"use client";

import { useState } from "react";

interface Props {
  affiliate: any;
  onClose: () => void;
  onApprove: (id: string, customCode?: string) => void;
  onReject: (id: string, reason: string) => void;
  onRefresh: () => void;
}

export function AffiliateDetailModal({
  affiliate,
  onClose,
  onApprove,
  onReject,
  onRefresh,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [customCode, setCustomCode] = useState(affiliate.affiliateCode);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/affiliates/${affiliate.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          customCode:
            customCode !== affiliate.affiliateCode ? customCode : undefined,
        }),
      });

      if (response.ok) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.error("Error approving:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      alert("يجب تقديم سبب الرفض");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/affiliates/${affiliate.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          rejectionReason,
        }),
      });

      if (response.ok) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.error("Error rejecting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{affiliate.name}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">البريد</p>
              <p className="text-white font-medium">{affiliate.email}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">الدولة</p>
              <p className="text-white font-medium">
                {affiliate.country || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">نوع المحتوى</p>
              <p className="text-white font-medium">
                {affiliate.contentType || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">الحالة</p>
              <p
                className={`font-medium ${
                  affiliate.status === "PENDING"
                    ? "text-yellow-400"
                    : affiliate.status === "APPROVED"
                      ? "text-green-400"
                      : "text-red-400"
                }`}
              >
                {affiliate.status}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <p className="text-slate-400 text-xs">الكليكات</p>
              <p className="text-2xl font-bold text-white">
                {affiliate.totalClicks}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs">المبيعات</p>
              <p className="text-2xl font-bold text-white">
                {affiliate.totalSales}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs">الأرباح</p>
              <p className="text-2xl font-bold text-green-400">
                ${affiliate.totalEarnings.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Actions */}
          {affiliate.status === "PENDING" && (
            <div className="space-y-4 pt-4 border-t border-slate-700">
              {!showRejectForm ? (
                <>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      كود مخصص (اختياري)
                    </label>
                    <input
                      type="text"
                      value={customCode}
                      onChange={(e) =>
                        setCustomCode(e.target.value.toUpperCase())
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                      placeholder="AFF-CUSTOM123"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleApprove}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {loading ? "جاري..." : "موافق"}
                    </button>
                    <button
                      onClick={() => setShowRejectForm(true)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      رفض
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      سبب الرفض
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                      rows={3}
                      placeholder="اشرح سبب الرفض..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleReject}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {loading ? "جاري..." : "تأكيد الرفض"}
                    </button>
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="flex-1 px-4 py-2 text-slate-300 border border-slate-600 rounded hover:border-slate-500 transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
