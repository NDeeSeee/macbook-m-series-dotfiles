# MacBook M-Series Development Environment Setup

A comprehensive dotfiles repository for macOS Apple Silicon (M1/M2/M3) development environment setup.

## 🚀 Quick Setup

```bash
# Clone the repository
git clone https://github.com/<username>/macbook-m-series-dotfiles.git
cd macbook-m-series-dotfiles

# Run the setup script
./setup.sh
```

## 📁 Repository Structure

```
├── shell/              # Shell configurations
│   ├── .zshrc
│   ├── .zprofile
│   ├── .bashrc
│   └── .p10k.zsh
├── editors/            # Editor configurations
│   ├── vscode/
│   ├── cursor/
│   └── claude/
├── development/        # Development tools
│   ├── git/
│   ├── aws/
│   ├── docker/
│   └── kubernetes/
├── r-environment/      # R configuration
│   ├── .Renviron
│   └── packages.txt
├── homebrew/           # Package management
│   └── Brewfile
├── scripts/            # Setup and utility scripts
│   ├── setup.sh
│   ├── backup.sh
│   └── install-packages.sh
└── docs/              # Documentation
    └── SETUP.md
```

## 🛠 Included Tools & Configurations

### Shell Environment
- **Zsh** with Oh My Zsh framework
- **Powerlevel10k** theme
- **Zoxide** for smart directory navigation
- **fzf** for fuzzy finding
- **Syntax highlighting** and **autosuggestions**

### Development Tools
- **Git** configuration
- **AWS CLI** setup
- **Docker** configuration
- **Kubernetes** (kubectl) setup
- **VS Code** and **Cursor** editor settings
- **Claude AI** configuration

### R Environment
- Environment variables
- Package management
- Radian REPL configuration

### Package Management
- **Homebrew** with Brewfile
- **Conda/Mamba** environment exports

## 🔧 Features

- **Automated setup** script for new machines
- **Backup utilities** for current configurations
- **Modular structure** for easy customization
- **Security-conscious** (no private keys or secrets)
- **Apple Silicon optimized** paths and configurations

## 📝 Usage

### First Time Setup
1. Install Xcode Command Line Tools: `xcode-select --install`
2. Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
3. Clone this repository and run `./setup.sh`

### Updating Configurations
```bash
# Backup current configs
./scripts/backup.sh

# Make changes and commit
git add .
git commit -m "Update configuration"
git push
```

## 🔄 Maintenance

- Run `./scripts/backup.sh` regularly to sync changes
- Update package lists with `./scripts/update-packages.sh`
- Review and clean up configurations periodically

## 🤝 Contributing

Feel free to fork and customize for your own setup. Pull requests welcome for general improvements!

## 📄 License

MIT License - Feel free to use and modify as needed.
