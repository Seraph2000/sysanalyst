# Seraphina — Claude Project Memory

## Project Overview
Building "Seraphina", a specialised Systems Analyst SaaS agent that helps founders make sense of messy MVPs and ideas. Single-role identity — analyst, not general assistant.

## Owner
Seraphina (the human) — founder, non-technical but learning. Prefers clear explanations and guided decisions.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **LLM**: Google Gemini API (`gemini-2.5-flash`) via `@google/generative-ai` (chosen for free tier; service layer designed to swap to Claude API later)
- **Auth & Storage**: Supabase (passwordless magic links, PostgreSQL with RLS)
- **Supabase SDKs**: `@supabase/supabase-js` + `@supabase/ssr`
- **Deployment**: DigitalOcean Droplet ($6/mo) — Ubuntu 22.04, 1 vCPU / 1GB RAM, London (`lon1`)
- **Process Manager**: PM2 (app name: `seraphina`)
- **Web Server**: Nginx (reverse proxy, port 80/443 -> 3000)
- **Domain**: `sysanalyst.dev` (registered on Cloudflare)
- **SSL**: Let's Encrypt via Certbot
- **Language**: TypeScript

## Key Architecture Decisions
- LLM calls abstracted behind a service layer (`lib/gemini.ts`) so provider is swappable
- System prompts stored in `lib/prompts.ts` — Seraphina's personality + 5 analysis modules
- Analysis modes defined in `config/modes.ts`
- Directory analyser uses browser File System Access API (file/folder names only, never contents)
- Guided conversation approach (not blank text box) because target users are disorganised founders
- Supabase auth via magic links (passwordless) — no passwords to manage
- Row Level Security (RLS) on all tables — users can only access their own data
- Types use snake_case field names (raw_markdown, created_at) to match Supabase column conventions
- AuthProvider wraps the entire app; AuthGuard shows login screen when unauthenticated
- User preferences (tone, depth, risk, architecture style, agent name) stored in `user_preferences` table
- Preferences injected into prompts per-request via `buildPreferencesBlock()` in `prompts.ts`
- Settings page at `/settings` with radio-group UI for all 4 preference dimensions + agent name text input
- Custom agent name replaces "Seraphina" across entire UI and LLM prompts (default: "Seraphina")
- System prompt converted from static const to `buildSystemPrompt(agentName)` function
- `useAgentName()` hook in `src/lib/hooks.ts` for components that need the name

## Seraphina's Personality
- Calm, sovereign tone
- Modular, systems-oriented thinking
- Narrative clarity and structural insight
- Gentle but firm reframing
- Focus on simplicity and coherence

## 5 Analysis Modules
1. Capability Extraction
2. Intent Clarification
3. Architecture Simplification
4. Risk & Assumption Mapping
5. Next-Step Sequencer

## 8-Part Output Format
1. High-Level Summary
2. Capability Map
3. Intent Map
4. Simplified Architecture
5. Risks & Assumptions
6. Missing Pieces
7. Next-Step Sequence
8. Insight / Reframe

## MVP Features
1. Guided Conversation Analysis
2. Directory Snapshot Analyser
3. Google Drive Analyser (OAuth, read-only, folder names only)
4. Structured Visual Output (Cards)
5. Analysis Mode Selector
6. Saved Analyses Dashboard
7. User Preferences (tone, depth, risk, architecture style, agent name)

## Monetisation (Planned)
- £9/month — unlimited analyses
- £29/month — personalised agent tuning
- £49/month — advanced architecture and roadmap features

## Conventions
- British English spelling (analyse, colour, organisation)
- Default agent name is "Seraphina" but user-configurable via Settings
- Privacy-first: never access file contents, only structure
- Keep things simple — avoid over-engineering
- **Always create a GitHub release for each version** — tag the commit, write release notes summarising what changed. Use `gh release create vX.Y` after committing.
- **Always update `package.json` version** to match the current release (e.g. `"version": "0.4.1"`) — this shows in `npm run dev` output and keeps things consistent.
- **Always commit all .md files** (CLAUDE.md, RUNBOOK.md, ROADMAP.md) so project memory transfers across machines
- **Dependency hygiene**: run `npm audit` before each deployment. Fix high/critical vulnerabilities in runtime dependencies before going live. Dev-only vulnerabilities (build tools, bundlers) can be deferred but should be tracked.
- **Stale cache errors**: if the app throws unexpected errors after env or dependency changes, delete `.next` and restart the dev server (`rm -rf .next && npm run dev`).
- **Google OAuth verification**: `drive.readonly` is a sensitive scope — Google may require a security review (4-6 weeks) before the app can be used by the public. Start the verification process early, in parallel with deployment.
- **Supabase migrations**: always run all migration files in order when setting up a new environment (`supabase-setup.sql` -> `supabase-v0.3.sql` -> `supabase-v0.3.1.sql` -> `supabase-v0.4.sql`).
- **Server user**: always SSH as `seraphina` (non-root). Root SSH login is disabled.
- **React hooks**: always declare all hooks before any conditional returns — violating rules-of-hooks causes build failure in production.
- **ESLint in production build**: Next.js runs ESLint as part of `npm run build`. Fix all lint errors locally before deploying — they will block the server build.

## Important Files
- `ROADMAP.md` — versioned product roadmap with checkboxes
- `RUNBOOK.md` — session-by-session work log + deployment reference
- `src/lib/gemini.ts` — LLM service layer
- `src/lib/prompts.ts` — system prompts and personality
- `src/lib/types.ts` — TypeScript type definitions
- `src/lib/supabase.ts` — Supabase browser client factory
- `src/lib/storage.ts` — Supabase CRUD operations (analyses + directory analyses)
- `src/lib/preferences.ts` — Supabase CRUD for user preferences
- `src/config/modes.ts` — analysis mode definitions
- `src/components/AuthProvider.tsx` — Auth context (user, session, signOut)
- `src/components/AuthGuard.tsx` — Login UI (magic link) + sign-out button
- `src/app/settings/page.tsx` — Settings page (preference radio groups)
- `supabase-setup.sql` — Database migration v0.2 (tables + RLS policies)
- `supabase-v0.3.sql` — Database migration v0.3 (user_preferences table)
- `supabase-v0.3.1.sql` — Database migration v0.3.1 (agent_name column)
- `supabase-v0.4.sql` — Database migration v0.4 (google_drive_tokens table)
- `src/lib/hooks.ts` — Custom hooks (`useAgentName`)

## Privacy rule (public repo)
- **Nothing confidential or private is ever committed or pushed**: no API keys, `.env.local`, real server IPs, account logins, personal details or real user data.
- Public docs use placeholders (e.g. `<SERVER_IP>`) or the `sysanalyst.dev` hostname. Real values live in `private/` (gitignored).
- Check every staged diff before committing.

## GitHub
- Repo: `Seraph2000/seraphina-agent` (public, Apache 2.0)
- Remote: SSH via a per-repo deploy key (`~/.ssh/seraphina-agent_deploy`, set in repo-local `core.sshCommand`)
- Releases: `v0.1` (MVP), `v0.2` (auth + persistence), `v0.3` (customisation), `v0.3.1` (custom agent name + domain), `v0.4` (Google Drive), `v0.4.1` (bug fixes), `v0.5` (deployment + auth), `v0.6` (UI redesign), `v0.6.1` (SEO foundation + open-source release)

## Deployment
- **Server**: DigitalOcean Droplet, Ubuntu 22.04, $6/mo, London (`lon1`)
- **IP**: `<SERVER_IP>` (real value kept privately; SSH via the `sysanalyst.dev` hostname)
- **Deploy user**: `seraphina` (non-root, sudo access)
- **App directory**: `~/seraphina-agent`
- **Process manager**: PM2 (app name: `seraphina`)
- **Web server**: Nginx reverse proxy (port 80/443 -> 3000)
- **Domain**: `sysanalyst.dev` on Cloudflare
- **SSL**: Let's Encrypt via Certbot (auto-renews)
- **Upgrade path**: bigger droplet at ~50 users -> DO App Platform/AWS at ~200+ users

### Routine deployment
```bash
ssh seraphina@sysanalyst.dev
cd ~/seraphina-agent
git pull
npm install
npm run build
pm2 restart seraphina
```
