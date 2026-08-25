# Cloudflare Workers AI Deployment

## Purpose

`cloudflare-worker/` contains DevCV AI's private inference proxy. It accepts analysis requests only from DevCV's server route, invokes the Cloudflare Workers AI binding with JSON mode, and never logs or stores raw resume text. It is intentionally deployed only through the manual GitHub Actions workflow.

## Required GitHub Secrets

An authorized Cloudflare account holder must add these repository secrets in **AbbasFullstack/devcv-ai → Settings → Secrets and variables → Actions**. Do not place any value in source code, a workflow file, an issue, a pull request, or chat.

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare token created with the **Edit Cloudflare Workers** template and restricted to the one deployment account. |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID for the authorized deployment account. |
| `DEVCV_WORKER_SHARED_SECRET` | Long, random server-to-server secret that prevents public callers from using the Worker. |

After the secrets exist, run **Actions → Deploy DevCV Cloudflare Worker → Run workflow**. The workflow has only a `workflow_dispatch` trigger, so pushes never deploy the Worker automatically.

## Required Vercel Values After a Successful Worker Deployment

Add these only after the workflow outputs the real Worker URL:

| Vercel variable | Value source | Visibility |
|---|---|---|
| `CLOUDFLARE_WORKER_URL` | Worker deployment URL without a trailing slash | Server-only configuration |
| `CLOUDFLARE_WORKER_SHARED_SECRET` | Same value as `DEVCV_WORKER_SHARED_SECRET` | Server-only secret |

The application selects the Cloudflare Worker only when both values are present. Otherwise it retains the existing non-configured/preview-safe behavior; it does not silently route resumes to an unknown service.

## Privacy and Quota Boundaries

The Worker has no public CORS allowlist because it is not a browser endpoint. It requires a bearer secret from the Vercel server, forwards a transient analysis request to Workers AI, returns a JSON result, and sets no cache. The DevCV application continues to validate every result through Zod and stores resume content only when a signed-in user explicitly chooses Save.

The selected model is `@cf/meta/llama-3.1-8b-instruct-fast`. It uses Cloudflare's free Workers AI allocation until that allocation is exhausted. The route returns an availability error on upstream failure; no part of the product may claim unlimited or guaranteed AI analysis.

## Sources

- [Cloudflare: GitHub Actions deployment](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Cloudflare: Workers AI JSON Mode](https://developers.cloudflare.com/workers-ai/features/json-mode/)
- [Cloudflare: Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
