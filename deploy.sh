#!/bin/bash

# deploy.sh - Production deployment script
set -e

echo "🚀 Starting CBS Approve Web deployment..."

# Configuration
IMAGE_NAME="cbs-approve-web"
CONTAINER_NAME="cbs-approve-web"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    log_info "Docker is running ✓"
}

# Check if required files exist
check_files() {
    local required_files=("Dockerfile" "$COMPOSE_FILE" "package.json")
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "Required file '$file' not found!"
            exit 1
        fi
    done
    log_info "Required files exist ✓"
}

# Create environment file if it doesn't exist
create_env_file() {
    if [[ ! -f "$ENV_FILE" ]]; then
        log_warning "Environment file not found. Creating default .env file..."
        cat > "$ENV_FILE" << EOF
# CBS Approve Web Environment Configuration
NODE_ENV=production
NUXT_TELEMETRY_DISABLED=1

# API Configuration
NUXT_PUBLIC_AUTH_URL=http://10.151.146.155:33236/
NUXT_PUBLIC_API_URL=http://10.151.146.155:33236/

# Keycloak Endpoints
NUXT_PUBLIC_LOGIN=/realms/apb_teller/protocol/openid-connect/token
NUXT_PUBLIC_LOGOUT=/realms/apb_teller/protocol/openid-connect/logout
NUXT_PUBLIC_REFRESH_TOKEN=/realms/apb_teller/protocol/openid-connect/token
NUXT_PUBLIC_CHECK_TOKEN=/realms/apb_teller/protocol/openid-connect/userinfo

# Admin Endpoints
NUXT_PUBLIC_ROLE_LIST=/admin/realms/apb_teller/roles
NUXT_PUBLIC_GET_USERS=/admin/realms/apb_teller/users
NUXT_PUBLIC_DELETE_USER=/admin/realms/apb_teller/users
NUXT_PUBLIC_EDIT_USER=/admin/realms/apb_teller/users

# App Configuration
NUXT_PUBLIC_WEB_TITLE=CBS Approve Web
NUXT_PUBLIC_WEB_DESCRIPTION=Complete approval management system
NUXT_PUBLIC_OG_IMAGE=/images/og-image.png
NUXT_PUBLIC_OG_TYPE=website
NUXT_PUBLIC_OG_URL=https://your-domain.com

# Redis Configuration
REDIS_PASSWORD=defaultpassword
EOF
        log_info "Created default .env file. Please update it with your configuration."
    else
        log_info "Environment file exists ✓"
    fi
}

# Build and deploy
deploy() {
    log_info "Building Docker image..."
    docker-compose build --no-cache

    log_info "Stopping existing containers..."
    docker-compose down

    log_info "Starting new containers..."
    docker-compose up -d

    log_info "Waiting for application to be ready..."
    sleep 30

    # Health check
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f http://localhost:5000/ > /dev/null 2>&1; then
            log_info "Application is ready! ✓"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "Application failed to start after $max_attempts attempts"
            docker-compose logs --tail=50 $CONTAINER_NAME
            exit 1
        fi
        
        log_info "Attempt $attempt/$max_attempts - waiting for application..."
        sleep 10
        ((attempt++))
    done
}

# Cleanup old Docker images
cleanup() {
    log_info "Cleaning up old Docker images..."
    docker image prune -f
    docker system prune -f
    log_info "Cleanup completed ✓"
}

# Show application status
show_status() {
    echo ""
    log_info "=== Deployment Status ==="
    docker-compose ps
    
    echo ""
    log_info "=== Application Logs (last 20 lines) ==="
    docker-compose logs --tail=20 $CONTAINER_NAME
    
    echo ""
    log_info "=== Useful Commands ==="
    echo "View logs: docker-compose logs -f $CONTAINER_NAME"
    echo "Restart app: docker-compose restart $CONTAINER_NAME"
    echo "Stop all: docker-compose down"
    echo "Update app: ./deploy.sh"
}

# Main execution
main() {
    echo "🔍 Pre-deployment checks..."
    check_docker
    check_files
    create_env_file
    
    echo ""
    echo "📦 Starting deployment..."
    deploy
    
    echo ""
    echo "🧹 Cleaning up..."
    cleanup
    
    echo ""
    echo "✅ Deployment completed successfully!"
    show_status
    
    echo ""
    log_info "🎉 CBS Approve Web is now running at http://localhost:3000"
}

# Handle script arguments
case "${1:-}" in
    "logs")
        docker-compose logs -f $CONTAINER_NAME
        ;;
    "status")
        show_status
        ;;
    "stop")
        log_info "Stopping application..."
        docker-compose down
        ;;
    "restart")
        log_info "Restarting application..."
        docker-compose restart $CONTAINER_NAME
        ;;
    "update")
        main
        ;;
    *)
        main
        ;;
esac