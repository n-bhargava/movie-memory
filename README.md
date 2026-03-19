# Movie Memory

A full-stack web application built with Next.js, Prisma, PostgreSQL, Google OAuth, and Groq AI.

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL 15+
- A Google OAuth application (see below)
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository

```bash
git clone https://github.com/n-bhargava/movie-memory.git
cd movie-memory
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up required environment variables

Create a `.env` file in the project root:

```
DATABASE_URL="postgresql://<your-mac-username>@localhost:5432/moviememory"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"

GROQ_API_KEY="your-groq-api-key"

```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console OAuth credentials |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console OAuth credentials |
| `NEXTAUTH_SECRET` | Random secret for session encryption |
| `NEXTAUTH_URL` | Base URL of the app (http://localhost:3000 in dev) |
| `GROQ_API_KEY` | API key from console.groq.com |

---

To generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Set up the database (database migration)

```bash
# create the database
createdb moviememory

# run migrations
npx prisma migrate dev

# generate Prisma client
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture Overview
 
### Tech Stack
 
- **Next.js 15** (App Router) — full-stack framework handling both frontend and API routes. Server components are used for data fetching and auth checks; client components are used only where interactivity is needed.
- **TypeScript** — end-to-end type safety across the frontend, API routes, and database layer
- **TailwindCSS + shadcn/ui** — utility-first styling with accessible, unstyled primitives
- **PostgreSQL + Prisma** — relational database with a type-safe ORM. Prisma v7 is used with the `@prisma/adapter-pg` driver adapter.
- **NextAuth v5 (beta)** — authentication with Google OAuth, using the Prisma adapter to persist users, accounts, and sessions
- **Groq SDK** — fast LLM inference (llama3-8b-8192) for movie fact generation, used as a drop-in replacement for OpenAI
 
### Project Structure
 
```
app/
  page.tsx                  # Landing page (unauthenticated)
  dashboard/page.tsx        # Main dashboard (authenticated)
  onboarding/page.tsx       # First-time user onboarding
  api/
    auth/[...nextauth]/     # NextAuth catch-all route handler
    movie/route.ts          # POST: save/update favorite movie
    fact/route.ts           # GET: fetch or generate movie fact
components/
  SignInButton.tsx           # Google OAuth sign-in (client)
  SignOutButton.tsx          # Sign-out button (client)
  OnboardingForm.tsx         # Movie input form (client)
  MovieFact.tsx              # Fact display + refresh (client)
lib/
  auth.ts                   # NextAuth configuration and exports
  prisma.ts                 # Prisma client singleton
types/
  next-auth.d.ts            # NextAuth Session type extension (adds user.id)
__tests__/
  fact.test.ts              # Unit tests for fact API
```
 
### Data Model
 
```
User
  ├── Account (OAuth credentials, one per user)
  ├── Session (active sessions managed by NextAuth)
  ├── Movie (one favorite movie per user)
  └── Fact[] (all generated facts, with timestamps)
```
 
**Key design decisions:**
 
- `Account` is separate from `User` so the schema can support multiple OAuth providers in the future without changes to the `User` model. The `@@unique([provider, providerAccountId])` constraint prevents duplicate account links.
- `Movie` has a `@unique` constraint on `userId` — enforcing one favorite movie per user at the database level, not just the application level. The API uses `upsert` so updating a movie is the same operation as creating one.
- `Fact` stores every generated fact with a `generatedAt` timestamp. This powers the 60-second cache window without needing a separate cache table or Redis — the facts table IS the cache. Querying for a recent fact is cheap because of the `@@index([userId, generatedAt])` index.
- Cascading deletes on all relations — deleting a user automatically cleans up their accounts, sessions, movie, and facts.
- All token fields on `Account` (`access_token`, `id_token`, `refresh_token`) are stored as `@db.Text` to handle tokens of arbitrary length.
 
### Auth Flow
 
1. Unauthenticated users land on `/` and see a "Sign in with Google" button
2. Clicking it triggers `signIn("google")` via NextAuth
3. After successful OAuth, NextAuth creates a `User`, `Account`, and `Session` in the database
4. First-time users (no `Movie` record) are redirected to `/onboarding`
5. Returning users go directly to `/dashboard`
6. All protected pages call `auth()` server-side and redirect to `/` if no session exists
7. All API routes call `auth()` and return a `401` if unauthenticated
8. All database queries are scoped to `session.user.id`, so users cannot read or modify other users' data
 
### Request Flow (Fact Generation)
 
```
Client (MovieFact.tsx)
  → GET /api/fact
    → auth() — verify session
    → prisma.movie.findUnique — get user's movie
    → prisma.fact.findFirst (within 60s) — cache check
      → HIT: return cached fact immediately
      → MISS:
        → check generationLocks Set — concurrency check
          → LOCKED: return 429
          → UNLOCKED:
            → acquire lock
            → groq.chat.completions.create — generate fact
            → prisma.fact.create — store fact
            → release lock (finally block)
            → return new fact
        → on Groq failure:
            → prisma.fact.findFirst (any age) — fallback
            → return fallback or 500
```
 
---
 
## Variant Choice
 
I chose **Variant A — Backend-Focused (Caching & Correctness)**.
 
The core of this application is an AI-powered API endpoint that calls an external service (Groq). The most interesting and failure-prone logic lives on the server (caching, concurrency, and graceful degradation). Variant A let me focus on getting that right.
 
Variant B's complexity (typed API client, optimistic UI updates, client-side cache invalidation) spans both the frontend and backend simultaneously, which means more surface area for things to go wrong and less depth in any one area. Variant A allowed me to go deep on a single, well-defined problem, which was how to make a backend endpoint correct, efficient, and resilient.
 
The specific challenges in Variant A, such as preventing duplicate LLM calls, handling partial failures, reasoning about cache windows, are closer to the kinds of problems that matter in production backend systems. These felt more valuable to demonstrate than UI state management for this particular application.
 
---

## Variant A — Backend-Focused (Caching & Correctness)

### 60-Second Cache Window

The `GET /api/fact` route checks for a `Fact` record for the current user with a `generatedAt` timestamp within the last 60 seconds. If one exists, it is returned immediately without calling Groq. If not, a new fact is generated, stored, and returned.

This means the facts table serves dual purpose — persistent storage and cache — without any additional infrastructure.

### Burst / Concurrency Protection

An in-memory `Set` called `generationLocks` tracks which `userId:movieId` combinations are currently mid-generation. If a second request comes in while generation is in progress, it immediately receives a `429` response instead of triggering a duplicate Groq call.

**Documented limitation:** This lock only works within a single Node.js process. In a horizontally scaled deployment (multiple server instances), two requests hitting different instances could both bypass the lock. The correct solution at scale would be a distributed lock using Redis (`SET NX PX`) or a database-level advisory lock.

### Failure Handling

If Groq fails (timeout, API error, empty response), the route falls back to the most recently stored fact for that user, regardless of age. If no fact has ever been generated, a user-friendly error is returned. This ensures the UI is never left empty due to a transient upstream failure.

---

## Key Tradeoffs

**In-memory lock vs. distributed lock**
The in-memory lock is simple, zero-dependency, and correct for a single-process dev environment. A Redis-based distributed lock would be correct for production but adds infrastructure complexity that isn't warranted for this exercise. The limitation is clearly documented.

**Facts table as cache vs. separate cache layer**
Using the facts table as the cache (via timestamp filtering) avoids adding Redis or a separate caching layer. The tradeoff is that the facts table grows unboundedly over time. In production, a background job would periodically prune old facts.

**Groq instead of OpenAI**
Groq provides faster inference and a free tier, which makes development iteration faster. The API interface is nearly identical to OpenAI's, so switching back would be a one-line change.

---

## What I Would Improve With 2 More Hours

1. **Fact pruning** — add a background job or cron to delete facts older than 24 hours to prevent unbounded table growth
2. **Rate limiting** — add per-user rate limiting on the fact endpoint to prevent abuse beyond what the in-memory lock provides
3. **Edit movie flow** — allow users to update their favorite movie from the dashboard without going back through onboarding
4. **Better error UI** — surface more specific error messages to the user instead of generic fallbacks
5. **Redis-based distributed lock** — replace the in-memory lock with a proper distributed lock for production correctness

---

## AI Usage

- Used Claude to scaffold the initial project structure, file layout, and boilerplate
- Used Claude to debug Prisma v7 configuration issues (new `prisma.config.ts` format, driver adapter requirements)
- Used Claude to debug NextAuth schema mismatches (missing `emailVerified`, `Session` table, `Account` token fields)
- Wrote some business logic (concurrency lock, failure handling checks) with Claude's guidance but reviewed and understood each decision
- Used Claude to generate the test file structure; fixed test assertions manually based on actual route behavior
- Used Claude to generate UI component structure and styling; made manual adjustments to match desired look and feel