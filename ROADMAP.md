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

- [ ]Passwordless authentication (magic links / email codes)
- [ ]Supabase database integration
- [ ]Cloud-saved analyses (replace localStorage)
- [ ]User accounts and sessions
- [ ]Cross-device access to saved analyses

---

## v0.3 — Customisation

- [ ]Tone settings (gentle, crisp, blunt, playful)
- [ ]Technical depth slider (beginner → expert)
- [ ]Risk tolerance setting (conservative → aggressive)
- [ ]Preferred architecture style (API-first, agent-first, modular, monolith)
- [ ]User preferences saved to profile
- [ ]Settings panel in the UI

---

## v0.4 — Cloud Storage Integration

- [ ]Google Drive connection (OAuth)
- [ ]Dropbox connection (OAuth)
- [ ]OneDrive connection (OAuth)
- [ ]Analyse cloud folder structures
- [ ]Suggest reorganisation across cloud storage
- [ ]Privacy controls and permission management

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
