import { ContentManager } from "@/components/admin/content-manager";

export const metadata = {
  title: "إدارة المحتوى",
  description: "تعديل محتوى الموقع والتنقل",
};

export default function AdminContentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <ContentManager />
      </div>
    </main>
  );
}
