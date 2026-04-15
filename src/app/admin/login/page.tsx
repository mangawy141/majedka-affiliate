"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock, User } from "lucide-react";
import { FormInput } from "@/components/form/FormInputs";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/session", {
        credentials: "same-origin",
      });
      if (res.ok) {
        router.replace("/admin/dashboard");
      }
    })();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      // Redirect to dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-cyan-500/20 border border-cyan-500/50 mb-6">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3 gradient-text">
            لوحة المسؤول
          </h1>
          <p className="text-slate-400">تسجيل الدخول لإدارة رموز الأفلييت</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8 border border-cyan-500/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Username */}
            <FormInput
              label="اسم المستخدم"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="أدخل اسم المستخدم"
              required
              icon={<User className="w-5 h-5" />}
            />

            {/* Password */}
            <FormInput
              label="كلمة السر"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="أدخل كلمة السر"
              required
              icon={<Lock className="w-5 h-5" />}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 px-4 rounded-lg font-semibold
                transition-all duration-300
                flex items-center justify-center gap-2

                ${
                  loading
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:from-cyan-400 hover:to-cyan-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-cyan-400 rounded-full animate-spin" />
                  جاري التحميل...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
