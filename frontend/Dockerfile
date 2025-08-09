# syntax=docker/dockerfile:1
# --- Build stage (Vite) ---
FROM node:20 AS build
WORKDIR /app
# copia o lockfile se existir
COPY package.json package-lock.json* ./
# usa ci se houver lock, senão faz install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

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
# Ensure legacy static login and assets are present
COPY login.html /usr/share/caddy/login.html
COPY public/admin.html /usr/share/caddy/admin.html
COPY public/app.html /usr/share/caddy/app.html
COPY public/personalArea.html /usr/share/caddy/personalArea.html
# Copy full src tree to satisfy module imports used by legacy static pages
COPY src /usr/share/caddy/src
# Copy additional public assets used by admin/personal pages
COPY public /usr/share/caddy/public
EXPOSE 8080
