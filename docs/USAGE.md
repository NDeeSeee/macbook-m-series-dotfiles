# Usage Guide

Simple guide to using your dotfiles effectively.

## 🚀 Workspace Management

```bash
# Create or switch to workspace
workspace myproject

# Create new project in workspace
new-project api-server node     # Node.js project
new-project data-analysis python # Python project
new-project cli-tool rust       # Rust project
```

## 📊 System Monitoring

```bash
# Quick system status
sys

# Show top processes
top-procs
```

## 📦 Package Management

```bash
# Install essential development tools
install-essentials

# Update all package managers (brew, npm, pip)
update-all

# Clean package caches
clean-packages
```

## 🔒 Secure Environment

```bash
# Add secure environment variable
add-secure-env GITHUB_TOKEN "ghp_xxxxxxxxxxxx"
add-secure-env OPENAI_API_KEY "sk-xxxxxxxxxxxx"

# List configured variables (without values)
list-secure-env
```

## 🛠️ Project Context

When you enter a project directory, the system automatically:
- Loads `.envrc` files
- Switches Node.js versions (`.nvmrc`)
- Switches Python versions (`.python-version`)
- Activates conda environments (`environment.yml`)

```bash
# Manually reload project context
reload-env
```

## 🚨 Emergency Recovery

If your shell breaks:

```bash
# Reset to minimal working configuration
./scripts/emergency-reset.sh
```

## 🧹 Maintenance

```bash
# Regular system maintenance
./scripts/maintenance.sh
```

## 💡 Daily Workflow

```bash
# Start your day
workspace my-current-project
sys  # Check system health

# Create new project
new-project new-feature node
# Work on your project...

# End of day maintenance
update-all
./scripts/maintenance.sh
```

That's it! Simple, clean, and effective.
