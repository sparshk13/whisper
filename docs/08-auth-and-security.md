# 08. Auth and Security

## Passwords
- bcrypt with cost 12. Never log or return `password_hash`.
- Minimum 8 characters; reject common weak passwords if simple to do.

## Tokens
- **Access token:** JWT, 15 minutes, signed with `JWT_ACCESS_SECRET`, payload `{sub: userId}`. Stored **in memory** on the client (not localStorage).
- **Refresh token:** random 64-byte string, stored hashed in `refresh_tokens`, sent as `httpOnly`, `sameSite=lax`, `secure` (in production) cookie, 7 days. Rotate on every refresh and revoke the old one.
- Logout revokes the refresh token.

## Socket authentication
- Token passed in the handshake `auth` field, verified in a Socket.IO middleware.
- On every event, re-check authorization using the stored `socket.data.userId`, never a userId from the payload.
- Before any chat action, verify the user is a member of the conversation.

## Authorization rules
- Only members can read/send/react in a conversation.
- Only admins add/remove group members.
- A user can only toggle their own reactions.
- Message bodies of expired messages are never returned.

## Input validation
- Zod schemas for every REST body/query and every socket payload.
- Escape/render message text as plain text in React (never `dangerouslySetInnerHTML`).
- Limit message length (4000), username format, upload type and size.

## Rate limiting
- REST: `express-rate-limit`. Login/register: 10 per 15 min per IP. General API: 100 per min.
- Sockets: per-socket counters (see doc 07).

## Headers and CORS
- `helmet` enabled.
- CORS allows only `CLIENT_ORIGIN` with credentials.
- Socket.IO CORS uses the same origin list.

## Uploads
- Check MIME type by magic bytes, not only extension. Random filenames. Serve from a separate `/uploads` static path with `X-Content-Type-Options: nosniff`.

## Secrets and env
- All secrets in `.env`; `.env.example` has placeholder values only; `.env` is in `.gitignore`.

## Known gaps (document honestly in README)
- No end-to-end encryption. Server can read messages.
- Self-destruct cannot stop a recipient from taking a screenshot or copying text. State this in the UI help text.
