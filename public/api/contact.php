<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');

const CONTACT_RECAP_TTL_SECONDS = 172800;
const CONTACT_RECAP_COOKIE = 'suprav_contact_recap';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$config = load_config();
$ip = client_ip();
$recapToken = current_recap_token();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    respond(200, ['ok' => true, 'recap' => $recapToken ? load_contact_recap($ip, $recapToken) : null]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Votre demande n’a pas pu être traitée. Merci de réessayer.']);
}

$input = read_json_body();
$errors = [];

if (!check_rate_limit($ip)) {
    respond(429, ['ok' => false, 'message' => 'Merci de patienter quelques minutes avant de renvoyer votre demande.']);
}

$values = [
    'name' => clean_text($input['name'] ?? ''),
    'email' => strtolower(clean_text($input['email'] ?? '')),
    'phone' => clean_text($input['phone'] ?? ''),
    'message' => clean_text($input['message'] ?? ''),
    'website' => clean_text($input['website'] ?? ''),
    'date' => clean_text($input['date'] ?? ''),
    'time' => clean_text($input['time'] ?? ''),
];
$startedAt = (int)($input['startedAt'] ?? 0);
$turnstileToken = clean_text($input['turnstileToken'] ?? '');

validate_contact($values, $startedAt, $turnstileToken, $errors);

if ($config['turnstile_secret_key'] && $turnstileToken !== '' && !verify_turnstile($config['turnstile_secret_key'], $turnstileToken, $ip)) {
    $errors['turnstile'] = 'Merci de confirmer le formulaire avant l’envoi.';
}

if ($errors) {
    respond(422, ['ok' => false, 'errors' => $errors]);
}

$subject = 'Nouveau projet Supra v - ' . mail_safe_header($values['name']);
$htmlBody = build_html_contact_email($values, $ip);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Supra v <' . mail_safe_header($config['mail_from']) . '>',
    'Reply-To: ' . mail_safe_header($values['email']),
    'X-Mailer: PHP/' . phpversion(),
];

$sent = send_contact_mail($config, $subject, $htmlBody, $headers);

if (!$sent) {
    error_log('Supra contact form: mail delivery failed.');
    respond(500, ['ok' => false, 'message' => 'Votre message n’a pas pu être envoyé pour le moment. Merci de réessayer dans quelques instants.']);
}

$recapToken = $recapToken ?: issue_recap_token();
$recap = store_contact_recap($ip, $recapToken, $values);

respond(200, ['ok' => true, 'recap' => $recap]);

function load_config(): array
{
    $configFile = __DIR__ . '/contact-config.php';
    $fileConfig = is_file($configFile) ? require $configFile : [];

    return [
        'turnstile_secret_key' => getenv('TURNSTILE_SECRET_KEY') ?: ($fileConfig['turnstile_secret_key'] ?? ''),
        'mail_to' => ($fileConfig['mail_to'] ?? getenv('CONTACT_MAIL_TO')) ?: 'contact@suprav3.com',
        'mail_from' => ($fileConfig['mail_from'] ?? getenv('CONTACT_MAIL_FROM')) ?: 'contact@suprav3.com',
        'smtp_host' => ($fileConfig['smtp_host'] ?? getenv('CONTACT_SMTP_HOST')) ?: '',
        'smtp_port' => (int)(($fileConfig['smtp_port'] ?? getenv('CONTACT_SMTP_PORT')) ?: 465),
        'smtp_username' => ($fileConfig['smtp_username'] ?? getenv('CONTACT_SMTP_USERNAME')) ?: '',
        'smtp_password' => ($fileConfig['smtp_password'] ?? getenv('CONTACT_SMTP_PASSWORD')) ?: '',
        'smtp_secure' => ($fileConfig['smtp_secure'] ?? getenv('CONTACT_SMTP_SECURE')) ?: 'ssl',
    ];
}

function send_contact_mail(array $config, string $subject, string $body, array $headers): bool
{
    if ($config['smtp_host'] && $config['smtp_username'] && $config['smtp_password']) {
        return smtp_send($config, $subject, $body, $headers);
    }

    $from = mail_safe_header($config['mail_from']);
    $parameters = filter_var($from, FILTER_VALIDATE_EMAIL) ? '-f ' . $from : '';
    return mail($config['mail_to'], $subject, $body, implode("\r\n", $headers), $parameters);
}

function build_html_contact_email(array $values, string $ip): string
{
    $name = html_escape($values['name']);
    $email = html_escape($values['email']);
    $phone = html_escape($values['phone']);
    $message = nl2br(html_escape($values['message']));
    $appointmentDate = html_escape($values['date']);
    $appointmentTime = html_escape($values['time']);
    $receivedAt = html_escape(format_received_at());
    $ipText = html_escape($ip);
    $mailtoHref = html_escape('mailto:' . $values['email'] . '?subject=' . rawurlencode('Re: Votre demande — Supra V3'));
    $whatsappHref = html_escape('https://wa.me/' . phone_digits_with_country($values['phone']));
    $telHref = html_escape('tel:' . phone_digits_with_country($values['phone']));

    return <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle demande — Supra V3</title>
</head>
<body style="margin:0;padding:0;background:#0e0e0e;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0e0e0e;margin:0;padding:36px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding:32px 36px 28px;background:#111111;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;">SUPRA<span style="color:#E8491C;">V3</span></td>
                  <td align="right">
                    <span style="display:inline-block;background:rgba(232,73,28,0.12);border:1px solid rgba(232,73,28,0.28);color:#E8491C;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:999px;">● Nouveau lead</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin:22px 0 0;font-size:20px;line-height:1.3;font-weight:700;color:#ffffff;">Nouvelle demande de projet</h1>
              <p style="margin:5px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.45);">Reçue le {$receivedAt}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 36px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(232,73,28,0.08);border:1px solid rgba(232,73,28,0.16);border-radius:10px;">
                <tr>
                  <td width="54" style="padding:14px 0 14px 18px;vertical-align:middle;">
                    <div style="width:42px;height:36px;line-height:36px;text-align:center;background:rgba(232,73,28,0.15);border-radius:8px;color:#E8491C;font-size:11px;font-weight:800;letter-spacing:0.8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">RDV</div>
                  </td>
                  <td style="padding:14px 18px 14px 12px;">
                    <div style="font-size:14px;font-weight:700;color:#ffffff;line-height:1.4;">{$appointmentDate}</div>
                    <div style="font-size:12px;color:rgba(255,255,255,0.48);line-height:1.5;">Créneau souhaité · {$appointmentTime}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 36px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;">
                <tr>
                  <td width="50%" style="padding:16px 18px;border-right:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);">
                    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin-bottom:6px;">Nom</div>
                    <div style="font-size:14px;font-weight:600;color:#ffffff;line-height:1.45;">{$name}</div>
                  </td>
                  <td width="50%" style="padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin-bottom:6px;">Téléphone</div>
                    <div style="font-size:14px;font-weight:600;color:#ffffff;line-height:1.45;"><a href="{$telHref}" style="color:#E8491C;text-decoration:none;">{$phone}</a></div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:16px 18px;">
                    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin-bottom:6px;">Email</div>
                    <div style="font-size:14px;font-weight:600;line-height:1.45;"><a href="mailto:{$email}" style="color:#E8491C;text-decoration:none;">{$email}</a></div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin-bottom:10px;">Message</div>
                    <div style="font-size:15px;line-height:1.65;color:rgba(255,255,255,0.82);">{$message}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-right:10px;">
                    <a href="{$mailtoHref}" style="display:inline-block;background:#E8491C;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:13px 22px;border-radius:10px;">Répondre par email</a>
                  </td>
                  <td>
                    <a href="{$whatsappHref}" style="display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.78);text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:10px;">WhatsApp</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size:11px;color:rgba(255,255,255,0.3);">Formulaire · suprav3.com</td>
                  <td align="right" style="font-size:11px;color:rgba(255,255,255,0.25);">IP <span style="font-family:'SF Mono','Fira Code',monospace;font-size:10px;background:rgba(255,255,255,0.05);padding:3px 6px;border-radius:4px;color:rgba(255,255,255,0.4);">{$ipText}</span></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

function html_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function format_received_at(): string
{
    return date('d/m/Y à H\hi');
}

function phone_digits_with_country(string $phone): string
{
    $digits = phone_digits($phone);
    if (str_starts_with($digits, '00')) {
        return substr($digits, 2);
    }
    if (str_starts_with($digits, '0')) {
        return '212' . substr($digits, 1);
    }
    return $digits;
}

function smtp_send(array $config, string $subject, string $body, array $headers): bool
{
    $host = (string)$config['smtp_host'];
    $port = (int)$config['smtp_port'];
    $secure = strtolower((string)$config['smtp_secure']);
    $transportHost = $secure === 'ssl' ? 'ssl://' . $host : $host;
    $errno = 0;
    $errstr = '';
    $socket = fsockopen($transportHost, $port, $errno, $errstr, 12);

    if (!$socket) {
        error_log('Supra contact form SMTP connection failed: ' . $errstr);
        return false;
    }

    stream_set_timeout($socket, 12);

    $ok = smtp_expect($socket, [220])
        && smtp_command($socket, 'EHLO suprav3.com', [250]);

    if ($ok && $secure === 'tls') {
        $ok = smtp_command($socket, 'STARTTLS', [220])
            && stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)
            && smtp_command($socket, 'EHLO suprav3.com', [250]);
    }

    $ok = $ok
        && smtp_command($socket, 'AUTH LOGIN', [334])
        && smtp_command($socket, base64_encode((string)$config['smtp_username']), [334])
        && smtp_command($socket, base64_encode((string)$config['smtp_password']), [235])
        && smtp_command($socket, 'MAIL FROM:<' . mail_safe_header($config['mail_from']) . '>', [250])
        && smtp_command($socket, 'RCPT TO:<' . mail_safe_header($config['mail_to']) . '>', [250, 251])
        && smtp_command($socket, 'DATA', [354]);

    if ($ok) {
        $message = implode("\r\n", array_merge(
            [
                'To: ' . mail_safe_header($config['mail_to']),
                'Subject: ' . mail_safe_header($subject),
            ],
            $headers
        ));
        $message .= "\r\n\r\n" . smtp_dot_stuff($body) . "\r\n.";
        $ok = smtp_command($socket, $message, [250]);
    }

    smtp_command($socket, 'QUIT', [221]);
    fclose($socket);
    return $ok;
}

function smtp_command($socket, string $command, array $expectedCodes): bool
{
    fwrite($socket, $command . "\r\n");
    return smtp_expect($socket, $expectedCodes);
}

function smtp_expect($socket, array $expectedCodes): bool
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (preg_match('/^\d{3}\s/', $line)) {
            break;
        }
    }

    $code = (int)substr($response, 0, 3);
    if (!in_array($code, $expectedCodes, true)) {
        error_log('Supra contact form SMTP unexpected response: ' . trim($response));
        return false;
    }

    return true;
}

function smtp_dot_stuff(string $body): string
{
    $body = str_replace(["\r\n", "\r"], "\n", $body);
    $lines = explode("\n", $body);
    $lines = array_map(static fn (string $line): string => str_starts_with($line, '.') ? '.' . $line : $line, $lines);
    return implode("\r\n", $lines);
}

function recap_storage_dir(): string
{
    return __DIR__ . '/.contact-recaps';
}

function recap_file_for_ip(string $ip, string $token): string
{
    return recap_storage_dir() . '/' . hash('sha256', $ip . '|' . $token) . '.json';
}

function store_contact_recap(string $ip, string $token, array $values): array
{
    $now = time();
    $recap = [
        'name' => $values['name'],
        'date' => $values['date'],
        'time' => $values['time'],
        'sentAt' => date(DATE_ATOM, $now),
        'expiresAt' => date(DATE_ATOM, $now + CONTACT_RECAP_TTL_SECONDS),
    ];

    $dir = recap_storage_dir();
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        error_log('Supra contact form: recap storage directory could not be created.');
        return $recap;
    }

    file_put_contents(recap_file_for_ip($ip, $token), json_encode($recap, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    cleanup_contact_recaps($dir);

    return $recap;
}

function load_contact_recap(string $ip, string $token): ?array
{
    $file = recap_file_for_ip($ip, $token);
    if (!is_file($file)) {
        return null;
    }

    $raw = file_get_contents($file);
    $recap = is_string($raw) ? json_decode($raw, true) : null;
    if (!is_array($recap) || empty($recap['expiresAt']) || strtotime((string)$recap['expiresAt']) <= time()) {
        @unlink($file);
        return null;
    }

    return [
        'name' => clean_text($recap['name'] ?? ''),
        'date' => clean_text($recap['date'] ?? ''),
        'time' => clean_text($recap['time'] ?? ''),
        'sentAt' => clean_text($recap['sentAt'] ?? ''),
        'expiresAt' => clean_text($recap['expiresAt'] ?? ''),
    ];
}

function current_recap_token(): string
{
    $token = $_COOKIE[CONTACT_RECAP_COOKIE] ?? '';
    return is_string($token) && preg_match('/^[a-f0-9]{64}$/', $token) ? $token : '';
}

function issue_recap_token(): string
{
    $token = bin2hex(random_bytes(32));
    setcookie(CONTACT_RECAP_COOKIE, $token, [
        'expires' => time() + CONTACT_RECAP_TTL_SECONDS,
        'path' => '/',
        'secure' => is_https_request(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    $_COOKIE[CONTACT_RECAP_COOKIE] = $token;

    return $token;
}

function is_https_request(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

function cleanup_contact_recaps(string $dir): void
{
    foreach (glob($dir . '/*.json') ?: [] as $file) {
        $raw = file_get_contents($file);
        $recap = is_string($raw) ? json_decode($raw, true) : null;
        if (!is_array($recap) || empty($recap['expiresAt']) || strtotime((string)$recap['expiresAt']) <= time()) {
            @unlink($file);
        }
    }
}

function read_json_body(): array
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'application/json') === false) {
        respond(415, ['ok' => false, 'message' => 'Votre demande n’a pas pu être traitée. Merci de réessayer.']);
    }

    $raw = file_get_contents('php://input');
    if ($raw === false || strlen($raw) > 12000) {
        respond(413, ['ok' => false, 'message' => 'Merci de raccourcir légèrement votre message avant l’envoi.']);
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        respond(400, ['ok' => false, 'message' => 'Votre demande n’a pas pu être traitée. Merci de réessayer.']);
    }

    return $data;
}

function clean_text(mixed $value): string
{
    $value = is_string($value) ? $value : '';
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?? '';
    $value = preg_replace('/\s+/u', ' ', $value) ?? '';
    return trim($value);
}

function validate_contact(array $values, int $startedAt, string $turnstileToken, array &$errors): void
{
    $digits = phone_digits($values['phone']);
    $email = strtolower($values['email']);
    $nameCompare = strtolower($values['name']);
    $phoneCompare = strtolower($values['phone']);

    if ($values['name'] === '') {
        $errors['name'] = 'Veuillez indiquer votre nom complet.';
    } elseif (
        text_length($values['name']) < 2
        || text_length($values['name']) > 80
        || !preg_match("/^[\p{L}]+(?:[ '-][\p{L}]+){0,5}$/u", $values['name'])
        || filter_var($values['name'], FILTER_VALIDATE_EMAIL)
        || contains_url($values['name'])
        || preg_match('/\d/u', $values['name'])
    ) {
        $errors['name'] = 'Veuillez indiquer votre nom complet.';
    }

    if ($email === '') {
        $errors['email'] = 'Merci de saisir votre adresse email.';
    } elseif (strlen($email) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Merci de saisir une adresse email valide.';
    }

    if ($values['phone'] === '') {
        $errors['phone'] = 'Merci d’indiquer votre numéro de téléphone.';
    } elseif (!is_likely_phone($values['phone'])) {
        $errors['phone'] = 'Merci d’indiquer un numéro de téléphone valide.';
    }

    if ($values['message'] === '') {
        $errors['message'] = 'Pouvez-vous nous en dire un peu plus sur votre projet ?';
    } elseif (
        text_length($values['message']) < 30
        || text_length($values['message']) > 2000
        || contains_url($values['message'])
        || preg_match('/\b(?:casino|crypto|bitcoin|forex|loan|viagra|porn|seo backlinks?|whatsapp marketing|telegram)\b/i', $values['message'])
        || preg_match('/(.)\1{9,}/u', $values['message'])
    ) {
        $errors['message'] = 'Merci de détailler légèrement votre demande pour que nous puissions mieux vous accompagner.';
    }

    if ($email !== '' && str_contains($nameCompare, $email)) {
        $errors['name'] = 'Veuillez indiquer uniquement votre nom complet dans ce champ.';
    }
    if (strlen($digits) >= 6 && str_contains(phone_digits($values['name']), $digits)) {
        $errors['name'] = 'Veuillez indiquer uniquement votre nom complet dans ce champ.';
    }
    if (strlen($digits) >= 6 && str_contains(phone_digits($email), $digits)) {
        $errors['email'] = 'Merci de vérifier votre adresse email.';
    }
    if ($email !== '' && str_contains($phoneCompare, $email)) {
        $errors['phone'] = 'Merci de vérifier votre numéro de téléphone.';
    }
}

function is_likely_phone(string $value): bool
{
    $digits = phone_digits($value);
    if (!preg_match('/^\+?[0-9()[\]\s.-]{8,24}$/', $value)) {
        return false;
    }
    if (strlen($digits) < 8 || strlen($digits) > 15) {
        return false;
    }
    if (preg_match('/^(\d)\1{7,}$/', $digits)) {
        return false;
    }
    return !preg_match('/(?:0123456789|1234567890|9876543210|0987654321)/', $digits);
}

function phone_digits(string $value): string
{
    return preg_replace('/\D+/', '', $value) ?? '';
}

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function contains_url(string $value): bool
{
    return (bool)preg_match('/(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|ma|fr|info|biz|ru|cn)\b)/i', $value);
}

function verify_turnstile(string $secret, string $token, string $ip): bool
{
    if (!$token) {
        return false;
    }

    $payload = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $ip,
    ]);
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => 6,
        ],
    ]);
    $response = file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $context);
    if ($response === false) {
        return false;
    }

    $data = json_decode($response, true);
    return is_array($data) && ($data['success'] ?? false) === true;
}

function check_rate_limit(string $ip): bool
{
    $directory = sys_get_temp_dir() . '/suprav-contact-rate';
    if (!is_dir($directory)) {
        mkdir($directory, 0700, true);
    }

    $file = $directory . '/' . hash('sha256', $ip) . '.json';
    $now = time();
    $window = 15 * 60;
    $limit = 5;
    $attempts = [];

    if (is_file($file)) {
        $attempts = json_decode((string)file_get_contents($file), true);
        $attempts = is_array($attempts) ? $attempts : [];
    }

    $attempts = array_values(array_filter($attempts, static fn ($timestamp) => is_int($timestamp) && ($now - $timestamp) < $window));
    if (count($attempts) >= $limit) {
        file_put_contents($file, json_encode($attempts), LOCK_EX);
        return false;
    }

    $attempts[] = $now;
    file_put_contents($file, json_encode($attempts), LOCK_EX);
    return true;
}

function client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    if (filter_var($ip, FILTER_VALIDATE_IP)) {
        return $ip;
    }

    return '0.0.0.0';
}

function mail_safe_header(string $value): string
{
    return str_replace(["\r", "\n"], '', $value);
}

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
