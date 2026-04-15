import { CodeDetailForm } from "@/components/admin/code-detail-form";

export const metadata = {
  title: "تعديل كود أفلييت",
  description: "عرض وتعديل كود التتبع",
};

export default async function AdminCodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <CodeDetailForm id={id} />
      </div>
    </div>
  );
}
