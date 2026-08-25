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
});
