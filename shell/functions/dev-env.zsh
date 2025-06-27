# Development Environment Isolation
# Automatically manage project-specific tool versions and dependencies

# Main development environment setup
dev-env() {
    local action=${1:-"detect"}
    local project_dir=${2:-$PWD}
    
    cd "$project_dir"
    local project_name=$(basename "$PWD")
    
    case $action in
        "detect"|"setup")
            echo "🔍 Analyzing project: $project_name"
            _detect_and_setup_env
            ;;
        "clean")
            _clean_env
            ;;
        "info")
            _show_env_info
            ;;
        *)
            echo "Usage: dev-env {detect|setup|clean|info} [directory]"
            echo "  detect/setup - Auto-detect and setup environment"
            echo "  clean        - Clean environment files"
            echo "  info         - Show current environment info"
            ;;
    esac
}

# Detect project type and setup appropriate environment
_detect_and_setup_env() {
    local changes_made=false
    
    # Node.js projects
    if [[ -f "package.json" ]]; then
        echo "📦 Node.js project detected"
        
        if [[ ! -f ".nvmrc" ]] && command -v node &> /dev/null; then
            local node_version=$(node --version | cut -d'v' -f2)
            echo "$node_version" > .nvmrc
            echo "   ✅ Created .nvmrc with Node $node_version"
            changes_made=true
        fi
        
        if [[ ! -f ".npmrc" ]]; then
            cat > .npmrc << 'EOF'
# Faster installs
prefer-offline=true
audit=false

# Security
fund=false
EOF
            echo "   ✅ Created optimized .npmrc"
            changes_made=true
        fi
    fi
    
    # Python projects
    if [[ -f "requirements.txt" || -f "pyproject.toml" || -f "setup.py" ]]; then
        echo "🐍 Python project detected"
        
        if [[ ! -f ".python-version" ]] && command -v python &> /dev/null; then
            local python_version=$(python --version | cut -d' ' -f2)
            echo "$python_version" > .python-version
            echo "   ✅ Created .python-version with Python $python_version"
            changes_made=true
        fi
        
        if [[ ! -d "venv" && ! -f "poetry.lock" ]]; then
            echo "   🔧 Creating virtual environment..."
            python -m venv venv
            echo "   ✅ Created virtual environment"
            echo "   💡 Activate with: source venv/bin/activate"
            changes_made=true
        fi
    fi
    
    # Rust projects
    if [[ -f "Cargo.toml" ]]; then
        echo "🦀 Rust project detected"
        
        if command -v rustc &> /dev/null; then
            local rust_version=$(rustc --version | cut -d' ' -f2)
            echo "rust-version = \"$rust_version\"" >> Cargo.toml
            echo "   ✅ Added Rust version to Cargo.toml"
            changes_made=true
        fi
    fi
    
    # Go projects
    if [[ -f "go.mod" ]]; then
        echo "🐹 Go project detected"
        
        if command -v go &> /dev/null; then
            local go_version=$(go version | cut -d' ' -f3 | cut -d'o' -f2)
            echo "   ℹ️  Go version: $go_version"
        fi
    fi
    
    # Ruby projects
    if [[ -f "Gemfile" ]]; then
        echo "💎 Ruby project detected"
        
        if [[ ! -f ".ruby-version" ]] && command -v ruby &> /dev/null; then
            local ruby_version=$(ruby --version | cut -d' ' -f2)
            echo "$ruby_version" > .ruby-version
            echo "   ✅ Created .ruby-version with Ruby $ruby_version"
            changes_made=true
        fi
    fi
    
    # Docker projects
    if [[ -f "Dockerfile" || -f "docker-compose.yml" ]]; then
        echo "🐳 Docker project detected"
        
        if [[ ! -f ".dockerignore" ]]; then
            cat > .dockerignore << 'EOF'
.git
.gitignore
README.md
Dockerfile
.dockerignore
node_modules
npm-debug.log
.env
.env.local
EOF
            echo "   ✅ Created .dockerignore"
            changes_made=true
        fi
    fi
    
    # Create universal .envrc for direnv if not exists
    if [[ ! -f ".envrc" ]] && command -v direnv &> /dev/null; then
        cat > .envrc << 'EOF'
# Auto-generated .envrc for development environment
# Edit this file to add project-specific environment variables

# Load .env file if it exists
dotenv_if_exists

# Add project bin to PATH
PATH_add bin
PATH_add scripts

# Load language-specific environments
if [[ -f ".nvmrc" ]]; then
    use node
fi

if [[ -f ".python-version" ]]; then
    use python
fi

if [[ -f ".ruby-version" ]]; then
    use ruby
fi
EOF
        echo "   ✅ Created .envrc for direnv"
        changes_made=true
    fi
    
    # Create development environment documentation
    if [[ ! -f "DEV_SETUP.md" ]]; then
        cat > DEV_SETUP.md << EOF
# Development Environment Setup

## Quick Start

\`\`\`bash
# Setup development environment
dev-env setup

# Activate environment (if applicable)
$(if [[ -d "venv" ]]; then echo "source venv/bin/activate"; fi)
$(if [[ -f ".nvmrc" ]]; then echo "nvm use"; fi)
$(if [[ -f ".ruby-version" ]]; then echo "rbenv local \$(cat .ruby-version)"; fi)
\`\`\`

## Environment Files

$(if [[ -f ".nvmrc" ]]; then echo "- \`.nvmrc\`: Node.js version $(cat .nvmrc)"; fi)
$(if [[ -f ".python-version" ]]; then echo "- \`.python-version\`: Python version $(cat .python-version)"; fi)
$(if [[ -f ".ruby-version" ]]; then echo "- \`.ruby-version\`: Ruby version $(cat .ruby-version)"; fi)
$(if [[ -f ".envrc" ]]; then echo "- \`.envrc\`: direnv configuration"; fi)

## Tools Required

$(if [[ -f "package.json" ]]; then echo "- Node.js (version specified in .nvmrc)"; fi)
$(if [[ -f "requirements.txt" ]]; then echo "- Python (version specified in .python-version)"; fi)
$(if [[ -f "Cargo.toml" ]]; then echo "- Rust (latest stable)"; fi)
$(if [[ -f "go.mod" ]]; then echo "- Go (latest stable)"; fi)

Generated: $(date)
EOF
        echo "   ✅ Created DEV_SETUP.md documentation"
        changes_made=true
    fi
    
    if [[ "$changes_made" == "true" ]]; then
        echo ""
        echo "🎉 Development environment configured!"
        echo "💡 Run 'dev-env info' to see current setup"
    else
        echo "✅ Development environment already configured"
    fi
}

# Clean environment files
_clean_env() {
    local files_to_clean=(".nvmrc" ".python-version" ".ruby-version" ".envrc" "DEV_SETUP.md" ".npmrc" ".dockerignore")
    local cleaned=false
    
    echo "🧹 Cleaning development environment files..."
    
    for file in "${files_to_clean[@]}"; do
        if [[ -f "$file" ]]; then
            rm "$file"
            echo "   🗑️  Removed $file"
            cleaned=true
        fi
    done
    
    if [[ "$cleaned" == "true" ]]; then
        echo "✅ Environment cleaned"
    else
        echo "ℹ️  No environment files to clean"
    fi
}

# Show current environment information
_show_env_info() {
    local project_name=$(basename "$PWD")
    echo "📊 Development Environment Info: $project_name"
    echo "================================"
    
    # Project type detection
    echo "📁 Project Type:"
    if [[ -f "package.json" ]]; then echo "   📦 Node.js"; fi
    if [[ -f "requirements.txt" || -f "pyproject.toml" ]]; then echo "   🐍 Python"; fi
    if [[ -f "Cargo.toml" ]]; then echo "   🦀 Rust"; fi
    if [[ -f "go.mod" ]]; then echo "   🐹 Go"; fi
    if [[ -f "Gemfile" ]]; then echo "   💎 Ruby"; fi
    if [[ -f "Dockerfile" ]]; then echo "   🐳 Docker"; fi
    
    echo ""
    echo "🔧 Environment Files:"
    local env_files=(".nvmrc" ".python-version" ".ruby-version" ".envrc" ".npmrc" ".dockerignore")
    for file in "${env_files[@]}"; do
        if [[ -f "$file" ]]; then
            echo "   ✅ $file"
            if [[ "$file" == ".nvmrc" ]]; then
                echo "      Node.js: $(cat .nvmrc)"
            elif [[ "$file" == ".python-version" ]]; then
                echo "      Python: $(cat .python-version)"
            elif [[ "$file" == ".ruby-version" ]]; then
                echo "      Ruby: $(cat .ruby-version)"
            fi
        else
            echo "   ❌ $file"
        fi
    done
    
    echo ""
    echo "🛠️  Available Tools:"
    local tools=("node" "python" "rust" "go" "ruby" "docker")
    for tool in "${tools[@]}"; do
        if command -v "$tool" &> /dev/null; then
            local version=""
            case $tool in
                "node") version=$(node --version) ;;
                "python") version=$(python --version | cut -d' ' -f2) ;;
                "rust") version=$(rustc --version | cut -d' ' -f2) ;;
                "go") version=$(go version | cut -d' ' -f3) ;;
                "ruby") version=$(ruby --version | cut -d' ' -f2) ;;
                "docker") version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1) ;;
            esac
            echo "   ✅ $tool ($version)"
        else
            echo "   ❌ $tool (not installed)"
        fi
    done
}

# Auto-detect environment when entering directories
auto-dev-env() {
    # Only run in interactive shells and if we're in a project directory
    if [[ -o interactive ]] && [[ -f "package.json" || -f "requirements.txt" || -f "Cargo.toml" || -f "go.mod" || -f "Gemfile" ]]; then
        # Check if we've already set up this project
        if [[ ! -f ".dev-env-setup" ]]; then
            echo "🔍 New development project detected!"
            echo "💡 Run 'dev-env setup' to configure environment"
        fi
    fi
}

# Hook into directory changes
if [[ -z "$DEV_ENV_AUTO_DETECT_DISABLED" ]]; then
    chpwd_functions+=(auto-dev-env)
fi

# Aliases
alias dev='dev-env'
alias dev-setup='dev-env setup'
alias dev-info='dev-env info'
alias dev-clean='dev-env clean'
