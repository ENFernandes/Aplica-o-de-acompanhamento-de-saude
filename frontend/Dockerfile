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

# Copiar ficheiros de configuração essenciais para o Vite
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY components.json ./

# Copiar código fonte e HTML
COPY index.html ./
COPY src/ ./src/
# Do not copy the repository's ./public directory because it contains a secondary app
# which should not be exposed as static files in production. Vite will still bundle
# required assets referenced by the app.

# Build da aplicação
RUN npm run build

# Stage de produção com Nginx
FROM nginx:alpine AS production

# Instalar curl para health check
RUN apk add --no-cache curl

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar ficheiros buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Comando de inicialização
CMD ["nginx", "-g", "daemon off;"]
