# DevCV AI

<p align="center">
  <strong>Prompt-guarded CV intelligence that compares your CV with a real job description — without inventing skills.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Supabase-Auth-green" alt="Supabase">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

---

## The Problem

Most AI CV tools do one dangerous thing: they invent.

They add skills you never learned, jobs you never did, and certificates you never earned — just to make your CV look stronger.

That looks good for one day. It fails in the interview, in the background check, and in your career.

## The Solution

DevCV AI is built on one rule:

> **If it is not in your CV, we will not add it. If it is not real, we will not show it.**

DevCV compares what you actually have with what the job actually asks for — and tells you the truth about the gap.

## What It Does

### 1. Target-Role Analysis
Paste your CV. Paste a job description. Pick a target role — Intern, Junior, Mid, Senior, Lead.

DevCV reads both and gives you a real match signal, not a fake score.

### 2. Score Panel + Findings
- **Overall Match Score** — How close is your CV to this job?
- **Matched Skills** — What you already have that the job wants.
- **Missing Skills** — What the job wants that you do not have yet.
- **Risk Flags** — Where your CV is vague, inflated, or unclear.

### 3. Keyword Signal
Shows which keywords from the job description appear in your CV — and which are missing. No guessing. Exact matching.

### 4. Action Roadmap
Not just a score. A clear plan:

1. What to add first
2. What to fix now
3. What to remove
4. What to learn next

### 5. Editable Resume Workspace
Edit your CV inside the app. Re-run analysis. See your score improve in real time — with real changes, not invented ones.

## Guardrails — Why DevCV Is Different

DevCV runs every analysis through strict prompt guardrails:

| Rule | What It Means |
|------|---------------|
| No invention | Never add a skill, job, or certificate that is not in your CV |
| No fake experience | Never extend dates or upgrade titles |
| Evidence first | Every claim must link to something in your CV |
| Honest gaps | If a skill is missing, say it is missing — do not hide it |
| No age / personal data | Never use age, gender, or private data to judge a CV |

This is what makes DevCV safe for students, interns, and early-career engineers.

## Key Features

- **Target-role picker** — Intern / Junior / Mid / Senior / Lead
- **Editable resume workspace** — Edit, save, re-analyze
- **Score panel** — Match score, findings, keyword signal
- **Action roadmap** — Prioritized next steps
- **Supabase Auth** — Email / Password + Google sign-in
- **Privacy mode** — Local preview works when API keys are not set
- **Carbon + Neon design** — Clean, fast, mobile-friendly UI

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes — `/api/analyze` |
| Database + Auth | Supabase — Auth + Postgres |
| AI | LLM analysis via server-side API with input bounds + validation |
| Deployment | Vercel |

## Architecture

```
User Pastes CV + Job Description
        ↓
Frontend validates input (length, format)
        ↓
POST /api/analyze — Server-side guardrails applied
        ↓
LLM compares CV vs JD with strict no-invention prompt
        ↓
Response: Score + Findings + Keywords + Roadmap
        ↓
User edits CV → Re-runs → Score updates
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase project (for Auth + DB) — optional for local preview

### 1. Clone

```bash
git clone https://github.com/AbbasFullstack/devcv-ai.git
cd devcv-ai
```

### 2. Install

```bash
npm install
```

### 3. Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
AI_API_KEY=your_ai_api_key
```

> Without keys, the app runs in Privacy / Local Preview mode.

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000

## API

### `POST /api/analyze`

Analyzes a CV against a job description.

**Request:**
```json
{
  "cvText": "Your CV text...",
  "jobDescription": "Job description text...",
  "targetRole": "Junior AI Engineer"
}
```

**Response:**
```json
{
  "score": 68,
  "matchedSkills": ["Python", "Next.js"],
  "missingSkills": ["Evaluation", "RAG"],
  "findings": ["..."],
  "roadmap": ["..."]
}
```

Input is bounded and validated server-side. No secrets are exposed to the client.

## Security & Privacy

- API keys live only on the server — never in client code
- CV text is not stored unless the user saves it
- Auth via Supabase — passwords handled by Supabase, not by this app
- No tracking, no ads, no third-party analytics

## Roadmap

- [ ] PDF export of analysis + roadmap
- [ ] Multi-role comparison — One CV vs 3 jobs
- [ ] Learning plan generator — Missing skills → 30-day plan
- [ ] Evaluation mode — Compare 2 versions of the same CV

## Who Built This

**Abbas Hussain** — Full Stack AI Engineer

Building AI tools that tell the truth — no fake claims, no invented skills.

- GitHub: https://github.com/AbbasFullstack
- Portfolio: https://abbas-portfolio-beta.vercel.app
- LinkedIn: https://linkedin.com/in/abbas-hussain-56a61338b

## License

MIT License — Free for personal and commercial use.

---

*DevCV AI does not write fake CVs. It helps you build a real one.*
