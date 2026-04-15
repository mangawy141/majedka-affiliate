import { redirect } from "next/navigation";

// Canonical entry point for admin now lives at /admin/dashboard (protected by middleware).
export default function AdminPage() {
  redirect("/admin/dashboard");
}
