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
- **Deployment**: DigitalOcean Droplet ($6/mo) + Nginx + PM2
- **Domain**: `sysanalyst.dev` (Cloudflare DNS + Let's Encrypt SSL)

## Getting Started

### Prerequisites

- Node.js 20+
- A Google Gemini API key ([get one free](https://makersuite.google.com/app/apikey))
- A Supabase project ([sign up free](https://supabase.com))
- A Google Cloud project with Drive API enabled (for Google Drive feature)

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
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
5. Run the database migrations in your Supabase SQL Editor, in order:
   ```
   supabase-setup.sql → supabase-v0.3.sql → supabase-v0.3.1.sql → supabase-v0.4.sql
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000)

## Features

1. **Guided Conversation Analysis** — Step-by-step prompts that walk you through describing your idea
2. **Directory Snapshot Analyser** — Seraphina reads your folder structure (names only) and suggests improvements
3. **Google Drive Analyser** — Connect your Drive and analyse its folder structure (OAuth, read-only)
4. **Structured Visual Output** — Analysis rendered as clear, scannable cards
5. **Analysis Mode Selector** — Choose between "Analyse my MVP", "Clarify my idea", "What should I build next?", "Review my architecture"
6. **Saved Analyses Dashboard** — Access your previous analyses anytime
7. **User Preferences** — Customise tone, depth, risk tolerance, architecture style, and agent name

## Project Structure

```
src/
├── app/              # Next.js pages and API routes
│   ├── chat/         # Guided conversation interface
│   ├── directory/    # Directory snapshot analyser
│   ├── dashboard/    # Saved analyses
│   ├── settings/     # User preferences
│   └── api/          # Backend endpoints
├── components/       # React components
├── lib/              # LLM service, prompts, types, storage, hooks
└── config/           # Analysis mode definitions
```

## Deployment

The app runs on a DigitalOcean Droplet ($6/mo) with Nginx as a reverse proxy and PM2 as the process manager.

### Routine deployment (after first-time setup)

```bash
# SSH into the server
ssh seraphina@<SERVER_IP>

# Pull latest changes, rebuild, restart
cd ~/seraphina-agent
git pull
npm install
npm run build
pm2 restart seraphina
```

### First-time server setup

1. Provision Ubuntu 22.04 Droplet on DigitalOcean
2. Create non-root deploy user (`adduser seraphina`), copy SSH keys, disable root SSH login
3. Install Node.js 20 (`nodesource` repo), PM2 (`npm install -g pm2`), Nginx
4. Authenticate GitHub CLI (`gh auth login`) and clone the repo
5. Add `.env.local` with all environment variables
6. Build the app (`npm run build`)
7. Start with PM2:
   ```bash
   pm2 start npm --name "seraphina" -- start
   pm2 save && pm2 startup
   ```
8. Configure Nginx as reverse proxy (port 80/443 → 3000)
9. Point `sysanalyst.dev` DNS on Cloudflare to Droplet IP
10. Issue SSL certificate with Certbot (Let's Encrypt)

See [RUNBOOK.md](./RUNBOOK.md) for the full step-by-step log.

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
