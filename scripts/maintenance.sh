#!/bin/bash
# Simple maintenance script - keep system clean and updated
set -euo pipefail

echo "🧹 Running Dotfiles Maintenance"
echo "==============================="

# Homebrew maintenance
if command -v brew &> /dev/null; then
    echo "🍺 Homebrew Maintenance:"
    echo "   Cleaning up old versions..."
    brew cleanup --prune=30 --quiet
    
    echo "   Checking for issues..."
    if ! brew doctor --quiet; then
        echo "   ⚠️  Homebrew has issues (run 'brew doctor' for details)"
    else
        echo "   ✅ Homebrew is healthy"
    fi
else
    echo "❌ Homebrew not found"
fi

# Conda maintenance (if installed)
if command -v conda &> /dev/null; then
    echo ""
    echo "🐍 Conda Maintenance:"
    echo "   Cleaning package cache..."
    conda clean --packages --tarballs --yes --quiet
    echo "   ✅ Conda cleaned"
fi

# Git maintenance
echo ""
echo "📦 Git Repository Maintenance:"
cd ~/Documents/git/macbook-m-series-dotfiles
echo "   Current status:"
git status --porcelain | head -5

# Clean up old backup files
echo ""
echo "🗑️  Cleanup:"
BACKUP_COUNT=$(find ~ -name ".dotfiles-emergency-backup-*" -type d 2>/dev/null | wc -l)
if [[ $BACKUP_COUNT -gt 3 ]]; then
    echo "   Found $BACKUP_COUNT emergency backups (keeping newest 3)"
    find ~ -name ".dotfiles-emergency-backup-*" -type d -print0 2>/dev/null | \
        xargs -0 ls -dt | tail -n +4 | xargs rm -rf
    echo "   ✅ Old backups cleaned"
else
    echo "   ✅ Backup count is reasonable ($BACKUP_COUNT)"
fi

echo ""
echo "✅ Maintenance complete!"
echo "💡 Run './scripts/health-check.sh' to verify system health"
