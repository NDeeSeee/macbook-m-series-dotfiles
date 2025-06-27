# Amazon Q pre block. Keep at the top of this file.
[[ -f "${HOME}/Library/Application Support/amazon-q/shell/zshrc.pre.zsh" ]] && builtin source "${HOME}/Library/Application Support/amazon-q/shell/zshrc.pre.zsh"
# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH
export PATH=$PATH:/Users/pavb5f/Library/Python/3.9/bin
# Path to your Oh My Zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time Oh My Zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="powerlevel10k/powerlevel10k"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment one of the following lines to change the auto-update behavior
# zstyle ':omz:update' mode disabled  # disable automatic updates
# zstyle ':omz:update' mode auto      # update automatically without asking
# zstyle ':omz:update' mode reminder  # just remind me to update when it's time

# Uncomment the following line to change how often to auto-update (in days).
# zstyle ':omz:update' frequency 13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# You can also set it to another string to have that shown instead of the default red dots.
# e.g. COMPLETION_WAITING_DOTS="%F{yellow}waiting...%f"
# Caution: this setting can cause issues with multiline prompts in zsh < 5.7.1 (see #5765)
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(zsh-copilot rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
function preexec() {
  # Only show alias suggestions after initialization is complete
  (( HISTCMD > 5 )) && [[ -o interactive ]] && {
    local cmd="${(@)argv}[1]"
    local count=$(history | grep -c "  $cmd")
    if (( count >= 5 )); then
      # Only show suggestion if we're not in the middle of initialization
      [[ $ZSH_EVAL_CONTEXT != *loadautofunc* ]] && echo "🔖 Consider aliasing '$cmd' (used $count times)"
    fi
  }
}

# 1) set shell options early
export ZPLUG_HOME=/opt/homebrew/opt/zplug
source $ZPLUG_HOME/init.zsh
setopt NOTIFY        # notify immediately when jobs finish
setopt CORRECT_ALL   # catch & offer to fix typos
zplug "changyuheng/fz", defer:1
zplug "rupa/z", use:z.sh

# 2) declare plugins:
plugins=(zsh-copilot 
  git 
  history-substring-search
  zsh-syntax-highlighting
  copybuffer
  fzf 
  thefuck 
  docker
)

# 3) initialize shims/hooks before you source OH-MY-ZSH
autoload -Uz add-zsh-hook
add-zsh-hook preexec preexec  # your alias-hint hook, etc.

# 4) any third-party inits:
eval "$(zoxide init zsh)"
eval "$(thefuck --alias)"
eval "$(atuin init zsh)"         # if you install atuin
eval "$(starship init zsh)"      # if you install starship

# 5) then load Oh My Zsh (this processes `plugins=(zsh-copilot …)`):
source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='nvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch $(uname -m)"

# Set personal aliases, overriding those provided by Oh My Zsh libs,
# plugins, and themes. Aliases can be placed here, though Oh My Zsh
# users are encouraged to define aliases within a top-level file in
# the $ZSH_CUSTOM folder, with .zsh extension. Examples:
# - $ZSH_CUSTOM/aliases.zsh
# - $ZSH_CUSTOM/macos.zsh
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
alias source-zshrc="source ~/.zshrc"
alias radian="radian"  # explicit radian command
alias ll="ls -laht"
export PATH="/opt/homebrew/opt/ssh-copy-id/bin:$PATH"

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/opt/homebrew/Caskroom/mambaforge/base/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/opt/homebrew/Caskroom/mambaforge/base/etc/profile.d/conda.sh" ]; then
        . "/opt/homebrew/Caskroom/mambaforge/base/etc/profile.d/conda.sh"
    else
        export PATH="/opt/homebrew/Caskroom/mambaforge/base/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

# The following lines have been added by Docker Desktop to enable Docker CLI completions.
fpath=(/Users/pavb5f/.docker/completions $fpath)
# End of Docker CLI completions
export DOTNET_ROOT="/opt/homebrew/opt/dotnet/libexec"
export LDFLAGS="-L/opt/homebrew/opt/libxml2/lib"
export CPPFLAGS="-I/opt/homebrew/opt/libxml2/include"

if type brew &>/dev/null; then
    FPATH=$(brew --prefix)/share/zsh-completions:$FPATH
fi

# Initialize completion system once at the end
autoload -Uz compinit
compinit

source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

export PATH="/Library/Frameworks/R.framework/Resources/bin:$PATH"
export R_LIBS_USER=~/R/arm64-apple-darwin20/4.5

alias claude="/Users/pavb5f/.claude/local/claude"

# Amazon Q completion optimizations
if [[ -n "${Q_TERM:-}" ]]; then
    # Enable better completion display for Amazon Q
    zstyle ':completion:*' menu select=2
    zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
    zstyle ':completion:*' verbose true
    zstyle ':completion:*:descriptions' format '%B%d%b'
    zstyle ':completion:*:messages' format '%d'
    zstyle ':completion:*:warnings' format 'No matches for: %d'
    zstyle ':completion:*' group-name ''
    
    # Enable completion caching
    zstyle ':completion:*' use-cache on
    zstyle ':completion:*' cache-path ~/.zsh/cache
    
    # Better file completion with Amazon Q integration
    zstyle ':completion:*:*:*:*:*' menu select
    zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}' 'r:|[._-]=* r:|=*' 'l:|=* r:|=*'
    
    # Force Amazon Q rich completions for specific commands
    zstyle ':completion:*:git:*' tag-order 'heads:-branch:branch\ names'
    zstyle ':completion:*:*:git:*' user-commands true
    
    # Amazon Q autosuggest styling
    export Q_AUTOSUGGEST_HIGHLIGHT_STYLE="fg=#666666,bg=none,bold,underline"
    export Q_AUTOSUGGEST_STRATEGY="inline_shell_completion history completion"
    
    # Enable Amazon Q rich completions
    export Q_COMPLETION_ENHANCED=1
    export Q_COMPLETION_UI_ENABLED=1
    export Q_RICH_COMPLETIONS=1
fi

# Load project context switching
[[ -r ~/Documents/git/macbook-m-series-dotfiles/shell/functions/project-context.zsh ]] && \
    source ~/Documents/git/macbook-m-series-dotfiles/shell/functions/project-context.zsh

# Load secure environment variables
[[ -r ~/Documents/git/macbook-m-series-dotfiles/shell/secure-env.zsh ]] && \
    source ~/Documents/git/macbook-m-series-dotfiles/shell/secure-env.zsh

# Load workspace management
[[ -r ~/Documents/git/macbook-m-series-dotfiles/shell/functions/workspace.zsh ]] && \
    source ~/Documents/git/macbook-m-series-dotfiles/shell/functions/workspace.zsh

# Load development environment isolation
[[ -r ~/Documents/git/macbook-m-series-dotfiles/shell/functions/dev-env.zsh ]] && \
    source ~/Documents/git/macbook-m-series-dotfiles/shell/functions/dev-env.zsh

# Load system monitoring
[[ -r ~/Documents/git/macbook-m-series-dotfiles/shell/functions/system-monitor.zsh ]] && \
    source ~/Documents/git/macbook-m-series-dotfiles/shell/functions/system-monitor.zsh

# Load package manager
[[ -r ~/Documents/git/macbook-m-series-dotfiles/shell/functions/package-manager.zsh ]] && \
    source ~/Documents/git/macbook-m-series-dotfiles/shell/functions/package-manager.zsh

# Amazon Q post block. Keep at the bottom of this file.
[[ -f "${HOME}/Library/Application Support/amazon-q/shell/zshrc.post.zsh" ]] && builtin source "${HOME}/Library/Application Support/amazon-q/shell/zshrc.post.zsh"
