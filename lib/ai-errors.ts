export function getVercelGatewayErrorMessage(status: number, type?: string) {
  if (type === "customer_verification_required") return "AI analysis is waiting for Vercel account verification in this private beta. No resume was saved.";
  if (status === 429) return "The Vercel AI beta quota is temporarily exhausted. Try again later; no resume was saved.";
  return "The Vercel AI beta is temporarily unavailable. No resume was saved.";
}
