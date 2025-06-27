#!/bin/bash
# Simple health check for dotfiles system
set -euo pipefail

echo "🔍 Dotfiles Health Check"
echo "========================"

# Check shell startup time
echo "⏱️  Shell Performance:"
STARTUP_TIME=$( (time zsh -i -c exit) 2>&1 | grep real | awk '{print $2}' || echo "unknown")
echo "   Startup time: $STARTUP_TIME"

# Check critical files exist
echo ""
echo "📁 Critical Files:"
CRITICAL_FILES=(
    "$HOME/.zshrc"
    "$HOME/.gitconfig"
    "/opt/homebrew/bin/brew"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [[ -e "$file" ]]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (MISSING)"
    fi
done

# Check disk usage
echo ""
echo "💾 Disk Usage:"
echo "   Homebrew: $(du -sh /opt/homebrew 2>/dev/null | cut -f1 || echo 'Not found')"
echo "   Dotfiles: $(du -sh ~/Documents/git/macbook-m-series-dotfiles 2>/dev/null | cut -f1 || echo 'Not found')"

# Check for common issues
echo ""
echo "⚠️  Potential Issues:"
ISSUES=0

# Check for broken symlinks in home directory
BROKEN_LINKS=$(find ~ -maxdepth 2 -type l -exec test ! -e {} \; -print 2>/dev/null | wc -l | tr -d ' ')
if [[ $BROKEN_LINKS -gt 0 ]]; then
    echo "   ⚠️  $BROKEN_LINKS broken symlinks found in home directory"
    ((ISSUES++))
fi

# Check if shell startup is slow (>2 seconds)
if [[ "$STARTUP_TIME" =~ ([0-9]+)m([0-9]+\.[0-9]+)s ]]; then
    MINUTES=${BASH_REMATCH[1]}
    SECONDS=${BASH_REMATCH[2]}
    TOTAL_SECONDS=$(echo "$MINUTES * 60 + $SECONDS" | bc -l 2>/dev/null || echo "0")
    if (( $(echo "$TOTAL_SECONDS > 2.0" | bc -l 2>/dev/null || echo "0") )); then
        echo "   ⚠️  Shell startup is slow (${STARTUP_TIME})"
        ((ISSUES++))
    fi
elif [[ "$STARTUP_TIME" =~ ([0-9]+\.[0-9]+)s ]]; then
    TOTAL_SECONDS=${BASH_REMATCH[1]}
    if (( $(echo "$TOTAL_SECONDS > 2.0" | bc -l 2>/dev/null || echo "0") )); then
        echo "   ⚠️  Shell startup is slow (${STARTUP_TIME})"
        ((ISSUES++))
    fi
fi

if [[ $ISSUES -eq 0 ]]; then
    echo "   ✅ No issues detected"
fi

echo ""
echo "🏁 Health check complete!"
