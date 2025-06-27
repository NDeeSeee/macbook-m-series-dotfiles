# Smart project context switching
# Automatically detect and load project-specific environments

# Function to load project environment
load_project_env() {
    local project_dir="$PWD"
    
    # Check for .envrc (direnv style)
    if [[ -f "$project_dir/.envrc" ]]; then
        echo "📁 Found .envrc - loading project environment..."
        # Source safely with error handling
        if source "$project_dir/.envrc" 2>/dev/null; then
            echo "✅ Project environment loaded"
        else
            echo "⚠️  Warning: .envrc had errors"
        fi
    fi
    
    # Check for .nvmrc (Node version)
    if [[ -f "$project_dir/.nvmrc" ]] && command -v nvm &> /dev/null; then
        echo "📦 Switching to Node version: $(cat .nvmrc)"
        nvm use
    fi
    
    # Check for environment.yml (Conda)
    if [[ -f "$project_dir/environment.yml" ]] && command -v conda &> /dev/null; then
        local env_name=$(basename "$project_dir")
        if conda info --envs | grep -q "$env_name"; then
            echo "🐍 Activating conda environment: $env_name"
            conda activate "$env_name"
        fi
    fi
    
    # Check for .python-version (pyenv)
    if [[ -f "$project_dir/.python-version" ]] && command -v pyenv &> /dev/null; then
        echo "🐍 Switching Python version: $(cat .python-version)"
        pyenv local "$(cat .python-version)"
    fi
}

# Hook into directory changes
chpwd() {
    # Only run in interactive shells to avoid script interference
    if [[ -o interactive ]]; then
        load_project_env
    fi
}

# Manual command to reload project context
alias reload-env='load_project_env'
