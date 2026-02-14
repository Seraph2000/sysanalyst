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
