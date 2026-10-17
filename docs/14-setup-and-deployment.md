# 14. Setup and Deployment

## Antigravity setup
1. Install Antigravity and open the `whisper/` folder as the workspace.
2. The agent reads `AGENTS.md` automatically. Rules are in `.agents/rules/` and workflows in `.agents/workflows/`. (If your Antigravity version expects `.agents/` instead of `.agents/`, rename the folder.)
3. Suggested settings: Agent-assisted development, review policy "Agent Decides" (or "Request review" while you are learning, so you approve each plan).
4. Open the agent panel, type `/start`, then `/build-phase` for each phase.
5. Each rule or workflow file must stay under 12,000 characters.

## Prerequisites
Node.js 20+, Git. (Docker Desktop optional if using hosted Postgres like Neon or Supabase).

## Local setup
```
# If using hosted Postgres (Neon / Supabase), paste your connection string into server/.env
cd server && cp .env.example .env && npm install && npx prisma migrate dev && npm run seed && npm run dev
cd ../client && cp .env.example .env && npm install && npm run dev
```

## docker-compose.yml (optional)
Postgres 16 with a named volume, port 5432, env `POSTGRES_USER=whisper`, `POSTGRES_PASSWORD=whisper`, `POSTGRES_DB=whisper`. A second database `whisper_test` for tests. (Redis service added only in bonus phase.)

## server/.env.example
```
PORT=4000
DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/whisper?sslmode=require
# Or local docker: postgresql://whisper:whisper@localhost:5432/whisper
JWT_ACCESS_SECRET=change-me-long-random-string
REFRESH_TOKEN_DAYS=7
CLIENT_ORIGIN=http://localhost:5173
UPLOAD_DIR=./uploads
NODE_ENV=development
# ANTHROPIC_API_KEY=   (bonus phase only)
```

## client/.env.example
```
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## Deployment (free-tier friendly)
- **Database:** Neon or Supabase Postgres (copy the connection string into `DATABASE_URL`).
- **Backend:** Render or Railway (needs a long-running server for WebSockets; serverless platforms like Vercel functions do NOT suit Socket.IO).
- **Frontend:** Vercel or Netlify (set `VITE_API_URL` and `VITE_SOCKET_URL` to the backend URL).
- Use HTTPS everywhere; set cookies `secure: true` and `sameSite: 'none'` if frontend and backend are on different domains, and update CORS.
- Run `npx prisma migrate deploy` on release.
- Free instances may sleep; the first connection can be slow. Mention this in the README.

## Production checklist
- Strong secrets, `NODE_ENV=production`, CORS locked to the real frontend origin.
- Rate limits on, helmet on, logs not leaking secrets.
- Persistent storage for uploads (switch to Cloudinary or S3, since free hosts wipe local disk).
- Health check endpoint configured in the host.
