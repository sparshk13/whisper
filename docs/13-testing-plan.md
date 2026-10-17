# 13. Testing Plan

Tools: Vitest, Supertest (REST), socket.io-client (socket tests), a separate test database (`whisper_test`), Testing Library for key React components.

## Unit tests
- Status computation from receipts (direct and group).
- Expiry calculation and "is expired" helper.
- Zod schemas accept and reject sample payloads.
- Direct-key builder gives the same key regardless of user order.

## REST integration tests
- Register: success, duplicate email, weak password.
- Login: success, wrong password.
- Refresh rotation: old refresh token stops working.
- Non-members get 403 on conversation endpoints.
- Pagination returns the correct pages with no overlap.

## Socket integration tests
Spin up the server on a random port, connect real clients:
- Rejects connection with no/invalid token.
- A sends, B receives `message:new`; A gets ack.
- Same `tempId` sent twice produces one message.
- Offline delivery: B disconnected, A sends, B connects, A receives `message:status delivered`.
- Typing events reach others, not the sender.
- Non-member cannot send to a conversation.
- Reaction toggle adds then removes; both clients get `reaction:updated`.
- Self-destruct: send with 10 s (use fake timers or a short test value), `message:expired` arrives, history returns `expired: true`.
- Thread reply increments `replyCount` and emits `thread:updated`; reply to a reply is rejected.
- Rate limit returns `RATE_LIMITED`.

## Manual test script (keep in README)
1. Open two browsers (normal and incognito), log in as two users.
2. Send messages both ways. Check ticks. Close one browser, send, reopen.
3. Test a 10 s message. Test reactions. Test a thread.
4. Throttle network to "Offline" in DevTools and watch the reconnect banner.

## Load smoke test (optional)
A small script that connects 100 fake clients and sends messages at a steady rate, to observe latency and memory.

## Definition of done for any feature
Tests written and passing, lint clean, no console errors, docs updated if behaviour changed.
