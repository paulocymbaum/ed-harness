#!/usr/bin/env bash
# EdHarness — sobe o servidor local e abre a UI no navegador (Linux Mint / xdg).
set -euo pipefail

# Resolve symlinks (ex.: ./EdHarness → scripts/launch-ed-harness.sh)
_SCRIPT="${BASH_SOURCE[0]}"
if command -v readlink >/dev/null 2>&1; then
  _SCRIPT="$(readlink -f "$_SCRIPT")"
elif command -v realpath >/dev/null 2>&1; then
  _SCRIPT="$(realpath "$_SCRIPT")"
fi
ROOT="$(cd "$(dirname "$_SCRIPT")/.." && pwd)"
FRONTEND="$ROOT/frontend"
unset _SCRIPT

STATE_DIR="$ROOT/.ed-harness-runtime"
mkdir -p "$STATE_DIR"
PID_FILE="$STATE_DIR/server.pid"
LOG_FILE="$STATE_DIR/server.log"
PORT_FILE="$STATE_DIR/port"
PREFERRED_PORT="${ED_HARNESS_PORT:-5173}"

die() {
  echo "EdHarness: $*" >&2
  if [[ -n "${DISPLAY:-}" ]] && command -v zenity >/dev/null 2>&1; then
    zenity --error --title="EdHarness" --text="$*" --width=420 2>/dev/null || true
  fi
  exit 1
}

notify() {
  echo "EdHarness: $*"
  if command -v notify-send >/dev/null 2>&1; then
    notify-send -a "EdHarness" "EdHarness" "$*" 2>/dev/null || true
  fi
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Comando necessário não encontrado: $1"
}

tcp_open() {
  local port="$1"
  (echo >/dev/tcp/127.0.0.1/"$port") >/dev/null 2>&1
}

http_up() {
  local port="$1"
  if command -v curl >/dev/null 2>&1; then
    curl -fsS --max-time 1 "http://127.0.0.1:${port}/" >/dev/null 2>&1
    return $?
  fi
  tcp_open "$port"
}

url_for() {
  echo "http://127.0.0.1:${1}/"
}

open_browser() {
  local url="$1"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  elif command -v gio >/dev/null 2>&1; then
    gio open "$url" >/dev/null 2>&1 || true
  else
    die "Não foi possível abrir o navegador (xdg-open ausente). Acesse: $url"
  fi
}

wait_for_server() {
  local port="$1"
  local i
  for i in $(seq 1 120); do
    if http_up "$port"; then
      return 0
    fi
    sleep 0.5
  done
  return 1
}

is_our_server() {
  [[ -f "$PID_FILE" && -f "$PORT_FILE" ]] || return 1
  local pid port
  pid="$(cat "$PID_FILE" 2>/dev/null || true)"
  port="$(cat "$PORT_FILE" 2>/dev/null || true)"
  [[ -n "$pid" && -n "$port" ]] || return 1
  kill -0 "$pid" 2>/dev/null || return 1
  http_up "$port"
}

find_free_port() {
  local port="$1"
  local max=$((port + 40))
  while (( port <= max )); do
    if ! tcp_open "$port"; then
      echo "$port"
      return 0
    fi
    port=$((port + 1))
  done
  return 1
}

require_cmd node
require_cmd npm

[[ -d "$FRONTEND" ]] || die "Pasta frontend não encontrada em: $ROOT"
[[ -f "$FRONTEND/package.json" ]] || die "package.json do frontend ausente."

cd "$FRONTEND"

if [[ ! -d node_modules ]]; then
  notify "Instalando dependências (primeira execução)…"
  npm install
fi

if [[ ! -f src/infrastructure/static/catalog.json ]]; then
  notify "Gerando catálogo estático…"
  npm run catalog:generate
fi

if is_our_server; then
  PORT="$(cat "$PORT_FILE")"
  URL="$(url_for "$PORT")"
  notify "Servidor já ativo — abrindo $URL"
  open_browser "$URL"
  exit 0
fi

PORT="$(find_free_port "$PREFERRED_PORT")" || die "Nenhuma porta livre perto de $PREFERRED_PORT"
URL="$(url_for "$PORT")"

notify "Iniciando servidor em $URL"
nohup npm run dev -- --host 127.0.0.1 --port "$PORT" --strictPort \
  >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"
echo "$PORT" >"$PORT_FILE"

if ! wait_for_server "$PORT"; then
  die "Servidor não respondeu a tempo. Veja o log: $LOG_FILE"
fi

notify "Pronto — abrindo o navegador"
open_browser "$URL"
exit 0
