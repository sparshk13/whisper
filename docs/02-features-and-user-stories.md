# 02. Features and User Stories

Priority: **MVP** = must have, **Twist** = differentiator, **Later** = optional.

## Core features

### F1. Sign up and log in (MVP)
As a user, I want an account so that my chats are private.
- Register with username, email, password. Password min 8 chars.
- Duplicate email or username is rejected with a clear error.
- Login returns an access token; refresh keeps me logged in.
- Logout clears the session and disconnects the socket.

### F2. One-to-one chat (MVP)
As a user, I want to message another user so that we can talk live.
- Search users by username and start a direct conversation.
- Only one direct conversation can exist between the same two users.
- Messages appear instantly for both users in order.
- Sent messages show instantly (optimistic UI) and are confirmed by the server.

### F3. Message history (MVP)
- Opening a chat loads the latest 30 messages; scrolling up loads older ones (cursor pagination).

### F4. Typing indicator (MVP)
- "typing..." shows within 300 ms and disappears after 3 s of inactivity or on send.

### F5. Presence and last seen (MVP)
- Online/offline dot per user. "Last seen" shown when offline.
- A user with multiple tabs open stays online until the last tab closes.

### F6. Message status ticks (MVP)
- Sent (1 tick), delivered (2 grey ticks), read (2 blue ticks).
- Works for offline receivers: delivered happens when they reconnect.
- In groups, status is shown as delivered or read when all members have it (simplified).

### F7. Group chat (MVP)
- Create a group with a name and members. Creator is admin.
- Admin can add/remove members. Members can leave.
- Everyone sees live messages, typing ("Ali is typing"), and member presence.

### F8. Unread counts (MVP)
- Chat list shows unread badge and latest message preview, sorted by latest activity.

### F9. Image sharing (Later in MVP)
- Send images up to 5 MB (jpg, png, webp). Shown inline.

## Twists

### T1. Self-destructing messages
As a sender, I want to set a timer so that a message disappears for everyone after being read.
- Timer options: off, 10 s, 1 min, 1 hr, 24 hr.
- Timer starts when the message is **read** by the recipient on the server (in direct chats when read by recipient; in groups when first read by any other member).
- At expiry the server deletes the body and broadcasts `message:expired`; clients show a "This message expired" placeholder or remove it.
- If a client was offline at expiry, it must never receive the body after expiry.
- A background job cleans up expired rows.

### T2. Live reactions
- Long-press or hover a message to pick an emoji (6 quick emojis).
- One reaction per emoji per user per message; toggling removes it.
- Counts update instantly for everyone in the chat.

### T3. Threaded replies (groups; also allowed in direct chats)
- "Reply in thread" on any top-level message opens a side panel.
- Thread replies do not clutter the main chat; the parent shows "N replies".
- New replies update the count live and appear live in the open thread panel.
- Threads are one level deep (no replies to replies).

## Later
- AI "Catch me up" summary of unread messages (Anthropic API)
- Pinned messages, scheduled messages, dark mode, push notifications
