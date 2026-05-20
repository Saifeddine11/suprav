#!/usr/bin/env bash
# Déploie le dossier dist/ vers Hostinger via SFTP (lftp).
# Prérequis : lftp installé + variables d'environnement :
#   SFTP_HOST, SFTP_USERNAME, SFTP_PASSWORD, SFTP_PORT (ex. 22)
#   SFTP_REMOTE_PATH (optionnel, défaut: public_html)
#
# Usage :
#   npm run build
#   export SFTP_HOST=... SFTP_USERNAME=... SFTP_PASSWORD=... SFTP_PORT=22
#   ./scripts/deploy-dist-hostinger.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
REMOTE_PATH="${SFTP_REMOTE_PATH:-public_html}"

for v in SFTP_HOST SFTP_USERNAME SFTP_PASSWORD SFTP_PORT; do
  test -n "${!v:-}" || { echo "Variable manquante: $v" >&2; exit 1; }
done

test -f "$DIST/index.html" || { echo "Lancez d'abord: npm run build" >&2; exit 1; }
test -f "$DIST/.htaccess" || { echo "dist/.htaccess manquant" >&2; exit 1; }

command -v lftp >/dev/null || { echo "Installez lftp (brew install lftp)" >&2; exit 1; }

echo "→ Upload dist/ vers ${SFTP_HOST}:${REMOTE_PATH}"

CMD="$(mktemp)"
{
  echo "set cmd:fail-exit yes"
  echo "set sftp:auto-confirm yes"
  echo "lcd $DIST"
  echo "cd \"$REMOTE_PATH\""
  find "$DIST" -type d -mindepth 1 | sort | while IFS= read -r directory; do
    remote_directory="${directory#$DIST/}"
    printf 'mkdir -p "./%s"\n' "$remote_directory"
  done
  find "$DIST" -type f | sort | while IFS= read -r file; do
    remote_file="${file#$DIST/}"
    if [ "$remote_file" = "api/contact-config.php" ]; then
      continue
    fi
    remote_directory="$(dirname "$remote_file")"
    if [ "$remote_directory" = "." ]; then
      printf 'put "%s"\n' "$remote_file"
    else
      printf 'put -O "./%s" "%s"\n' "$remote_directory" "$remote_file"
    fi
  done
  echo "bye"
} > "$CMD"

lftp -u "${SFTP_USERNAME},${SFTP_PASSWORD}" "sftp://${SFTP_HOST}:${SFTP_PORT}" < "$CMD"
rm -f "$CMD"
echo "✓ Déploiement terminé."
