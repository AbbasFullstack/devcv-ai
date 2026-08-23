# DevCV AI

> **AI-powered resume intelligence for clearer, role-aware career stories.**

DevCV AI is a carbon-neon SaaS workspace where a user can choose a target role, review resume signal, inspect prioritized improvement suggestions, and prepare stronger resume content. The foundation deliberately distinguishes **preview feedback** from a real AI analysis so that no generated result is presented as an AI response without a server-side provider call.

## Foundation Features

| Area | Included in this foundation |
| --- | --- |
| Visual system | Responsive carbon-neon interface with CSS 3D orbital/cube animation and reduced-motion support |
| Authentication | Supabase Auth adapter for email/password sign-up, sign-in, sign-out, session-aware route protection, and callback exchange |
| Dashboard | Target-role picker, editable resume workspace, score panel, findings, rewritten summary, keyword signal, and action roadmap |
| AI contract | Server-side `/api/analyze` route with input bounds, authentication check, structured-result validation, and no raw-resume logging |
| Data model | RLS-ready Supabase schema for user profiles, saved resume versions, and analysis history |
| Privacy mode | An explicit local preview workspace when Supabase/AI environment variables are not configured |

## Product Boundary

DevCV AI is built to make suggestions, not to invent a user's qualifications. The analysis prompt forbids inventing employers, degrees, quantified results, technologies, or achievements. Users remain responsible for checking every suggested sentence before using it in an application.

## Local Setup

```bash
git clone https://github.com/AbbasFullstack/devcv-ai.git
cd devcv-ai
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Without secrets, the dashboard intentionally runs in clearly labelled local preview mode.

## Configuration

| Variable | Purpose | Visibility |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Browser-safe |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Browser-safe |
| `AI_API_KEY` | AI provider key | Server only |
| `AI_BASE_URL` | OpenAI-compatible API base URL | Server only |
| `AI_MODEL` | Selected analysis model | Server only |

Never commit `.env.local`, user resume files, service-role keys, or raw provider credentials.

## Verification

```bash
npm run check
npm run lint
npm run test
NODE_ENV=production npm run build
```

## Roadmap

The initial foundation is ready for live Supabase configuration and a server-only AI provider key. The next increments are document parsing for PDF/DOCX uploads, authenticated save/version history, job-description comparison, exportable resume versions, and user-controlled deletion.

## Architecture

Detailed privacy, database, and AI boundaries live in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). The SQL RLS starter schema is located at [`supabase/schema.sql`](supabase/schema.sql).

Built by **Abbas Hussain**.
