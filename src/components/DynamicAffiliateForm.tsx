"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect";
  placeholder?: string;
  required: boolean;
  order: number;
  options?: Array<{ label: string; value: string }>;
}

interface FormData {
  [key: string]: string;
}

export function DynamicAffiliateForm() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/config");
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("فشل تحميل نموذج التقديم");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    questions.forEach((question) => {
      if (question.required && !formData[question.id]?.trim()) {
        newErrors[question.id] = "هذا الحقل مطلوب";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSubmitting(true);

    try {
      const answers: Record<string, string> = {};
      questions.forEach((q) => {
        answers[q.label] = formData[q.id] || "";
      });

      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData[questions[0]?.id] || "",
          email: formData[questions[1]?.id] || "",
          phone: formData[questions[2]?.id] || "",
          country: "",
          contentType: "",
          experience: "",
          motivation: formData[questions[questions.length - 1]?.id] || "",
          socialLinks: answers,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit application");
      }

      const data = await response.json();
      toast.success("تم استقبال طلبك بنجاح!");
      router.push("/apply/success");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء التقديم",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-300">
        لم يتم تحديد أسئلة النموذج بعد
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            {question.type === "text" && (
              <>
                <label className="block text-sm font-medium text-slate-200">
                  {question.label}
                  {question.required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder={question.placeholder || ""}
                  value={formData[question.id] || ""}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all ${
                    errors[question.id]
                      ? "border-red-500 bg-red-500/10"
                      : "border-slate-700"
                  }`}
                />
                {errors[question.id] && (
                  <p className="text-sm text-red-400">{errors[question.id]}</p>
                )}
              </>
            )}

            {question.type === "textarea" && (
              <>
                <label className="block text-sm font-medium text-slate-200">
                  {question.label}
                  {question.required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </label>
                <textarea
                  placeholder={question.placeholder || ""}
                  value={formData[question.id] || ""}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none ${
                    errors[question.id]
                      ? "border-red-500 bg-red-500/10"
                      : "border-slate-700"
                  }`}
                />
                {errors[question.id] && (
                  <p className="text-sm text-red-400">{errors[question.id]}</p>
                )}
              </>
            )}

            {question.type === "select" && question.options && (
              <>
                <label className="block text-sm font-medium text-slate-200">
                  {question.label}
                  {question.required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </label>

                {/* Render a free-text input instead of a select so users can type their answer */}
                <input
                  type="text"
                  placeholder={question.placeholder || ""}
                  value={formData[question.id] || ""}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all ${
                    errors[question.id]
                      ? "border-red-500 bg-red-500/10"
                      : "border-slate-700"
                  }`}
                />

                {/* Show available options as a hint (non-editable) to guide the user */}
                {question.options.length > 0 && (
                  <p className="text-sm text-slate-400 mt-2">
                    أمثلة: {question.options.map((o) => o.label).join(" • ")}
                  </p>
                )}

                {errors[question.id] && (
                  <p className="text-sm text-red-400">{errors[question.id]}</p>
                )}
              </>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          {submitting ? "جاري التقديم..." : "انضم الآن"}
        </button>
      </form>
    </div>
  );
}
