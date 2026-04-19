"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  MessageCircle,
  Camera,
  Music,
} from "lucide-react";
import toast from "react-hot-toast";

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

const platformIcons: Record<string, React.ReactNode> = {
  whatsapp: <MessageCircle size={20} />,
  instagram: <Camera size={20} />,
  tiktok: <Music size={20} />,
};

export function SocialMediaManager() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<SocialLink>>({
    order: 0,
  });

  // Fetch social media links
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/admin/social-media");
      if (!response.ok) throw new Error("Failed to fetch social media links");
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error("Error fetching social media links:", error);
      toast.error("فشل تحميل وسائل التواصل");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.platform || !formData.label || !formData.url) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      const url = editing
        ? `/api/admin/social-media?id=${editing.id}`
        : "/api/admin/social-media";

      const method = editing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save social media link");

      toast.success(
        editing ? "تم تحديث رابط التواصل بنجاح" : "تم إضافة رابط التواصل بنجاح",
      );
      setShowForm(false);
      setEditing(null);
      setFormData({ order: 0 });
      fetchLinks();
    } catch (error) {
      console.error("Error saving social media link:", error);
      toast.error("فشل حفظ رابط التواصل");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الرابط؟")) return;

    try {
      const response = await fetch(`/api/admin/social-media?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete social media link");

      toast.success("تم حذف رابط التواصل بنجاح");
      fetchLinks();
    } catch (error) {
      console.error("Error deleting social media link:", error);
      toast.error("فشل حذف رابط التواصل");
    }
  };

  const handleEdit = (link: SocialLink) => {
    setEditing(link);
    setFormData(link);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">إدارة وسائل التواصل</h3>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ order: 0 });
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          إضافة رابط
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass p-6 rounded-lg space-y-4">
          <h4 className="text-lg font-semibold">
            {editing ? "تعديل رابط التواصل" : "إضافة رابط تواصل جديد"}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">المنصة</label>
              <select
                value={formData.platform || ""}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">اختر المنصة</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الاسم</label>
              <input
                type="text"
                value={formData.label || ""}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="مثال: اتصل بنا على واتس"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الرابط</label>
              <input
                type="url"
                value={formData.url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="https://wa.me/966..."
              />
            </div>

            {formData.platform === "whatsapp" && (
              <div>
                <label className="block text-sm font-medium mb-1">نوع الأيقونة</label>
                <select
                  value={formData.icon || "message-circle"}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="message-circle">رسالة (الافتراضي)</option>
                  <option value="phone">هاتف</option>
                  <option value="send">إرسال</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">الترتيب</label>
              <input
                type="number"
                value={formData.order || 0}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
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

      {/* Links List */}
      <div className="space-y-2">
        {links.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            لم يتم إضافة روابط تواصل بعد
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="glass p-4 rounded-lg flex items-center justify-between hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-cyan-400">
                  {platformIcons[link.platform]}
                </div>
                <div>
                  <div className="font-medium">{link.label}</div>
                  <div className="text-sm text-slate-400 truncate">
                    {link.url}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(link)}
                  className="p-2 hover:bg-slate-700 rounded transition-colors"
                  title="تعديل"
                >
                  <Edit2 size={18} className="text-cyan-400" />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
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
