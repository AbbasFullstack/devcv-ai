"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { boundedResumeText, resumeSaveInputSchema, type SavedResumeVersion } from "@/lib/resume";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";

export type ResumeActionResult = { error?: string; message?: string; version?: SavedResumeVersion };
const versionIdSchema = z.string().uuid();

export async function saveResumeVersion(input: unknown): Promise<ResumeActionResult> {
  const parsed = resumeSaveInputSchema.safeParse(input);
  if (!parsed.success) return { error: "Add a title, target role, and at least 80 characters of resume text before saving." };

  const client = await createSupabaseServerClient();
  const user = await getCurrentUser();
  if (!client || !user) return { error: "Sign in to save a resume version." };

  const { data: version, error: versionError } = await client
    .from("resume_versions")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      target_role: parsed.data.role,
      resume_text: boundedResumeText(parsed.data.resume),
    })
    .select("id,title,target_role,resume_text,created_at,updated_at")
    .single();

  if (versionError || !version) return { error: "The resume version could not be saved. Please try again." };

  if (parsed.data.analysis) {
    const { error: analysisError } = await client.from("analysis_runs").insert({
      user_id: user.id,
      resume_version_id: version.id,
      target_role: parsed.data.role,
      overall_score: parsed.data.analysis.overallScore,
      result: parsed.data.analysis,
    });
    if (analysisError) {
      await client.from("resume_versions").delete().eq("id", version.id);
      return { error: "The analysis history could not be saved, so no resume version was kept. Please try again." };
    }
  }

  revalidatePath("/dashboard");
  return { version: { ...version, analysis_runs: [] }, message: parsed.data.analysis ? "Resume and AI analysis saved." : "Resume version saved without analysis." };
}

export async function deleteResumeVersion(versionId: string): Promise<ResumeActionResult> {
  const parsed = versionIdSchema.safeParse(versionId);
  if (!parsed.success) return { error: "The saved version identifier is invalid." };

  const client = await createSupabaseServerClient();
  const user = await getCurrentUser();
  if (!client || !user) return { error: "Sign in to delete a saved version." };

  const { error } = await client.from("resume_versions").delete().eq("id", parsed.data);
  if (error) return { error: "The saved version could not be deleted." };

  revalidatePath("/dashboard");
  return { message: "Saved resume version deleted." };
}
