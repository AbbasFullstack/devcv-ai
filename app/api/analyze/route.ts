import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/supabase/server";

const requestSchema = z.object({ role: z.string().trim().min(2).max(100), resume: z.string().trim().min(80).max(24000) });
const outputSchema = z.object({ overallScore: z.number().int().min(0).max(100), atsScore: z.number().int().min(0).max(100), clarityScore: z.number().int().min(0).max(100), impactScore: z.number().int().min(0).max(100), keywords: z.array(z.string()).min(3).max(12), findings: z.array(z.object({ category: z.string(), severity: z.enum(["high", "medium", "low"]), title: z.string(), detail: z.string() })).min(1).max(8), summaryRewrite: z.string().min(30).max(1000) });

export async function POST(request: Request) {
  if (isSupabaseConfigured && !(await getCurrentUser())) return NextResponse.json({ error: "Sign in to run AI analysis." }, { status: 401 });
  const parsed = requestSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Add a target role and at least 80 characters of resume content." }, { status: 400 });
  if (!process.env.AI_API_KEY) return NextResponse.json({ error: "AI analysis is not configured yet. Use Preview feedback while the server-only provider key is being added." }, { status: 503 });
  try {
    const response = await fetch(`${process.env.AI_BASE_URL ?? "https://api.openai.com/v1"}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.AI_API_KEY}` }, body: JSON.stringify({ model: process.env.AI_MODEL ?? "gpt-5-mini", response_format: { type: "json_object" }, messages: [{ role: "system", content: "You are a precise resume analyst. Return JSON only with overallScore, atsScore, clarityScore, impactScore, keywords, findings, summaryRewrite. Do not invent employers, degrees, metrics, technologies, or achievements. Frame uncertain suggestions conditionally." }, { role: "user", content: `Target role: ${parsed.data.role}\n\nResume:\n${parsed.data.resume}` }] }) });
    if (!response.ok) return NextResponse.json({ error: "The AI provider could not complete this request." }, { status: 502 });
    const payload = await response.json() as { choices?: { message?: { content?: string } }[] }; const content = payload.choices?.[0]?.message?.content; if (!content) return NextResponse.json({ error: "The AI provider returned an empty response." }, { status: 502 });
    const analysis = outputSchema.safeParse(JSON.parse(content)); if (!analysis.success) return NextResponse.json({ error: "The AI response did not match the required resume-analysis structure." }, { status: 502 });
    return NextResponse.json({ analysis: { ...analysis.data, isPreview: false } });
  } catch { return NextResponse.json({ error: "Analysis failed without saving your submitted resume." }, { status: 502 }); }
}
