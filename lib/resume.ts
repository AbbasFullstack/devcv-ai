export type ResumeFinding = { category: string; severity: "high" | "medium" | "low"; title: string; detail: string };
export type ResumeAnalysis = {
  overallScore: number;
  atsScore: number;
  clarityScore: number;
  impactScore: number;
  keywords: string[];
  findings: ResumeFinding[];
  summaryRewrite: string;
  isPreview: boolean;
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
