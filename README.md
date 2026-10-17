# Whisper

A real-time messaging application with self-destructing messages, live emoji reactions, and threaded group replies.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Zustand, TanStack Query
- **Backend**: Node.js 20, Express, Socket.IO, TypeScript, Prisma ORM
- **Database**: PostgreSQL 16
- **Authentication**: JWT access token (in-memory) + rotating HTTP-only refresh cookie, bcrypt password hashing

## Architecture & Features

- **Real-time Messaging**: Instant delivery, typing indicators, user presence (online/last seen), and delivery/read receipts.
- **Self-Destructing Messages**: Disappearing messages with a server-enforced timer activated after being read.
- **Emoji Reactions**: Real-time reaction counters and user reaction sync.
- **Threaded Replies**: Dedicated side panel for group conversation threads.
- **Security**: In-memory token management, bcrypt cost 12, rate-limiting, and Zod validation on every endpoint.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or hosted via Neon / Supabase)

### Setup

1. **Clone & install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create `server/.env` based on `server/.env.example`:
   ```bash
   cp server/.env.example server/.env
   ```
   Add your PostgreSQL connection string in `server/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   ```

3. **Run database migrations and seed**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the development servers**:
   ```bash
   # In terminal 1 (Backend - http://localhost:4000)
   npm run dev:server

   # In terminal 2 (Frontend - http://localhost:5173)
   npm run dev:client
   ```

## Testing & Quality

```bash
npm run typecheck    # TypeScript verification
npm run lint         # ESLint checks
npm test             # Automated unit & integration tests
```
