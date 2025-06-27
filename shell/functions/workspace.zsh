# Workspace Management - Quick project switching with context
# Creates organized development environments with tmux integration

# Main workspace function
workspace() {
    local ws_name=$1
    local ws_dir="$HOME/Workspaces/$ws_name"
    
    if [[ -z "$ws_name" ]]; then
        echo "📁 Available workspaces:"
        if [[ -d "$HOME/Workspaces" ]]; then
            ls -1 "$HOME/Workspaces" | sed 's/^/   /'
        else
            echo "   No workspaces found. Create one with: workspace <name>"
        fi
        return 0
    fi
    
    # Create workspace directory if it doesn't exist
    if [[ ! -d "$ws_dir" ]]; then
        mkdir -p "$ws_dir"
        echo "📁 Created workspace: $ws_name"
        
        # Initialize with basic structure
        mkdir -p "$ws_dir"/{projects,notes,scripts}
        echo "# $ws_name Workspace\n\nCreated: $(date)\n\n## Projects\n\n## Notes\n" > "$ws_dir/README.md"
    fi
    
    # Change to workspace directory
    cd "$ws_dir"
    echo "🚀 Switched to workspace: $ws_name"
    
    # Auto-start tmux session if available
    if command -v tmux &> /dev/null; then
        if ! tmux has-session -t "$ws_name" 2>/dev/null; then
            tmux new-session -d -s "$ws_name" -c "$ws_dir"
            echo "📺 Created tmux session: $ws_name"
        fi
        
        # Attach to session if not already in tmux
        if [[ -z "$TMUX" ]]; then
            echo "💡 Run 'tmux attach -t $ws_name' to attach to tmux session"
        fi
    fi
    
    # Load workspace-specific environment if it exists
    if [[ -f "$ws_dir/.workspace-env" ]]; then
        echo "🔧 Loading workspace environment..."
        source "$ws_dir/.workspace-env"
    fi
}

# Create new project within current workspace
new-workspace-project() {
    local project_name=$1
    local project_type=${2:-"general"}
    
    if [[ -z "$project_name" ]]; then
        echo "Usage: new-workspace-project <name> [type]"
        echo "Types: node, python, rust, go, general"
        return 1
    fi
    
    # Check if we're in a workspace
    if [[ "$PWD" != "$HOME/Workspaces"* ]]; then
        echo "⚠️  Not in a workspace. Use 'workspace <name>' first."
        return 1
    fi
    
    local project_dir="projects/$project_name"
    mkdir -p "$project_dir"
    cd "$project_dir"
    
    # Initialize based on project type
    case $project_type in
        "node")
            npm init -y
            echo "node_modules/\n.env\n*.log\ndist/\nbuild/" > .gitignore
            echo "# $project_name\n\n## Setup\n\n\`\`\`bash\nnpm install\nnpm start\n\`\`\`" > README.md
            ;;
        "python")
            python -m venv venv
            echo "venv/\n__pycache__/\n*.pyc\n.env\n*.egg-info/\ndist/\nbuild/" > .gitignore
            echo "# $project_name\n\n## Setup\n\n\`\`\`bash\npython -m venv venv\nsource venv/bin/activate\npip install -r requirements.txt\n\`\`\`" > README.md
            touch requirements.txt
            ;;
        "rust")
            cargo init --name "$project_name"
            ;;
        "go")
            go mod init "$project_name"
            echo "# $project_name\n\n## Setup\n\n\`\`\`bash\ngo mod tidy\ngo run main.go\n\`\`\`" > README.md
            echo 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' > main.go
            ;;
        *)
            echo "# $project_name\n\nCreated: $(date)" > README.md
            ;;
    esac
    
    # Initialize git repository
    git init
    git add .
    git commit -m "Initial commit: $project_name project setup"
    
    echo "✅ Created $project_type project: $project_name"
    echo "📁 Location: $(pwd)"
}

# Workspace environment management
workspace-env() {
    local action=$1
    local key=$2
    local value=$3
    
    if [[ "$PWD" != "$HOME/Workspaces"* ]]; then
        echo "⚠️  Not in a workspace."
        return 1
    fi
    
    local workspace_root=$(echo "$PWD" | sed "s|$HOME/Workspaces/||" | cut -d'/' -f1)
    local env_file="$HOME/Workspaces/$workspace_root/.workspace-env"
    
    case $action in
        "set")
            if [[ -z "$key" || -z "$value" ]]; then
                echo "Usage: workspace-env set KEY value"
                return 1
            fi
            echo "export $key=\"$value\"" >> "$env_file"
            echo "✅ Set $key in workspace environment"
            ;;
        "list")
            if [[ -f "$env_file" ]]; then
                echo "🔧 Workspace environment variables:"
                cat "$env_file" | sed 's/^/   /'
            else
                echo "No workspace environment variables set"
            fi
            ;;
        "edit")
            ${EDITOR:-nano} "$env_file"
            ;;
        *)
            echo "Usage: workspace-env {set|list|edit}"
            echo "  set KEY value  - Set environment variable"
            echo "  list          - List all variables"
            echo "  edit          - Edit environment file"
            ;;
    esac
}

# Quick aliases
alias ws='workspace'
alias ws-list='workspace'
alias ws-new='new-workspace-project'
alias ws-env='workspace-env'

# Tmux integration aliases
alias ws-tmux='tmux attach -t $(basename $(dirname $PWD) 2>/dev/null || basename $PWD)'
alias ws-kill='tmux kill-session -t $(basename $(dirname $PWD) 2>/dev/null || basename $PWD)'
