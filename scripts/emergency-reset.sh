#!/bin/bash
# Emergency reset - restore to working shell configuration
set -euo pipefail

echo "🚨 Emergency Reset: Restoring shell to working state..."

# Backup current broken state
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/.dotfiles-emergency-backup-$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

# Backup current configs
[[ -f ~/.zshrc ]] && cp ~/.zshrc "$BACKUP_DIR/zshrc.broken"
[[ -d ~/.config ]] && cp -r ~/.config "$BACKUP_DIR/config.broken"

echo "📦 Current config backed up to: $BACKUP_DIR"

# Restore minimal working zsh config
cat > ~/.zshrc << 'EOF'
# Emergency minimal zsh configuration
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export EDITOR="nano"

# Basic aliases
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'

# Basic prompt
PS1='%n@%m:%~$ '

echo "✅ Emergency shell config loaded. Run 'source ~/.zshrc' or restart terminal."
echo "💡 To restore full config: cd ~/Documents/git/macbook-m-series-dotfiles && ./scripts/setup.sh"
EOF

echo "✅ Emergency reset complete!"
echo "🔄 Please restart your terminal or run: source ~/.zshrc"
echo "📁 Your broken config is saved in: $BACKUP_DIR"
