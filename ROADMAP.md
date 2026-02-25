# Seraphina — Systems Analyst Agent: Roadmap

## v0.1 — MVP (Current)

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

## v0.2 — Auth & Persistence

- [x]Passwordless authentication (magic links / email codes)
- [x]Supabase database integration
- [x]Cloud-saved analyses (replace localStorage)
- [x]User accounts and sessions
- [x]Cross-device access to saved analyses

---

## v0.3 — Customisation

- [x]Tone settings (gentle, crisp, blunt, playful)
- [x]Technical depth slider (beginner → expert)
- [x]Risk tolerance setting (conservative → aggressive)
- [x]Preferred architecture style (API-first, agent-first, modular, monolith)
- [x]User preferences saved to profile
- [x]Settings panel in the UI

---

## v0.4 — Google Drive Integration ✓

- [x]Google Cloud Console project + OAuth 2.0 credentials
- [x]OAuth consent screen and Drive read-only scope
- [x]Connect/disconnect Google Drive from Settings page
- [x]OAuth token storage in Supabase (encrypted)
- [x]List top-level folder structure via Drive API (names only, no file contents)
- [x]Pass folder structure to Seraphina for analysis (same flow as local directory analyser)
- [x]Privacy controls: clear scope explanation, easy disconnect

---

## v0.5 — Deployment, Domain & Marketing Foundation

### DigitalOcean Deployment
- [x]Provision $6/mo Droplet (Ubuntu, Node 20)
- [ ]Deploy Next.js app with PM2 process manager
- [ ]Nginx reverse proxy + SSL (Let's Encrypt)
- [ ]Point `sysanalyst.dev` DNS (Cloudflare) to Droplet
- [x]Environment variables configured securely on server
- [x]Basic deployment runbook documented
- [ ]Run `npm audit` and resolve all high/critical runtime vulnerabilities before go-live

### Pre-Launch Checklist
- [ ]Landing page (`/`) with value proposition and sign-up CTA
- [ ]Google OAuth app verification submitted (allow 4-6 weeks for sensitive scope review)
- [ ]Supabase magic link email template customised
- [ ]Favicon and browser metadata confirmed
- [ ]Basic error boundaries in place
- [ ]Privacy Policy page (`/privacy`) — GDPR compliant, covers email, analyses, Google Drive connection (use Termly or GetTerms)
- [ ]Terms of Service page (`/terms`)
- [ ]Cookie notice banner (Supabase sets auth cookies)
- [ ]Legal links in landing page footer

### SEO Foundation
- [ ]Landing page (`/`) — copywriting, value proposition, hero section
- [ ]Meta tags, Open Graph, Twitter Card across all pages
- [ ]`sitemap.xml` and `robots.txt`
- [ ]Structured data (JSON-LD) for the landing page
- [ ]Google Search Console setup and site verified
- [ ]Core Web Vitals baseline measured

### Bootstrap Marketing
- [ ]Blog section (`/blog`) — static MDX posts, SEO-optimised
- [ ]3 launch posts: what Seraphina does, who it's for, how to use it
- [ ]Social proof placeholder (testimonials section, ready for real quotes)
- [ ]"Share your analysis" feature — shareable link or screenshot export
- [ ]Submit to relevant directories (Product Hunt, Indie Hackers, etc.)
- [ ]Email capture for waitlist / early access (pre-monetisation)

---

## v0.6 — UI Redesign: "Hot Off the Press"

### Positioning
- Deliberately anti-Silicon-Valley — gritty, real, directional
- Target: founders who think in systems, outside the VC/startup hype scene
- Aesthetic inspired by: worn stencil arrows on wet tarmac, newspaper press, industrial signage

### Design Language
- [ ]Dark tarmac background (`#0D0D0D`) with cream/newsprint content (`#F2EDE4`, `#C4B89A`)
- [ ]Typographic hierarchy: serif headlines (Georgia/Playfair) + monospace body (Space Mono)
- [ ]Hard offset borders instead of drop shadows — misregistered print feel
- [ ]Worn arrow motif as brand element — logo mark, CTAs, dividers
- [ ]Subtle grain/noise texture overlay on backgrounds
- [ ]No gradients, no rounded pill buttons — flat, stamped, deliberate

### Pages
- [ ]Landing page prototype built (v0.4.1) — refine and polish
- [ ]App shell (sidebar, nav) restyled to match
- [ ]Analysis output cards as "press sheets"
- [ ]Settings and Dashboard restyled
- [ ]Mobile-responsive polish across all pages
- [ ]Favicon — muddy tyre mark (stamp/imprint aesthetic, works at 16px and 32px)
- [ ]Brand icon suite — favicon, OG image, apple touch icon
- [ ]Unified branding across all tools / future products (sysanalyst.dev as the brand home)

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

## Design Principles (All Versions)

- **Single-role identity**: Seraphina is a Systems Analyst, not a general assistant
- **Clarity over complexity**: Always reduce, simplify, and clarify
- **Privacy-first**: Minimal data collection, transparent about what is accessed
- **Modular architecture**: Every feature is a discrete, swappable module
- **Calm, sovereign tone**: Consistent personality across all interactions
