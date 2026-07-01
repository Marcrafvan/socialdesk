# YouTube Module

## Purpose

The YouTube module owns YouTube OAuth, channel profile fetch, and video upload. It uses the official `googleapis` SDK for OAuth2 and YouTube Data API v3 calls.

## Public Routes

Mounted from `src/app.js` at `/api/auth/youtube`.

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/oauth` | Redirects to Google OAuth consent screen. Requires `userId`. |
| `GET` | `/callback` | Exchanges the OAuth code, saves the channel and token, then returns JSON. |
| `POST` | `/upload` | Uploads a video to YouTube. Requires `accessToken`, `title`, and file upload. Multipart fields: `file`, `accessToken`, `title`, `description` (optional), `tags` (optional, comma-separated), `privacyStatus` (optional: `public`, `private`, `unlisted`). |

## Module API

- `youtube.routes.js` exposes the Express router.
- `youtube.controller.js` owns request validation and response behavior.
- `youtube.service.js` owns Google OAuth2 client setup, token exchange, channel profile fetch, and video upload via the YouTube Data API v3.

## Data And Dependencies

- External API: YouTube Data API v3 (`googleapis` SDK)
- Shared modules: Social Connections
- Tables touched through Social Connections: `platforms`, `social_accounts`, `oauth_tokens`
- Environment variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `YOUTUBE_REDIRECT_URI`

## Runtime Contracts

The OAuth callback returns JSON rather than redirecting. Google tokens include a `refresh_token` (only returned on first consent — `prompt: "consent"` is set to force it on every auth) and an `expiry_date` (milliseconds), which are stored as-is in `oauth_tokens`. The `platforms` table must have a row with `code = 'youtube'` before the callback can succeed.
