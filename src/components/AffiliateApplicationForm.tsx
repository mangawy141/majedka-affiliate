"use client";

import { useState } from "react";
import { Send, AlertCircle, CheckCircle } from "lucide-react";
import { FormInput, FormTextarea } from "@/components/form/FormInputs";

export default function AffiliateApplicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    platform: "",
    followers: "",
    contentType: "",
    motivation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "الاسم مطلوب";
    if (!formData.email.trim()) errors.email = "البريد الإلكتروني مطلوب";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "بريد إلكتروني غير صحيح";
    if (!formData.platform.trim()) errors.platform = "المنصة مطلوبة";
    if (!formData.followers.trim()) errors.followers = "عدد المتابعين مطلوب";
    if (!formData.contentType.trim()) errors.contentType = "نوع المحتوى مطلوب";
    if (!formData.motivation.trim()) errors.motivation = "أخبرنا عن خططك";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Build payload: top-level known fields and pack any other inputs into `socialLinks`
      const { name, email, phone, country, contentType, motivation, ...rest } =
        formData;

      const socialLinks: Record<string, string> = {};
      Object.entries(rest).forEach(([k, v]) => {
        if (v && String(v).trim() !== "") {
          socialLinks[k] = String(v);
        }
      });

      const payload: any = { name, email };
      if (phone) payload.phone = phone;
      if (country) payload.country = country;
      if (contentType) payload.contentType = contentType;
      if (motivation) payload.motivation = motivation;
      if (Object.keys(socialLinks).length) payload.socialLinks = socialLinks;

      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل في إرسال الطلب");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        country: "",
        platform: "",
        followers: "",
        contentType: "",
        motivation: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-green-500/50 bg-green-500/20">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">
            تم استقبال طلبك!
          </h2>
          <p className="mb-6 text-slate-400">
            شكراً لتقديمك. سيتم مراجعة طلبك من قبل فريقنا في خلال 24-48 ساعة
          </p>
          <p className="text-sm text-slate-500">
            سنرسل لك رسالة على بريدك الإلكتروني بنتائج المراجعة
          </p>
        </div>
      </div>
    );
  }

  return (
    <section id="apply" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute -top-20 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl gradient-text">
            قدّم الآن
          </h2>
          <p className="text-lg leading-relaxed text-slate-400">
            ملي النموذج أدناه وسنتصل بك في أقرب وقت
          </p>
        </div>

        <div className="glass rounded-2xl border border-cyan-500/20 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-10" noValidate>
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div>
              <h3 className="mb-6 text-lg font-semibold tracking-wide text-cyan-200/95">
                المعلومات الشخصية
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput
                  label="الاسم"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الكامل"
                  required
                  error={formErrors.name}
                />

                <FormInput
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  error={formErrors.email}
                />

                <FormInput
                  label="رقم الهاتف"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+966..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormInput
                label="الدولة (اختياري)"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="مثال: السعودية أو الإمارات"
              />

              <FormInput
                label="المنصة التي تستخدمها *"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                placeholder="مثال: YouTube أو TikTok أو Instagram"
                required
                error={formErrors.platform}
              />

              <FormInput
                label="عدد متابعيك *"
                name="followers"
                value={formData.followers}
                onChange={handleChange}
                placeholder="مثال: 15K أو 1200"
                required
                error={formErrors.followers}
              />

              <FormInput
                label="نوع محتواك *"
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                placeholder="مثال: تقنية أو ألعاب أو تعليم"
                required
                error={formErrors.contentType}
              />
            </div>

            <FormTextarea
              label="لماذا تريد الانضمام إلى برنامجنا؟"
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              placeholder="اخبرنا عن خططك في برنامج الأفلييت وكيف ستروج لنا..."
              required
              error={formErrors.motivation}
              rows={5}
              maxLength={500}
              showCharCount={true}
            />

            <button
              type="submit"
              disabled={loading}
              className={[
                "flex w-full items-center justify-center gap-2 rounded-xl py-4 px-6 font-bold transition-all duration-300",
                loading
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 active:scale-[0.99]",
              ].join(" ")}
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  إرسال الطلب
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
