type AnalysisRequest = { role: string; resume: string };

interface Env {
  AI: { run: (model: string, input: unknown) => Promise<unknown> };
  WORKER_SHARED_SECRET?: string;
}

const model = "@cf/meta/llama-3.1-8b-instruct-fast";
const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  required: ["overallScore", "atsScore", "clarityScore", "impactScore", "keywords", "findings", "summaryRewrite"],
  properties: {
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    atsScore: { type: "integer", minimum: 0, maximum: 100 },
    clarityScore: { type: "integer", minimum: 0, maximum: 100 },
    impactScore: { type: "integer", minimum: 0, maximum: 100 },
    keywords: { type: "array", minItems: 3, maxItems: 12, items: { type: "string", minLength: 1, maxLength: 80 } },
    findings: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["category", "severity", "title", "detail"],
        properties: {
          category: { type: "string", minLength: 1, maxLength: 80 },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          title: { type: "string", minLength: 1, maxLength: 160 },
          detail: { type: "string", minLength: 1, maxLength: 1200 },
        },
      },
    },
    summaryRewrite: { type: "string", minLength: 30, maxLength: 1000 },
  },
};

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function validRequest(value: unknown): value is AnalysisRequest {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AnalysisRequest>;
  return typeof candidate.role === "string" && candidate.role.trim().length >= 2 && candidate.role.length <= 100 && typeof candidate.resume === "string" && candidate.resume.trim().length >= 80 && candidate.resume.length <= 24000;
}

function authorized(request: Request, secret?: string) {
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST" || new URL(request.url).pathname !== "/analyze") return respond({ error: "Not found." }, 404);
    if (!authorized(request, env.WORKER_SHARED_SECRET)) return respond({ error: "Unauthorized." }, 401);
    if (!request.headers.get("content-type")?.includes("application/json")) return respond({ error: "JSON is required." }, 415);

    let input: unknown;
    try { input = await request.json(); } catch { return respond({ error: "Invalid JSON." }, 400); }
    if (!validRequest(input)) return respond({ error: "Invalid analysis request." }, 400);

    try {
      const output = await env.AI.run(model, {
        messages: [
          { role: "system", content: "You are a precise resume analyst. Return only the requested JSON. Do not invent employers, degrees, metrics, technologies, or achievements. Frame uncertain suggestions conditionally." },
          { role: "user", content: `Target role: ${input.role}\n\nResume:\n${input.resume}` },
        ],
        response_format: { type: "json_schema", json_schema: analysisSchema },
      });
      const analysis = (output as { response?: unknown }).response;
      if (!analysis || typeof analysis !== "object") return respond({ error: "The AI result was incomplete." }, 502);
      return respond({ analysis });
    } catch {
      return respond({ error: "AI analysis is temporarily unavailable. No resume was saved." }, 502);
    }
  },
};

export default worker;
