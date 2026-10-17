# 03. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | Fast dev server, huge ecosystem |
| Styling | Tailwind CSS v3 | Quick, consistent UI, battle-tested tooling |
| Client state | Zustand (UI/live state) + TanStack Query (REST data) | Simple and beginner-friendly |
| Realtime | Socket.IO (client + server) | Rooms, acks, auto-reconnect built in; easier than raw WebSocket |
| Backend | Node.js 20 + Express + TypeScript | Same language everywhere |
| ORM | Prisma | Readable schema, safe migrations |
| Database | PostgreSQL 16 (Hosted Neon / Supabase or Docker) | Relational data fits chats; strong consistency |
| Validation | Zod | One schema for runtime and types |
| Auth | jsonwebtoken + bcrypt | Standard, well documented |
| Scheduling | node-cron (simple) or BullMQ (later with Redis) | Message expiry cleanup |
| Testing | Vitest, Supertest, socket.io-client | Covers REST and sockets |
| Dev infra | Hosted Postgres (Neon / Supabase) or Docker Compose | Free cloud Postgres or local container |
| File upload | Multer, local `uploads/` first | Swap to Cloudinary or S3 later |
| AI (later) | Anthropic API | Catch-up summary |

## Why Socket.IO and not raw WebSocket?
Raw WebSocket only sends messages. Socket.IO adds: rooms (group broadcast), acknowledgements (confirm delivery to the sender), automatic reconnection, and fallback transports. These are exactly what a chat app needs.

## Why PostgreSQL and not MongoDB?
Messages, members, reactions, and receipts are relational (many-to-many, unique constraints, joins). Unique constraints also prevent duplicate reactions at the database level.

## Folder layout
```
whisper/
├── client/        # React app
├── server/
│   ├── src/
│   │   ├── config/        # env, constants
│   │   ├── routes/        # REST routes
│   │   ├── controllers/
│   │   ├── services/      # business logic (messages, reactions, presence)
│   │   ├── sockets/       # socket handlers, grouped by feature
│   │   ├── middleware/    # auth, validation, rate limit, errors
│   │   ├── jobs/          # expiry cleanup
│   │   └── schemas/       # Zod schemas (shared with socket payloads)
│   └── prisma/schema.prisma
├── docker-compose.yml
└── docs/
```
