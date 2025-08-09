# Health Tracker - MiniBox Esposende

Modern web app for health tracking with a React landing page, BackOffice (Admin), and an Express + PostgreSQL API.

## Overview

- React/Vite landing page (port 8000)
- BackOffice (Admin) served from classic HTML/JS in `frontend/public/admin.html`
- Express API (port 3000) with PostgreSQL

## Quick start

1) Database (Docker recommended)
```bash
docker-compose up -d
# Postgres and pgAdmin are provisioned; see docs/ for connection details
```

2) Start both servers (Windows)
```cmd
start-servers.bat
# Backend → http://localhost:3000
# Frontend → http://localhost:8000
```

3) Login/Navigation
- Landing: `http://localhost:8000/`
- Login page: `http://localhost:8000/login`
- BackOffice: `http://localhost:8000/admin`
- Personal Area: `http://localhost:8000/personalArea`

## Default Admin User

The application comes with a default admin user:
- **Email:** `admin@healthtracker.com`
- **Password:** `admin123`

This user is automatically created when the database is initialized.

## Key features

- Health records (weight, height, BMI, etc.) with charts
- Auth (JWT), roles (admin/customer)
- Admin can create users, reset passwords, view user profiles
- Sticky header on landing; CTA “WhatsApp” configurable via Admin settings

## Admin settings and public WhatsApp number

- The Admin can set the WhatsApp phone number in:
  - BackOffice → Configuração → Configurações Gerais → “WhatsApp (número com indicativo)”
- The landing page fetches it from the public API endpoint (no auth required):
  - `GET /api/public/settings` → `{ settings: { whatsappNumber } }`

## Backend

- Node.js/Express on port 3000
- Routes (selection):
  - `/api/auth/*` → authentication
  - `/api/users/*`, `/api/health-records/*` → user and records
  - `/api/admin/*` → admin-only routes (users, settings, dashboard)
  - `/api/public/settings` → exposes safe public settings (WhatsApp number)

Environment (copy and adjust):
```bash
cd backend
npm install
copy env.example .env
npm start
```

## Frontend (landing)

- Vite + React + Tailwind
- Dev server: `npm run dev` (port 8000)

Note: files under `frontend/public/` are served statically by Vite. Legacy app pages (e.g. `personalArea.html`) are kept for compatibility and are not part of the React app.

## Scripts

- `start-servers.bat` – starts backend (3000) and frontend (8000)
- `stop-servers.bat` – stops Node processes

## Troubleshooting

- “personalArea.html imports src/js/main.js” error in Vite: this is from legacy assets under `frontend/public/`. It does not affect the landing; ignore or move legacy pages outside `frontend/public/`.
- CORS: backend allows `http://localhost:8000` by default.

## License

MIT (see repository).