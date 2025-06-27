# Unified Package Management
# Simplify installation and management of development tools across different package managers

# Main package management function
pkg-manager() {
    local action=$1
    local category=$2
    local package=$3
    
    case $action in
        "install")
            _install_package_category "$category"
            ;;
        "update")
            _update_all_managers
            ;;
        "clean")
            _clean_all_managers
            ;;
        "list")
            _list_categories
            ;;
        "search")
            _search_package "$category"
            ;;
        "info")
            _show_manager_info
            ;;
        *)
            echo "Usage: pkg-manager {install|update|clean|list|search|info}"
            echo ""
            echo "Actions:"
            echo "  install <category>  - Install package category"
            echo "  update             - Update all package managers"
            echo "  clean              - Clean all package managers"
            echo "  list               - List available categories"
            echo "  search <term>      - Search for packages"
            echo "  info               - Show package manager status"
            ;;
    esac
}

# Install package categories
_install_package_category() {
    local category=$1
    
    case $category in
        "essential")
            echo "📦 Installing Essential Development Tools..."
            _install_essential_tools
            ;;
        "node-tools")
            echo "📦 Installing Node.js Development Tools..."
            _install_node_tools
            ;;
        "python-tools")
            echo "🐍 Installing Python Development Tools..."
            _install_python_tools
            ;;
        "rust-tools")
            echo "🦀 Installing Rust Development Tools..."
            _install_rust_tools
            ;;
        "go-tools")
            echo "🐹 Installing Go Development Tools..."
            _install_go_tools
            ;;
        "data-science")
            echo "📊 Installing Data Science Tools..."
            _install_data_science_tools
            ;;
        "devops")
            echo "🚀 Installing DevOps Tools..."
            _install_devops_tools
            ;;
        "security")
            echo "🔒 Installing Security Tools..."
            _install_security_tools
            ;;
        *)
            echo "❌ Unknown category: $category"
            echo "Run 'pkg-manager list' to see available categories"
            return 1
            ;;
    esac
}

# Essential development tools
_install_essential_tools() {
    local tools=(
        "git"
        "curl"
        "wget"
        "jq"
        "tree"
        "htop"
        "fzf"
        "ripgrep"
        "bat"
        "exa"
        "fd"
        "tldr"
    )
    
    echo "Installing via Homebrew..."
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            echo "  📥 Installing $tool..."
            brew install "$tool"
        else
            echo "  ✅ $tool already installed"
        fi
    done
}

# Node.js development tools
_install_node_tools() {
    # Install Node.js via Homebrew if not present
    if ! command -v node &> /dev/null; then
        echo "  📥 Installing Node.js..."
        brew install node
    fi
    
    # Install global npm packages
    local npm_tools=(
        "typescript"
        "eslint"
        "prettier"
        "@vue/cli"
        "create-react-app"
        "nodemon"
        "pm2"
        "http-server"
        "json-server"
        "npm-check-updates"
    )
    
    echo "Installing global npm packages..."
    for tool in "${npm_tools[@]}"; do
        echo "  📥 Installing $tool..."
        npm install -g "$tool"
    done
}

# Python development tools
_install_python_tools() {
    # Ensure pip is available
    if ! command -v pip &> /dev/null; then
        echo "  📥 Installing pip..."
        python -m ensurepip --upgrade
    fi
    
    local python_tools=(
        "black"
        "flake8"
        "pytest"
        "jupyter"
        "ipython"
        "requests"
        "virtualenv"
        "pipenv"
        "poetry"
        "pre-commit"
    )
    
    echo "Installing Python packages..."
    for tool in "${python_tools[@]}"; do
        echo "  📥 Installing $tool..."
        pip install "$tool"
    done
}

# Rust development tools
_install_rust_tools() {
    # Install Rust if not present
    if ! command -v rustc &> /dev/null; then
        echo "  📥 Installing Rust..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source ~/.cargo/env
    fi
    
    local rust_tools=(
        "cargo-edit"
        "cargo-watch"
        "cargo-audit"
        "cargo-outdated"
        "cargo-tree"
        "ripgrep"
        "bat"
        "exa"
        "fd-find"
    )
    
    echo "Installing Rust tools..."
    for tool in "${rust_tools[@]}"; do
        echo "  📥 Installing $tool..."
        cargo install "$tool"
    done
}

# Go development tools
_install_go_tools() {
    # Install Go if not present
    if ! command -v go &> /dev/null; then
        echo "  📥 Installing Go..."
        brew install go
    fi
    
    local go_tools=(
        "github.com/golangci/golangci-lint/cmd/golangci-lint@latest"
        "golang.org/x/tools/cmd/goimports@latest"
        "github.com/air-verse/air@latest"
        "github.com/cosmtrek/air@latest"
    )
    
    echo "Installing Go tools..."
    for tool in "${go_tools[@]}"; do
        echo "  📥 Installing $tool..."
        go install "$tool"
    done
}

# Data science tools
_install_data_science_tools() {
    local brew_tools=(
        "r"
        "python"
        "jupyter"
    )
    
    local python_tools=(
        "pandas"
        "numpy"
        "matplotlib"
        "seaborn"
        "scikit-learn"
        "jupyter"
        "notebook"
        "jupyterlab"
    )
    
    echo "Installing data science tools via Homebrew..."
    for tool in "${brew_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            echo "  📥 Installing $tool..."
            brew install "$tool"
        fi
    done
    
    echo "Installing Python data science packages..."
    for tool in "${python_tools[@]}"; do
        echo "  📥 Installing $tool..."
        pip install "$tool"
    done
}

# DevOps tools
_install_devops_tools() {
    local devops_tools=(
        "docker"
        "docker-compose"
        "kubectl"
        "helm"
        "terraform"
        "ansible"
        "awscli"
        "azure-cli"
        "gcloud"
    )
    
    echo "Installing DevOps tools..."
    for tool in "${devops_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            echo "  📥 Installing $tool..."
            case $tool in
                "docker"|"docker-compose")
                    brew install --cask docker
                    ;;
                "gcloud")
                    brew install --cask google-cloud-sdk
                    ;;
                *)
                    brew install "$tool"
                    ;;
            esac
        else
            echo "  ✅ $tool already installed"
        fi
    done
}

# Security tools
_install_security_tools() {
    local security_tools=(
        "gnupg"
        "openssh"
        "nmap"
        "wireshark"
        "hashcat"
        "john-jumbo"
    )
    
    echo "Installing security tools..."
    for tool in "${security_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            echo "  📥 Installing $tool..."
            if [[ "$tool" == "wireshark" ]]; then
                brew install --cask wireshark
            else
                brew install "$tool"
            fi
        else
            echo "  ✅ $tool already installed"
        fi
    done
}

# Update all package managers
_update_all_managers() {
    echo "🔄 Updating All Package Managers..."
    
    # Homebrew
    if command -v brew &> /dev/null; then
        echo "🍺 Updating Homebrew..."
        brew update && brew upgrade
    fi
    
    # npm
    if command -v npm &> /dev/null; then
        echo "📦 Updating npm packages..."
        npm update -g
    fi
    
    # pip
    if command -v pip &> /dev/null; then
        echo "🐍 Updating pip packages..."
        pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip install -U
    fi
    
    # Rust
    if command -v rustup &> /dev/null; then
        echo "🦀 Updating Rust..."
        rustup update
    fi
    
    # Go modules (if in a Go project)
    if [[ -f "go.mod" ]]; then
        echo "🐹 Updating Go modules..."
        go get -u ./...
    fi
    
    echo "✅ All package managers updated!"
}

# Clean all package managers
_clean_all_managers() {
    echo "🧹 Cleaning All Package Managers..."
    
    # Homebrew
    if command -v brew &> /dev/null; then
        echo "🍺 Cleaning Homebrew..."
        brew cleanup --prune=30
        brew autoremove
    fi
    
    # npm
    if command -v npm &> /dev/null; then
        echo "📦 Cleaning npm cache..."
        npm cache clean --force
    fi
    
    # pip
    if command -v pip &> /dev/null; then
        echo "🐍 Cleaning pip cache..."
        pip cache purge
    fi
    
    # Cargo
    if command -v cargo &> /dev/null; then
        echo "🦀 Cleaning Cargo cache..."
        cargo clean
    fi
    
    echo "✅ All package managers cleaned!"
}

# List available categories
_list_categories() {
    echo "📦 Available Package Categories:"
    echo "================================"
    echo ""
    echo "🔧 essential     - Essential development tools (git, curl, jq, etc.)"
    echo "📦 node-tools    - Node.js development tools (TypeScript, ESLint, etc.)"
    echo "🐍 python-tools  - Python development tools (Black, Pytest, etc.)"
    echo "🦀 rust-tools    - Rust development tools (Cargo extensions, etc.)"
    echo "🐹 go-tools      - Go development tools (Linters, etc.)"
    echo "📊 data-science  - Data science tools (R, Jupyter, Pandas, etc.)"
    echo "🚀 devops        - DevOps tools (Docker, Kubernetes, Terraform, etc.)"
    echo "🔒 security      - Security tools (GPG, Nmap, etc.)"
    echo ""
    echo "Usage: pkg-manager install <category>"
}

# Search for packages
_search_package() {
    local term=$1
    
    if [[ -z "$term" ]]; then
        echo "Usage: pkg-manager search <term>"
        return 1
    fi
    
    echo "🔍 Searching for: $term"
    echo "======================"
    
    # Search Homebrew
    if command -v brew &> /dev/null; then
        echo "🍺 Homebrew results:"
        brew search "$term" | head -5 | sed 's/^/   /'
    fi
    
    # Search npm
    if command -v npm &> /dev/null; then
        echo "📦 npm results:"
        npm search "$term" --parseable | head -5 | cut -d$'\t' -f1 | sed 's/^/   /'
    fi
    
    # Search pip
    if command -v pip &> /dev/null; then
        echo "🐍 pip results:"
        pip search "$term" 2>/dev/null | head -5 | sed 's/^/   /' || echo "   pip search temporarily disabled"
    fi
}

# Show package manager information
_show_manager_info() {
    echo "📊 Package Manager Status"
    echo "========================="
    
    # Homebrew
    if command -v brew &> /dev/null; then
        local brew_packages=$(brew list | wc -l | tr -d ' ')
        local brew_casks=$(brew list --cask | wc -l | tr -d ' ')
        echo "🍺 Homebrew: $brew_packages packages, $brew_casks casks"
    else
        echo "🍺 Homebrew: Not installed"
    fi
    
    # npm
    if command -v npm &> /dev/null; then
        local npm_global=$(npm list -g --depth=0 2>/dev/null | grep -c "├──\|└──" || echo "0")
        echo "📦 npm: $npm_global global packages"
    else
        echo "📦 npm: Not installed"
    fi
    
    # pip
    if command -v pip &> /dev/null; then
        local pip_packages=$(pip list | wc -l | tr -d ' ')
        echo "🐍 pip: $pip_packages packages"
    else
        echo "🐍 pip: Not installed"
    fi
    
    # Cargo
    if command -v cargo &> /dev/null; then
        local cargo_packages=$(cargo install --list 2>/dev/null | grep -c "^[a-zA-Z]" || echo "0")
        echo "🦀 Cargo: $cargo_packages packages"
    else
        echo "🦀 Cargo: Not installed"
    fi
    
    # Go
    if command -v go &> /dev/null; then
        echo "🐹 Go: $(go version | cut -d' ' -f3)"
    else
        echo "🐹 Go: Not installed"
    fi
}

# Aliases
alias pkg='pkg-manager'
alias pkg-install='pkg-manager install'
alias pkg-update='pkg-manager update'
alias pkg-clean='pkg-manager clean'
alias pkg-list='pkg-manager list'
alias pkg-search='pkg-manager search'
alias pkg-info='pkg-manager info'
