# 11. Roadmap and Tasks

Build **one phase at a time**. Each phase ends with the **exit gate**:
1. Tests written and passing
2. The `/review-and-clean` workflow completed: self-review, unused and unneeded code removed, code simplified so it reads hand-written (checklist in `docs/15-phase-review-checklist.md`)
3. `lint`, `typecheck`, and `test` all green
4. Manual test steps written, short explanation for the developer, a git commit

Do not start the next phase until the developer says so.

## Phase 1: Setup, database, auth
- Create monorepo, TypeScript, ESLint, Prettier.
- `docker-compose.yml` with Postgres. Prisma schema from doc 05, migration, seed.
- Express app, `/health`, error middleware, env validation.
- Register, login, refresh, logout (doc 06, 08).
- Basic React app with login/register pages and protected routes.
**Done when:** a user can register, log in, refresh the page and stay logged in.

## Phase 2: Socket "hello world"
- Socket.IO server with JWT handshake auth.
- Client `SocketProvider` and a `ConnectionBanner`.
- Temporary test page: ping/pong event between two logged-in tabs.
**Done when:** two tabs, two users, see each other's ping live; invalid token is rejected.

## Phase 3: One-to-one chat with history
- Users search, direct conversation creation (`direct_key`).
- `message:send` with ack, `message:new`, optimistic UI, idempotent `tempId`.
- History with cursor pagination. Chat list with last message and sort.
**Done when:** two users chat live; refreshing keeps history; duplicate sends never create duplicates.

## Phase 4: Typing, presence, status ticks, unread
- `typing:*`, `presence:update` with multi-tab handling, `last_seen_at`.
- Receipts: delivered on arrival and on reconnect, read on view. Ticks UI.
- Unread counts.
**Done when:** message sent to an offline user shows 1 tick, then 2 ticks when they reconnect, then blue when read.

## Phase 5: Group chats
- Create group, roles, add/remove/leave, room membership updates live.
- Group typing text ("Ali, Sara are typing"), group status rule.
**Done when:** a removed user instantly stops receiving the group's events.

## Phase 6: Twist 1, self-destructing messages
- `expiresInSeconds`, `expires_at`, cleanup job, `message:expired`, UI countdown.
- Ensure expired bodies are blanked in every query path.
**Done when:** a 10 s message disappears for everyone, including a client that reconnects after expiry.

## Phase 7: Twist 2, reactions
- `reaction:toggle`, `reaction:updated`, reaction UI.
**Done when:** two tabs see counts update instantly; the DB prevents duplicates.

## Phase 8: Twist 3, threaded replies
- `parentMessageId` support, one-level rule, thread API, `thread:updated`, thread panel UI, thread typing.
**Done when:** replies stay out of the main list, and counts update live.

## Phase 9: Media, polish, hardening
- Image upload and display. Rate limits. Security checklist from doc 08.
- Loading/empty/error states, responsive pass, accessibility pass.

## Phase 10: Testing, README, deployment
- Fill test gaps (doc 13), write README with architecture diagram, deploy (doc 14).

## Bonus phases (only if asked)
- Redis adapter and presence in Redis.
- AI "Catch me up" summary using the Anthropic API (summarise last N unread messages, cap tokens, never send expired messages).
- Pinned messages, scheduled messages, dark mode.
