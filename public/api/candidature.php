<?php
declare(strict_types=1);

/*
 * Candidatures « Rejoindre l'agence » (Hostinger) : POST multipart/form-data avec CV, book ou photo en pièce jointe.
 * Même comportement et mêmes réponses JSON que api/candidature.js (Vercel).
 * Configuration SMTP partagée avec le formulaire de contact : contact-config.php ou variables CONTACT_SMTP_*.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');

const CAND_MAX_BODY_BYTES = 4194304;   // 4 Mo
const CAND_MAX_FILE_BYTES = 3145728;   // 3 Mo
const CAND_MIN_FILL_MS = 4000;
const CAND_GENERIC = 'Votre candidature n’a pas pu être traitée. Merci de réessayer.';
const CAND_TOO_LARGE = 'Fichier trop lourd : 3 Mo maximum.';

const CAND_TYPES = ['casting' => 'Casting', 'competence' => 'Compétence'];
const CAND_DOMAINS = [
    'casting' => ['Comédien ou comédienne', 'Mannequin', 'Créateur ou créatrice de contenu UGC', 'Voix off', 'Autre talent face caméra'],
    'competence' => ['Vidéo : cadrage et tournage', 'Montage et motion design', 'Design graphique et direction artistique', 'Développement web', 'Publicité en ligne (media buying)', 'Social media et community management', 'IA et automatisation', 'Stage ou alternance', 'Autre compétence'],
];
const CAND_FILE_TYPES = [
    'pdf' => ['ext' => 'pdf', 'mime' => 'application/pdf', 'label' => 'PDF'],
    'jpg' => ['ext' => 'jpg', 'mime' => 'image/jpeg', 'label' => 'JPG'],
    'png' => ['ext' => 'png', 'mime' => 'image/png', 'label' => 'PNG'],
    'webp' => ['ext' => 'webp', 'mime' => 'image/webp', 'label' => 'WebP'],
];

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => CAND_GENERIC]);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (!preg_match('/^multipart\/form-data;\s*boundary=/i', $contentType)) {
    respond(415, ['ok' => false, 'message' => CAND_GENERIC]);
}
$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > CAND_MAX_BODY_BYTES) {
    respond(413, too_large());
}
/* corps plus gros que post_max_size : PHP vide $_POST et $_FILES */
if ($contentLength > 0 && empty($_POST) && empty($_FILES)) {
    error_log('Supra candidature: corps rejeté par PHP (post_max_size = ' . ini_get('post_max_size') . ').');
    respond(413, too_large());
}

$config = load_config();
$ip = client_ip();

if (!check_rate_limit($ip)) {
    respond(429, ['ok' => false, 'message' => 'Merci de patienter quelques minutes avant de renvoyer votre candidature.']);
}

$values = [
    'type' => clean_text($_POST['type'] ?? ''),
    'domain' => clean_text($_POST['domain'] ?? ''),
    'name' => clean_text($_POST['name'] ?? ''),
    'email' => strtolower(clean_text($_POST['email'] ?? '')),
    'phone' => clean_text($_POST['phone'] ?? ''),
    'city' => clean_text($_POST['city'] ?? ''),
    'portfolio' => clean_text($_POST['portfolio'] ?? ''),
    'message' => clean_message($_POST['message'] ?? ''),
    'consent' => clean_text($_POST['consent'] ?? ''),
    'website' => clean_text($_POST['website'] ?? ''),
];
$startedAt = (int)($_POST['startedAt'] ?? 0);
$turnstileToken = clean_text($_POST['turnstileToken'] ?? '');

/* champ piège rempli : on répond comme si tout allait bien, sans rien envoyer */
if ($values['website'] !== '') {
    respond(200, ['ok' => true]);
}

$errors = validate_candidature($values, $startedAt);
$file = inspect_file($_FILES['cv'] ?? null, $values['type']);
if (isset($file['error'])) {
    $errors['cv'] = $file['error'];
}

if ($config['turnstile_secret_key'] && $turnstileToken !== '' && !verify_turnstile($config['turnstile_secret_key'], $turnstileToken, $ip)) {
    $errors['form'] = 'Merci de confirmer le formulaire avant l’envoi.';
}
if ($errors) {
    respond(422, ['ok' => false, 'errors' => $errors]);
}

$subject = 'Candidature Supra v3 — ' . CAND_TYPES[$values['type']] . ' — ' . mail_safe_header($values['name']);
$html = build_html_email($values, $file, $ip);
$sent = send_candidature_mail($config, $subject, $html, $values['email'], $file);

if (!$sent) {
    error_log('Supra candidature: mail delivery failed.');
    respond(500, ['ok' => false, 'message' => 'Votre candidature n’a pas pu être envoyée pour le moment.']);
}

respond(200, ['ok' => true]);

/* ---------------------------------------------------------------- */

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

function validate_candidature(array $v, int $startedAt): array
{
    $errors = [];
    $digits = phone_digits($v['phone']);

    if (!isset(CAND_TYPES[$v['type']])) {
        $errors['type'] = 'Choisissez Casting ou Compétence.';
    } elseif (!in_array($v['domain'], CAND_DOMAINS[$v['type']], true)) {
        $errors['domain'] = 'Choisissez un domaine.';
    }

    if (
        $v['name'] === ''
        || text_length($v['name']) < 2
        || text_length($v['name']) > 80
        || !preg_match("/^[\p{L}]+(?:[ '-][\p{L}]+){0,5}$/u", $v['name'])
        || filter_var($v['name'], FILTER_VALIDATE_EMAIL)
        || contains_url($v['name'])
        || preg_match('/\d/u', $v['name'])
    ) {
        $errors['name'] = 'Indiquez votre prénom et votre nom (lettres uniquement).';
    }

    if ($v['email'] === '' || strlen($v['email']) > 120 || !filter_var($v['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Indiquez une adresse e-mail valide.';
    }
    if ($v['phone'] === '' || !is_likely_phone($v['phone'])) {
        $errors['phone'] = 'Indiquez un numéro WhatsApp valide.';
    }
    if ($v['city'] === '' || text_length($v['city']) > 60 || !preg_match("/^[\p{L}]+(?:[ '-][\p{L}]+){0,4}$/u", $v['city'])) {
        $errors['city'] = 'Indiquez votre ville.';
    }
    if ($v['portfolio'] !== '' && !is_portfolio_url($v['portfolio'])) {
        $errors['portfolio'] = 'Collez un lien complet qui commence par https://';
    }

    if ($v['message'] !== '') {
        if (text_length($v['message']) > 1500) {
            $errors['message'] = '1500 caractères maximum.';
        } elseif (contains_url($v['message'])) {
            $errors['message'] = 'Mettez vos liens dans le champ portfolio, pas dans le message.';
        } elseif (
            preg_match('/\b(?:casino|crypto|bitcoin|forex|loan|viagra|porn|seo backlinks?|whatsapp marketing|telegram)\b/i', $v['message'])
            || preg_match('/(.)\1{9,}/u', $v['message'])
        ) {
            $errors['message'] = 'Merci de reformuler votre message.';
        }
    }

    if ($v['consent'] !== 'oui') {
        $errors['consent'] = 'Cochez cette case pour que nous puissions traiter votre candidature.';
    }

    if (strlen($digits) >= 6 && str_contains(phone_digits($v['name']), $digits)) {
        $errors['name'] = 'Indiquez uniquement votre prénom et votre nom dans ce champ.';
    }
    if ($v['email'] !== '' && str_contains(strtolower($v['name']), $v['email'])) {
        $errors['name'] = 'Indiquez uniquement votre prénom et votre nom dans ce champ.';
    }

    $nowMs = (int)floor(microtime(true) * 1000);
    if ($startedAt <= 0 || ($nowMs - $startedAt) < CAND_MIN_FILL_MS) {
        $errors['form'] = 'Merci de patienter quelques secondes avant d’envoyer votre candidature.';
    }

    return $errors;
}

/** @return array{error?: string, path?: string, size?: int, type?: array, filename?: string} */
function inspect_file(?array $upload, string $type): array
{
    $missing = $type === 'casting' ? 'Ajoutez une photo récente ou votre book.' : 'Ajoutez votre CV.';
    if (!$upload || !isset($upload['error']) || is_array($upload['error'])) {
        return ['error' => $missing];
    }
    switch ($upload['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            return ['error' => $missing];
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            error_log('Supra candidature: fichier refusé par PHP (upload_max_filesize = ' . ini_get('upload_max_filesize') . ').');
            return ['error' => CAND_TOO_LARGE];
        default:
            error_log('Supra candidature: erreur de téléversement ' . (int)$upload['error'] . '.');
            return ['error' => 'Le fichier n’a pas pu être reçu. Merci de réessayer.'];
    }

    $path = (string)$upload['tmp_name'];
    if (!is_uploaded_file($path)) {
        return ['error' => 'Le fichier n’a pas pu être reçu. Merci de réessayer.'];
    }
    $size = (int)filesize($path);
    if ($size <= 0) {
        return ['error' => $missing];
    }
    if ($size > CAND_MAX_FILE_BYTES) {
        return ['error' => CAND_TOO_LARGE];
    }

    $kind = sniff_file($path);
    if ($kind === '') {
        return ['error' => 'Format non accepté. Envoyez un PDF, un JPG, un PNG ou un WebP.'];
    }

    return [
        'path' => $path,
        'size' => $size,
        'type' => CAND_FILE_TYPES[$kind],
        'filename' => sanitize_filename((string)($upload['name'] ?? ''), CAND_FILE_TYPES[$kind]['ext']),
    ];
}

/* Type réel du fichier d'après ses premiers octets. */
function sniff_file(string $path): string
{
    $handle = fopen($path, 'rb');
    if (!$handle) {
        return '';
    }
    $head = (string)fread($handle, 12);
    fclose($handle);
    if (strlen($head) < 12) {
        return '';
    }
    if (str_starts_with($head, '%PDF')) {
        return 'pdf';
    }
    if (str_starts_with($head, "\xFF\xD8\xFF")) {
        return 'jpg';
    }
    if (str_starts_with($head, "\x89PNG")) {
        return 'png';
    }
    if (str_starts_with($head, 'RIFF') && substr($head, 8, 4) === 'WEBP') {
        return 'webp';
    }
    return '';
}

function sanitize_filename(string $name, string $ext): string
{
    $base = basename(str_replace('\\', '/', $name));
    $base = preg_replace('/\.[^.]*$/', '', $base) ?? '';
    if (function_exists('iconv')) {
        $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $base);
        if ($ascii !== false) {
            $base = $ascii;
        }
    }
    $base = preg_replace('/[^A-Za-z0-9._-]+/', '-', $base) ?? '';
    $base = preg_replace('/-{2,}/', '-', $base) ?? '';
    $base = trim(substr($base, 0, 80), '-.');
    return ($base !== '' ? $base : 'candidature') . '.' . $ext;
}

function is_portfolio_url(string $value): bool
{
    if (strlen($value) > 300 || !filter_var($value, FILTER_VALIDATE_URL)) {
        return false;
    }
    $parts = parse_url($value);
    $scheme = strtolower((string)($parts['scheme'] ?? ''));
    $host = (string)($parts['host'] ?? '');
    return in_array($scheme, ['http', 'https'], true) && str_contains($host, '.') && !isset($parts['user']) && !isset($parts['pass']);
}

function build_html_email(array $values, array $file, string $ip): string
{
    $e = static fn (string $s): string => html_escape($s);
    $type = $e(CAND_TYPES[$values['type']]);
    $message = $values['message'] !== '' ? nl2br($e($values['message']), false) : '<span style="color:rgba(255,255,255,0.45);">Aucun message</span>';
    $portfolio = $values['portfolio'] !== ''
        ? '<a href="' . $e($values['portfolio']) . '" style="color:#E8491C;text-decoration:none;word-break:break-all;">' . $e($values['portfolio']) . '</a>'
        : '<span style="color:rgba(255,255,255,0.45);">Non renseigné</span>';
    $fileLine = $e($file['filename']) . ' · ' . $e($file['type']['label']) . ' · ' . $e(format_size((int)$file['size']));
    $mailtoHref = $e('mailto:' . $values['email'] . '?subject=' . rawurlencode('Re: Votre candidature — Supra V3'));
    $whatsappHref = $e('https://wa.me/' . phone_digits_with_country($values['phone']));
    $telHref = $e('tel:+' . phone_digits_with_country($values['phone']));
    $label = 'font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin-bottom:6px;';
    $value = 'font-size:14px;font-weight:600;color:#ffffff;line-height:1.45;';
    $cell = 'padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.06);';
    $badge = $values['type'] === 'casting' ? 'CAST' : 'CV';

    return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Nouvelle candidature — Supra V3</title></head>'
        . '<body style="margin:0;padding:0;background:#0e0e0e;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Helvetica,Arial,sans-serif;">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0e0e0e;margin:0;padding:36px 14px;"><tr><td align="center">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">'
        . '<tr><td style="padding:32px 36px 28px;background:#111111;border-bottom:1px solid rgba(255,255,255,0.06);">'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="font-size:22px;font-weight:800;color:#ffffff;">SUPRA<span style="color:#E8491C;">V3</span></td><td align="right"><span style="display:inline-block;background:rgba(232,73,28,0.12);border:1px solid rgba(232,73,28,0.28);color:#E8491C;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:999px;">● Candidature</span></td></tr></table>'
        . '<h1 style="margin:22px 0 0;font-size:20px;line-height:1.3;font-weight:700;color:#ffffff;">Nouvelle candidature — ' . $type . '</h1><p style="margin:5px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.45);">Reçue le ' . $e(format_received_at()) . '</p></td></tr>'
        . '<tr><td style="padding:24px 36px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(232,73,28,0.08);border:1px solid rgba(232,73,28,0.16);border-radius:10px;"><tr><td width="54" style="padding:14px 0 14px 18px;vertical-align:middle;"><div style="width:42px;height:36px;line-height:36px;text-align:center;background:rgba(232,73,28,0.15);border-radius:8px;color:#E8491C;font-size:11px;font-weight:800;letter-spacing:0.8px;">' . $badge . '</div></td><td style="padding:14px 18px 14px 12px;"><div style="font-size:14px;font-weight:700;color:#ffffff;line-height:1.4;">' . $e($values['domain']) . '</div><div style="font-size:12px;color:rgba(255,255,255,0.48);line-height:1.5;">' . $type . ' · ' . $e($values['city']) . '</div></td></tr></table></td></tr>'
        . '<tr><td style="padding:28px 36px 20px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;">'
        . '<tr><td width="50%" style="' . $cell . 'border-right:1px solid rgba(255,255,255,0.06);"><div style="' . $label . '">Nom</div><div style="' . $value . '">' . $e($values['name']) . '</div></td><td width="50%" style="' . $cell . '"><div style="' . $label . '">Téléphone</div><div style="' . $value . '"><a href="' . $telHref . '" style="color:#E8491C;text-decoration:none;">' . $e($values['phone']) . '</a></div></td></tr>'
        . '<tr><td width="50%" style="' . $cell . 'border-right:1px solid rgba(255,255,255,0.06);"><div style="' . $label . '">Email</div><div style="' . $value . '"><a href="mailto:' . $e($values['email']) . '" style="color:#E8491C;text-decoration:none;">' . $e($values['email']) . '</a></div></td><td width="50%" style="' . $cell . '"><div style="' . $label . '">Ville</div><div style="' . $value . '">' . $e($values['city']) . '</div></td></tr>'
        . '<tr><td colspan="2" style="' . $cell . '"><div style="' . $label . '">Portfolio</div><div style="' . $value . '">' . $portfolio . '</div></td></tr>'
        . '<tr><td colspan="2" style="padding:16px 18px;"><div style="' . $label . '">Pièce jointe</div><div style="' . $value . '">' . $fileLine . '</div></td></tr></table>'
        . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;"><tr><td style="padding:20px;"><div style="' . $label . 'margin-bottom:10px;">Message</div><div style="font-size:15px;line-height:1.65;color:rgba(255,255,255,0.82);">' . $message . '</div></td></tr></table></td></tr>'
        . '<tr><td style="padding:0 36px 28px;"><table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="padding-right:10px;"><a href="' . $mailtoHref . '" style="display:inline-block;background:#E8491C;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:13px 22px;border-radius:10px;">Répondre par email</a></td><td><a href="' . $whatsappHref . '" style="display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.78);text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:10px;">WhatsApp</a></td></tr></table></td></tr>'
        . '<tr><td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="font-size:11px;color:rgba(255,255,255,0.3);">Rejoindre l’agence · suprav3.com · consentement donné (12 mois)</td><td align="right" style="font-size:11px;color:rgba(255,255,255,0.25);">IP <span style="font-family:monospace;font-size:10px;background:rgba(255,255,255,0.05);padding:3px 6px;border-radius:4px;color:rgba(255,255,255,0.4);">' . $e($ip) . '</span></td></tr></table></td></tr>'
        . '</table></td></tr></table></body></html>';
}

/* ---------- envoi : MIME multipart/mixed avec la pièce jointe ---------- */

function send_candidature_mail(array $config, string $subject, string $html, string $replyTo, array $file): bool
{
    $boundary = 'supra-' . bin2hex(random_bytes(12));
    $domain = substr(strrchr((string)$config['mail_from'], '@') ?: '@suprav3.com', 1);
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
        'From: Supra v <' . mail_safe_header($config['mail_from']) . '>',
        'Reply-To: ' . mail_safe_header($replyTo),
        'Date: ' . date('r'),
        'Message-ID: <' . bin2hex(random_bytes(16)) . '@' . mail_safe_header($domain) . '>',
        'X-Mailer: PHP/' . phpversion(),
    ];
    $content = file_get_contents((string)$file['path']);
    if ($content === false) {
        return false;
    }
    $filename = mail_safe_header((string)$file['filename']);
    $body = '--' . $boundary . "\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html), 76, "\r\n")
        . '--' . $boundary . "\r\n"
        . 'Content-Type: ' . $file['type']['mime'] . '; name="' . $filename . "\"\r\n"
        . 'Content-Disposition: attachment; filename="' . $filename . "\"\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($content), 76, "\r\n")
        . '--' . $boundary . '--';
    $encodedSubject = encode_header_word($subject);

    if ($config['smtp_host'] && $config['smtp_username'] && $config['smtp_password']) {
        return smtp_send($config, $encodedSubject, $body, $headers);
    }

    $from = mail_safe_header($config['mail_from']);
    $parameters = filter_var($from, FILTER_VALIDATE_EMAIL) ? '-f ' . $from : '';
    return mail($config['mail_to'], $encodedSubject, $body, implode("\r\n", $headers), $parameters);
}

function encode_header_word(string $value): string
{
    $value = mail_safe_header($value);
    if (preg_match('/^[\x20-\x7E]*$/', $value)) {
        return $value;
    }
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function smtp_send(array $config, string $subject, string $body, array $headers): bool
{
    $host = (string)$config['smtp_host'];
    $port = (int)$config['smtp_port'];
    $secure = strtolower((string)$config['smtp_secure']);
    $transportHost = $secure === 'ssl' ? 'ssl://' . $host : $host;
    $errno = 0;
    $errstr = '';
    $socket = @fsockopen($transportHost, $port, $errno, $errstr, 12);

    if (!$socket) {
        error_log('Supra candidature SMTP connection failed: ' . $errstr);
        return false;
    }

    stream_set_timeout($socket, 20);

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
                'Subject: ' . $subject,
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
        error_log('Supra candidature SMTP unexpected response: ' . trim($response));
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

/* ---------- utilitaires (mêmes règles que contact.php) ---------- */

function too_large(): array
{
    return ['ok' => false, 'errors' => ['cv' => CAND_TOO_LARGE], 'message' => CAND_TOO_LARGE];
}

function clean_text(mixed $value): string
{
    $value = is_string($value) ? $value : '';
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value) ?? '';
    $value = preg_replace('/\s+/u', ' ', $value) ?? '';
    return trim($value);
}

/* Message : on garde les retours à la ligne, on retire les autres caractères de contrôle. */
function clean_message(mixed $value): string
{
    $value = is_string($value) ? $value : '';
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', '', $value) ?? '';
    $value = preg_replace('/[^\S\n]+/u', ' ', $value) ?? '';
    $value = preg_replace('/\n{3,}/', "\n\n", $value) ?? '';
    return trim($value);
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
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query(['secret' => $secret, 'response' => $token, 'remoteip' => $ip]),
            'timeout' => 6,
        ],
    ]);
    $response = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $context);
    if ($response === false) {
        return false;
    }
    $data = json_decode($response, true);
    return is_array($data) && ($data['success'] ?? false) === true;
}

function check_rate_limit(string $ip): bool
{
    $directory = sys_get_temp_dir() . '/suprav-candidature-rate';
    if (!is_dir($directory)) {
        @mkdir($directory, 0700, true);
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
        @file_put_contents($file, json_encode($attempts), LOCK_EX);
        return false;
    }

    $attempts[] = $now;
    @file_put_contents($file, json_encode($attempts), LOCK_EX);
    return true;
}

function client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

function html_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function format_size(int $bytes): string
{
    return $bytes < 1048576 ? max(1, (int)round($bytes / 1024)) . ' Ko' : str_replace('.', ',', sprintf('%.1f', $bytes / 1048576)) . ' Mo';
}

function format_received_at(): string
{
    $date = new DateTime('now', new DateTimeZone('Africa/Casablanca'));
    return $date->format('d/m/Y') . ' à ' . $date->format('H\hi');
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
