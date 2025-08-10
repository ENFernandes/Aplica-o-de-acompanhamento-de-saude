# 🐳 Docker Setup - Health Tracker Application

## 📋 **Visão Geral**

Este projeto inclui configurações Docker completas para desenvolvimento local e produção:

- **Backend**: Node.js API com PostgreSQL
- **Frontend**: React/Vite com Nginx
- **Database**: PostgreSQL 15 com scripts de inicialização
- **Development**: Docker Compose para ambiente local
- **Production**: Dockerfiles otimizados para deploy

## 🚀 **Início Rápido**

### **1. Pré-requisitos**
```bash
# Verificar se Docker está instalado
docker --version
docker-compose --version

# Se não tiver Docker Desktop, instala:
# macOS: https://docs.docker.com/desktop/install/mac-install/
# Windows: https://docs.docker.com/desktop/install/windows-install/
# Linux: https://docs.docker.com/engine/install/
```

### **2. Iniciar Aplicação Completa**
```bash
# Dar permissões ao script
chmod +x docker-dev.sh

# Iniciar todos os serviços
./docker-dev.sh start
```

### **3. Aceder à Aplicação**
- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

## 🛠️ **Comandos Disponíveis**

### **Script Principal (`docker-dev.sh`)**
```bash
./docker-dev.sh [COMMAND]

# Comandos disponíveis:
./docker-dev.sh start      # Iniciar todos os serviços
./docker-dev.sh stop       # Parar todos os serviços
./docker-dev.sh restart    # Reiniciar serviços
./docker-dev.sh status     # Verificar status
./docker-dev.sh logs       # Ver logs em tempo real
./docker-dev.sh shell      # Aceder ao shell do backend
./docker-dev.sh clean      # Limpar tudo
./docker-dev.sh help       # Mostrar ajuda
```

### **Docker Compose Direto**
```bash
# Iniciar serviços
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar serviços
docker-compose -f docker-compose.dev.yml down

# Reconstruir e iniciar
docker-compose -f docker-compose.dev.yml up -d --build
```

## 🏗️ **Estrutura dos Ficheiros Docker**

```
├── backend/
│   ├── Dockerfile          # Imagem do backend Node.js
│   └── .dockerignore       # Ficheiros a ignorar no build
├── frontend/
│   ├── Dockerfile          # Imagem do frontend React
│   └── nginx.conf          # Configuração do Nginx
├── docker-compose.dev.yml  # Orquestração para desenvolvimento
├── docker-dev.sh           # Script de automação
└── render.yaml             # Configuração para Render.com
```

## 🔧 **Configurações Específicas**

### **Backend Dockerfile**
- **Multi-stage build** para otimizar tamanho
- **Node.js 18 Alpine** para segurança e performance
- **Usuário não-root** para segurança
- **Health checks** automáticos
- **PostgreSQL client** incluído

### **Frontend Dockerfile**
- **Build Vite** para produção
- **Nginx Alpine** para servir ficheiros estáticos
- **SPA routing** com fallback para index.html
- **Compressão Gzip** ativada
- **Headers de segurança** configurados

### **Nginx Configuration**
- **Rate limiting** para API e login
- **Compressão Gzip** para performance
- **Headers de segurança** (XSS, CSRF, etc.)
- **Cache de ficheiros estáticos**
- **Proxy reverso** para API

## 🌐 **Variáveis de Ambiente**

### **Backend**
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://health_user:health_password_2024@postgres:5432/health_tracker
JWT_SECRET=dev_jwt_secret_2024
CORS_ORIGIN=http://localhost:8000
```

### **Frontend**
```bash
VITE_API_URL=http://localhost:3000
```

### **Database**
```bash
POSTGRES_DB=health_tracker
POSTGRES_USER=health_user
POSTGRES_PASSWORD=health_password_2024
```

## 🚀 **Deploy para Produção**

### **Render.com (Recomendado)**
```bash
# 1. Conectar repositório no Render
# 2. Configurar PostgreSQL
# 3. Configurar Web Service (Backend)
# 4. Configurar Static Site (Frontend)
# 5. Deploy automático via Git
```

### **Docker Hub**
```bash
# Construir imagens
docker build -t username/health-tracker-backend:latest ./backend
docker build -t username/health-tracker-frontend:latest ./frontend

# Fazer push
docker push username/health-tracker-backend:latest
docker push username/health-tracker-frontend:latest
```

### **Outros Cloud Providers**
- **DigitalOcean App Platform**
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**

## 🔍 **Troubleshooting**

### **Problemas Comuns**

#### **1. Porta já em uso**
```bash
# Verificar portas em uso
lsof -i :3000
lsof -i :8000
lsof -i :5432

# Parar serviços conflitantes
./docker-dev.sh stop
```

#### **2. Erro de permissões**
```bash
# Dar permissões ao script
chmod +x docker-dev.sh

# Verificar permissões Docker
docker ps
```

#### **3. Base de dados não conecta**
```bash
# Verificar logs do PostgreSQL
./docker-dev.sh logs postgres

# Verificar variáveis de ambiente
docker-compose -f docker-compose.dev.yml exec backend env | grep DATABASE
```

#### **4. Frontend não carrega**
```bash
# Verificar build
docker-compose -f docker-compose.dev.yml exec frontend ls -la /usr/share/nginx/html

# Verificar logs do Nginx
./docker-dev.sh logs frontend
```

### **Logs e Debugging**
```bash
# Ver logs de todos os serviços
./docker-dev.sh logs

# Ver logs de um serviço específico
docker-compose -f docker-compose.dev.yml logs -f backend

# Aceder ao shell de um serviço
./docker-dev.sh shell backend
./docker-dev.sh shell frontend
./docker-dev.sh shell postgres
```

## 📊 **Monitorização**

### **Health Checks**
- **Backend**: http://localhost:3000/api/health
- **Frontend**: http://localhost:8000/health
- **Database**: Automático via Docker

### **Métricas**
```bash
# Ver recursos utilizados
docker stats

# Ver espaço em disco
docker system df

# Ver imagens e containers
docker images
docker ps -a
```

## 🔒 **Segurança**

### **Configurações Implementadas**
- ✅ **Usuários não-root** nos containers
- ✅ **Headers de segurança** no Nginx
- ✅ **Rate limiting** para prevenir ataques
- ✅ **SSL/TLS** para produção
- ✅ **Health checks** para monitorização

### **Recomendações Adicionais**
- 🔐 **Secrets management** para produção
- 🔐 **Network policies** para isolamento
- 🔐 **Image scanning** para vulnerabilidades
- 🔐 **Log monitoring** para auditoria

## 📚 **Recursos Adicionais**

### **Documentação Oficial**
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)

### **Tutoriais Relacionados**
- [Multi-stage Docker builds](https://docs.docker.com/develop/dev-best-practices/multistage-build/)
- [Docker security best practices](https://docs.docker.com/develop/security-best-practices/)
- [Nginx configuration guide](https://nginx.org/en/docs/beginners_guide.html)

## 🤝 **Contribuição**

Para contribuir para esta configuração Docker:

1. **Fork** o repositório
2. **Cria** uma branch para a feature
3. **Commit** as alterações
4. **Push** para a branch
5. **Abre** um Pull Request

## 📄 **Licença**

Este projeto está licenciado sob a licença MIT - ver o ficheiro [LICENSE](LICENSE) para detalhes.

---

**🎯 Dúvidas? Problemas? Abre uma issue no GitHub!**
