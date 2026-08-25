# Supabase Auth Delivery Status

## Current Beta Constraint

DevCV AI retains email confirmation. The project is currently using Supabase's built-in email delivery service, which Supabase documents as a development/testing service rather than a public-production delivery service. Its current project-wide limit is two authentication emails per hour and it only sends to pre-authorized organization-team addresses.

The product therefore uses clear sign-up and sign-in error messages rather than exposing raw provider text. It does not claim that self-service public email delivery is ready. The synthetic QA account could be created, and the app correctly required email confirmation before allowing sign-in; confirmation delivery testing is blocked until approved delivery infrastructure is configured.

## Before Public Self-Service Signup

An authorized adult account holder must choose and configure a custom SMTP provider in Supabase Auth. This requires separate approval because it creates a third-party provider account and may involve billing, sender-domain, or guardian-controlled information. Do not disable email confirmation just to bypass this delivery constraint.

## References

- [Supabase Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits)
- [Supabase custom SMTP guidance](https://supabase.com/docs/guides/auth/auth-smtp)
