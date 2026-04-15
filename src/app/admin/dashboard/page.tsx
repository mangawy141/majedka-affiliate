"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Pencil,
  Bell,
  Mail,
  MessageCircle,
} from "lucide-react";
import { FormInput, FormSelect } from "@/components/form/FormInputs";

interface AffiliateCode {
  id: string;
  code: string;
  name: string;
  owner: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ApiResponse {
  success?: boolean;
  data?: AffiliateCode[];
  pagination?: PaginationInfo;
  error?: string;
}

interface ApiSuccessResponse extends ApiResponse {
  success: true;
  data: AffiliateCode[];
  pagination: PaginationInfo;
}

interface AffiliateApplication {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  affiliateCode?: { code: string } | null;
  whatsappUrl?: string | null;
  emailUrl?: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [codes, setCodes] = useState<AffiliateCode[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    owner: "",
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [applications, setApplications] = useState<AffiliateApplication[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [appLoading, setAppLoading] = useState(false);

  // Fetch codes
  const fetchCodes = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: searchTerm,
        sortBy,
        order: sortOrder,
      });

      const response = await fetch(`/api/affiliate-codes?${params}`, {
        credentials: "same-origin",
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "فشل في تحميل البيانات");
      }

      const successData = data as ApiSuccessResponse;
      setCodes(successData.data);
      setPagination(successData.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes(1);
  }, [searchTerm, sortBy, sortOrder]);

  const fetchApplications = async () => {
    try {
      setAppLoading(true);
      const response = await fetch(
        "/api/admin/applications?status=PENDING&page=1&limit=20",
        {
          credentials: "same-origin",
        },
      );

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = (await response.json()) as {
        success?: boolean;
        data?: AffiliateApplication[];
        pendingCount?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "فشل تحميل الطلبات");
      }

      setApplications(data.data || []);
      setPendingCount(data.pendingCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ في تحميل الطلبات");
    } finally {
      setAppLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = window.setInterval(fetchApplications, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const handleApplicationAction = async (
    id: string,
    action: "approve" | "reject",
  ) => {
    const rejectionReason =
      action === "reject"
        ? prompt("يرجى إدخال سبب الرفض", "غير مطابق لشروط البرنامج") || ""
        : undefined;
    if (action === "reject" && !(rejectionReason ?? "").trim()) return;

    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action, rejectionReason }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "فشل تحديث الطلب");
      fetchApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    }
  };

  const handleAddCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/affiliate-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل إنشاء الكود");
      }

      setFormData({ code: "", name: "", owner: "" });
      setShowAddForm(false);
      fetchCodes(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm("هل تتأكد من حذف هذا الكود؟")) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/affiliate-codes/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("فشل حذف الكود");
      }

      fetchCodes(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      /* ignore */
    }
    router.push("/admin/login");
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold gradient-text">لوحة المسؤول</h1>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
                <Bell className="h-4 w-4" />
                طلبات جديدة: {pendingCount}
              </div>
              <Link
                href="/admin/content"
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20"
              >
                إدارة المحتوى
              </Link>
              <Link
                href="/admin/create-user"
                className="rounded-lg border border-slate-600 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400"
              >
                إضافة مسؤول
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Pending Applications */}
        <div className="mb-8 glass rounded-xl border border-cyan-500/20 overflow-hidden">
          <div className="border-b border-cyan-500/20 bg-slate-900/50 px-6 py-4">
            <h2 className="text-xl font-semibold text-cyan-200">
              طلبات التسجيل الجديدة
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              يتم توليد كود أفلييت تلقائياً مع كل طلب. يمكنك الموافقة أو الرفض.
            </p>
          </div>
          {appLoading ? (
            <div className="p-6 text-slate-400">جاري تحميل الطلبات...</div>
          ) : applications.length === 0 ? (
            <div className="p-6 text-slate-400">لا توجد طلبات معلقة حالياً.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/40">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs text-cyan-300">الاسم</th>
                    <th className="px-6 py-3 text-right text-xs text-cyan-300">الكود</th>
                    <th className="px-6 py-3 text-right text-xs text-cyan-300">التواصل</th>
                    <th className="px-6 py-3 text-right text-xs text-cyan-300">التاريخ</th>
                    <th className="px-6 py-3 text-right text-xs text-cyan-300">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-100">{app.name}</div>
                        <div className="text-xs text-slate-400">{app.email}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-cyan-300">
                        {app.affiliateCode?.code || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {app.emailUrl && (
                            <a
                              href={app.emailUrl}
                              className="inline-flex items-center gap-1 rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:border-cyan-400"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              Email
                            </a>
                          )}
                          {app.whatsappUrl && (
                            <a
                              href={app.whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:border-cyan-400"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(app.createdAt).toLocaleString("ar-SA")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApplicationAction(app.id, "approve")}
                            className="rounded bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/30"
                          >
                            موافقة
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplicationAction(app.id, "reject")}
                            className="rounded bg-red-500/20 px-3 py-1 text-xs text-red-300 hover:bg-red-500/30"
                          >
                            رفض
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <FormInput
                label="بحث عن كود"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن كود أو اسم..."
                icon={<Search className="w-5 h-5" />}
              />
            </div>

            {/* Add Code Button */}
            <div className="flex items-end">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full px-6 py-3 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                إضافة كود جديد
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <FormSelect
              label="ترتيب حسب"
              name="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "createdAt", label: "تاريخ الإنشاء" },
                { value: "clicks", label: "عدد النقرات" },
                { value: "name", label: "الاسم" },
              ]}
            />
            <FormSelect
              label="الترتيب"
              name="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              options={[
                { value: "desc", label: "تنازلي" },
                { value: "asc", label: "تصاعدي" },
              ]}
            />
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-8 glass rounded-xl p-6 border border-cyan-500/20">
            <h2 className="text-xl font-bold mb-4">إضافة كود جديد</h2>
            <form
              onSubmit={handleAddCode}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <FormInput
                label="الكود (اختياري)"
                name="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="سيتم إنشاء تلقائي إذا ترك فارغ"
              />
              <FormInput
                label="الاسم *"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="اسم الكود"
                required
              />
              <FormInput
                label="المالك *"
                name="owner"
                value={formData.owner}
                onChange={(e) =>
                  setFormData({ ...formData, owner: e.target.value })
                }
                placeholder="اسم المالك"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="md:col-span-3 px-6 py-3 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "جاري الإنشاء..." : "إنشاء الكود"}
              </button>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="glass rounded-xl border border-cyan-500/20 overflow-hidden">
          {loading && codes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">جاري التحميل...</p>
            </div>
          ) : codes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">لا توجد أكواد حتى الآن</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-cyan-500/20">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-cyan-300">
                      الكود
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-cyan-300">
                      الاسم
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-cyan-300">
                      المالك
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-cyan-300">
                      النقرات
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-cyan-300">
                      التاريخ
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-cyan-300">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {codes.map((code) => (
                    <tr
                      key={code.id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => copyToClipboard(code.code, code.id)}
                          className="flex items-center gap-2 font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          {code.code}
                          {copiedId === code.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{code.name}</td>
                      <td className="px-6 py-4 text-slate-400">{code.owner}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm">
                          {code.clicks}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(code.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/codes/${code.id}`}
                            className="rounded-lg p-2 text-cyan-400 transition hover:bg-cyan-500/10 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                            title="تعديل"
                          >
                            <Pencil className="h-5 w-5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteCode(code.id)}
                            className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                            title="حذف"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => fetchCodes(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-slate-400">
              {pagination.page} / {pagination.pages}
            </span>

            <button
              onClick={() => fetchCodes(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
