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
    respond(405, ['ok' => false, 'message' => 'Méthode non autorisée.']);
}

$config = load_config();
$input = read_json_body();
$ip = client_ip();
$errors = [];

if (!check_rate_limit($ip)) {
    respond(429, ['ok' => false, 'message' => 'Trop de tentatives. Réessayez dans quelques minutes.']);
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
    $errors['form'] = 'Configuration Turnstile manquante côté serveur.';
} elseif (!verify_turnstile($config['turnstile_secret_key'], $turnstileToken, $ip)) {
    $errors['turnstile'] = 'Validez la protection anti-spam.';
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
    'Ce message a été validé côté serveur avec Cloudflare Turnstile.',
]);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Supra v <' . mail_safe_header($config['mail_from']) . '>',
    'Reply-To: ' . mail_safe_header($values['email']),
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail($config['mail_to'], $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(500, ['ok' => false, 'message' => "L'envoi est momentanément indisponible."]);
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
    ];
}

function read_json_body(): array
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'application/json') === false) {
        respond(415, ['ok' => false, 'message' => 'Format de requête invalide.']);
    }

    $raw = file_get_contents('php://input');
    if ($raw === false || strlen($raw) > 12000) {
        respond(413, ['ok' => false, 'message' => 'Requête trop volumineuse.']);
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        respond(400, ['ok' => false, 'message' => 'JSON invalide.']);
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
        $errors['name'] = 'Indiquez votre vrai nom complet.';
    } elseif (
        text_length($values['name']) < 5
        || text_length($values['name']) > 80
        || !preg_match("/^[\p{L}]+(?:[ '-][\p{L}]+){1,5}$/u", $values['name'])
        || filter_var($values['name'], FILTER_VALIDATE_EMAIL)
        || contains_url($values['name'])
        || preg_match('/\d/u', $values['name'])
    ) {
        $errors['name'] = 'Utilisez uniquement un vrai nom, sans chiffre, email, téléphone ou lien.';
    }

    if ($email === '') {
        $errors['email'] = 'Indiquez une adresse email.';
    } elseif (strlen($email) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Indiquez une adresse email valide.';
    }

    if ($values['phone'] === '') {
        $errors['phone'] = 'Indiquez un numéro de téléphone.';
    } elseif (!is_likely_phone($values['phone'])) {
        $errors['phone'] = 'Indiquez un vrai numéro avec indicatif, par exemple +33 7 44 20 86 73.';
    }

    if ($values['message'] === '') {
        $errors['message'] = 'Décrivez votre projet.';
    } elseif (
        text_length($values['message']) < 30
        || text_length($values['message']) > 2000
        || contains_url($values['message'])
        || preg_match('/\b(?:casino|crypto|bitcoin|forex|loan|viagra|porn|seo backlinks?|whatsapp marketing|telegram)\b/i', $values['message'])
        || preg_match('/(.)\1{9,}/u', $values['message'])
    ) {
        $errors['message'] = 'Votre message doit être plus précis et ne pas ressembler à du spam.';
    }

    if ($email !== '' && str_contains($nameCompare, $email)) {
        $errors['name'] = 'Le nom ne doit pas contenir votre email.';
    }
    if (strlen($digits) >= 6 && str_contains(phone_digits($values['name']), $digits)) {
        $errors['name'] = 'Le nom ne doit pas contenir votre numéro.';
    }
    if (strlen($digits) >= 6 && str_contains(phone_digits($email), $digits)) {
        $errors['email'] = "L'email ne doit pas contenir votre numéro.";
    }
    if ($email !== '' && str_contains($phoneCompare, $email)) {
        $errors['phone'] = "Le numéro ne doit pas contenir votre email.";
    }
    if (!$turnstileToken) {
        $errors['turnstile'] = 'Validez la protection anti-spam.';
    }
    if ($startedAt <= 0 || ((int)floor(microtime(true) * 1000) - $startedAt) < 4000) {
        $errors['form'] = 'Prenez quelques secondes pour compléter le formulaire avant de l’envoyer.';
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
