# Seraphina — The Systems Analyst Agent

A specialised, single-role analysis agent that brings clarity to messy MVPs, half-formed ideas, and early-stage product concepts. Seraphina reads unstructured input, extracts underlying structure, and produces clean, actionable insights.

She is a **Systems Analyst**, not a general assistant.

Beta deployment: [sysanalyst.dev](https://sysanalyst.dev) (currently offline) · Licence: [Apache 2.0](./LICENSE) · Roadmap: [ROADMAP.md](./ROADMAP.md)

## Who It's For

- **Solo founders and indie builders** with a half-built MVP and no clear picture of what it actually is
- **Non-technical or early-technical founders** who need structure and next steps, not more code
- **Anyone with a messy project folder or Google Drive** who wants it organised into something coherent
- **Small teams** who want one shared, structured picture of what they're building

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
4. Add your keys to `.env.local` (never commit this file — it is gitignored):
   ```
   GEMINI_API_KEY=your_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
   RESEND_API_KEY=your_resend_api_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
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
ssh seraphina@sysanalyst.dev

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

---

## Post-Deployment Setup

### 1. Cloudflare Email Routing

Set up `hello@sysanalyst.dev` and `privacy@sysanalyst.dev` so inbound contact emails forward to your personal Gmail.

> **DNS already configured.** The required MX records (×3), DKIM record, and SPF record are already present on `sysanalyst.dev`. Email Routing is active. Skip straight to adding the forwarding addresses.

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) → select `sysanalyst.dev`
2. Go to **Email** → **Email Routing** → **Custom addresses**
3. Check whether `hello@` and `privacy@` are already listed — if so, you're done
4. If not, click **Create address**:
   - Address: `hello` → Destination: your personal Gmail address → **Save**
   - Address: `privacy` → Destination: your personal Gmail address (or a dedicated inbox for GDPR hygiene) → **Save**
5. Check your Gmail inbox for a confirmation email from Cloudflare — click the verification link for each address
6. Test by sending an email to `hello@sysanalyst.dev` and confirming it arrives in Gmail

> **Note:** Resend (used for outbound magic link emails) has its own SPF/DKIM records already verified on the domain. These coexist with the Email Routing records without conflict.

---

### 2. Google OAuth App Verification

The Google Drive integration uses the `drive.readonly` scope, which Google classifies as sensitive. Public users cannot connect their Drive until the app passes Google's security review. This review takes **4–6 weeks** — submit as early as possible.

**Before you submit, you need:**
- A privacy policy URL: `https://sysanalyst.dev/privacy` ✓ (already live)
- A homepage URL: `https://sysanalyst.dev` ✓
- An authorised test user list (add yourself — one is enough to submit)
- A demo video showing the OAuth flow and how Drive data is used (a 2–3 minute Loom is fine)

---

#### Step A — Configure the OAuth consent screen

Do this first. It's what will appear to users during the OAuth flow, and what Google reviews.

1. Go to [Google Cloud Console](https://console.cloud.google.com) → select project `sysanalyst-agent`
2. Navigate to **APIs & Services** → **OAuth consent screen**
3. Under **App information**, confirm or fill in:
   - **App name**: `SysAnalyst`
   - **User support email**: the project's Google account address — Google only accepts Google accounts or Google Group addresses in this field, so `hello@sysanalyst.dev` (a forwarding address) cannot be used here. A Gmail address is fine.
   - **App logo**: upload the favicon SVG or a square PNG version if available
   - **App homepage**: `https://sysanalyst.dev`
   - **Privacy policy**: `https://sysanalyst.dev/privacy`
   - **Terms of service**: `https://sysanalyst.dev/terms`
4. Under **Authorised domains**, confirm `sysanalyst.dev` is listed
5. Under **Scopes**, confirm `https://www.googleapis.com/auth/drive.readonly` is present — if not, click **Add or remove scopes** and add it
6. Under **Test users**, click **Add users** → add your own Google account (e.g. the project's Google account)
7. Click **Save and continue** through all steps

> At this point the consent screen is configured and you are in **Testing** mode. The Drive feature works for any account in your test users list.

---

#### Step B — Record the Loom demo video

Google requires a short video demonstrating the OAuth flow and showing how Drive data is used. Record this before submitting.

**Setup before recording:**
- Open an incognito Chrome window (so you start from a clean, logged-out state)
- Log into `sysanalyst.dev` with your account
- Have your Google Drive open in a separate tab so you can cross-reference what the analysis sees

**What to record (2–3 minutes):**

1. **Show the app** — navigate to `sysanalyst.dev`, briefly show the landing page and that it's a systems analyst tool
2. **Navigate to Google Drive** — click the Drive tab in the sidebar
3. **Show the connect button** — show that Drive is not yet connected, and click **Connect Google Drive**
4. **OAuth consent screen appears** — Google's consent screen will appear showing:
   - The app name (SysAnalyst)
   - Your Google account
   - The scope: *"See information about your Google Drive files"*
   - Pause here briefly so it's clearly visible
5. **Grant access** — click **Allow**
6. **Show the folder analysis** — the app fetches your Drive folder structure and displays the names; briefly scroll through the output
7. **Show what is NOT accessed** — point out that no file contents are shown, only folder and file names
8. **Show the disconnect option** — navigate to Settings and show the **Disconnect Google Drive** button, demonstrating users have full control
9. **End on the analysis output** — show Seraphina's analysis of the folder structure

> **Narrate as you go.** Say out loud: *"SysAnalyst only reads folder and file names — it never accesses file contents."* Google reviewers watch for this.

---

#### Step C — Submit for verification

1. Go back to **APIs & Services** → **OAuth consent screen**
2. Click **Publish App** — this moves the app from Testing to Production and triggers the verification requirement
3. Google will show a prompt: click **Prepare for Verification** (or **Submit for verification** depending on the UI)
4. Fill in the verification form:
   - **Use case justification**: *"Users connect their Google Drive so SysAnalyst can read folder and file names (not file contents) and provide organisational analysis and improvement suggestions. No file contents are ever accessed or stored."*
   - **Demo video**: upload or link your Loom recording
   - **Contact email**: `hello@sysanalyst.dev`
5. Submit — Google will email updates. Typical timeline: 4–6 weeks.

> **While verification is pending:** The app works normally for any Google accounts added as test users. Anyone outside that list will see an "unverified app" warning screen but can still click through to proceed. This is acceptable for beta.

---

### 3. Supabase Magic Link Email Template

Customise the magic link email so it says "Seraphina" instead of the default Supabase branding.

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard) → select your project
2. Go to **Authentication** → **Email Templates**
3. Select the **Magic Link** template
4. Edit the subject line — change from the default to something like:
   ```
   Your sign-in link for SysAnalyst
   ```
5. Edit the body — replace the default content with something like:
   ```
   <h2>Sign in to SysAnalyst</h2>
   <p>Click the link below to sign in. This link expires in 1 hour and can only be used once.</p>
   <p><a href="{{ .ConfirmationURL }}">Sign in to SysAnalyst</a></p>
   <p style="color: #999; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
   ```
6. Click **Save** — changes take effect immediately, no deployment needed

> **Note:** Keep `{{ .ConfirmationURL }}` exactly as written — this is Supabase's variable for the magic link URL.

---

### 4. OG Image

Convert the HTML template to a PNG and add it to the project.

1. Open `public/og-image.html` in Chrome (drag the file into a Chrome tab)
2. Press `F12` to open DevTools
3. Click the **Toggle device toolbar** icon (or press `Ctrl+Shift+M`)
4. Set the dimensions to **1200 × 630** using the custom size fields at the top
5. Press `Ctrl+Shift+P` → type **Capture screenshot** → press Enter
6. Chrome saves a PNG — rename it `og-image.png`
7. Move it into `public/og-image.png`
8. Deploy to the server — the OG tags in `layout.tsx` will pick it up automatically

---

### 5. Apple Touch Icon

The Apple touch icon appears when a user adds SysAnalyst to their iPhone home screen.

1. Open `public/oauth-logo.html` in Chrome (the square chevron icon — already created)
2. Press `F12` → **Toggle device toolbar** → set dimensions to **180 × 180**
3. Press `Ctrl+Shift+P` → **Capture screenshot** → Enter
4. Rename the file `apple-touch-icon.png`
5. Move it into `public/apple-touch-icon.png`
6. Add the following line to the `<head>` in `src/app/layout.tsx`:
   ```html
   <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
   ```
   In Next.js, add it to the `metadata` object instead:
   ```ts
   icons: {
     apple: '/apple-touch-icon.png',
   },
   ```
7. Deploy

---

### 6. Plausible Analytics

Plausible is a privacy-first analytics tool. The script tag is already in the code — you just need to register the site.

1. Go to [plausible.io](https://plausible.io) → **Sign up** (free 30-day trial, then $9/mo)
2. After signing up, click **Add a website**
3. Enter domain: `sysanalyst.dev` → **Add**
4. Plausible will show you a script tag — you can ignore it, it's already in the code
5. Visit `sysanalyst.dev` in your browser — Plausible should register the first pageview within a minute
6. Go back to the Plausible dashboard → confirm data is flowing

> **Why Plausible and not Google Analytics:** Plausible is cookie-free and GDPR compliant by default. No consent banner needed for analytics. This is consistent with the privacy-first stance in the Privacy Policy.

---

### 7. Google Search Console

Tells Google your site exists, lets you submit your sitemap, and shows you search performance over time.

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add property** → select **URL prefix** → enter `https://sysanalyst.dev`
3. Google will offer several verification methods — choose **HTML tag**
4. Copy the `content` value from the meta tag Google provides (looks like `abc123xyz`)
5. Add it to the `metadata` object in `src/app/layout.tsx`:
   ```ts
   verification: {
     google: 'paste-your-content-value-here',
   },
   ```
6. Deploy to the server (git push → pull on server → build → pm2 restart)
7. Back in Search Console, click **Verify** — it should confirm immediately
8. Go to **Sitemaps** → enter `sitemap.xml` → **Submit**
9. Google will begin crawling — first data appears within a few days

---

### 8. Business Card

Order the D9 design via Moo.com. Design spec is in `ROADMAP.md` under the Brand & Marketing section.

1. Open Figma and build the D9 design following the spec in `ROADMAP.md`
2. Export front and back as **PDF at 300dpi**
3. Go to [moo.com](https://moo.com) → **Business Cards**
4. Choose **Luxe** or **Premium** card stock
5. Select **Matte finish** and **Square corners**
6. Upload your front and back PDFs
7. Order a small run (50 cards) to test — check print quality before ordering more

---

### 9. Deferred Post-Launch Tasks

These are in the roadmap but not blocking launch. Do them once the product is live and you have real users.

| Task | Why deferred | When to do it |
|------|-------------|----------------|
| **Sentry error monitoring** | No users yet — nothing to monitor | Add at launch: create a Sentry project → install `@sentry/nextjs` → add DSN to `.env.local` |
| **Blog section** (`/blog`) | Content takes time; SEO value builds slowly | Write 3 posts after launch, focus on what SysAnalyst does and who it's for |
| **Social proof / testimonials** | No users yet | Add real quotes as they come in from beta users |
| **"Share your analysis" feature** | Requires design and build work | Schedule for v1.0 or alongside monetisation |
| **Submit to directories** | Better with social proof and some traction | Product Hunt, Indie Hackers — submit 2–4 weeks after launch |
| **Email capture / waitlist** | App is already live — send people straight to sign up | Add if you want to gate a future feature or run a campaign |
| **Core Web Vitals** | Measure after all code changes are deployed | Run Lighthouse in Chrome DevTools once everything is live |

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

## License

Licensed under the [Apache License, Version 2.0](./LICENSE).

---

Built by Seraphina (the human, not the agent).
