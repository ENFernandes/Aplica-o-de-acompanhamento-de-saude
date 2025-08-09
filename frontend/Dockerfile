# syntax=docker/dockerfile:1
# --- Build stage (Vite) ---
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build with Vite; uses .env.production if present
RUN npm run build

# --- Runtime stage (Caddy static server) ---
FROM caddy:2.7
# Railway injects PORT; default to 8080 for local runs
ENV PORT=8080
# Caddyfile uses {$PORT} and {$API_UPSTREAM}
COPY Caddyfile /etc/caddy/Caddyfile
# Copy built assets
COPY --from=build /app/dist /usr/share/caddy
EXPOSE 8080
