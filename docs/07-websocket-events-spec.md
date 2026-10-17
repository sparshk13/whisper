# 07. WebSocket Events Specification (SOURCE OF TRUTH)

Library: Socket.IO. Event names use `namespace:action`. Payloads are validated with Zod on the server. Unknown events are ignored and logged.

## Connection and auth
- Client connects with `io(URL, { auth: { token: accessToken } })`.
- Server middleware verifies the JWT. On failure: connection rejected with error `UNAUTHORIZED`.
- On success the server: joins `user:{id}` and every `conv:{id}` room, marks presence online, marks pending messages delivered (see doc 12).
- If the access token expires, the client refreshes via REST, updates `socket.auth.token`, and reconnects.

## Acknowledgements
Every client to server event that changes data uses a Socket.IO ack callback returning:
`{ ok: true, data: ... }` or `{ ok: false, error: { code, message } }`.

## Client to Server events

| Event | Payload | Ack data | Notes |
|---|---|---|---|
| `message:send` | `{conversationId, text, tempId, expiresInSeconds?, parentMessageId?, attachmentUrl?}` | `{message}` | Validates membership, text 1-4000 chars, `expiresInSeconds` in {10,60,3600,86400} or omitted |
| `message:delivered` | `{messageIds: string[]}` | `{}` | Sent by receiver client when messages arrive |
| `message:read` | `{conversationId, upToMessageId}` | `{}` | Marks all earlier messages as read |
| `typing:start` | `{conversationId, parentMessageId?}` | none | Throttle on client: at most 1 per 2 s |
| `typing:stop` | `{conversationId, parentMessageId?}` | none | |
| `reaction:toggle` | `{messageId, emoji}` | `{reactions}` | Adds if absent, removes if present. Allowed emojis: 👍 ❤️ 😂 😮 😢 🙏 |
| `conversation:join` | `{conversationId}` | `{}` | Rarely needed; server auto-joins |

## Server to Client events

| Event | Payload | Sent to | When |
|---|---|---|---|
| `message:new` | `{message}` | room `conv:{id}` (sender excluded; sender gets it via ack) | New top-level message or thread reply |
| `message:status` | `{messageId, conversationId, status: "delivered"\|"read", userId}` | sender's `user:{id}` room | Receipt changes |
| `message:expired` | `{messageId, conversationId, expiredAt}` | room `conv:{id}` | Self-destruct fired |
| `thread:updated` | `{parentMessageId, conversationId, replyCount, lastReplyAt}` | room `conv:{id}` | A reply was added to a thread |
| `reaction:updated` | `{messageId, conversationId, reactions: [{emoji,count,userIds}]}` | room `conv:{id}` | After any toggle |
| `typing:update` | `{conversationId, parentMessageId?, userId, isTyping}` | room `conv:{id}` excluding sender | Server auto-sends `isTyping:false` after 5 s without refresh |
| `presence:update` | `{userId, online, lastSeenAt}` | users sharing a conversation | First tab on / last tab off |
| `conversation:updated` | `{conversation}` | members | Group name or members changed, new conversation created |
| `conversation:removed` | `{conversationId}` | the removed user | Removed from group; server also makes their sockets leave the room |
| `error:event` | `{code, message, event}` | the emitting socket | Non-ack failures |

## Error codes
`UNAUTHORIZED`, `VALIDATION_ERROR`, `NOT_A_MEMBER`, `NOT_FOUND`, `RATE_LIMITED`, `THREAD_TOO_DEEP`, `INVALID_EXPIRY`, `INTERNAL`.

## Rate limits (per socket)
- `message:send`: 20 per 10 seconds
- `reaction:toggle`: 30 per 10 seconds
- `typing:*`: 1 per second
Exceeding returns `RATE_LIMITED`.

## Optimistic UI contract
1. Client generates `tempId` (uuid), shows message as `sending`.
2. On ack success, client replaces the temp message with the server message (matched by `tempId`).
3. On ack failure or timeout (10 s), show "failed, tap to retry" and reuse the same `tempId` on retry.
4. The server must treat the same `(senderId, tempId)` as idempotent: a retry returns the existing message, not a duplicate.

## Ordering rule
Clients sort by `createdAt` (server time), tie-break by `id`. Never sort by arrival order.

## Example flow: reaction
1. A emits `reaction:toggle {messageId, emoji:"❤️"}`
2. Server writes/deletes the reaction row, loads the new summary
3. Server acks A and emits `reaction:updated` to `conv:{id}`
4. All clients in the room re-render counts
