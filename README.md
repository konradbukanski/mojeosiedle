# Moje Osiedle Backend

Backend API for the *Moje Osiedle* mobile/web application. Provides JWT-secured endpoints for residents, announcements, events, marketplace, issue reporting, push notifications, and media uploads.

## Tech Stack

- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database & Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Storage:** Supabase Storage (media assets)
- **Push Notifications:** Firebase Cloud Messaging

## Getting Started

```bash
cd server
npm install
npm run dev
```

By default the server listens on `http://localhost:4000`.

### Available Scripts

- `npm run dev` – start the API with hot reload (`ts-node-dev`)
- `npm run build` – compile TypeScript to `dist`
- `npm start` – run the compiled JavaScript

## Environment Variables

Create a `.env` file (same directory as this README) with the following keys:

| Variable | Description |
| -------- | ----------- |
| `NODE_ENV` | `development` \\| `production` |
| `APP_ENV` | Custom environment label (e.g. `local`, `staging`) |
| `PORT` | Port to listen on (default `4000`) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key (for public operations) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (required for admin queries) |
| `SUPABASE_JWT_SECRET` | Supabase JWT secret – used to verify access tokens |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name for media (default `media`) |
| `FIREBASE_PROJECT_ID` | Firebase project id for FCM |
| `FIREBASE_CLIENT_EMAIL` | Service account client email |
| `FIREBASE_PRIVATE_KEY` | Service account private key (escape newlines as `\n`) |
| `MEDIA_MAX_FILE_SIZE_MB` | Maximum upload size in MB (default `10`) |
| `ENABLE_MODERATION_WORKFLOWS` | Toggle moderation flow (`true`/`false`) |

## Supabase Setup

1. Create a Supabase project and enable **Email + Password** auth.
2. Run `supabase/schema.sql` in the SQL editor to create tables, indexes, and triggers.
3. Create a storage bucket named `media` (or match `SUPABASE_STORAGE_BUCKET`).
4. Configure storage policies to allow uploads via signed URLs only.
5. Configure RLS policies according to your deployment (sample policies TBD).

### Firebase Cloud Messaging

Create a Firebase service account with the `Firebase Admin` role and supply its credentials via environment variables. Residents register FCM tokens using `POST /api/push-tokens`; moderators can broadcast via `POST /api/notifications/send`.

## API Overview

| Endpoint | Description |
| -------- | ----------- |
| `POST /api/auth/register` | Create Supabase auth user + resident profile |
| `GET /api/profile/me` | Fetch current resident profile |
| `PATCH /api/profile/me` | Update profile details |
| `GET /api/announcements` | List announcements (supports filters & pagination) |
| `POST /api/announcements` | Create announcement (moderation pending) |
| `PATCH /api/announcements/:id/status` | Moderator approval/rejection |
| `GET /api/events` | List events |
| `POST /api/events` | Create new event |
| `POST /api/events/:id/register` | RSVP to an event |
| `GET /api/marketplace` | List marketplace items |
| `POST /api/marketplace` | Add marketplace listing |
| `GET /api/shops` | List shops in estate |
| `POST /api/issues` | Report maintenance issue |
| `POST /api/media/presign` | Get presigned URL for uploads |
| `POST /api/push-tokens` | Register device token |
| `POST /api/notifications/send` | Dispatch push notification (moderators) |

All endpoints (except health check and registration) require a valid Supabase JWT sent via `Authorization: Bearer <token>`.

## Frontend Integration Notes

- Replace mock data in the React app with `fetch` calls against `/api/...`.
- Obtain Supabase session tokens on the client (e.g. using Supabase JS) and forward them to the backend.
- Media upload flow:
  1. Call `POST /api/media/presign` with file metadata.
  2. Upload to Supabase Storage using the returned signed URL.
  3. Pass the returned `asset.id` in the entity creation request (`mediaIds`).
- Moderation: new announcements, events, marketplace items, and shops default to `pending`. Moderators approve via the dedicated status endpoints.

## Testing

Automated tests are not yet implemented. Suggested next steps:

- Add request/response contract tests (Vitest, Supertest).
- Mock Supabase using a local Postgres or Supabase emulator.
- Add linting (ESLint, Prettier).

## Deployment

- Build with `npm run build` and deploy the `dist` folder.
- Provide environment variables via your hosting platform (Railway, Render, Fly.io, etc.).
- Ensure HTTPS termination for secure JWT transport.

