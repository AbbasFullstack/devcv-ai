import { z } from "zod";

export const resumeFindingSchema = z.object({
  category: z.string().min(1).max(80),
  severity: z.enum(["high", "medium", "low"]),
  title: z.string().min(1).max(160),
  detail: z.string().min(1).max(1200),
}).strict();

export const analysisPayloadSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  atsScore: z.number().int().min(0).max(100),
  clarityScore: z.number().int().min(0).max(100),
  impactScore: z.number().int().min(0).max(100),
  keywords: z.array(z.string().min(1).max(80)).min(3).max(12),
  findings: z.array(resumeFindingSchema).min(1).max(8),
  summaryRewrite: z.string().min(30).max(1000),
}).strict();

export const realAnalysisSchema = analysisPayloadSchema.extend({ isPreview: z.literal(false) }).strict();

export const resumeSaveInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  role: z.string().trim().min(2).max(100),
  resume: z.string().trim().min(80).max(24000),
  analysis: realAnalysisSchema.optional(),
}).strict();

export type ResumeAnalysis = z.infer<typeof analysisPayloadSchema> & { isPreview: boolean };
export type SavedResumeVersion = {
  id: string;
  title: string;
  target_role: string | null;
  resume_text: string;
  created_at: string;
  updated_at: string;
  analysis_runs?: { id: string; overall_score: number | null; created_at: string; result: unknown }[];
};

export const previewAnalysis: ResumeAnalysis = {
  overallScore: 72,
  atsScore: 69,
  clarityScore: 78,
  impactScore: 68,
  keywords: ["TypeScript", "REST APIs", "React", "Testing", "CI/CD"],
  findings: [
    { category: "Impact", severity: "high", title: "Add measurable outcomes", detail: "Convert task-only bullets into outcomes using scale, speed, adoption, reliability, or time saved." },
    { category: "Targeting", severity: "medium", title: "Match the selected role", detail: "Move the most relevant stack, API, database, and deployment experience into the top third of the resume." },
    { category: "ATS", severity: "low", title: "Use explicit technical keywords", detail: "Name tools and patterns in plain text so applicant tracking systems can detect them reliably." },
  ],
  summaryRewrite: "Full-stack developer who builds reliable product experiences across React, TypeScript, APIs, databases, and AI-assisted workflows. Focused on clear architecture, measurable outcomes, and user-ready delivery.",
  isPreview: true,
};

export function scoreBand(score: number) {
  if (score >= 85) return "Interview-ready";
  if (score >= 70) return "Strong foundation";
  return "Needs focus";
}

export function boundedResumeText(text: string) {
  return text.trim().replace(/\s+/g, " ").slice(0, 24000);
}
