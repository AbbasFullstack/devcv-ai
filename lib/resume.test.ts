import { describe, expect, it } from "vitest";
import { boundedResumeText, previewAnalysis, realAnalysisSchema, resumeSaveInputSchema, scoreBand } from "./resume";

const resume = "Built reliable TypeScript and React web applications with authenticated user flows, database-backed features, API routes, testing, deployment, and thoughtful user interfaces for real product use cases.";

describe("resume helpers", () => {
  it("normalizes and bounds submitted resume text", () => {
    expect(boundedResumeText("  Hello\n\n world  ")).toBe("Hello world");
    expect(boundedResumeText("x".repeat(25000))).toHaveLength(24000);
  });

  it("maps scores to useful feedback bands", () => {
    expect(scoreBand(90)).toBe("Interview-ready");
    expect(scoreBand(72)).toBe("Strong foundation");
    expect(scoreBand(50)).toBe("Needs focus");
  });

  it("allows an explicit saved version with a real analysis only", () => {
    const real = { ...previewAnalysis, isPreview: false };
    expect(realAnalysisSchema.safeParse(real).success).toBe(true);
    expect(resumeSaveInputSchema.safeParse({ title: "Developer resume", role: "Full-stack Developer", resume, analysis: real }).success).toBe(true);
    expect(resumeSaveInputSchema.safeParse({ title: "Developer resume", role: "Full-stack Developer", resume, analysis: previewAnalysis }).success).toBe(false);
  });
});
