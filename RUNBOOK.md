# Seraphina — Runbook

A running log of work done, decisions made, and issues encountered during development.

---

## Session 1 — 2026-02-13: Project Inception & Scaffolding

### What Was Done
- Discussed product concept, target audience, and feature set
- Defined 5 MVP features:
  1. Guided Conversation Analysis
  2. Directory Snapshot Analyser
  3. Structured Visual Output (Cards)
  4. Analysis Mode Selector
  5. Saved Analyses Dashboard
- Chose tech stack: Next.js 14 + Tailwind CSS + Google Gemini API
- Scaffolded Next.js project with TypeScript and Tailwind
- Installed `@google/generative-ai` SDK
- Created ROADMAP.md, README.md, RUNBOOK.md, CLAUDE.md

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| LLM Provider | Google Gemini | Free tier for development, cost-effective at scale. Service layer allows easy swap to Claude later. |
| Frontend Framework | Next.js 14 (App Router) | React-based, Vercel-ready, good for adding auth/payments later |
| Storage (MVP) | localStorage | Zero infrastructure cost, sufficient for MVP. Upgrade to Supabase in v0.2 |
| Auth (MVP) | Skipped | Not needed for MVP. Passwordless magic links planned for v0.2 |
| Directory Access | File System Access API (names only) | Privacy-first — only reads folder/file names, not contents. Easier trust sell. |
| GUI Approach | Guided conversation | Target users are disorganised founders — a blank text box would overwhelm them |

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| `create-next-app` rejected uppercase directory name | Created in subdirectory `seraphina-app` then moved files to root |
| Node.js v18 vs v20 warning from create-next-app@16 | Used `create-next-app@14` which supports Node 18 |

---

## Session 2 — 2026-02-14: Full MVP Build & Testing

### What Was Done
- Built complete LLM service layer (`lib/gemini.ts`) with swappable provider
- Created Seraphina's system prompt with personality + all 5 analysis modules
- Defined 4 analysis modes with guided conversation steps
- Built all UI components: ChatInterface, DirectoryAnalyser, AnalysisOutput, ModeSelector, Sidebar
- Built 2 API routes (`/api/analyse`, `/api/directory`)
- Built all 3 pages: `/chat`, `/directory`, `/dashboard`
- Implemented localStorage save/load/delete for both analysis types
- Fixed dashboard to show both chat analyses and directory analyses
- Added friendly rate limit error messages
- Added form field id/name for accessibility
- All 5 MVP features confirmed working end-to-end

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Gemini Model | `gemini-2.5-flash` | `gemini-1.5-flash` retired. Tried `gemini-2.0-flash` (rate limited), `gemini-2.5-flash-lite` (503 errors). `gemini-2.5-flash` is stable and free tier. |
| SDK | `@google/generative-ai` v0.24.1 | Works with `gemini-2.5-flash`. May need to upgrade to `@google/genai` for future models. |

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| `gemini-1.5-flash` 404 — model retired | Switched to `gemini-2.5-flash` |
| `gemini-2.0-flash` 429 rate limit (limit: 0) | Free tier quota exhausted for that model. Switched models. |
| `gemini-2.5-flash-lite` 503 Service Unavailable | High demand. Switched to `gemini-2.5-flash`. |
| Server-side code not hot-reloading model change | `.next` cache retained old compiled code. Fixed by deleting `.next` and restarting dev server. |
| ESLint `no-explicit-any` on File System Access API | Added eslint-disable comments — API lacks full TS type definitions. |
| Directory analyses not showing on dashboard | Dashboard only loaded chat analyses. Updated to load and display both types. |
| Port 3000 in use | Next.js auto-fell back to port 3001. Later freed up and ran on 3000. |

---

## Session 3 — 2026-02-14: v0.2 Auth & Persistence

### What Was Done
- Installed `@supabase/supabase-js` and `@supabase/ssr` dependencies
- Created Supabase browser client factory (`lib/supabase.ts`)
- Created AuthProvider context (`components/AuthProvider.tsx`) — provides user, session, loading, signOut
- Created AuthGuard component (`components/AuthGuard.tsx`) — magic link login UI + sign-out button
- Rewrote storage layer (`lib/storage.ts`) — all CRUD operations now go through Supabase instead of localStorage
- Updated types to snake_case fields (`raw_markdown`, `created_at`) to match Supabase columns
- Updated ChatInterface and DirectoryAnalyser to use auth context and async saves
- Updated Dashboard to load from Supabase with loading state
- Updated layout.tsx to wrap app with AuthProvider and AuthGuard
- Created `supabase-setup.sql` migration script (2 tables + RLS policies)
- Updated `.env.local.example` with Supabase env vars
- User set up Supabase project, ran SQL migration, tested end-to-end
- All features confirmed working: login, analysis save, directory save, dashboard, delete, persistence

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Auth method | Passwordless magic links | No passwords to manage, simple UX, Supabase handles email delivery |
| Database | Supabase PostgreSQL | Free tier, built-in auth, RLS for security, real-time capable for future |
| Type field naming | snake_case (raw_markdown) | Matches Supabase column naming convention, avoids mapping layer |
| Session management | @supabase/ssr cookies | Survives browser close, works with SSR |

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| User couldn't find Supabase anon key | Located under Settings > API > Legacy anon key tab (not default view) |
| Webpack cache warnings after install | Deleted `.next` directory and restarted dev server |
| Node.js 18 deprecation warning from @supabase/supabase-js | Non-blocking warning; upgrade to Node 20+ recommended but not required |

---

## Session 4 — 2026-02-14: v0.3 Customisation

### What Was Done
- Added user preferences system: tone, technical depth, risk tolerance, architecture style
- Created `user_preferences` Supabase table with RLS (migration: `supabase-v0.3.sql`)
- Created preferences CRUD helper (`lib/preferences.ts`)
- Built preferences injection into prompts (`buildPreferencesBlock()` in `prompts.ts`)
- Updated `gemini.ts`, both API routes, ChatInterface, and DirectoryAnalyser to pass preferences
- Created Settings page (`/settings`) with radio-group UI for all 4 dimensions
- Added Settings link to Sidebar navigation
- Updated Sidebar version to v0.3
- Updated ROADMAP.md (v0.3 checkboxes ticked), CLAUDE.md, RUNBOOK.md

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Preference injection point | User prompt (not system prompt) | Keeps system prompt static, preferences dynamic per-request |
| Storage | Supabase `user_preferences` table | One row per user, upsert on save. Consistent with v0.2 pattern. |
| UI pattern | Radio-group cards | Visual, touch-friendly, clear descriptions for non-technical users |
| Default tone | Gentle | Matches Seraphina's core personality, least surprising for new users |

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| Preference differences hard to notice | Strengthened prompt instructions with IMPORTANT/MUST prefixes |
| Analysis cards showing raw markdown | Added react-markdown + @tailwindcss/typography for proper rendering |

### Testing Preferences (Manual QA Checklist)

Use the same short input for all tests (e.g. "I'm building a task manager app for freelancers") so the only variable is the preference setting.

**Tone test — run the same analysis 2x:**
1. Set tone to **gentle** → look for: encouraging phrases, "you're on the right track", celebrating wins
2. Set tone to **blunt** → look for: direct language, "this won't work", no pleasantries

**Depth test — run the same analysis 2x:**
1. Set depth to **beginner** → look for: analogies, plain English, no jargon
2. Set depth to **expert** → look for: technical terms used freely, trade-off discussion

**Risk test — run the same analysis 2x:**
1. Set risk to **conservative** → look for: long Risks section, many warnings
2. Set risk to **aggressive** → look for: short Risks section, focus on Next Steps

**Architecture test — run the same analysis 2x:**
1. Set architecture to **monolith** → look for: "keep it simple", pushback on splitting
2. Set architecture to **api-first** → look for: service boundaries, API specs

---

## Session Template

Copy this for future sessions:

```markdown
## Session N — YYYY-MM-DD: Title

### What Was Done
-

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|

### Troubleshooting

| Issue | Resolution |
|-------|------------|
```
