import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "./auth-errors";

describe("getAuthErrorMessage", () => {
  it("turns Supabase confirmation delivery limits into actionable non-provider guidance", () => {
    expect(getAuthErrorMessage("email rate limit exceeded")).toBe("Confirmation emails are temporarily rate-limited. Please wait before trying again.");
    expect(getAuthErrorMessage("Email address not authorized")).toBe("Email confirmation is temporarily available only for approved beta addresses while delivery is being configured.");
  });

  it("does not expose raw provider errors for unrecognised authentication failures", () => {
    expect(getAuthErrorMessage("unexpected upstream error 9d3f")).toBe("Authentication could not be completed. Please try again.");
  });
});
