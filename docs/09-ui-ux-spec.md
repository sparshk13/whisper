# 09. UI/UX Specification

## Design direction
Soft, calm, and a little dreamy: "twilight". Rounded shapes, gentle gradients, airy spacing, and soft shadows instead of hard borders. Mobile-first and responsive. A visual reference exists as a design canvas (login, desktop chat with thread panel, mobile list, mobile chat); match it.

Tokens:
- Ink (text) `#1E1B3A`; muted text `#6B6788`
- Accent indigo `#5B4BDB`; accent gradient `#6A5AE0` to `#4A3BC7` (outgoing bubbles, send button); deep `#3B2FA8`
- Warm accent peach `#FFB88C`, used sparingly (brand dot, decorative circle)
- Page ground: mist `#F4F2FB`; app backdrop gradient `#E6E0FB` to `#FDE6DA`
- Panels: white, radius 24px, shadow `0 8px 30px rgba(60,40,160,.10)`, floating on the backdrop with 16px gaps (desktop)
- Message area: vertical gradient `#F6F3FD` to `#FDF1EA`
- Incoming bubble: white, radius 20px (small tail corner 6px), soft shadow. Outgoing: accent gradient, white text
- Selected chat row: horizontal gradient `#EFEBFF` to white, radius 16px
- Avatars: initials on four soft gradients (lavender, peach, mint, rose), picked by user id. Online = green dot `#2FC27D` with white ring
- Reaction chips: `#F4F2FB` pill, text `#3B2FA8`
- Inputs: filled `#F4F2FB`, no heavy border; message input and send button fully round
- Font: Plus Jakarta Sans (400, 500, 700). Brand wordmark is lowercase "whisper" with a peach full stop, tight letter spacing
- Typing indicator: three grey-violet dots plus "X is typing"
- Ticks are inline SVG: light grey-violet double = delivered, light blue double = read
- "Today" date pill centred in the message list
- Visible focus ring: 2px indigo outline
- Motion: 150 to 200 ms ease for hover and bubble entry; respect `prefers-reduced-motion`
Light theme first; dark mode later.

## Screens
1. **Login / Register**: centered card, inline validation errors.
2. **Main layout (desktop):** two columns. Left: sidebar (chat list). Right: chat window. Optional third column: thread panel.
3. **Main layout (mobile):** chat list is one screen; opening a chat is a full screen with a back button; thread opens as a full-screen slide-over.
4. **New chat modal:** search users, or create group (name + select members).
5. **Group info drawer:** members, presence, add/remove (admin), leave.
6. **Profile modal:** display name, about, avatar.

## Desktop wireframe
```
+----------------+------------------------------+----------------+
| Search / New + | Chat header: name, online    |  Thread        |
|----------------| ---------------------------- |  (optional)    |
| Avatar Name 2m | [incoming bubble]            |  Parent msg    |
|  last msg   (3)|        [outgoing bubble] vv  |  Reply 1       |
| Avatar Name    | [bubble]  (reactions 👍2)    |  Reply 2       |
|  ...           | "Ali is typing..."           |  [reply box]   |
|                | [timer ⏱] [ input ] [Send]   |                |
+----------------+------------------------------+----------------+
```

## Components
`AuthForm`, `AppShell`, `Sidebar`, `ChatListItem`, `ChatWindow`, `ChatHeader`, `MessageList` (virtualised or paginated upward), `MessageBubble`, `MessageStatusTicks`, `ReactionBar`, `ReactionPicker`, `TypingIndicator`, `MessageInput`, `TimerPicker`, `ThreadPanel`, `NewChatModal`, `GroupInfoDrawer`, `PresenceDot`, `ExpiredPlaceholder`, `ConnectionBanner` ("Reconnecting...").

## Behaviour details
- Auto-scroll to bottom on new message only if the user is already near the bottom; otherwise show a "New messages" pill.
- Scrolling to top loads older messages and keeps scroll position.
- Self-destruct messages show a small ⏱ icon and countdown (e.g. "9s") that matches `expiresAt`. On expiry, replace with an italic "This message expired" (or fade out).
- Ticks: grey single = sent, grey double = delivered, blue double = read, clock = sending, red ! = failed.
- Reaction chips under a bubble show emoji + count; highlighted if reacted by me.
- Thread: "N replies" link under the parent bubble opens the panel.
- Connection banner shows when the socket is disconnected.
- Empty states for no chats, no messages, no search results.
- Loading skeletons for the chat list and history.

## Accessibility
Keyboard: Enter sends, Shift+Enter newline. Buttons have aria-labels. Colour contrast AA. Focus rings visible.
