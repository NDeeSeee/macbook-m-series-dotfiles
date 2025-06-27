# Core Development Functions - Consolidated and Cleaned
# Essential functionality without redundancy

# =============================================================================
# WORKSPACE MANAGEMENT
# =============================================================================

workspace() {
    local ws_name=$1
    local ws_dir="$HOME/Workspaces/$ws_name"
    
    if [[ -z "$ws_name" ]]; then
        echo "📁 Available workspaces:"
        [[ -d "$HOME/Workspaces" ]] && ls -1 "$HOME/Workspaces" | sed 's/^/   /' || echo "   No workspaces found"
        return 0
    fi
    
    # Create workspace if needed
    if [[ ! -d "$ws_dir" ]]; then
        mkdir -p "$ws_dir"/{projects,notes}
        echo "# $ws_name Workspace\n\nCreated: $(date)" > "$ws_dir/README.md"
        echo "📁 Created workspace: $ws_name"
    fi
    
    cd "$ws_dir"
    echo "🚀 Switched to workspace: $ws_name"
    
    # Tmux integration
    if command -v tmux &> /dev/null && [[ -z "$TMUX" ]]; then
        if ! tmux has-session -t "$ws_name" 2>/dev/null; then
            tmux new-session -d -s "$ws_name" -c "$ws_dir"
        fi
        echo "💡 Run 'tmux attach -t $ws_name' to attach to session"
    fi
}

# Quick project creation
new-project() {
    local name=$1
    local type=${2:-"general"}
    
    [[ -z "$name" ]] && { echo "Usage: new-project <name> [node|python|rust]"; return 1; }
    
    mkdir -p "$name" && cd "$name"
    
    case $type in
        "node")
            npm init -y
            echo "node_modules/\n.env\n*.log" > .gitignore
            echo "$(node --version | cut -d'v' -f2)" > .nvmrc
            ;;
        "python")
            python -m venv venv
            echo "venv/\n__pycache__/\n*.pyc\n.env" > .gitignore
            echo "$(python --version | cut -d' ' -f2)" > .python-version
            ;;
        "rust")
            cargo init --name "$name"
            ;;
    esac
    
    git init && echo "✅ Created $type project: $name"
}

# =============================================================================
# SMART PROJECT CONTEXT
# =============================================================================

# Auto-load project environments
load_project_context() {
    # Load .envrc if exists
    [[ -f ".envrc" ]] && source ".envrc" 2>/dev/null && echo "📁 Loaded .envrc"
    
    # Node version switching
    if [[ -f ".nvmrc" ]] && command -v nvm &> /dev/null; then
        nvm use
    fi
    
    # Python version switching  
    if [[ -f ".python-version" ]] && command -v pyenv &> /dev/null; then
        pyenv local "$(cat .python-version)"
    fi
    
    # Conda environment
    if [[ -f "environment.yml" ]] && command -v conda &> /dev/null; then
        local env_name=$(basename "$PWD")
        conda info --envs | grep -q "$env_name" && conda activate "$env_name"
    fi
}

# Hook into directory changes
chpwd() {
    [[ -o interactive ]] && load_project_context
}

# =============================================================================
# SYSTEM MONITORING (ESSENTIAL ONLY)
# =============================================================================

# Quick system status
sys-status() {
    echo "🖥️  System Status - $(date '+%H:%M')"
    echo "================================"
    
    # CPU & Memory
    local cpu=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d% -f1 | cut -d. -f1)
    local memory=$(vm_stat | awk '/free|active|inactive|wired/ {sum+=$3} /free/ {free=$3} END {printf "%.0f", (sum-free)*100/sum}')
    local disk=$(df -h / | tail -1 | awk '{print $5}' | cut -d% -f1)
    
    echo "⚡ CPU: ${cpu}%"
    echo "🧠 Memory: ${memory}%"  
    echo "💾 Disk: ${disk}%"
    
    # Alerts (using integer comparison)
    local alerts=0
    [[ $cpu -gt 80 ]] && echo "   ⚠️  High CPU usage" && ((alerts++))
    [[ $memory -gt 85 ]] && echo "   ⚠️  High memory usage" && ((alerts++))
    [[ $disk -gt 85 ]] && echo "   ⚠️  Low disk space" && ((alerts++))
    [[ $alerts -eq 0 ]] && echo "   ✅ System healthy"
}

# Top processes
top-procs() {
    echo "🔥 Top Processes"
    echo "================"
    ps aux | sort -nr -k 3 | head -8 | awk 'NR==1{print "   PID    CPU%  COMMAND"} NR>1{printf "   %-6s %-5s %s\n", $2, $3"%", $11}'
}

# =============================================================================
# PACKAGE MANAGEMENT (SIMPLIFIED)
# =============================================================================

# Install essential development tools
install-essentials() {
    echo "📦 Installing Essential Tools..."
    local tools=("git" "curl" "jq" "tree" "fzf" "ripgrep" "bat")
    
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            echo "  📥 Installing $tool..."
            brew install "$tool"
        else
            echo "  ✅ $tool already installed"
        fi
    done
}

# Update all package managers
update-all() {
    echo "🔄 Updating Package Managers..."
    
    command -v brew &> /dev/null && { echo "🍺 Updating Homebrew..."; brew update && brew upgrade; }
    command -v npm &> /dev/null && { echo "📦 Updating npm..."; npm update -g; }
    command -v pip &> /dev/null && { echo "🐍 Updating pip..."; pip list --outdated --format=freeze | cut -d = -f 1 | xargs -n1 pip install -U 2>/dev/null; }
    
    echo "✅ Updates complete!"
}

# Clean package managers
clean-packages() {
    echo "🧹 Cleaning Package Managers..."
    
    command -v brew &> /dev/null && brew cleanup --prune=30
    command -v npm &> /dev/null && npm cache clean --force
    command -v pip &> /dev/null && pip cache purge
    
    echo "✅ Cleanup complete!"
}

# =============================================================================
# SECURE ENVIRONMENT (SIMPLIFIED)
# =============================================================================

# Add secure environment variable
add-secure-env() {
    [[ $# -ne 2 ]] && { echo "Usage: add-secure-env VARIABLE_NAME value"; return 1; }
    
    local var_name="$1" var_value="$2"
    local secure_file="$HOME/.config/secure-env"
    
    # Create secure file if needed
    if [[ ! -f "$secure_file" ]]; then
        mkdir -p "$(dirname "$secure_file")"
        echo "# Secure Environment Variables" > "$secure_file"
        chmod 600 "$secure_file"
    fi
    
    # Check if variable exists
    if grep -q "^export $var_name=" "$secure_file"; then
        echo "⚠️  Variable $var_name already exists"
        return 1
    fi
    
    echo "export $var_name=\"$var_value\"" >> "$secure_file"
    echo "✅ Added $var_name to secure environment"
}

# List secure environment variables
list-secure-env() {
    local secure_file="$HOME/.config/secure-env"
    if [[ -f "$secure_file" ]]; then
        echo "🔒 Secure environment variables:"
        grep "^export " "$secure_file" | sed 's/=.*//' | sed 's/export /  - /'
    else
        echo "No secure environment file found"
    fi
}

# =============================================================================
# ALIASES & SHORTCUTS
# =============================================================================

# Workspace shortcuts
alias ws='workspace'
alias np='new-project'

# System shortcuts  
alias sys='sys-status'
alias procs='top-procs'

# Package shortcuts
alias install-dev='install-essentials'
alias update-dev='update-all'
alias clean-dev='clean-packages'

# Context shortcuts
alias reload-env='load_project_context'
