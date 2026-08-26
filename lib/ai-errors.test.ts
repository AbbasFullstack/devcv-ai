import { describe, expect, it } from "vitest";
import { getVercelGatewayErrorMessage } from "./ai-errors";

describe("Vercel AI Gateway errors", () => {
  it("explains the account-verification prerequisite without exposing billing details", () => {
    expect(getVercelGatewayErrorMessage(403, "customer_verification_required")).toBe("AI analysis is waiting for Vercel account verification in this private beta. No resume was saved.");
  });

  it("retains quota-specific and generic beta fallbacks", () => {
    expect(getVercelGatewayErrorMessage(429)).toContain("quota");
    expect(getVercelGatewayErrorMessage(502)).toContain("temporarily unavailable");
  });
});
