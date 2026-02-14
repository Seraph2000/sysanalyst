# Seraphina — The Systems Analyst Agent

A specialised, single-role analysis agent that brings clarity to messy MVPs, half-formed ideas, and early-stage product concepts. Seraphina reads unstructured input, extracts underlying structure, and produces clean, actionable insights.

She is a **Systems Analyst**, not a general assistant.

## What Seraphina Does

- Transforms chaotic notes into structured clarity
- Reveals the underlying system behind an idea
- Identifies capabilities, gaps, risks, and assumptions
- Produces simplified architectures and next steps
- Analyses messy folder structures and suggests improvements
- Reduces cognitive load for founders and builders

## Core Analysis Modules

| Module | Purpose |
|--------|---------|
| Capability Extraction | What can the MVP currently do? |
| Intent Clarification | What is the user actually trying to build? |
| Architecture Simplification | What is the smallest coherent version? |
| Risk & Assumption Mapping | What is fragile, missing, or untested? |
| Next-Step Sequencer | What should happen in the next 48 hours? |

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **LLM**: Google Gemini API (swappable service layer)
- **Auth & Storage**: Supabase (passwordless magic links, PostgreSQL with RLS)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key ([get one free](https://makersuite.google.com/app/apikey))
- A Supabase project ([sign up free](https://supabase.com))

### Setup

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file:
   ```bash
   cp .env.local.example .env.local
   ```
4. Add your keys to `.env.local`:
   ```
   GEMINI_API_KEY=your_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
5. Run the database setup in your Supabase SQL Editor:
   ```
   Copy the contents of supabase-setup.sql and run it in Dashboard > SQL Editor
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000)

## Features (MVP)

1. **Guided Conversation Analysis** — Step-by-step prompts that walk you through describing your idea
2. **Directory Snapshot Analyser** — Let Seraphina look at your folder structure (names only) and suggest improvements
3. **Structured Visual Output** — Analysis rendered as clear, scannable cards
4. **Analysis Mode Selector** — Choose between "Analyse my MVP", "Clarify my idea", "What should I build next?", "Review my architecture"
5. **Saved Analyses Dashboard** — Access your previous analyses anytime

## Project Structure

```
src/
├── app/              # Next.js pages and API routes
│   ├── chat/         # Guided conversation interface
│   ├── directory/    # Directory snapshot analyser
│   ├── dashboard/    # Saved analyses
│   └── api/          # Backend endpoints
├── components/       # React components
├── lib/              # LLM service, prompts, types, storage
└── config/           # Analysis mode definitions
```

## Documentation

- [ROADMAP.md](./ROADMAP.md) — Full versioned product roadmap
- [RUNBOOK.md](./RUNBOOK.md) — Work log, decisions, and troubleshooting
- [CLAUDE.md](./CLAUDE.md) — AI assistant project memory

## Monetisation (Planned)

- **Standard** — £9/month: Unlimited analyses
- **Professional** — £29/month: Personalised agent tuning
- **Enterprise** — £49/month: Advanced architecture and roadmap features

## Philosophy

Seraphina is built on the principle that most AI tools focus on **execution** (writing, coding, generating), but very few focus on **thinking**. She fills this gap by offering structural clarity rather than task automation.

---

Built by Seraphina (the human, not the agent).
