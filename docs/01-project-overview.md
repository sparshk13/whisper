# 01. Project Overview

## Name
**Whisper** (working name)

## One-line pitch
A real-time messaging app like WhatsApp, with self-destructing messages, live reactions, and threaded group replies.

## Problem
Group chats get chaotic and permanent. People want chats that stay organized (threads), feel alive (reactions), and can be temporary (self-destruct).

## Target users
College students and small friend or project groups.

## Goals
1. Two or more users chat in real time with no page refresh.
2. Reliable delivery, including for users who are offline when a message is sent.
3. Message status: sent, delivered, read.
4. Three twists: self-destruct, reactions, threads.
5. The developer learns WebSockets, JWT auth, database design, and real-time state.

## Non-goals (do NOT build)
- Voice or video calls
- Status/stories
- Payments
- End-to-end encryption (mention it as future work only)
- Native mobile apps (a responsive web app is enough)
- Contact syncing with the phone

## Success criteria
- Two browser tabs logged in as different users can chat live.
- A message sent while the receiver is offline arrives (and shows "delivered") when they reconnect.
- A message with a 10-second timer disappears for both users at the right time, even if one client is closed and reopened.
- Reactions appear instantly on all connected clients of that chat.
- Replies in a group thread are grouped under the parent message.

## Scale assumption
Built for roughly 100 concurrent users on a single server. Scaling (Redis adapter) is documented but optional.
