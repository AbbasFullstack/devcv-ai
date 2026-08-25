export type AnalysisProviderConfig =
  | { kind: "cloudflare-worker"; url: string; sharedSecret: string }
  | { kind: "generic-openai-compatible"; url: string; apiKey: string; model: string };

type ProviderEnvironment = Partial<Pick<NodeJS.ProcessEnv, "CLOUDFLARE_WORKER_URL" | "CLOUDFLARE_WORKER_SHARED_SECRET" | "AI_API_KEY" | "AI_BASE_URL" | "AI_MODEL">>;

export function getAnalysisProviderConfig(environment: ProviderEnvironment = {
  CLOUDFLARE_WORKER_URL: process.env.CLOUDFLARE_WORKER_URL,
  CLOUDFLARE_WORKER_SHARED_SECRET: process.env.CLOUDFLARE_WORKER_SHARED_SECRET,
  AI_API_KEY: process.env.AI_API_KEY,
  AI_BASE_URL: process.env.AI_BASE_URL,
  AI_MODEL: process.env.AI_MODEL,
}): AnalysisProviderConfig | null {
  const workerUrl = environment.CLOUDFLARE_WORKER_URL?.trim().replace(/\/$/, "");
  const workerSharedSecret = environment.CLOUDFLARE_WORKER_SHARED_SECRET?.trim();
  if (workerUrl && workerSharedSecret) return { kind: "cloudflare-worker", url: workerUrl, sharedSecret: workerSharedSecret };

  const apiKey = environment.AI_API_KEY?.trim();
  if (!apiKey) return null;
  return {
    kind: "generic-openai-compatible",
    url: (environment.AI_BASE_URL?.trim() || "https://api.openai.com/v1").replace(/\/$/, ""),
    apiKey,
    model: environment.AI_MODEL?.trim() || "gpt-5-mini",
  };
}
