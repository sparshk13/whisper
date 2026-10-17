# 06. REST API Specification

Base URL: `/api`. JSON bodies. Auth via `Authorization: Bearer <accessToken>` except where marked public.
Error format (always): `{ "error": { "code": "STRING_CODE", "message": "Human readable" } }`

## Auth (public)
| Method | Path | Body | Success | Errors |
|---|---|---|---|---|
| POST | /auth/register | `{username,email,password,displayName}` | 201 `{user, accessToken}` + refresh cookie | 400 validation, 409 duplicate |
| POST | /auth/login | `{email,password}` | 200 `{user, accessToken}` + refresh cookie | 401 invalid credentials |
| POST | /auth/refresh | cookie | 200 `{accessToken}` | 401 |
| POST | /auth/logout | cookie | 204 | |

## Users
| Method | Path | Notes |
|---|---|---|
| GET | /users/me | current user |
| PATCH | /users/me | update displayName, about, avatar |
| GET | /users/search?q=ali | username prefix search, max 10, excludes self |

## Conversations
| Method | Path | Notes |
|---|---|---|
| GET | /conversations | list with last message preview, unread count, members' presence |
| POST | /conversations/direct | `{userId}` returns existing or creates new (uses `direct_key`) |
| POST | /conversations/group | `{name, memberIds[]}` |
| GET | /conversations/:id | details + members |
| POST | /conversations/:id/members | admin only: `{userIds[]}` |
| DELETE | /conversations/:id/members/:userId | admin removes, or self leaves |

## Messages
| Method | Path | Notes |
|---|---|---|
| GET | /conversations/:id/messages?before=<messageId>&limit=30 | older page, top-level messages only, newest first; includes reactions summary and replyCount |
| GET | /conversations/:id/messages?after=<messageId> | catch-up after reconnect |
| GET | /messages/:id/thread | replies of a top-level message |
| POST | /conversations/:id/read | `{upToMessageId}` marks read (also available as a socket event) |

Message object returned by REST and sockets (same shape everywhere):
```json
{
  "id": "uuid",
  "conversationId": "uuid",
  "senderId": "uuid",
  "type": "text",
  "body": "hello",
  "parentMessageId": null,
  "replyCount": 0,
  "reactions": [{"emoji":"👍","count":2,"reactedByMe":true}],
  "expiresAt": null,
  "expired": false,
  "status": "sent",
  "tempId": "client-generated-id-or-null",
  "createdAt": "2025-01-01T10:00:00.000Z"
}
```
When `expired` is true, `body` is `null`.

## Uploads
| Method | Path | Notes |
|---|---|---|
| POST | /uploads | multipart image, max 5 MB, jpg/png/webp. Returns `{url, mimeType, sizeBytes}`; then send a message of type image referencing it |

## Health
`GET /health` returns `{status:"ok"}` (public).

## Status codes
400 validation, 401 unauthenticated, 403 not a member / not admin, 404 not found, 409 conflict, 413 file too large, 429 rate limited.
