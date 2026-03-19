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
1. Set tone to **gentle** -> look for: encouraging phrases, "you're on the right track", celebrating wins
2. Set tone to **blunt** -> look for: direct language, "this won't work", no pleasantries

**Depth test — run the same analysis 2x:**
1. Set depth to **beginner** -> look for: analogies, plain English, no jargon
2. Set depth to **expert** -> look for: technical terms used freely, trade-off discussion

**Risk test — run the same analysis 2x:**
1. Set risk to **conservative** -> look for: long Risks section, many warnings
2. Set risk to **aggressive** -> look for: short Risks section, focus on Next Steps

**Architecture test — run the same analysis 2x:**
1. Set architecture to **monolith** -> look for: "keep it simple", pushback on splitting
2. Set architecture to **api-first** -> look for: service boundaries, API specs

---

## Session 5 — 2026-02-21: v0.3.1 Custom Agent Name + Domain + Deployment Planning

### What Was Done
- Implemented custom agent name feature across entire stack (11 files modified, 2 new)
- Added `agent_name` column to `user_preferences` (migration: `supabase-v0.3.1.sql`)
- Added `agent_name` to types, preferences CRUD, and settings UI
- Created `useAgentName()` hook (`src/lib/hooks.ts`) for reusable name access
- Converted static `SERAPHINA_SYSTEM_PROMPT` to `buildSystemPrompt(agentName)` function
- Updated LLM service, both API routes, ChatInterface, DirectoryAnalyser, and Sidebar to use dynamic name
- Updated layout.tsx metadata for `sysanalyst.dev` domain with OpenGraph tags
- Purchased `sysanalyst.dev` domain on Cloudflare
- Decided on DigitalOcean Droplet ($6/mo) for deployment hosting
- Added GitHub release convention to CLAUDE.md
- Created retroactive GitHub releases for v0.1, v0.2, v0.3
- Created v0.3.1 release

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Hosting | DigitalOcean Droplet ($6/mo) | Cheapest option with full control, no commercial-use restrictions (unlike Vercel Hobby), predictable billing (unlike AWS) |
| Domain registrar | Cloudflare | Owner already uses it, good DNS management, free SSL |
| Not Vercel | Hobby tier restricts commercial use; Pro is $20/mo | Need Stripe paywall from day one, can't use free tier commercially |
| Not AWS | Unpredictable billing, overwhelming dashboard | Overkill for current scale, DigitalOcean simpler |
| Upgrade path | Bigger droplet -> DO App Platform -> AWS | Migrate when hitting ~200+ concurrent users or ~1-2k MRR |
| GitHub releases | Tag every version with `gh release create` | Provides clear version history, makes it easy to roll back, professional habit |

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| `body` variable scoped inside `try` block, not accessible in `catch` | Moved `agentName` to `let` declaration before `try` block |

---

## Session 6 — 2026-02-22: v0.4 Google Drive Integration + Roadmap Update

### What Was Done
- Updated ROADMAP.md: v0.4 scoped to Google Drive only; added v0.5 (deployment + SEO/marketing); added v0.6 (UI redesign); Dropbox/OneDrive moved to Future
- Created dedicated Google business account (`<PROJECT_GOOGLE_ACCOUNT>`) for Cloud Console
- Set up Google Cloud Console project (`sysanalyst-agent`), enabled Drive API, configured OAuth consent screen with `drive.readonly` scope
- Created OAuth 2.0 credentials (Client ID + Secret)
- Built full Google Drive integration: OAuth flow, token storage, folder tree fetching, analysis, disconnect
- Created `supabase-v0.4.sql` migration (google_drive_tokens table + RLS)
- All features tested and confirmed working end to end (including on a dense Drive structure)
- Added dependency hygiene and stale cache conventions to CLAUDE.md
- Added `npm audit` pre-deployment step to ROADMAP.md v0.5

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Google Drive only for v0.4 | Deferred Dropbox/OneDrive | Ship one integration well; others can follow |
| SEO/marketing at v0.5 | Before monetisation | Build traffic before the paywall goes live |
| UI redesign at v0.6 | After deployment | Ship first, redesign second |
| Tokens stored in Supabase | `google_drive_tokens` table with RLS | Consistent with existing storage pattern |
| All Drive API calls server-side | API routes only | Client never sees raw tokens |

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| `.env.local` not found on new laptop | File not committed (gitignored) -- must be recreated manually on each machine |
| `EXT_PUBLIC_SUPABASE_URL` typo | Missing `N` from `NEXT_` prefix -- spotted by reading the file |
| Drive API 403 error after OAuth | Google Drive API wasn't enabled in Cloud Console -- enabled via Library |
| Stale cache errors | `rm -rf .next && npm run dev` |

---

## Session 7 — 2026-02-22: v0.4.1 Bug fixes + Pre-launch Planning

### What Was Done
- Fixed settings save bug: `agent_name` column was missing from `user_preferences` table -- ran `supabase-v0.3.1.sql` migration
- Fixed sidebar not updating after agent name save -- added `router.refresh()` after successful save
- Identified pre-launch checklist: deployment, landing page, Google OAuth app verification
- Noted Google Drive `drive.readonly` scope may require Google security review (4-6 weeks)

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Sidebar refresh after save | `router.refresh()` after 1s | Simplest fix without global state refactor |
| Pre-launch order | Deploy -> landing page -> Google verification -> launch | Can't onboard users without deployment; Google review runs in parallel |

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| Settings save failing silently | `agent_name` column missing from Supabase -- v0.3.1 migration not run on this project |
| Sidebar not updating after name change | `useAgentName` only fetches on mount -- fixed with `router.refresh()` post-save |

---

## Session 8 — 2026-02-25: v0.5 DigitalOcean Deployment

### What Was Done
- Fixed two ESLint build errors blocking `npm run build`:
  - `route.ts`: split destructuring -- `refresh_token` and `expires_at` are never reassigned, changed to `const`; `access_token` kept as `let` (reassigned on token refresh)
  - `AuthGuard.tsx`: moved all `useState` hooks above the early return for `/` (React hooks rules-of-hooks violation)
- Provisioned DigitalOcean Droplet: Ubuntu 22.04, $6/mo, London region (`lon1`), IP `<SERVER_IP>`
- Updated server (`apt update && apt upgrade`) -- kept local `sshd_config` when prompted
- Installed Node.js 20 via NodeSource repo, PM2 globally, Nginx
- Created non-root deploy user `seraphina`:
  - `adduser seraphina` + `usermod -aG sudo seraphina`
  - Copied SSH keys: `rsync --archive --chown=seraphina:seraphina ~/.ssh /home/seraphina`
  - Verified SSH login as `seraphina` before proceeding
  - Disabled root SSH login (`PermitRootLogin no` in `sshd_config`)
  - Verified root SSH is blocked
- Authenticated GitHub CLI (`gh auth login`) as deploy user
- Cloned repo: `gh repo clone Seraph2000/seraphina-agent`
- Installed dependencies (`npm install`) and created `.env.local` from local copy

### Next Steps (remaining v0.5 work)
- `npm run build` on the server (after pushing ESLint fixes)
- Start app with PM2 (`pm2 start npm --name "seraphina" -- start && pm2 save && pm2 startup`)
- Configure Nginx reverse proxy (port 80/443 -> 3000)
- Point `sysanalyst.dev` DNS on Cloudflare to Droplet IP `<SERVER_IP>`
- Issue SSL certificate with Certbot (Let's Encrypt)

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Non-root deploy user | `seraphina` | Security best practice -- root SSH disabled after setup |
| Keep local sshd_config | Local version | Custom SSH config already hardened; package version would overwrite it |
| London region | `lon1` | Closest to target audience (UK-based founder) |

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| ESLint `prefer-const` on `refresh_token`, `expires_at` | Split destructuring -- kept `access_token` as `let`, others as `const` |
| React `rules-of-hooks` in AuthGuard | Moved all `useState` calls above the early return |
| `sshd_config` upgrade prompt during `apt upgrade` | Chose "keep local version" -- preserves SSH hardening |

---

## Email Infrastructure Reference

### Overview
- **Domain**: `sysanalyst.dev` — hosted on Cloudflare
- **Outbound email (transactional)**: Resend API — sends magic link emails via Supabase
- **Sender address**: `noreply@sysanalyst.dev` / display name `Seraphina`
- **Resend account**: signed up with `<PROJECT_GOOGLE_ACCOUNT>`
- **Inbound/contact email**: `hello@sysanalyst.dev` — NOT YET SET UP (pre-launch task)
- **Privacy email**: `privacy@sysanalyst.dev` — NOT YET SET UP (pre-launch task, referenced in Privacy Policy)

### What's working
- Magic link emails send successfully via Resend API integration in Supabase
- `sysanalyst.dev` domain is verified in Resend — additional sender addresses can be added without re-verification

### Setting up hello@ and privacy@ (pre-launch)

Use **Cloudflare Email Routing** (free) — domain is already on Cloudflare:

1. Log in to Cloudflare dashboard → select `sysanalyst.dev` → Email → Email Routing
2. Enable Email Routing (Cloudflare will add MX records automatically)
3. Add custom address: `hello@sysanalyst.dev` → destination: your personal Gmail
4. Add custom address: `privacy@sysanalyst.dev` → destination: your personal Gmail (or a separate inbox for GDPR hygiene)
5. Verify the destination address when prompted (Cloudflare sends a confirmation email)
- Note: check Resend's SPF/DKIM DNS records don't conflict — Cloudflare usually handles this gracefully but worth checking

### SMTP history (for reference)
- Attempted Supabase SMTP via Resend (`smtp.resend.com`, port 465 then 587) — failed silently
- Switched to Resend API approach — this is what works and what is currently in use

---

## Deployment Reference

### Server Details
- **Provider**: DigitalOcean
- **Droplet**: $6/mo, Ubuntu 22.04, 1 vCPU / 1GB RAM, London (`lon1`)
- **IP**: `<SERVER_IP>`
- **Deploy user**: `seraphina`
- **App directory**: `~/seraphina-agent`
- **Process manager**: PM2 (app name: `seraphina`)
- **Web server**: Nginx (reverse proxy -> port 3000)
- **Domain**: `sysanalyst.dev` (Cloudflare DNS)
- **SSL**: Let's Encrypt via Certbot

### Routine Deployment

```bash
ssh seraphina@<SERVER_IP>
cd ~/seraphina-agent
git pull
npm install
npm run build
pm2 restart seraphina
```

### PM2 Commands

```bash
pm2 status              # check app is running
pm2 logs seraphina      # tail logs
pm2 restart seraphina   # restart after deploy
pm2 save                # persist process list across reboots
```

### Nginx Config Location
`/etc/nginx/sites-available/seraphina`

### SSL Renewal
Certbot auto-renews. Manual renew: `sudo certbot renew`

---

## Session 9 — 2026-03-19: v0.5 Completion + npm audit

### What Was Done
- Confirmed Resend API integration working and login verified end-to-end on `https://sysanalyst.dev`
- Confirmed v0.5 GitHub release cut
- Ran `npm audit` — 7 vulnerabilities found (1 moderate, 6 high)
- Ran `npm audit fix` — cleared ajv, flatted, minimatch (all dev-only/build tooling)
- Assessed remaining 4 high vulnerabilities:
  - `glob` in `eslint-config-next` — dev-only ESLint tooling, not in running server
  - `next` 14.x CVEs (HTTP smuggling, Image Optimizer DoS, RSC DoS, disk cache) — not applicable: app uses no rewrites, no next/image, no remotePatterns
- Updated `package.json` version to `0.5.0`
- Ticked npm audit ROADMAP checkbox; added Next.js 15 upgrade note to Future section

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Don't force-upgrade Next.js to 15 | Deferred | Breaking change; affected CVEs don't apply to this app's feature set. Track in Future. |

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| Node v18 engine warnings during audit fix | Local machine runs v18, server runs v20. Warnings are non-blocking; no action needed. |

---

## Session Template

Copy this for future sessions:

```markdown
## Session N -- YYYY-MM-DD: Title

### What Was Done
-

### Key Decisions

| Decision | Choice | Reasoning |
|----------|--------|-----------|

### Troubleshooting

| Issue | Resolution |
|-------|------------|
```

## Session 8 continued — Certbot SSL + SMTP troubleshooting

### What Was Done (continued)
- Completed all remaining v0.5 deployment steps:
  - Built app on server (`npm run build`) after pushing ESLint fixes
  - Started app with PM2, saved process list, registered systemd startup script
  - Configured Nginx reverse proxy (port 80/443 -> 3000)
  - Added A records in Cloudflare (DNS only, grey cloud) for `@` and `www` -> `<SERVER_IP>`
  - Issued SSL certificate with Certbot (Let's Encrypt): `sudo certbot --nginx -d sysanalyst.dev -d www.sysanalyst.dev`
  - Site confirmed live at `https://sysanalyst.dev`
- Identified login issue: magic link redirecting to localhost instead of sysanalyst.dev
  - Fixed Supabase Site URL: Authentication -> URL Configuration -> `https://sysanalyst.dev`
  - Added redirect URL: `https://sysanalyst.dev/**`
- Hit Supabase free tier email rate limit (3 emails/hour, shared across all users)
- Set up Resend for custom SMTP to remove rate limit:
  - Signed up at resend.com with `<PROJECT_GOOGLE_ACCOUNT>`
  - Added and verified `sysanalyst.dev` domain (eu-west-1, auto-configured DNS via Cloudflare)
  - Created API key (full access)
  - Configured Supabase SMTP: host `smtp.resend.com`, port `465`, username `resend`
  - Sender: `noreply@sysanalyst.dev` / `Seraphina`
- SMTP connection not working -- Resend shows no incoming requests from Supabase
- Tried port 587 -- no change
- Next session: switch from SMTP to Resend API approach

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| Magic link redirects to localhost after deployment | Updated Supabase Site URL to `https://sysanalyst.dev` and added redirect URL |
| Supabase free tier rate limit (3 emails/hour) | Setting up Resend custom SMTP (in progress) |
| SMTP connection failing silently | Supabase not reaching Resend -- switching to Resend API approach next session |
| Duplicate PM2 processes | `pm2 delete all` then restart fresh |
| Cloudflare DNS proxy must be off for Certbot | Set to DNS only (grey cloud) during cert issuance |

### Next Session
- Implement Resend API integration to bypass Supabase SMTP issues
- Verify login works end-to-end on `https://sysanalyst.dev`
- Commit all docs and cut v0.5 GitHub release
