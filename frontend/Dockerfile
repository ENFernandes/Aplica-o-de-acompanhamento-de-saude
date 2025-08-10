# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage de produção com Nginx
FROM nginx:alpine AS production

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar ficheiros buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]
