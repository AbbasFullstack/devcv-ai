import { describe, expect, it } from "vitest";
import { boundedResumeText, scoreBand } from "./resume";

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
});
