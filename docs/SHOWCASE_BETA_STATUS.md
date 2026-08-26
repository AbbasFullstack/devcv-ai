# DevCV AI — Verified Showcase Beta Status

## Positioning

DevCV AI is a **private showcase beta** for privacy-conscious resume drafting and user-controlled resume version history. It is not presented as a publicly ready AI resume service or an unlimited AI product.

## Verified in production

| Area | Verified behavior |
|---|---|
| Authentication | A non-personal synthetic account signed up and reached its protected workspace during controlled QA. Unauthenticated dashboard access redirected to sign-in. Email confirmation has since been restored. |
| Privacy model | The isolated DevCV Supabase project uses owner-scoped row-level security. Resume text is not stored automatically after an analysis request. |
| Resume history | A synthetic resume version was explicitly saved, client workspace was cleared, the version was loaded again, and it was deleted from the UI. Final verification found `0` saved resume versions and `0` analysis runs. |
| Preview safeguard | Preview/sample feedback is clearly labelled and is prevented by validation from being persisted as a real AI analysis result. |
| Build quality | The current source passed 11 Vitest tests, TypeScript checking, linting, and a production Next.js build before deployment. |

## Intentionally limited

The Vercel AI Gateway integration uses short-lived server-side OIDC authentication and never exposes a provider API key to the browser. The connected Vercel team currently requires customer verification before it will execute AI Gateway requests. DevCV therefore shows an accurate verification-required beta message and does not save a submitted resume when an AI request cannot run.

Email confirmation is enabled. The default Supabase email service is still unsuitable for broad public self-service delivery, so DevCV remains a limited private beta until a guardian-approved delivery provider is configured.

## Safe portfolio wording

> **DevCV AI — Private Showcase Beta:** A privacy-first resume workspace built with Next.js, Supabase Auth/RLS, Zod validation, explicit resume version history, and a server-side Vercel AI Gateway integration. The live AI request remains verification-gated, so the project is presented as a beta foundation rather than a completed public AI service.

## Do not claim

Do not claim that live AI analysis is verified, that public-scale email delivery is production-ready, or that DevCV offers unlimited/free AI usage.
