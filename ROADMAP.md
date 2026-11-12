# Seraphina — Systems Analyst Agent: Roadmap

## v0.1 — MVP ✓ (shipped Feb 2026)

### Core Analysis Engine
- [x]Google Gemini API integration (swappable LLM service layer)
- [x]Seraphina personality and reasoning style (system prompt)
- [x]5 analysis modules: Capability Extraction, Intent Clarification, Architecture Simplification, Risk & Assumption Mapping, Next-Step Sequencer
- [x]Structured 8-part output: Summary, Capability Map, Intent Map, Simplified Architecture, Risks & Assumptions, Missing Pieces, Next Steps, Insight/Reframe

### Guided Conversation Interface
- [x]Step-by-step guided prompts ("What are you building?", "Who is it for?", etc.)
- [x]Calm, conversational flow (not a form submission)
- [x]Analysis generated after all inputs collected

### Directory Snapshot Analyser
- [x]Browser File System Access API integration
- [x]Reads folder/file names only (no file contents)
- [x]Organisation analysis and improvement suggestions
- [x]Suggested folder structure output

### Structured Visual Output
- [x]Analysis rendered as distinct visual cards/panels
- [x]Clean, scannable layout (not a wall of text)
- [x]Each of the 8 output sections in its own card

### Analysis Mode Selector
- [x]"Analyse my MVP" mode
- [x]"Clarify my idea" mode
- [x]"What should I build next?" mode
- [x]"Review my architecture" mode
- [x]Each mode adjusts the system prompt focus

### Saved Analyses Dashboard
- [x]Analyses saved to localStorage with timestamp and title
- [x]Dashboard listing previous analyses
- [x]View full analysis on click
- [x]Delete individual analyses

---

## v0.2 — Auth & Persistence ✓ (shipped Feb 2026)

- [x]Passwordless authentication (magic links / email codes)
- [x]Supabase database integration
- [x]Cloud-saved analyses (replace localStorage)
- [x]User accounts and sessions
- [x]Cross-device access to saved analyses

---

## v0.3 — Customisation ✓ (shipped Feb 2026)

- [x]Tone settings (gentle, crisp, blunt, playful)
- [x]Technical depth slider (beginner → expert)
- [x]Risk tolerance setting (conservative → aggressive)
- [x]Preferred architecture style (API-first, agent-first, modular, monolith)
- [x]User preferences saved to profile
- [x]Settings panel in the UI

---

## v0.4 — Google Drive Integration ✓ (shipped Feb 2026)

- [x]Google Cloud Console project + OAuth 2.0 credentials
- [x]OAuth consent screen and Drive read-only scope
- [x]Connect/disconnect Google Drive from Settings page
- [x]OAuth token storage in Supabase (encrypted)
- [x]List top-level folder structure via Drive API (names only, no file contents)
- [x]Pass folder structure to Seraphina for analysis (same flow as local directory analyser)
- [x]Privacy controls: clear scope explanation, easy disconnect

---

## v0.5 — Deployment, Domain & Marketing Foundation (deployment shipped Mar 2026; marketing items ongoing)

### DigitalOcean Deployment
- [x]Provision $6/mo Droplet (Ubuntu, Node 20)
- [x]Deploy Next.js app with PM2 process manager
- [x]Nginx reverse proxy + SSL (Let's Encrypt)
- [x]Point `sysanalyst.dev` DNS (Cloudflare) to Droplet
- [x]Environment variables configured securely on server
- [x]Basic deployment runbook documented
- [x]Run `npm audit` and resolve all high/critical runtime vulnerabilities before go-live

### Pre-Launch Checklist
- [x]Landing page (`/`) with value proposition and sign-up CTA
- [x]Favicon (SVG chevron brand mark, auto-loaded by Next.js)
- [x]Basic error boundaries in place (`error.tsx` + `not-found.tsx`)
- [x]Privacy Policy page (`/privacy`) — GDPR compliant, covers email, analyses, Google Drive connection
- [x]Terms of Service page (`/terms`)
- [x]Cookie notice banner (strictly necessary cookies only, dismissible, links to Privacy Policy)
- [x]Legal links in landing page footer
- [x]v0.6 UI deployed to production — beta live at sysanalyst.dev
- [ ]Set up `hello@sysanalyst.dev` and `privacy@sysanalyst.dev` via Cloudflare Email Routing — see RUNBOOK
- [ ]Supabase magic link email template customised
- [x]Browser metadata / Open Graph tags — affects link previews in WhatsApp, iMessage, etc.
- [ ]Google OAuth app verification submitted (allow 4-6 weeks — submit ASAP)

### Brand & Marketing Collateral
- [ ]Business card design — print via Moo.com, dark card stock, cream ink, matte finish, square corners — **chosen design: D9**

  **Design principles:**
  - Landscape, 85mm × 55mm
  - URL is the hero — `sysanalyst.dev` is the largest element, the main driver
  - SERAPHINA present but mysterious — small, muted, no explanation. Makes people wonder, visit the URL, find out
  - Read order: `sysanalyst.dev` → SYSTEMS ANALYST → SERAPHINA (who?)
  - Single chevron (consistent with favicon and landing page arrow — not double)
  - Square corners on print (matches flat, no-rounded aesthetic of the app)

  **Design spec:**
  - Front: `#0D0D0D` background — single chevron `›` top-left (`#C4B89A`, opacity 60%) — `sysanalyst.dev` hero (Georgia or Space Mono bold, 18–20pt, `#F2EDE4`, vertically centred) — `SYSTEMS ANALYST` below (Space Mono, 7pt, tracking 250–300, `#C4B89A`, opacity 50%) — `SERAPHINA` below that (Space Mono, 6pt, `#C4B89A`, opacity 25%)
  - Back: *"Clarity over complexity."* centred, Georgia italic, 10pt, `#C4B89A`, opacity 50%

  **Figma steps:**
  1. Create frame: 85mm × 55mm, background `#0D0D0D`
  2. Add chevron `›`: ~14px, colour `#C4B89A`, opacity 60%, position top-left (`x: 16, y: 16`)
  3. Add text: **sysanalyst.dev** → Georgia or Space Mono, bold, 18–20pt, colour `#F2EDE4`, left-aligned, vertically centred (slightly above mid)
  4. Add text below: **SYSTEMS ANALYST** → Space Mono, 7pt, tracking 250–300, colour `#C4B89A`, opacity 50%
  5. Add text below: **SERAPHINA** → Space Mono, 6pt, tracking wide, colour `#C4B89A`, opacity 25%
  6. Duplicate frame for back → clear all elements → add one centred line: *"Clarity over complexity."* Georgia italic, 10pt, `#C4B89A`, opacity 50%, perfectly centred
  7. Export both frames as PDF (print) at 300dpi → upload to moo.com → Luxe or Premium stock → matte finish → square corners
- [ ]OG image for social link previews (matches brand aesthetic)
- [ ]Apple touch icon

### SEO Foundation
- [x]Landing page copywriting and value proposition
- [x]Meta tags, Open Graph, Twitter Card (site-wide via root layout)
- [x]`sitemap.xml` and `robots.txt`
- [x]Structured data (JSON-LD) for the landing page
- [ ]Google Search Console setup and site verified
- [ ]Core Web Vitals baseline measured

### Bootstrap Marketing
- [ ]Blog section (`/blog`) — static MDX posts, SEO-optimised
- [ ]3 launch posts: what SysAnalyst does, who it's for, how to use it
- [ ]Social proof placeholder (testimonials section, ready for real quotes)
- [ ]"Share your analysis" feature — shareable link or screenshot export
- [ ]Submit to relevant directories (Product Hunt, Indie Hackers, etc.)
- [ ]Email capture for waitlist / early access (pre-monetisation)
- [x]Plausible Analytics script added to layout (site registration on plausible.io still to do)

---

## v0.6 — UI Redesign: "Hot Off the Press" ✓ (shipped Mar 2026; v0.6.1 adds SEO foundation + open-source licence)

### Positioning
- Deliberately anti-Silicon-Valley — gritty, real, directional
- Target: founders who think in systems, outside the VC/startup hype scene
- Aesthetic inspired by: worn stencil arrows on wet tarmac, newspaper press, industrial signage

### Design Language
- [x]Dark tarmac background (`#0D0D0D`) with cream/newsprint content (`#F2EDE4`, `#C4B89A`)
- [x]Monospace body font — Georgia serif on headlines (landing page + partially in app)
- [x]Worn arrow motif as brand element — logo mark, CTAs, dividers
- [x]Subtle grain/noise texture overlay on backgrounds (landing page)
- [x]No gradients, no rounded pill buttons — flat, stamped, deliberate
- [x]Flat borders, no shadows — inner app pages use border-[#C4B89A]/10 throughout
- [x]Georgia serif headlines across Dashboard, Settings, error/404 pages

### Pages
- [x]Landing page — polished and live
- [x]App shell (sidebar, nav) restyled to match
- [x]Analysis output cards as "press sheets" — numbered, dark, gap-px grid
- [x]Settings and Dashboard restyled
- [ ]Mobile-responsive polish across all pages — deferred post-launch
- [x]Favicon — SVG chevron brand mark
- [ ]Brand icon suite — OG image, apple touch icon — deferred post-launch
- [ ]Unified branding across all tools / future products (sysanalyst.dev as the brand home) — future

---

## v0.7 — Reliability & Launch Readiness (next)

- [ ]Bring the beta back online at sysanalyst.dev and add uptime monitoring (UptimeRobot / Better Uptime free tier)
- [ ]Pin exact dependency versions and deploy with `npm ci` for reproducible server builds
- [ ]Automated tests: unit tests for `prompts.ts` (preference injection) and API route smoke tests
- [ ]CI on GitHub Actions: lint, type-check and build on every push
- [ ]Sentry error monitoring (`@sentry/nextjs`)
- [ ]OG image PNG + Apple touch icon generated from the `public/` HTML templates
- [ ]Mobile-responsive polish across all pages
- [ ]Google OAuth app verification submitted

## v0.8 — Sharing & Growth

- [ ]"Share your analysis" — read-only shareable link per analysis
- [ ]Export an analysis to Markdown / PDF
- [ ]Blog section (`/blog`) with 3 launch posts
- [ ]Upgrade Next.js 14 → 15 (React 19, async request APIs)

---

## v1.0 — Monetisation

- [ ]Stripe integration
- [ ]Free tier (limited analyses per month)
- [ ]Standard tier — £9/month: unlimited analyses
- [ ]Professional tier — £29/month: personalised agent tuning
- [ ]Enterprise tier — £49/month: advanced architecture and roadmap features
- [ ]Subscription management (upgrade, downgrade, cancel)
- [ ]Usage tracking and limits

---

## v1.5 — Personalised Agent Tuning (£29 tier)

- [ ]Seraphina learns individual user's patterns and preferences
- [ ]Adaptive analysis based on past interactions
- [ ]Custom vocabulary and domain awareness
- [ ]Persistent context across sessions
- [ ]Fine-tuned recommendations based on user's stack and style

---

## v2.0 — Advanced Architecture & Roadmap (£49 tier)

- [ ]Full architecture diagram generation
- [ ]Interactive roadmap builder
- [ ]Dependency mapping between components
- [ ]Timeline estimation for milestones
- [ ]Export to common formats (Mermaid, PlantUML, Markdown)
- [ ]Version comparison (track how architecture evolves)

---

## Future — Expansion

### Desktop App
- [ ]Electron or Tauri-based desktop application
- [ ]Full local file system access
- [ ]Deep project scanning (code structure analysis)
- [ ]Offline analysis capability

### Team Features
- [ ]Shared analyses within a team
- [ ]Collaborative annotation and comments
- [ ]Team dashboards and progress tracking
- [ ]Role-based access control

### API Access
- [ ]Public API for Seraphina analysis
- [ ]Webhook integrations
- [ ]CI/CD pipeline integration
- [ ]Custom analysis endpoints

### Infrastructure: Migrate off Supabase (self-hosted)
Supabase free tier pauses inactive projects. Long-term, replace with self-hosted equivalents on DigitalOcean.
- [ ]Upgrade droplet to $12/mo (2GB RAM) to run Postgres + Next.js comfortably
- [ ]Install and configure PostgreSQL on the droplet
- [ ]Migrate all tables and data from Supabase (analyses, directory_analyses, user_preferences, google_drive_tokens)
- [ ]Replace Supabase auth with Auth.js (NextAuth) — magic links + Google OAuth
- [ ]Rewrite AuthProvider, AuthGuard, and all API routes to use Auth.js sessions
- [ ]Rewrite storage layer (storage.ts, preferences.ts) to use raw Postgres or a lightweight ORM
- [ ]Move Row Level Security from Supabase RLS policies to application-layer middleware
- [ ]Remove @supabase/supabase-js and @supabase/ssr dependencies
- **Trigger**: do this post-launch once the product is proven, not before

### Observability & Monitoring

#### Traffic Analytics (add at launch)
- **Recommended**: Plausible Analytics ($9/mo) — privacy-first, no cookies, GDPR compliant, no consent banner needed, lightweight script
- **Alternative**: Umami (self-hosted, free) — same privacy principles but requires running on the droplet
- **Do NOT use**: Google Analytics — uses tracking cookies, conflicts with "no tracking" promise in cookie banner
- [ ]Sign up for Plausible → add script tag to `layout.tsx` → verify data flowing

#### Error Monitoring (add at launch)
- **Recommended**: Sentry (free tier — 5k errors/month) — catches unhandled exceptions, stack traces, user context
- [ ]Create Sentry project → install `@sentry/nextjs` → add DSN to `.env.local` → verify errors reporting

#### Application Logging (post-launch / at scale)
- **Current**: PM2 logs (`pm2 logs seraphina`) — sufficient for early stage
- **Near-term**: Structured logging with a lightweight library (e.g. `pino`) — write JSON logs, easier to query
- **At scale**: Ship logs to a managed platform
  - **Splunk** — enterprise-grade, powerful query language (SPL), best for compliance-heavy environments
  - **Datadog** — more developer-friendly than Splunk, unified logs + metrics + traces, $15+/mo
  - **Grafana + Loki** — open source, self-hostable, strong community
  - **Trigger**: when PM2 logs become insufficient (~Tier 3 scale) or a paying enterprise customer requires audit logs

### Scaling Plan

The current stack is intentionally minimal. Each tier below is a trigger-based upgrade — only act when the signal is clear.

#### Tier 1 — Current (0–50 users)
- Single $6/mo DigitalOcean droplet (1 vCPU / 1GB RAM)
- Supabase free tier for database and auth
- Gemini API free tier for LLM
- PM2 + Nginx on one box
- **No action needed**

#### Tier 2 — Early traction (50–200 users)
- **Trigger**: app feels slow, PM2 logs show memory pressure, or paying users complain
- Upgrade droplet to $12–24/mo (2–4GB RAM, 2 vCPU)
- Migrate off Supabase free tier → Supabase Pro ($25/mo) or self-hosted Postgres (see migration plan above)
- Add basic uptime monitoring (Better Uptime or UptimeRobot — free tier)
- Consider separating database onto its own DO droplet if memory contention is the issue

#### Tier 3 — Meaningful scale (200–1,000 users)
- **Trigger**: ~£2–5k MRR, consistent traffic, single droplet hitting limits
- Move to DigitalOcean App Platform or a managed Kubernetes cluster (DO DOKS)
- Separate database server (DO Managed Postgres — $15/mo entry)
- Add a CDN (Cloudflare is already in place — enable proxying)
- Implement a job queue for LLM calls (BullMQ + Redis) to handle concurrent analysis requests gracefully
- Consider caching frequent analysis patterns

#### Tier 4 — Serious scale (1,000+ users / enterprise)
- **Trigger**: ~£10k+ MRR or enterprise contracts requiring SLAs
- Evaluate AWS (ECS/Fargate) or GCP for managed infrastructure with autoscaling
- Dedicated Redis instance for session/cache
- Read replicas for the database
- Proper observability stack (Datadog, Sentry, or self-hosted Grafana)
- Hire or contract a DevOps engineer — don't manage this alone

#### LLM cost watch
- Gemini API is currently free tier. At scale, LLM costs become real.
- Monitor tokens per analysis × monthly analyses
- Trigger: if LLM costs exceed 20% of MRR, evaluate prompt optimisation, response caching, or provider swap (the service layer in `lib/gemini.ts` is already designed for this)

### Dependency Upgrades
- [ ]Upgrade Next.js 14 → 15 (breaking change — requires React 19 + async request API migration). Currently safe to defer: rewrites, next/image, and RSC features that carry the known CVEs are not used.

### Additional Cloud Storage (post v0.4)
- [ ]Dropbox connection (OAuth) — folder structure analysis
- [ ]OneDrive connection (OAuth) — folder structure analysis
- [ ]Cross-provider reorganisation suggestions

### Integrations
- [ ]Notion integration
- [ ]Linear / Jira integration
- [ ]Slack bot
- [ ]GitHub repository analysis
- [ ]VS Code extension

### Advanced Analysis
- [ ]Multi-project portfolio analysis
- [ ]Competitive landscape mapping
- [ ]Technology stack recommendations
- [ ]Cost estimation and resource planning
- [ ]Market fit scoring

---

## Funding Strategy

### Recommended approach: Bootstrap first

- Infrastructure cost is negligible ($6/mo droplet, free-tier APIs)
- Revenue model is simple and proven — even 50 Standard users = £450/mo; 200 = £1,800/mo with near-zero COGS
- Target market (founders/builders) discovers tools organically — Product Hunt, Indie Hackers, X — no ad spend needed to reach them
- Solo operator: no team to pay, no burn rate pressure
- Bootstrapping means 100% ownership and building on your own terms

### When to reconsider outside funding

- Strong early traction + want to hire to accelerate
- Enterprise/team features (v2.0+) require serious sales motion
- Strategic investor (e.g. Entrepreneur First, founder-focused fund) brings network, not just capital
- Organic growth past ~£5k MRR and a clear case for acceleration

### Why seed/VC doesn't fit right now

- VC requires 100x returns — needs a much larger addressable market
- Seed funding introduces growth metrics and investor timelines before product-market fit is established
- The right scale for this product is indie SaaS profitability, not unicorn trajectory

---

## Design Principles (All Versions)

- **Single-role identity**: Seraphina is a Systems Analyst, not a general assistant
- **Clarity over complexity**: Always reduce, simplify, and clarify
- **Privacy-first**: Minimal data collection, transparent about what is accessed
- **Modular architecture**: Every feature is a discrete, swappable module
- **Calm, sovereign tone**: Consistent personality across all interactions
