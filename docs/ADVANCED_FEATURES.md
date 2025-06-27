# Advanced Features Guide

This guide covers the advanced productivity features available in your dotfiles setup.

## 🚀 Workspace Management

Organize your development work into isolated workspaces with automatic tmux integration.

### Basic Usage

```bash
# Create or switch to a workspace
workspace myproject

# List all workspaces
workspace
# or
ws-list

# Create a new project within current workspace
ws-new my-app node          # Node.js project
ws-new data-analysis python # Python project
ws-new api-server rust      # Rust project
```

### Workspace Structure

Each workspace automatically gets:
```
~/Workspaces/myproject/
├── projects/           # Your code projects
├── notes/             # Project notes and documentation
├── scripts/           # Workspace-specific scripts
├── README.md          # Workspace overview
└── .workspace-env     # Environment variables
```

### Environment Management

```bash
# Set workspace-specific environment variables
ws-env set API_KEY "your-key-here"
ws-env set DATABASE_URL "postgres://localhost/mydb"

# List environment variables
ws-env list

# Edit environment file directly
ws-env edit
```

### Tmux Integration

```bash
# Attach to workspace tmux session
ws-tmux

# Kill workspace tmux session
ws-kill
```

## 🔧 Development Environment Isolation

Automatically detect and configure project-specific development environments.

### Auto-Detection

When you enter a project directory, the system automatically detects:
- **Node.js** projects (package.json)
- **Python** projects (requirements.txt, pyproject.toml)
- **Rust** projects (Cargo.toml)
- **Go** projects (go.mod)
- **Ruby** projects (Gemfile)
- **Docker** projects (Dockerfile)

### Manual Setup

```bash
# Analyze and setup current project
dev-env setup

# Show project environment info
dev-env info

# Clean environment files
dev-env clean
```

### What Gets Created

For each project type, appropriate files are created:

**Node.js Projects:**
- `.nvmrc` - Node version specification
- `.npmrc` - Optimized npm configuration

**Python Projects:**
- `.python-version` - Python version specification
- `venv/` - Virtual environment
- `DEV_SETUP.md` - Setup documentation

**All Projects:**
- `.envrc` - direnv configuration for automatic environment loading
- `DEV_SETUP.md` - Project-specific setup instructions

## 📊 System Monitoring

Keep track of your system's performance and health.

### Quick Status

```bash
# Show system overview
sys

# Watch system continuously
sys-watch

# Show top processes
top-proc

# Network information
netinfo

# Disk usage details
diskinfo
```

### Detailed Monitoring

```bash
# Comprehensive system status
sys-monitor status

# Check for system alerts
sys-monitor alerts

# Monitor specific aspects
sys-monitor processes  # Top CPU/memory processes
sys-monitor network    # Network details
sys-monitor disk       # Disk usage breakdown
```

### Automatic Alerts

The system automatically warns you about:
- High CPU usage (>80%)
- High memory usage (>85%)
- Low disk space (>85% full)
- Low battery (<20% on battery power)
- Runaway processes

## 📦 Unified Package Management

Manage packages across all your development tools from one interface.

### Install Tool Categories

```bash
# Essential development tools
pkg install essential

# Language-specific tools
pkg install node-tools     # TypeScript, ESLint, Prettier, etc.
pkg install python-tools   # Black, Pytest, Jupyter, etc.
pkg install rust-tools     # Cargo extensions and utilities
pkg install go-tools       # Go development utilities

# Specialized categories
pkg install data-science   # R, Jupyter, Pandas, NumPy, etc.
pkg install devops         # Docker, Kubernetes, Terraform, etc.
pkg install security       # GPG, Nmap, security tools
```

### Package Management

```bash
# Update all package managers
pkg update

# Clean all package managers
pkg clean

# Search for packages
pkg search docker

# Show package manager status
pkg info

# List available categories
pkg list
```

### Supported Package Managers

- **Homebrew** - macOS packages and applications
- **npm** - Node.js packages
- **pip** - Python packages
- **Cargo** - Rust packages
- **Go modules** - Go packages

## 🔒 Secure Environment Management

Safely manage API keys, tokens, and other sensitive data.

### Adding Secure Variables

```bash
# Add a secure environment variable
add-secure-env GITHUB_TOKEN "ghp_xxxxxxxxxxxx"
add-secure-env OPENAI_API_KEY "sk-xxxxxxxxxxxx"
add-secure-env AWS_ACCESS_KEY_ID "AKIAXXXXXXXXXXXX"

# List configured variables (without values)
list-secure-env
```

### Security Features

- Variables stored in `~/.config/secure-env` with 600 permissions
- File is excluded from git tracking
- Automatically loaded in all shell sessions
- Safe from accidental exposure in dotfiles

## 🎯 Project Context Switching

Automatically adapt your environment when entering different projects.

### Supported Files

The system automatically detects and loads:
- `.envrc` - direnv-style environment variables
- `.nvmrc` - Node.js version switching
- `environment.yml` - Conda environment activation
- `.python-version` - Python version switching with pyenv

### Manual Context Loading

```bash
# Reload project environment
reload-env
```

## 🚨 Emergency Recovery

If something goes wrong with your shell configuration:

```bash
# Emergency reset to minimal working shell
./scripts/emergency-reset.sh
```

This will:
- Backup your broken configuration
- Restore a minimal working shell
- Provide instructions for full recovery

## 📈 Performance Monitoring

Keep track of your shell and system performance:

```bash
# Check shell startup time
time zsh -i -c exit

# Run comprehensive health check
./scripts/health-check.sh

# System maintenance
./scripts/maintenance.sh
```

## 💡 Pro Tips

### Productivity Shortcuts

```bash
# Quick workspace switching
ws myproject && ws-new api node

# Install full development stack
pkg install essential && pkg install node-tools && pkg install python-tools

# Monitor system while working
sys-watch  # In a separate terminal

# Set up new project quickly
mkdir myproject && cd myproject && dev-env setup
```

### Integration with Editors

Your editors (Cursor, VS Code) will automatically:
- Detect project environments
- Use correct Node/Python versions
- Load workspace-specific settings
- Integrate with tmux sessions

### Automation

Add to your workflow:
- Weekly: `./scripts/maintenance.sh`
- Monthly: `./scripts/health-check.sh`
- As needed: `pkg update && pkg clean`

## 🔧 Customization

### Workspace Templates

Create custom project templates by modifying the `new-workspace-project` function in `shell/functions/workspace.zsh`.

### System Monitoring Thresholds

Adjust alert thresholds in `shell/functions/system-monitor.zsh`:
- CPU usage warning level
- Memory usage warning level
- Disk space warning level

### Package Categories

Add custom package categories in `shell/functions/package-manager.zsh` by creating new functions following the existing pattern.

---

These advanced features transform your dotfiles from simple configuration into a comprehensive development environment management system. Each feature is designed to work independently, so you can adopt them gradually as needed.
