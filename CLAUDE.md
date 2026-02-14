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
- **Deployment**: Vercel-ready
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
3. Structured Visual Output (Cards)
4. Analysis Mode Selector
5. Saved Analyses Dashboard

## Monetisation (Planned)
- £9/month — unlimited analyses
- £29/month — personalised agent tuning
- £49/month — advanced architecture and roadmap features

## Conventions
- British English spelling (analyse, colour, organisation)
- Use placeholder name "Seraphina" throughout (agent name, not the founder's real product name necessarily)
- Privacy-first: never access file contents, only structure
- Keep things simple — avoid over-engineering

## Important Files
- `ROADMAP.md` — versioned product roadmap with checkboxes
- `RUNBOOK.md` — session-by-session work log
- `src/lib/gemini.ts` — LLM service layer
- `src/lib/prompts.ts` — system prompts and personality
- `src/lib/types.ts` — TypeScript type definitions
- `src/lib/supabase.ts` — Supabase browser client factory
- `src/lib/storage.ts` — Supabase CRUD operations (analyses + directory analyses)
- `src/config/modes.ts` — analysis mode definitions
- `src/components/AuthProvider.tsx` — Auth context (user, session, signOut)
- `src/components/AuthGuard.tsx` — Login UI (magic link) + sign-out button
- `supabase-setup.sql` — Database migration (tables + RLS policies)

## GitHub
- Repo: `Seraph2000/seraphina-agent` (private)
- Remote: HTTPS via `gh auth`
