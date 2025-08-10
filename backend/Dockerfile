# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Stage de produção
FROM node:18-alpine AS production

# Instalar dependências necessárias para PostgreSQL
RUN apk add --no-cache postgresql-client

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar dependências do builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar código fonte
COPY --chown=nodejs:nodejs . .

# Criar diretório para logs
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

# Expor porta
EXPOSE 3000

# Mudar para usuário não-root
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Comando de inicialização
CMD ["npm", "start"]
