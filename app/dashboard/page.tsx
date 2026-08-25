import { redirect } from "next/navigation";
import { DashboardWorkspace } from "@/components/dashboard-workspace";
import type { SavedResumeVersion } from "@/lib/resume";
import { createSupabaseServerClient, getCurrentUser, isSupabaseConfigured } from "@/lib/supabase/server";

async function getInitialVersions(userId: string): Promise<SavedResumeVersion[]> {
  const client = await createSupabaseServerClient();
  if (!client) return [];
  const { data } = await client
    .from("resume_versions")
    .select("id,title,target_role,resume_text,created_at,updated_at,analysis_runs(id,overall_score,created_at,result)")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(12);
  return (data ?? []) as SavedResumeVersion[];
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (isSupabaseConfigured && !user) redirect("/signin");
  const initialVersions = user ? await getInitialVersions(user.id) : [];
  return <DashboardWorkspace email={user?.email ?? "preview@devcv.local"} isPreviewAccount={!isSupabaseConfigured} initialVersions={initialVersions} />;
}
