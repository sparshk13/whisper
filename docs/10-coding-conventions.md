# 10. Coding Conventions

## General
- **Write less code.** Precise and concise: only what the spec needs. No dead code, no speculative helpers, no filler comments. The code must read like a careful human wrote it. Full rules: `.agents/rules/code-quality.md`.
- Every phase ends with the review-and-clean pass in `docs/15-phase-review-checklist.md`.
- TypeScript strict mode on both client and server. No `any` unless commented why.
- Prettier + ESLint. Run before committing.
- Small files, small functions. One responsibility each.

## Naming
- Files: `kebab-case.ts` (server), `PascalCase.tsx` for React components.
- Variables/functions: `camelCase`. Types/interfaces/components: `PascalCase`. Constants: `UPPER_SNAKE_CASE`.
- DB columns: `snake_case` in SQL; Prisma maps to `camelCase` fields.
- Socket events: `namespace:action` exactly as in doc 07.

## Server structure rules
- Routes call controllers; controllers call services; services hold logic and talk to Prisma.
- Socket handlers call the **same services** as REST. No business logic inside handlers.
- Group socket handlers by feature: `sockets/messages.ts`, `sockets/typing.ts`, `sockets/reactions.ts`, `sockets/presence.ts`.
- Shared Zod schemas live in `schemas/`.

## Error handling
- Throw typed `AppError(code, message, status)`. One Express error middleware formats responses (doc 06 format).
- Socket handlers wrap logic in try/catch and return the ack error shape.
- Never swallow errors silently; log with context (userId, event).

## Client rules
- Socket connection created once in a provider, exposed via a hook `useSocket()`.
- Socket listeners are registered in one place and update the store; components only read the store.
- Always remove listeners on cleanup to avoid duplicate events.
- Server data via TanStack Query; live updates patch the same cache.

## Comments
Comment the **why**, especially for real-time logic (ordering, idempotency, reconnect handling).

## Git
- Branch per phase: `phase-3-direct-chat`.
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
- Commit at the end of each working step.

## Logging
Use `pino`. Log connect/disconnect, errors, and rate-limit hits. Never log passwords, tokens, or message bodies.
