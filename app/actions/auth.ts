"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };
const credentials = z.object({ email: z.string().email("Enter a valid email address."), password: z.string().min(8, "Use at least 8 characters.") });

function parse(formData: FormData) { return credentials.safeParse({ email: formData.get("email"), password: formData.get("password") }); }

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const input = parse(formData); if (!input.success) return { error: input.error.issues[0]?.message };
  const client = await createSupabaseServerClient(); if (!client) return { error: "Authentication is not configured yet. Add Supabase environment variables first." };
  const { error } = await client.auth.signInWithPassword(input.data); if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const input = parse(formData); if (!input.success) return { error: input.error.issues[0]?.message };
  const client = await createSupabaseServerClient(); if (!client) return { error: "Authentication is not configured yet. Add Supabase environment variables first." };
  const { error, data } = await client.auth.signUp({ email: input.data.email, password: input.data.password, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback` } });
  if (error) return { error: error.message };
  if (!data.session) return { message: "Account created. Check your email to confirm your address, then sign in." };
  redirect("/dashboard");
}

export async function signOut() { const client = await createSupabaseServerClient(); await client?.auth.signOut(); redirect("/"); }
