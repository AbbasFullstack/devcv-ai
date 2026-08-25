# Vercel AI Gateway Beta

## Scope

DevCV AI uses Vercel AI Gateway only when Vercel provides the server-side `VERCEL_OIDC_TOKEN` at runtime. No user-created AI provider key is placed in Vercel environment variables, source code, client bundles, logs, or chat.

The current beta model identifier is `poolside/laguna-s-2.1-free`. It is a limited free model candidate and is not presented as a premium or unlimited resume-review service. The DevCV route sends a request only after the signed-in user explicitly requests analysis, validates the response using the existing Zod schema, and does not automatically save the submitted resume or result.

## Privacy Boundaries

The request runs server-to-server from DevCV's Vercel route. The browser never receives a Vercel OIDC token. Vercel documents that AI Gateway deletes prompts and responses after request completion. However, provider-level Zero Data Retention routing is a Pro/Enterprise feature; while DevCV remains on Hobby, product copy must not claim provider-level ZDR. Users should not submit highly sensitive personal data during this beta.

## Failure and Quota Behavior

The beta returns a specific availability message if Vercel AI Gateway fails or its free-tier limit responds with HTTP 429. The route returns no analysis in those cases and does not automatically save resume text. The UI must preserve the existing preview and explicit-save safeguards.

## References

- [Vercel AI Gateway authentication](https://vercel.com/docs/ai-gateway/authentication-and-byok)
- [Vercel AI Gateway pricing](https://vercel.com/docs/ai-gateway/pricing)
- [Vercel Zero Data Retention documentation](https://vercel.com/docs/ai-gateway/security-and-compliance/zdr)
- [Laguna S 2.1 Free model page](https://vercel.com/ai-gateway/models/laguna-s-2.1-free)
