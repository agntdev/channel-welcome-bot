# Channel Welcome Bot — Bot specification

**Archetype:** community

**Voice:** professional and concise — write every user-facing message, button label, error, and empty state in this voice.

Automatically posts a configurable welcome message and chat rules as a reply under every new Telegram channel post, with admin controls for configuration and error notifications.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- Telegram channel admins
- Community moderators

## Success criteria

- Bot posts auto-reply under every new channel post
- Admin can configure reply text and toggle feature
- Error notifications sent to admin on posting failures

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open admin configuration menu
- **/set** (command, actor: user, command: /set) — Set/update auto-reply text
- **/toggle** (command, actor: user, command: /toggle) — Enable or disable auto-reply feature
- **/view** (command, actor: user, command: /view) — View current auto-reply configuration

## Flows

### Auto-reply posting
_Trigger:_ new channel post

1. Detect new post in channel
2. Check if auto-reply is enabled
3. Post configured reply as comment

_Data touched:_ Auto-reply Message, Admin settings

### Admin configuration
_Trigger:_ /set or /toggle or /view

1. Receive admin command
2. Validate admin permissions
3. Update configuration or show current settings

_Data touched:_ Auto-reply Message, Admin settings

### Error handling
_Trigger:_ posting failure

1. Detect Telegram API error
2. Log error details
3. Send notification to admin

_Data touched:_ Admin settings

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **Channel Post** _(retention: none)_ — Trigger event for auto-reply
  - fields: post_id, author, content
- **Auto-reply Message** _(retention: persistent)_ — Configurable text to post as reply
  - fields: message_text, enabled
- **Admin settings** _(retention: persistent)_ — Configuration and error notification settings
  - fields: admin_user_id, notification_enabled

## Integrations

- **Telegram** (required) — Channel post monitoring and reply posting
- **Telegram** (required) — Admin configuration interface
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Set auto-reply text
- Toggle auto-reply feature
- View current configuration
- Receive error notifications

## Notifications

- Admin notification on posting failure

## Permissions & privacy

- Bot requires permission to post and reply in the channel
- Admin user ID stored for notifications

## Edge cases

- Rate limiting preventing reply posting
- Bot lacks permissions to post in channel
- Channel post deleted before reply is sent

## Required tests

- Verify auto-reply is posted after new channel post
- Test admin commands for configuration
- Simulate posting failure and verify admin notification

## Assumptions

- Bot will be added as admin with post permissions
- Default reply text is provided
- Only one admin contact per channel
