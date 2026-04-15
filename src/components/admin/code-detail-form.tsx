"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save, Trash2 } from "lucide-react";
import { FormInput } from "@/components/form/FormInputs";

type CodeRow = {
  id: string;
  code: string;
  name: string;
  owner: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
};

function authHeaders(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  return h;
}

export function CodeDetailForm({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [row, setRow] = useState<CodeRow | null>(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    owner: "",
    clicks: 0,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/affiliate-codes/${id}`, {
          headers: authHeaders(),
          credentials: "same-origin",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "فشل التحميل");
        }
        if (cancelled) return;
        const r = data.data as CodeRow;
        setRow(r);
        setForm({
          code: r.code,
          name: r.name,
          owner: r.owner,
          clicks: r.clicks,
        });
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "خطأ");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/affiliate-codes/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        credentials: "same-origin",
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          owner: form.owner,
          clicks: form.clicks,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الحفظ");
      setRow(data.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("حذف هذا الكود نهائياً؟")) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/affiliate-codes/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الحذف");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطأ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div
          className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"
          aria-label="جاري التحميل"
        />
      </div>
    );
  }

  if (!row) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
        {error || "غير موجود"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400/90 transition hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          العودة للوحة
        </Link>
        <p className="text-sm text-slate-500">
          أُنشئ في{" "}
          {new Date(row.createdAt).toLocaleString("ar-SA", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          تعديل الكود
        </h1>
        <p className="mt-2 text-slate-400">
          المعرف الفني:{" "}
          <span className="font-mono text-slate-300">{row.id}</span>
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="glass space-y-6 rounded-2xl border border-cyan-500/20 p-6 sm:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormInput
            label="كود التتبع (slug)"
            name="code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            placeholder="مثال: ahmed-x"
            helpText="يُخزَّن بحروف صغيرة وشرطات؛ يُستخدم في الروابط."
          />
          <FormInput
            label="التسمية الظاهرة"
            name="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder='مثال: "Ahmed X"'
            required
          />
        </div>

        <FormInput
          label="المالك"
          name="owner"
          value={form.owner}
          onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
          placeholder="اسم أو وصف المالك"
          required
        />

        <FormInput
          label="عدد النقرات"
          name="clicks"
          type="number"
          value={String(form.clicks)}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              clicks: Math.max(0, parseInt(e.target.value, 10) || 0),
            }))
          }
          helpText="يمكن ضبط العدد يدوياً عند الحاجة."
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            حذف الكود
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 active:scale-[0.99] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </form>
    </div>
  );
}
