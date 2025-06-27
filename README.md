# MacBook M-Series Dotfiles

A comprehensive, optimized dotfiles setup for macOS Apple Silicon development environments. Features intelligent shell configuration, automated maintenance, and emergency recovery capabilities.

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
│   └── functions/        # Custom shell functions
├── editors/              # Editor configurations
│   ├── cursor/           # Cursor AI editor settings
│   └── vscode/           # VS Code settings
├── development/          # Development tools config
├── r-environment/        # R and RStudio setup
├── homebrew/            # Package management
└── scripts/             # Automation scripts
```

## 🛠️ Essential Scripts

### Emergency Recovery
```bash
# If your shell breaks, run this to restore basic functionality
./scripts/emergency-reset.sh
```

### Health Monitoring
```bash
# Check system health and performance
./scripts/health-check.sh
```

### Maintenance
```bash
# Clean up and maintain your system
./scripts/maintenance.sh
```

## ✨ Key Features

### 🔒 **Secure Environment Management**
- Encrypted storage for API keys and tokens
- Automatic `.gitignore` protection for sensitive files
- Hardware security key support

```bash
# Add secure environment variables
add-secure-env GITHUB_TOKEN "your-token-here"
list-secure-env  # View configured variables
```

### 🎯 **Smart Project Context**
- Automatic environment switching when entering projects
- Support for `.envrc`, `.nvmrc`, `environment.yml`
- Python version management with pyenv

### ⚡ **Performance Optimized**
- Shell startup time < 500ms target
- Lazy loading of heavy tools
- Intelligent caching strategies

### 🛡️ **Bulletproof Reliability**
- Emergency recovery mode
- Automated health checks
- Backup verification
- Conflict-free updates

## 🔧 Configuration

### Shell Performance
The configuration is optimized for fast startup times:
- Powerlevel10k with instant prompt
- Conditional loading of tools
- Optimized plugin selection

### Editor Integration
- Cursor AI with curated extensions
- VS Code settings sync
- Consistent themes and shortcuts

### Development Tools
- Homebrew package management
- Conda environment handling
- Git configuration with security

## 📊 Monitoring

### Performance Metrics
```bash
# Check shell startup time
time zsh -i -c exit

# Run comprehensive health check
./scripts/health-check.sh
```

### Maintenance Schedule
- **Weekly**: Run `./scripts/maintenance.sh`
- **Monthly**: Review `./scripts/health-check.sh` output
- **As needed**: Use `./scripts/emergency-reset.sh` for issues

## 🚨 Troubleshooting

### Shell Won't Start
```bash
# Emergency reset to minimal config
./scripts/emergency-reset.sh
```

### Slow Performance
```bash
# Check for issues
./scripts/health-check.sh

# Clean up system
./scripts/maintenance.sh
```

### Missing Dependencies
```bash
# Reinstall core tools
./scripts/setup.sh
```

## 🔄 Updates

```bash
# Update dotfiles
cd ~/Documents/git/macbook-m-series-dotfiles
git pull origin main

# Apply changes
source ~/.zshrc
```

## 🤝 Contributing

1. Test changes thoroughly
2. Run health checks before committing
3. Update documentation for new features
4. Keep security in mind for all changes

## 📝 License

MIT License - Feel free to adapt for your own use.

---

**💡 Pro Tip**: Run `./scripts/health-check.sh` regularly to catch issues early!
