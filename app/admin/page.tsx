import { redirect } from "next/navigation";
import { getAdminFromCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getAdminFromCookie();
  if (admin) redirect("/admin/jobs");
  redirect("/admin/login");
}
