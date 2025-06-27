# System Resource Monitoring for Developers
# Real-time monitoring and alerts for system performance

# Main system monitoring function
sys-monitor() {
    local action=${1:-"status"}
    
    case $action in
        "status"|"info")
            _show_system_status
            ;;
        "watch")
            _watch_system
            ;;
        "processes"|"proc")
            _show_top_processes
            ;;
        "network"|"net")
            _show_network_info
            ;;
        "disk")
            _show_disk_usage
            ;;
        "alerts")
            _check_system_alerts
            ;;
        *)
            echo "Usage: sys-monitor {status|watch|processes|network|disk|alerts}"
            echo "  status     - Show current system status"
            echo "  watch      - Continuously monitor system"
            echo "  processes  - Show top CPU/memory processes"
            echo "  network    - Show network information"
            echo "  disk       - Show disk usage"
            echo "  alerts     - Check for system alerts"
            ;;
    esac
}

# Show comprehensive system status
_show_system_status() {
    echo "🖥️  System Status - $(date)"
    echo "================================"
    
    # CPU Usage
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d% -f1)
    echo "⚡ CPU Usage: ${cpu_usage}%"
    
    # Memory Usage
    local memory_info=$(vm_stat | grep -E "(free|active|inactive|wired)")
    local page_size=$(vm_stat | grep "page size" | awk '{print $8}')
    local free_pages=$(echo "$memory_info" | grep "free" | awk '{print $3}' | cut -d. -f1)
    local active_pages=$(echo "$memory_info" | grep "Pages active" | awk '{print $3}' | cut -d. -f1)
    local inactive_pages=$(echo "$memory_info" | grep "Pages inactive" | awk '{print $3}' | cut -d. -f1)
    local wired_pages=$(echo "$memory_info" | grep "Pages wired down" | awk '{print $4}' | cut -d. -f1)
    
    local total_pages=$((free_pages + active_pages + inactive_pages + wired_pages))
    local used_pages=$((active_pages + inactive_pages + wired_pages))
    local memory_usage=$((used_pages * 100 / total_pages))
    
    echo "🧠 Memory Usage: ${memory_usage}%"
    
    # Disk Usage
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}' | cut -d% -f1)
    echo "💾 Disk Usage: ${disk_usage}%"
    
    # Load Average
    local load_avg=$(uptime | awk -F'load averages:' '{print $2}' | awk '{print $1}')
    echo "📊 Load Average: $load_avg"
    
    # Battery (if laptop)
    if system_profiler SPPowerDataType 2>/dev/null | grep -q "Battery"; then
        local battery_info=$(pmset -g batt | grep -o '[0-9]*%' | head -1)
        local power_source=$(pmset -g batt | grep -o 'AC Power\|Battery Power' | head -1)
        echo "🔋 Battery: $battery_info ($power_source)"
    fi
    
    # Temperature (if available)
    if command -v osx-cpu-temp &> /dev/null; then
        local temp=$(osx-cpu-temp)
        echo "🌡️  CPU Temperature: $temp"
    fi
    
    # Network connectivity
    if ping -c 1 8.8.8.8 &>/dev/null; then
        echo "🌐 Network: ✅ Connected"
    else
        echo "🌐 Network: ❌ Disconnected"
    fi
    
    # Check for alerts
    echo ""
    _check_system_alerts
}

# Watch system continuously
_watch_system() {
    echo "👀 Watching system (Press Ctrl+C to stop)..."
    echo ""
    
    while true; do
        clear
        _show_system_status
        sleep 2
    done
}

# Show top processes by CPU and memory
_show_top_processes() {
    echo "🔥 Top Processes"
    echo "================"
    
    echo "📈 Top CPU Consumers:"
    ps aux | sort -nr -k 3 | head -8 | awk 'NR==1{print "   PID    CPU%  COMMAND"} NR>1{printf "   %-6s %-5s %s\n", $2, $3"%", $11}'
    
    echo ""
    echo "🧠 Top Memory Consumers:"
    ps aux | sort -nr -k 4 | head -8 | awk 'NR==1{print "   PID    MEM%  COMMAND"} NR>1{printf "   %-6s %-5s %s\n", $2, $4"%", $11}'
    
    # Show development-related processes
    echo ""
    echo "💻 Development Processes:"
    ps aux | grep -E "(node|python|code|cursor|docker|postgres|redis)" | grep -v grep | head -5 | awk '{printf "   %-6s %-5s %s\n", $2, $3"%", $11}'
}

# Show network information
_show_network_info() {
    echo "🌐 Network Information"
    echo "====================="
    
    # External IP
    local external_ip=$(curl -s --max-time 3 ifconfig.me 2>/dev/null || echo "Unable to fetch")
    echo "🌍 External IP: $external_ip"
    
    # Local IP
    local local_ip=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Not connected")
    echo "🏠 Local IP: $local_ip"
    
    # DNS servers
    local dns_servers=$(scutil --dns | grep 'nameserver\[0\]' | awk '{print $3}' | head -3 | tr '\n' ' ')
    echo "🔍 DNS Servers: $dns_servers"
    
    # Network interfaces
    echo ""
    echo "📡 Network Interfaces:"
    ifconfig | grep -E "^[a-z]|inet " | grep -A1 "flags=" | grep -E "^[a-z]|inet " | awk '/^[a-z]/{iface=$1} /inet /{print "   " iface " " $2}'
    
    # Active connections
    echo ""
    echo "🔗 Active Connections:"
    lsof -i -P -n | grep LISTEN | head -5 | awk '{print "   " $1 " (PID " $2 ") listening on " $9}'
}

# Show disk usage details
_show_disk_usage() {
    echo "💾 Disk Usage"
    echo "============="
    
    # Overall disk usage
    echo "📊 Filesystem Usage:"
    df -h | grep -E "^/dev/" | awk '{printf "   %-20s %5s used of %5s (%s full)\n", $1, $3, $2, $5}'
    
    echo ""
    echo "📁 Large Directories in Home:"
    du -sh ~/Downloads ~/Documents ~/Desktop ~/Library 2>/dev/null | sort -hr | head -5 | awk '{printf "   %-10s %s\n", $1, $2}'
    
    # Development-related disk usage
    echo ""
    echo "💻 Development Disk Usage:"
    local dev_dirs=("node_modules" ".npm" ".cargo" ".rustup" "venv" "__pycache__")
    for dir in "${dev_dirs[@]}"; do
        local size=$(find ~ -name "$dir" -type d -exec du -sh {} + 2>/dev/null | awk '{sum+=$1} END {print sum "M"}' 2>/dev/null || echo "0M")
        if [[ "$size" != "0M" ]]; then
            echo "   $dir: $size"
        fi
    done
}

# Check for system alerts and warnings
_check_system_alerts() {
    echo "⚠️  System Alerts:"
    local alerts=0
    
    # High CPU usage
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d% -f1)
    if (( $(echo "$cpu_usage > 80" | bc -l 2>/dev/null || echo "0") )); then
        echo "   🔥 High CPU usage: ${cpu_usage}%"
        ((alerts++))
    fi
    
    # High memory usage
    local memory_info=$(vm_stat | grep -E "(free|active|inactive|wired)")
    local free_pages=$(echo "$memory_info" | grep "free" | awk '{print $3}' | cut -d. -f1)
    local active_pages=$(echo "$memory_info" | grep "Pages active" | awk '{print $3}' | cut -d. -f1)
    local inactive_pages=$(echo "$memory_info" | grep "Pages inactive" | awk '{print $3}' | cut -d. -f1)
    local wired_pages=$(echo "$memory_info" | grep "Pages wired down" | awk '{print $4}' | cut -d. -f1)
    local total_pages=$((free_pages + active_pages + inactive_pages + wired_pages))
    local used_pages=$((active_pages + inactive_pages + wired_pages))
    local memory_usage=$((used_pages * 100 / total_pages))
    
    if (( memory_usage > 85 )); then
        echo "   🧠 High memory usage: ${memory_usage}%"
        ((alerts++))
    fi
    
    # High disk usage
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}' | cut -d% -f1)
    if (( disk_usage > 85 )); then
        echo "   💾 High disk usage: ${disk_usage}%"
        ((alerts++))
    fi
    
    # Low battery
    if system_profiler SPPowerDataType 2>/dev/null | grep -q "Battery"; then
        local battery_level=$(pmset -g batt | grep -o '[0-9]*%' | head -1 | cut -d% -f1)
        local power_source=$(pmset -g batt | grep -o 'AC Power\|Battery Power' | head -1)
        if [[ "$power_source" == "Battery Power" ]] && (( battery_level < 20 )); then
            echo "   🔋 Low battery: ${battery_level}%"
            ((alerts++))
        fi
    fi
    
    # Check for runaway processes
    local high_cpu_procs=$(ps aux | awk '$3 > 50 {print $11}' | head -3)
    if [[ -n "$high_cpu_procs" ]]; then
        echo "   ⚡ High CPU processes detected"
        ((alerts++))
    fi
    
    if (( alerts == 0 )); then
        echo "   ✅ No alerts - system running normally"
    fi
}

# Quick system check for shell prompt integration
quick-sys-check() {
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d% -f1)
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}' | cut -d% -f1)
    
    local status="✅"
    if (( $(echo "$cpu_usage > 80" | bc -l 2>/dev/null || echo "0") )) || (( disk_usage > 85 )); then
        status="⚠️"
    fi
    
    echo "$status"
}

# Aliases for convenience
alias sysmon='sys-monitor'
alias sys='sys-monitor status'
alias top-proc='sys-monitor processes'
alias netinfo='sys-monitor network'
alias diskinfo='sys-monitor disk'
alias sys-watch='sys-monitor watch'
alias sys-alerts='sys-monitor alerts'

# Auto-check system health on shell startup (only once per session)
if [[ -z "$SYS_MONITOR_CHECKED" ]] && [[ -o interactive ]]; then
    export SYS_MONITOR_CHECKED=1
    
    # Quick silent check for major issues
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d% -f1 2>/dev/null || echo "0")
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}' | cut -d% -f1 2>/dev/null || echo "0")
    
    if (( $(echo "$cpu_usage > 90" | bc -l 2>/dev/null || echo "0") )); then
        echo "⚠️  Warning: High CPU usage detected (${cpu_usage}%)"
    fi
    
    if (( disk_usage > 90 )); then
        echo "⚠️  Warning: Low disk space (${disk_usage}% full)"
    fi
fi
