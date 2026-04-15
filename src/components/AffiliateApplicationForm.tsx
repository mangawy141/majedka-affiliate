"use client";

import { useState } from "react";
import {
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { CardSelect } from "@/components/form/CardSelect";
import {
  FormInput,
  FormTextarea,
} from "@/components/form/FormInputs";

interface CardSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

const COUNTRY_OPTIONS: CardSelectOption[] = [
  { value: "SA", label: "السعودية", description: "المملكة العربية السعودية" },
  { value: "AE", label: "الإمارات", description: "دولة الإمارات" },
  { value: "EG", label: "مصر", description: "جمهورية مصر" },
  { value: "KW", label: "الكويت", description: "دولة الكويت" },
  { value: "QA", label: "قطر", description: "دولة قطر" },
  { value: "OTHER", label: "أخرى", description: "دولة أخرى" },
];

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

  const platformOptions: CardSelectOption[] = [
    {
      value: "youtube",
      label: "YouTube",
      description: "فيديوهات طويلة",
      icon: "📺",
    },
    { value: "tiktok", label: "TikTok", description: "محتوى قصير", icon: "🎵" },
    { value: "twitch", label: "Twitch", description: "بث مباشر", icon: "🎮" },
    {
      value: "instagram",
      label: "Instagram",
      description: "صور وفيديو قصير",
      icon: "📸",
    },
    { value: "twitter", label: "Twitter/X", description: "تغريدات", icon: "𝕏" },
    { value: "discord", label: "Discord", description: "مجتمع", icon: "💬" },
    {
      value: "website",
      label: "Blogging",
      description: "موقع ويب",
      icon: "📝",
    },
  ];

  const followersOptions: CardSelectOption[] = [
    { value: "100-1000", label: "100 - 1K", description: "البداية" },
    { value: "1000+", label: "1K+", description: "نمو مبكر" },
    { value: "10000+", label: "10K+", description: "وسط" },
    { value: "100000+", label: "100K+", description: "كبير" },
    { value: "1000000+", label: "1M+", description: "ضخم" },
  ];

  const contentTypeOptions: CardSelectOption[] = [
    {
      value: "gaming",
      label: "ألعاب",
      description: "محتوى الألعاب",
      icon: "🎮",
    },
    { value: "tech", label: "تقنية", description: "تكنولوجيا", icon: "💻" },
    {
      value: "lifestyle",
      label: "نمط حياة",
      description: "يومي وترفيهي",
      icon: "✨",
    },
    {
      value: "reviews",
      label: "مراجعات",
      description: "منتجات وخدمات",
      icon: "⭐",
    },
    {
      value: "education",
      label: "تعليم",
      description: "دروس وشروحات",
      icon: "📚",
    },
    { value: "other", label: "أخرى", description: "فئات أخرى", icon: "🌟" },
  ];

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

  const handleCardSelect = (field: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [field]: values[0] || "" }));
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "الاسم مطلوب";
    if (!formData.email.trim()) errors.email = "البريد الإلكتروني مطلوب";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "بريد إلكتروني غير صحيح";
    if (!formData.platform) errors.platform = "اختر منصة";
    if (!formData.followers) errors.followers = "اختر عدد المتابعين";
    if (!formData.contentType) errors.contentType = "اختر نوع المحتوى";
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
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          country: formData.country || undefined,
          platform: formData.platform,
          followers: formData.followers,
          contentType: formData.contentType || undefined,
          motivation: formData.motivation || undefined,
          socialLinks: {
            platform: formData.platform,
            followers: formData.followers,
          },
        }),
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

            <CardSelect
              legend="الدولة (اختياري)"
              name="country"
              options={COUNTRY_OPTIONS}
              selected={formData.country ? [formData.country] : []}
              onChange={(sel) => handleCardSelect("country", sel)}
              multiSelect={false}
              gridClassName="sm:grid-cols-2 lg:grid-cols-3"
            />

            <CardSelect
              legend="المنصة التي تستخدمها *"
              name="platform"
              options={platformOptions}
              selected={formData.platform ? [formData.platform] : []}
              onChange={(sel) => handleCardSelect("platform", sel)}
              multiSelect={false}
              error={formErrors.platform}
            />

            <CardSelect
              legend="عدد متابعيك *"
              name="followers"
              options={followersOptions}
              selected={formData.followers ? [formData.followers] : []}
              onChange={(sel) => handleCardSelect("followers", sel)}
              multiSelect={false}
              error={formErrors.followers}
            />

            <CardSelect
              legend="نوع محتواك *"
              name="contentType"
              options={contentTypeOptions}
              selected={formData.contentType ? [formData.contentType] : []}
              onChange={(sel) => handleCardSelect("contentType", sel)}
              multiSelect={false}
              error={formErrors.contentType}
            />

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
