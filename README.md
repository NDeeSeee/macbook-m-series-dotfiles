# MacBook M-Series Dotfiles

A clean, optimized dotfiles setup for macOS Apple Silicon development environments. Features intelligent shell configuration, automated maintenance, and emergency recovery capabilities.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/NDeeSeee/macbook-m-series-dotfiles.git ~/Documents/git/macbook-m-series-dotfiles

# Run setup
cd ~/Documents/git/macbook-m-series-dotfiles
./scripts/setup.sh
```

## 📁 Structure

```
├── shell/                 # Shell configurations
│   ├── .zshrc            # Main zsh configuration
│   ├── .p10k.zsh         # Powerlevel10k theme
│   ├── secure-env.zsh    # Secure environment variables
│   └── functions/        # Core development functions
├── editors/              # Editor configurations
├── development/          # Development tools config
├── r-environment/        # R and RStudio setup
├── homebrew/            # Package management
└── scripts/             # Essential automation scripts
```

## 🛠️ Core Functions

All functionality is consolidated into a single, clean `core-functions.zsh` file:

### Workspace Management
```bash
workspace myproject    # Create/switch to workspace
new-project api node   # Quick project creation
```

### System Monitoring
```bash
sys                   # Quick system status
top-procs            # Show top processes
```

### Package Management
```bash
install-essentials   # Install core development tools
update-all          # Update all package managers
clean-packages      # Clean package caches
```

### Secure Environment
```bash
add-secure-env GITHUB_TOKEN "your-token"
list-secure-env     # View configured variables
```

## 🚨 Emergency Scripts

### Emergency Recovery
```bash
./scripts/emergency-reset.sh  # Restore basic shell functionality
```

### System Maintenance
```bash
./scripts/maintenance.sh      # Clean and maintain system
```

## ✨ Key Features

### 🔒 **Security First**
- Encrypted storage for API keys and tokens
- Comprehensive `.gitignore` protection
- Secure file permissions (600) for sensitive data

### ⚡ **Performance Optimized**
- Single consolidated function file (no redundancy)
- Fast shell startup with lazy loading
- Efficient resource usage

### 🛡️ **Bulletproof Reliability**
- Emergency recovery mode
- Automated maintenance
- Clean, conflict-free updates

### 🎯 **Smart Context Switching**
- Automatic environment detection (.nvmrc, .python-version, etc.)
- Workspace organization with tmux integration
- Project-specific configurations

## 📊 Usage Examples

### Daily Workflow
```bash
# Start new project
workspace my-startup
new-project backend-api node

# Check system health
sys

# Maintain system
./scripts/maintenance.sh
```

### Development Setup
```bash
# Install essential tools
install-essentials

# Update everything
update-all

# Add secure credentials
add-secure-env OPENAI_API_KEY "sk-..."
```

## 🔧 Customization

Edit `shell/functions/core-functions.zsh` to customize:
- Workspace templates
- System monitoring thresholds  
- Package installation lists
- Project detection logic

## 🚨 Troubleshooting

### Shell Won't Start
```bash
./scripts/emergency-reset.sh
```

### Performance Issues
```bash
sys                    # Check system status
./scripts/maintenance.sh  # Clean up system
```

## 🔄 Updates

```bash
cd ~/Documents/git/macbook-m-series-dotfiles
git pull origin main
source ~/.zshrc
```

## 📝 What's Different

This is a **cleaned and consolidated** version that eliminates:
- ❌ Redundant function files (5 files → 1 file)
- ❌ Overlapping functionality 
- ❌ Complex, oversized scripts
- ❌ Duplicate system monitoring

**Result**: Faster loading, easier maintenance, cleaner codebase.

---

**💡 Pro Tip**: All functions are now in one place - `shell/functions/core-functions.zsh` - making customization simple and maintenance easy!
