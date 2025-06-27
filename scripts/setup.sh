#!/bin/bash

# MacBook M-Series Development Environment Setup Script
# This script sets up a complete development environment on macOS Apple Silicon

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    log_error "This script is designed for macOS only"
    exit 1
fi

# Check if running on Apple Silicon
if [[ $(uname -m) != "arm64" ]]; then
    log_warning "This script is optimized for Apple Silicon Macs"
fi

log_info "Starting MacBook M-Series Development Environment Setup..."

# Create backup of existing dotfiles
backup_existing() {
    log_info "Creating backup of existing configurations..."
    BACKUP_DIR="$HOME/.dotfiles-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup existing files
    for file in .zshrc .zprofile .bashrc .p10k.zsh .gitconfig .Renviron; do
        if [[ -f "$HOME/$file" ]]; then
            cp "$HOME/$file" "$BACKUP_DIR/"
            log_info "Backed up $file"
        fi
    done
    
    log_success "Backup created at $BACKUP_DIR"
}

# Install Homebrew if not present
install_homebrew() {
    if ! command -v brew &> /dev/null; then
        log_info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH for Apple Silicon
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
        
        log_success "Homebrew installed successfully"
    else
        log_info "Homebrew already installed"
    fi
}

# Install packages from Brewfile
install_packages() {
    log_info "Installing packages from Brewfile..."
    if [[ -f "homebrew/Brewfile" ]]; then
        brew bundle --file=homebrew/Brewfile
        log_success "Packages installed successfully"
    else
        log_warning "Brewfile not found, skipping package installation"
    fi
}

# Setup shell configurations
setup_shell() {
    log_info "Setting up shell configurations..."
    
    # Copy shell files
    cp shell/.zshrc "$HOME/"
    cp shell/.zprofile "$HOME/"
    cp shell/.bashrc "$HOME/"
    cp shell/.p10k.zsh "$HOME/"
    cp shell/.fzf.zsh "$HOME/"
    
    # Install Oh My Zsh if not present
    if [[ ! -d "$HOME/.oh-my-zsh" ]]; then
        log_info "Installing Oh My Zsh..."
        sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
    fi
    
    # Install Powerlevel10k theme
    if [[ ! -d "$HOME/.oh-my-zsh/custom/themes/powerlevel10k" ]]; then
        log_info "Installing Powerlevel10k theme..."
        git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$HOME/.oh-my-zsh/custom/themes/powerlevel10k"
    fi
    
    log_success "Shell configuration completed"
}

# Setup development tools
setup_development() {
    log_info "Setting up development tools..."
    
    # Git configuration
    if [[ -f "development/git/.gitconfig" ]]; then
        cp development/git/.gitconfig "$HOME/"
        log_info "Git configuration applied"
    fi
    
    # R environment
    if [[ -f "r-environment/.Renviron" ]]; then
        cp r-environment/.Renviron "$HOME/"
        log_info "R environment configuration applied"
    fi
    
    log_success "Development tools configured"
}

# Setup editors
setup_editors() {
    log_info "Setting up editor configurations..."
    
    # VS Code settings
    if [[ -d "editors/vscode" ]] && [[ -d "$HOME/.vscode" ]]; then
        cp -r editors/vscode/* "$HOME/.vscode/" 2>/dev/null || true
        log_info "VS Code settings applied"
    fi
    
    # Cursor settings
    if [[ -d "editors/cursor" ]] && [[ -d "$HOME/.cursor" ]]; then
        cp -r editors/cursor/* "$HOME/.cursor/" 2>/dev/null || true
        log_info "Cursor settings applied"
    fi
    
    # Claude settings
    if [[ -f "editors/claude/.claude.json" ]]; then
        cp editors/claude/.claude.json "$HOME/"
        log_info "Claude configuration applied"
    fi
    
    log_success "Editor configurations completed"
}

# Main setup function
main() {
    log_info "MacBook M-Series Development Environment Setup"
    log_info "=============================================="
    
    # Get current directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    REPO_DIR="$(dirname "$SCRIPT_DIR")"
    
    cd "$REPO_DIR"
    
    # Run setup steps
    backup_existing
    install_homebrew
    install_packages
    setup_shell
    setup_development
    setup_editors
    
    log_success "Setup completed successfully!"
    log_info "Please restart your terminal or run 'source ~/.zshrc' to apply changes"
    log_info "You may need to configure some applications manually"
}

# Run main function
main "$@"
