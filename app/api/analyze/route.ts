import { NextResponse } from "next/server";
import { z } from "zod";
import { analysisPayloadSchema } from "@/lib/resume";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { getAnalysisProviderConfig } from "@/lib/analysis-provider";

const requestSchema = z.object({ role: z.string().trim().min(2).max(100), resume: z.string().trim().min(80).max(24000) }).strict();

export async function POST(request: Request) {
  if (isSupabaseConfigured && !(await getCurrentUser())) return NextResponse.json({ error: "Sign in to run AI analysis." }, { status: 401 });
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Add a target role and at least 80 characters of resume content." }, { status: 400 });
  const provider = getAnalysisProviderConfig(undefined, request.headers.get("x-vercel-oidc-token") ?? undefined);
  if (!provider) return NextResponse.json({ error: "AI analysis is not configured yet. Use sample feedback while the server-only provider key is being added." }, { status: 503 });
  try {
    const response = provider.kind === "cloudflare-worker"
      ? await fetch(`${provider.url}/analyze`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${provider.sharedSecret}` }, body: JSON.stringify(parsed.data), cache: "no-store" })
      : provider.kind === "vercel-ai-gateway"
        ? await fetch(`${provider.url}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${provider.oidcToken}` }, body: JSON.stringify({ model: provider.model, response_format: { type: "json_object" }, messages: [{ role: "system", content: "You are a precise resume analyst in a limited beta. Return JSON only with overallScore, atsScore, clarityScore, impactScore, keywords, findings, summaryRewrite. Do not invent employers, degrees, metrics, technologies, or achievements. Frame uncertain suggestions conditionally." }, { role: "user", content: `Target role: ${parsed.data.role}\n\nResume:\n${parsed.data.resume}` }] }), cache: "no-store" })
      : await fetch(`${provider.url}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${provider.apiKey}` }, body: JSON.stringify({ model: provider.model, response_format: { type: "json_object" }, messages: [{ role: "system", content: "You are a precise resume analyst. Return JSON only with overallScore, atsScore, clarityScore, impactScore, keywords, findings, summaryRewrite. Do not invent employers, degrees, metrics, technologies, or achievements. Frame uncertain suggestions conditionally." }, { role: "user", content: `Target role: ${parsed.data.role}\n\nResume:\n${parsed.data.resume}` }] }) });
    if (!response.ok) {
      const providerFailure = await response.json().catch(() => null) as { error?: { code?: unknown; type?: unknown } } | null;
      console.error("AI_PROVIDER_REQUEST_FAILED", {
        provider: provider.kind,
        status: response.status,
        code: typeof providerFailure?.error?.code === "string" ? providerFailure.error.code : "unavailable",
        type: typeof providerFailure?.error?.type === "string" ? providerFailure.error.type : "unavailable",
      });
      const error = provider.kind === "vercel-ai-gateway"
        ? response.status === 429 ? "The Vercel AI beta quota is temporarily exhausted. Try again later; no resume was saved." : "The Vercel AI beta is temporarily unavailable. No resume was saved."
        : "The AI provider could not complete this request.";
      return NextResponse.json({ error }, { status: 502 });
    }
    const payload = await response.json() as { analysis?: unknown; choices?: { message?: { content?: string } }[] };
    const rawAnalysis = provider.kind === "cloudflare-worker" ? payload.analysis : payload.choices?.[0]?.message?.content;
    if (!rawAnalysis) return NextResponse.json({ error: "The AI provider returned an empty response." }, { status: 502 });
    const analysis = analysisPayloadSchema.safeParse(typeof rawAnalysis === "string" ? JSON.parse(rawAnalysis) : rawAnalysis);
    if (!analysis.success) return NextResponse.json({ error: "The AI response did not match the required resume-analysis structure." }, { status: 502 });
    return NextResponse.json({ analysis: { ...analysis.data, isPreview: false } });
  } catch { return NextResponse.json({ error: "Analysis failed without saving your submitted resume." }, { status: 502 }); }
}
