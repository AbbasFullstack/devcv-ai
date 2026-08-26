import { describe, expect, it } from "vitest";
import { getAnalysisProviderConfig } from "./analysis-provider";

describe("analysis provider selection", () => {
  it("uses the Cloudflare worker only when both server-only values are present", () => {
    expect(getAnalysisProviderConfig({ CLOUDFLARE_WORKER_URL: "https://worker.example.workers.dev/", CLOUDFLARE_WORKER_SHARED_SECRET: "private-secret", AI_API_KEY: "fallback" })).toEqual({ kind: "cloudflare-worker", url: "https://worker.example.workers.dev", sharedSecret: "private-secret" });
    expect(getAnalysisProviderConfig({ CLOUDFLARE_WORKER_URL: "https://worker.example.workers.dev" })).toBeNull();
  });

  it("keeps the generic provider path as an explicit fallback", () => {
    expect(getAnalysisProviderConfig({ AI_API_KEY: "provider-secret", AI_BASE_URL: "https://provider.example/v1/", AI_MODEL: "provider/model" })).toEqual({ kind: "generic-openai-compatible", url: "https://provider.example/v1", apiKey: "provider-secret", model: "provider/model" });
  });

  it("uses Vercel OIDC for the approved no-key beta path before a generic provider fallback", () => {
    expect(getAnalysisProviderConfig({ VERCEL_OIDC_TOKEN: "short-lived-vercel-token", AI_API_KEY: "provider-secret" })).toEqual({ kind: "vercel-ai-gateway", url: "https://ai-gateway.vercel.sh/v1", oidcToken: "short-lived-vercel-token", model: "poolside/laguna-s-2.1-free" });
  });

  it("prefers the Vercel Function runtime OIDC header over build-time credentials", () => {
    expect(getAnalysisProviderConfig({ VERCEL_OIDC_TOKEN: "build-token", AI_API_KEY: "provider-secret" }, "function-request-token")).toEqual({ kind: "vercel-ai-gateway", url: "https://ai-gateway.vercel.sh/v1", oidcToken: "function-request-token", model: "poolside/laguna-s-2.1-free" });
  });
});
