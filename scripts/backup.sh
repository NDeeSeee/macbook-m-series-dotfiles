#!/bin/bash

# Backup current configurations to dotfiles repository
# Run this script to sync your current configs with the repository

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

cd "$REPO_DIR"

log_info "Backing up current configurations..."

# Backup shell configurations
log_info "Backing up shell configurations..."
cp "$HOME/.zshrc" shell/
cp "$HOME/.zprofile" shell/
cp "$HOME/.bashrc" shell/
cp "$HOME/.p10k.zsh" shell/
cp "$HOME/.fzf.zsh" shell/

# Backup development tools
log_info "Backing up development configurations..."
cp "$HOME/.gitconfig" development/git/
cp "$HOME/.Renviron" r-environment/

# Backup editor configurations
log_info "Backing up editor configurations..."
if [[ -f "$HOME/.claude.json" ]]; then
    cp "$HOME/.claude.json" editors/claude/
fi

# Update Brewfile
log_info "Updating Brewfile..."
cd homebrew
brew bundle dump --force
cd ..

# Generate R packages list
log_info "Updating R packages list..."
echo "# R Packages installed on this system" > r-environment/packages.txt
echo "# Generated on $(date)" >> r-environment/packages.txt

# Update conda environments if available
if command -v conda &> /dev/null; then
    log_info "Exporting conda environments..."
    conda env export > r-environment/conda-environment.yml 2>/dev/null || true
fi

log_success "Backup completed successfully!"
log_info "Review changes with: git diff"
log_info "Commit changes with: git add . && git commit -m 'Update configurations'"
