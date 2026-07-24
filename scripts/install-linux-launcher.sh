#!/usr/bin/env bash
# Instala atalho EdHarness no menu de aplicativos e na Área de Trabalho (Linux Mint).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAUNCHER="$ROOT/scripts/launch-ed-harness.sh"
ICON="$ROOT/scripts/ed-harness-icon.png"
APP_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
DESKTOP_DIR="${XDG_DESKTOP_DIR:-$HOME/Desktop}"
APP_FILE="$APP_DIR/ed-harness.desktop"
DESKTOP_FILE="$DESKTOP_DIR/EdHarness.desktop"

die() {
  echo "$*" >&2
  exit 1
}

[[ -f "$LAUNCHER" ]] || die "Launcher não encontrado: $LAUNCHER"
[[ -f "$ICON" ]] || die "Ícone não encontrado: $ICON"

chmod +x "$LAUNCHER" "$ROOT/scripts/install-linux-launcher.sh"

mkdir -p "$APP_DIR"

write_desktop() {
  local dest="$1"
  cat >"$dest" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=EdHarness
GenericName=Educational Harness
Comment=Abre o EdHarness no navegador (servidor local)
Exec=$LAUNCHER
Icon=$ICON
Path=$ROOT
Terminal=false
Categories=Education;Development;
StartupNotify=true
Keywords=edharness;curso;javascript;estudo;
EOF
  chmod +x "$dest"
}

write_desktop "$APP_FILE"

if [[ -d "$DESKTOP_DIR" ]]; then
  write_desktop "$DESKTOP_FILE"
  # Marca como confiável no Cinnamon/Nemo (duplo clique na Área de Trabalho)
  if command -v gio >/dev/null 2>&1; then
    gio set "$DESKTOP_FILE" metadata::trusted true 2>/dev/null || true
  fi
  # Fallback usado por alguns ambientes
  chmod +x "$DESKTOP_FILE"
fi

if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$APP_DIR" 2>/dev/null || true
fi

# Atalho executável na raiz do repositório (duplo clique / terminal)
ROOT_LINK="$ROOT/EdHarness"
ln -sfn "$LAUNCHER" "$ROOT_LINK"
chmod +x "$ROOT_LINK"

echo "Instalado:"
echo "  Menu de aplicativos: $APP_FILE"
if [[ -f "${DESKTOP_FILE:-}" ]]; then
  echo "  Área de Trabalho:   $DESKTOP_FILE"
fi
echo "  Executável no repo:  $ROOT_LINK"
echo
echo "Procure por \"EdHarness\" no menu, ou dê duplo clique no ícone da Área de Trabalho."
