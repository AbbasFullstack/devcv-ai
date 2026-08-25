export function getAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit exceeded")) return "Confirmation emails are temporarily rate-limited. Please wait before trying again.";
  if (normalized.includes("email address not authorized")) return "Email confirmation is temporarily available only for approved beta addresses while delivery is being configured.";
  if (normalized.includes("email not confirmed")) return "Confirm your email before signing in.";
  if (normalized.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (normalized.includes("user already registered")) return "This email already has an account. Sign in instead.";

  return "Authentication could not be completed. Please try again.";
}
