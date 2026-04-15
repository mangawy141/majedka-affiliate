"use client";

import { useState } from "react";
import Link from "next/link";
import { FormInput, FormSelect } from "@/components/form/FormInputs";

export default function AdminCreateUserPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "ADMIN",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "فشل إنشاء المستخدم");
      setStatus("تم إنشاء المستخدم بنجاح.");
      setForm({ username: "", password: "", role: "ADMIN" });
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">إنشاء مسؤول جديد</h1>
            <p className="mt-2 text-slate-400">
              إنشاء مستخدم مسؤول من داخل النظام (بدون أي تسجيل عام).
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400"
          >
            رجوع
          </Link>
        </div>

        {status ? (
          <div className="mb-6 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            {status}
          </div>
        ) : null}

        <form
          onSubmit={onSubmit}
          className="glass rounded-2xl border border-cyan-500/20 p-6 space-y-5"
        >
          <FormInput
            label="اسم المستخدم"
            name="username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            required
          />
          <FormInput
            label="كلمة السر (12+)"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
          <FormSelect
            label="الدور"
            name="role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            options={[
              { value: "ADMIN", label: "ADMIN" },
              { value: "SUPER_ADMIN", label: "SUPER_ADMIN" },
            ]}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? "جارٍ الإنشاء..." : "إنشاء"}
          </button>
        </form>
      </div>
    </main>
  );
}

