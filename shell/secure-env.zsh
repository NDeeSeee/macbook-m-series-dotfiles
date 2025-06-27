# Secure environment variable management
# Keeps sensitive data out of shell history and dotfiles

# Create secure environment file if it doesn't exist
SECURE_ENV_FILE="$HOME/.config/secure-env"

if [[ ! -f "$SECURE_ENV_FILE" ]]; then
    mkdir -p "$(dirname "$SECURE_ENV_FILE")"
    cat > "$SECURE_ENV_FILE" << 'EOF'
# Secure Environment Variables
# This file is not tracked in git and has restricted permissions
# Add your sensitive environment variables here

# Example:
# export OPENAI_API_KEY="your-key-here"
# export AWS_ACCESS_KEY_ID="your-key-here"
# export GITHUB_TOKEN="your-token-here"

EOF
    chmod 600 "$SECURE_ENV_FILE"
    echo "📁 Created secure environment file: $SECURE_ENV_FILE"
    echo "💡 Add your sensitive environment variables there"
fi

# Source secure environment if it exists and is readable
if [[ -r "$SECURE_ENV_FILE" ]]; then
    source "$SECURE_ENV_FILE"
fi

# Function to safely add environment variables
add-secure-env() {
    if [[ $# -ne 2 ]]; then
        echo "Usage: add-secure-env VARIABLE_NAME value"
        echo "Example: add-secure-env GITHUB_TOKEN ghp_xxxxxxxxxxxx"
        return 1
    fi
    
    local var_name="$1"
    local var_value="$2"
    
    # Check if variable already exists
    if grep -q "^export $var_name=" "$SECURE_ENV_FILE"; then
        echo "⚠️  Variable $var_name already exists in secure environment"
        echo "Edit $SECURE_ENV_FILE manually to update it"
        return 1
    fi
    
    # Add the variable
    echo "export $var_name=\"$var_value\"" >> "$SECURE_ENV_FILE"
    echo "✅ Added $var_name to secure environment"
    echo "🔄 Restart terminal or run 'source ~/.zshrc' to load"
}

# Function to list secure environment variables (without values)
list-secure-env() {
    if [[ -f "$SECURE_ENV_FILE" ]]; then
        echo "🔒 Secure environment variables:"
        grep "^export " "$SECURE_ENV_FILE" | sed 's/=.*//' | sed 's/export /  - /'
    else
        echo "No secure environment file found"
    fi
}
