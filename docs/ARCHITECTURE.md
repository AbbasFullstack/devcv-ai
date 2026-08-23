# DevCV AI Architecture

DevCV AI is designed as a privacy-aware resume improvement workspace. A user owns their account, chooses a target role, submits resume text for one analysis request, reviews improvements, and can explicitly save a version later. The app must never claim that preview content is a real AI result.

| Layer | Responsibility | Security boundary |
| --- | --- | --- |
| Next.js App Router | Landing pages, auth screens, dashboard, and responsive visual experience | No secret keys in client components |
| Supabase Auth | Email/password sign-up, sign-in, sign-out, and session refresh | Only public URL/anon key are browser-visible |
| Supabase database | Profiles, resume versions, analysis metadata, and user-owned history | Row-level security restricts every row to its owner |
| Server-only analysis route | Validates resume length and target role, then calls the configured AI provider | `AI_API_KEY` stays server-only |
| AI provider | Returns structured resume feedback and rewrite suggestions | Raw resumes are sent only after the user explicitly requests analysis |

## Privacy Rules

Resume content can contain personal contact data and employment history. The dashboard therefore starts with a local workspace, requires an explicit analysis action, avoids secret fields, and explains when external AI processing is unavailable. The implementation must not log raw resume text or expose provider credentials.

## Initial Data Model

The live authentication integration will use `profiles`, `resume_versions`, and `analysis_runs` tables. Every table includes `user_id`, and every policy must verify `auth.uid() = user_id`. Resume text is stored only when a user explicitly saves a version; analysis preview stays in browser state until saved.

## AI Contract

The server route returns structured data: an overall score, category scores, prioritized findings, ATS keywords, rewritten summary, and bullets. When the AI provider is not configured, the route returns an explicit setup error. A client-side rubric is labeled **Preview feedback**, never as an AI result.
