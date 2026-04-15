"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Save, RefreshCw } from "lucide-react";

type FaqItem = { question: string; answer: string };
type SiteContentPayload = {
  "nav.middleLabel": string;
  "nav.middleUrl": string;
  "nav.ctaLabel": string;
  "hero.title": string;
  "hero.subtitle": string;
  "hero.badge": string;
  "hero.primaryCtaLabel": string;
  "hero.secondaryCtaLabel": string;
  "affiliate.explanation": string;
  "benefits.title": string;
  "benefits.description": string;
  "rewards.title": string;
  "rewards.description": string;
  "faq.title": string;
  "faq.description": string;
  "faq.items": FaqItem[];
  "footer.tagline": string;
};

const EMPTY_FAQ: FaqItem = { question: "", answer: "" };

export function ContentManager() {
  const [data, setData] = useState<SiteContentPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    void loadContent();
  }, []);

  async function loadContent() {
    setLoading(true);
    setStatus("");
    try {
      const token = localStorage.getItem("admin-token");
      const res = await fetch("/api/admin/content", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: "same-origin",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "فشل تحميل المحتوى");
      setData(json.data as SiteContentPayload);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function saveContent(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setStatus("");
    try {
      const token = localStorage.getItem("admin-token");
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "فشل حفظ المحتوى");
      setData(json.data as SiteContentPayload);
      setStatus("تم حفظ المحتوى بنجاح.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="py-16 text-center text-slate-300">
        جاري تحميل إعدادات المحتوى...
      </div>
    );
  }

  return (
    <form onSubmit={saveContent} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">إدارة المحتوى</h1>
          <p className="mt-2 text-slate-400">
            تعديل نصوص الواجهة الرئيسية والتنقل بدون إعادة نشر.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400"
          >
            رجوع للوحة
          </Link>
          <button
            type="button"
            onClick={() => void loadContent()}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400"
          >
            <RefreshCw className="inline h-4 w-4" /> تحديث
          </button>
        </div>
      </div>

      {status ? (
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
          {status}
        </div>
      ) : null}

      <section className="rounded-xl border border-cyan-500/20 bg-slate-900/40 p-5">
        <h2 className="mb-4 text-xl font-semibold text-white">إعدادات التنقل</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="نص الرابط الأوسط"
            value={data["nav.middleLabel"]}
            onChange={(value) => setData({ ...data, "nav.middleLabel": value })}
          />
          <InputField
            label="رابط الرابط الأوسط"
            value={data["nav.middleUrl"]}
            onChange={(value) => setData({ ...data, "nav.middleUrl": value })}
          />
          <InputField
            label="نص زر التقديم"
            value={data["nav.ctaLabel"]}
            onChange={(value) => setData({ ...data, "nav.ctaLabel": value })}
          />
        </div>
      </section>

      <section className="rounded-xl border border-cyan-500/20 bg-slate-900/40 p-5">
        <h2 className="mb-4 text-xl font-semibold text-white">محتوى الصفحة الرئيسية</h2>
        <div className="grid gap-4">
          <InputField
            label="عنوان Hero"
            value={data["hero.title"]}
            onChange={(value) => setData({ ...data, "hero.title": value })}
          />
          <TextField
            label="وصف Hero"
            value={data["hero.subtitle"]}
            onChange={(value) => setData({ ...data, "hero.subtitle": value })}
          />
          <InputField
            label="شارة Hero"
            value={data["hero.badge"]}
            onChange={(value) => setData({ ...data, "hero.badge": value })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="زر Hero الأساسي"
              value={data["hero.primaryCtaLabel"]}
              onChange={(value) =>
                setData({ ...data, "hero.primaryCtaLabel": value })
              }
            />
            <InputField
              label="زر Hero الثانوي"
              value={data["hero.secondaryCtaLabel"]}
              onChange={(value) =>
                setData({ ...data, "hero.secondaryCtaLabel": value })
              }
            />
          </div>
          <TextField
            label="نص شرح نظام الأفلييت"
            value={data["affiliate.explanation"]}
            onChange={(value) =>
              setData({ ...data, "affiliate.explanation": value })
            }
          />
          <InputField
            label="عنوان قسم المزايا"
            value={data["benefits.title"]}
            onChange={(value) => setData({ ...data, "benefits.title": value })}
          />
          <TextField
            label="وصف قسم المزايا"
            value={data["benefits.description"]}
            onChange={(value) =>
              setData({ ...data, "benefits.description": value })
            }
          />
          <InputField
            label="عنوان قسم المكافآت"
            value={data["rewards.title"]}
            onChange={(value) => setData({ ...data, "rewards.title": value })}
          />
          <TextField
            label="وصف قسم المكافآت"
            value={data["rewards.description"]}
            onChange={(value) =>
              setData({ ...data, "rewards.description": value })
            }
          />
          <InputField
            label="عنوان قسم FAQ"
            value={data["faq.title"]}
            onChange={(value) => setData({ ...data, "faq.title": value })}
          />
          <TextField
            label="وصف قسم FAQ"
            value={data["faq.description"]}
            onChange={(value) => setData({ ...data, "faq.description": value })}
          />
          <TextField
            label="نص تذييل الموقع"
            value={data["footer.tagline"]}
            onChange={(value) => setData({ ...data, "footer.tagline": value })}
          />
        </div>
      </section>

      <section className="rounded-xl border border-cyan-500/20 bg-slate-900/40 p-5">
        <h2 className="mb-4 text-xl font-semibold text-white">الأسئلة الشائعة</h2>
        <div className="space-y-4">
          {data["faq.items"].map((item, index) => (
            <div key={index} className="rounded-lg border border-slate-700 p-4">
              <InputField
                label={`السؤال ${index + 1}`}
                value={item.question}
                onChange={(value) => {
                  const next = [...data["faq.items"]];
                  next[index] = { ...next[index], question: value };
                  setData({ ...data, "faq.items": next });
                }}
              />
              <div className="mt-3">
                <TextField
                  label="الإجابة"
                  value={item.answer}
                  onChange={(value) => {
                    const next = [...data["faq.items"]];
                    next[index] = { ...next[index], answer: value };
                    setData({ ...data, "faq.items": next });
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                "faq.items": [...data["faq.items"], { ...EMPTY_FAQ }],
              })
            }
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400"
          >
            إضافة سؤال
          </button>
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
      </button>
    </form>
  );
}

function InputField(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-300">{props.label}</span>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
      />
    </label>
  );
}

function TextField(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-300">{props.label}</span>
      <textarea
        rows={3}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
      />
    </label>
  );
}
