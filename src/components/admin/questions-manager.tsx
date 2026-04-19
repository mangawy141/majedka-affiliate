"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";

interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect";
  placeholder?: string;
  required: boolean;
  order: number;
  options?: Array<{ label: string; value: string }>;
  isActive: boolean;
}

export function QuestionsManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Question>>({
    type: "text",
    required: true,
    order: 0,
  });

  // Fetch questions
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/admin/questions");
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("فشل تحميل الأسئلة");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.label) {
      toast.error("يرجى إدخال نص السؤال");
      return;
    }

    try {
      const url = editing
        ? `/api/admin/questions?id=${editing.id}`
        : "/api/admin/questions";

      const method = editing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save question");

      toast.success(
        editing ? "تم تحديث السؤال بنجاح" : "تم إضافة السؤال بنجاح"
      );
      setShowForm(false);
      setEditing(null);
      setFormData({ type: "text", required: true, order: 0 });
      fetchQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("فشل حفظ السؤال");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;

    try {
      const response = await fetch(`/api/admin/questions?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete question");

      toast.success("تم حذف السؤال بنجاح");
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("فشل حذف السؤال");
    }
  };

  const handleEdit = (question: Question) => {
    setEditing(question);
    setFormData(question);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">إدارة أسئلة النموذج</h3>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ type: "text", required: true, order: 0 });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          إضافة سؤال
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass p-6 rounded-lg space-y-4">
          <h4 className="text-lg font-semibold">
            {editing ? "تعديل السؤال" : "إضافة سؤال جديد"}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                نص السؤال
              </label>
              <input
                type="text"
                value={formData.label || ""}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="مثال: اسمك"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  نوع الحقل
                </label>
                <select
                  value={formData.type || "text"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="text">نص</option>
                  <option value="textarea">منطقة نصية</option>
                  <option value="select">قائمة منسدلة</option>
                  <option value="multiselect">اختيار متعدد</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  الترتيب
                </label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                النص المساعد
              </label>
              <input
                type="text"
                value={formData.placeholder || ""}
                onChange={(e) =>
                  setFormData({ ...formData, placeholder: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="مثال: أدخل اسمك الكامل"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required || false}
                onChange={(e) =>
                  setFormData({ ...formData, required: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="required" className="text-sm">
                حقل مطلوب
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded transition-colors"
              >
                حفظ
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-2">
        {questions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            لم يتم إضافة أسئلة بعد
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className="glass p-4 rounded-lg flex items-center justify-between hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium">
                  {question.order + 1}. {question.label}
                </div>
                <div className="text-sm text-slate-400">
                  {question.type} {question.required ? "• مطلوب" : ""}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(question)}
                  className="p-2 hover:bg-slate-700 rounded transition-colors"
                  title="تعديل"
                >
                  <Edit2 size={18} className="text-cyan-400" />
                </button>
                <button
                  onClick={() => handleDelete(question.id)}
                  className="p-2 hover:bg-slate-700 rounded transition-colors"
                  title="حذف"
                >
                  <Trash2 size={18} className="text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
