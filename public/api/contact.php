<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Votre demande n’a pas pu être traitée. Merci de réessayer.']);
}

$config = load_config();
$input = read_json_body();
$ip = client_ip();
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

if (!empty($values['website'])) {
    $errors['form'] = "Le formulaire n'a pas pu être envoyé.";
}

if (!$config['turnstile_secret_key']) {
    $errors['form'] = 'Certaines informations semblent incorrectes, merci de vérifier vos champs.';
} elseif (!verify_turnstile($config['turnstile_secret_key'], $turnstileToken, $ip)) {
    $errors['turnstile'] = 'Merci de confirmer le formulaire avant l’envoi.';
}

if ($errors) {
    respond(422, ['ok' => false, 'errors' => $errors]);
}

$subject = 'Nouveau projet Supra v - ' . mail_safe_header($values['name']);
$body = implode("\n", [
    'Nouvelle demande depuis suprav3.com',
    '',
    'Date souhaitée: ' . $values['date'],
    'Créneau: ' . $values['time'],
    'Nom: ' . $values['name'],
    'Email: ' . $values['email'],
    'Téléphone: ' . $values['phone'],
    'IP: ' . $ip,
    '',
    'Message:',
    $values['message'],
    '',
    '--',
    'Demande transmise depuis le formulaire du site.',
]);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Supra v <' . mail_safe_header($config['mail_from']) . '>',
    'Reply-To: ' . mail_safe_header($values['email']),
    'X-Mailer: PHP/' . phpversion(),
];

$sent = send_contact_mail($config, $subject, $body, $headers);

if (!$sent) {
    error_log('Supra contact form: mail delivery failed.');
    respond(500, ['ok' => false, 'message' => 'Votre message n’a pas pu être envoyé pour le moment. Merci de réessayer dans quelques instants.']);
}

respond(200, ['ok' => true]);

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
        text_length($values['name']) < 5
        || text_length($values['name']) > 80
        || !preg_match("/^[\p{L}]+(?:[ '-][\p{L}]+){1,5}$/u", $values['name'])
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
    if (!$turnstileToken) {
        $errors['turnstile'] = 'Merci de confirmer le formulaire avant l’envoi.';
    }
    if ($startedAt <= 0 || ((int)floor(microtime(true) * 1000) - $startedAt) < 4000) {
        $errors['form'] = 'Merci de prendre un instant pour vérifier vos informations avant l’envoi.';
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
    $candidates = [
        $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '',
        $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '',
        $_SERVER['REMOTE_ADDR'] ?? '',
    ];

    foreach ($candidates as $candidate) {
        $ip = trim(explode(',', $candidate)[0]);
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
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
