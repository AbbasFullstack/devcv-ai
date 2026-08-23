import { redirect } from "next/navigation";
import { DashboardWorkspace } from "@/components/dashboard-workspace";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (isSupabaseConfigured && !user) redirect("/signin");
  return <DashboardWorkspace email={user?.email ?? "preview@devcv.local"} isPreviewAccount={!isSupabaseConfigured} />;
}
