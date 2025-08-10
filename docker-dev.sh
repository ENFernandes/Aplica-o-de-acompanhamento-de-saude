#!/bin/bash

# Script para desenvolvimento local com Docker
# Health Tracker Application

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para verificar se Docker está a correr
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está a correr. Inicia o Docker Desktop primeiro."
        exit 1
    fi
    print_success "Docker está a correr"
}

# Função para construir as imagens
build_images() {
    print_status "Construindo imagens Docker..."
    
    # Construir backend
    print_status "Construindo backend..."
    docker build -t health-tracker-backend:dev ./backend
    
    # Construir frontend
    print_status "Construindo frontend..."
    docker build -t health-tracker-frontend:dev ./frontend
    
    print_success "Imagens construídas com sucesso!"
}

# Função para iniciar os serviços
start_services() {
    print_status "Iniciando serviços..."
    
    # Parar serviços existentes
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    # Iniciar serviços
    docker-compose -f docker-compose.dev.yml up -d
    
    print_success "Serviços iniciados!"
}

# Função para parar os serviços
stop_services() {
    print_status "Parando serviços..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Serviços parados!"
}

# Função para verificar o status dos serviços
check_status() {
    print_status "Verificando status dos serviços..."
    
    echo ""
    echo "=== STATUS DOS SERVIÇOS ==="
    docker-compose -f docker-compose.dev.yml ps
    
    echo ""
    echo "=== LOGS DO BACKEND ==="
    docker-compose -f docker-compose.dev.yml logs --tail=10 backend
    
    echo ""
    echo "=== LOGS DO FRONTEND ==="
    docker-compose -f docker-compose.dev.yml logs --tail=10 frontend
    
    echo ""
    echo "=== LOGS DO POSTGRES ==="
    docker-compose -f docker-compose.dev.yml logs --tail=10 postgres
}

# Função para mostrar logs em tempo real
show_logs() {
    print_status "Mostrando logs em tempo real (Ctrl+C para sair)..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Função para aceder ao container
shell() {
    local service=${1:-backend}
    print_status "Acedendo ao shell do $service..."
    docker-compose -f docker-compose.dev.yml exec $service sh
}

# Função para executar comandos
exec_command() {
    local service=${1:-backend}
    local command=${2:-"ls -la"}
    print_status "Executando comando no $service: $command"
    docker-compose -f docker-compose.dev.yml exec $service sh -c "$command"
}

# Função para mostrar ajuda
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build     - Construir imagens Docker"
    echo "  start     - Iniciar serviços"
    echo "  stop      - Parar serviços"
    echo "  restart   - Reiniciar serviços"
    echo "  status    - Verificar status dos serviços"
    echo "  logs      - Mostrar logs em tempo real"
    echo "  shell     - Aceder ao shell do backend"
    echo "  exec      - Executar comando no backend"
    echo "  clean     - Limpar containers e volumes"
    echo "  help      - Mostrar esta ajuda"
    echo ""
    echo "Examples:"
    echo "  $0 start                    # Iniciar todos os serviços"
    echo "  $0 shell frontend          # Shell do frontend"
    echo "  $0 exec 'npm run test'     # Executar testes no backend"
}

# Função para limpar tudo
clean_all() {
    print_warning "Esta ação vai remover todos os containers, imagens e volumes!"
    read -p "Tens a certeza? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Limpando tudo..."
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        print_success "Limpeza concluída!"
    else
        print_status "Limpeza cancelada"
    fi
}

# Main script
main() {
    check_docker
    
    case "${1:-help}" in
        build)
            build_images
            ;;
        start)
            build_images
            start_services
            print_success "Aplicação disponível em:"
            echo "  Frontend: http://localhost:8000"
            echo "  Backend:  http://localhost:3000"
            echo "  Database: localhost:5432"
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            start_services
            ;;
        status)
            check_status
            ;;
        logs)
            show_logs
            ;;
        shell)
            shell "$2"
            ;;
        exec)
            exec_command "$2" "$3"
            ;;
        clean)
            clean_all
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Comando desconhecido: $1"
            show_help
            exit 1
            ;;
    esac
}

# Executar main com todos os argumentos
main "$@"
