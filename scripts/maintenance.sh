#!/bin/bash
# Simplified maintenance script
set -euo pipefail

echo "🧹 Running System Maintenance"
echo "============================="

# Use core functions for package management
source ~/Documents/git/macbook-m-series-dotfiles/shell/functions/core-functions.zsh

# Run package cleanup
clean-packages

# Git repository maintenance
echo ""
echo "📦 Git Repository Status:"
cd ~/Documents/git/macbook-m-series-dotfiles
git status --porcelain | head -3

# Clean old emergency backups (keep newest 2)
echo ""
echo "🗑️  Backup Cleanup:"
BACKUP_COUNT=$(find ~ -name ".dotfiles-emergency-backup-*" -type d 2>/dev/null | wc -l | tr -d ' ')
if [[ $BACKUP_COUNT -gt 2 ]]; then
    find ~ -name ".dotfiles-emergency-backup-*" -type d -print0 2>/dev/null | \
        xargs -0 ls -dt | tail -n +3 | xargs rm -rf
    echo "   ✅ Cleaned old backups (kept newest 2)"
else
    echo "   ✅ Backup count is reasonable ($BACKUP_COUNT)"
fi

echo ""
echo "✅ Maintenance complete!"
