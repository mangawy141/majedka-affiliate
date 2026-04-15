"use client";

import { useEffect, useState } from "react";
import { AffiliateTable } from "@/components/admin/affiliate-table";
import { AffiliateDetailModal } from "@/components/admin/affiliate-detail-modal";

interface Affiliate {
  id: string;
  name: string;
  email: string;
  country?: string;
  contentType?: string;
  affiliateCode: string;
  status: string;
  totalClicks: number;
  totalSales: number;
  totalEarnings: number;
  createdAt: string;
  approvedAt?: string;
}

export function AdminDashboard() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(
    null,
  );
  const [page, setPage] = useState(1);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/affiliates?status=${filter}&page=${page}&limit=10`,
      );
      const data = await response.json();
      setAffiliates(data.data);
    } catch (error) {
      console.error("Error fetching affiliates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, [filter, page]);

  const handleApprove = async (id: string, customCode?: string) => {
    // Will be passed to modal
  };

  const handleReject = async (id: string, reason: string) => {
    // Will be passed to modal
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة تحكم الشركاء</h1>
        <div className="flex gap-2">
          {["PENDING", "APPROVED", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg transition ${
                filter === status
                  ? "bg-blue-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {status === "PENDING" && "قيد المراجعة"}
              {status === "APPROVED" && "موافق عليهم"}
              {status === "REJECTED" && "مرفوضين"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {affiliates.length > 0 && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm">الإجمالي</p>
            <p className="text-2xl font-bold text-white">{affiliates.length}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm">الكليكات</p>
            <p className="text-2xl font-bold text-white">
              {affiliates.reduce((sum, a) => sum + a.totalClicks, 0)}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm">المبيعات</p>
            <p className="text-2xl font-bold text-white">
              {affiliates.reduce((sum, a) => sum + a.totalSales, 0)}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm">الأرباح الكلية</p>
            <p className="text-2xl font-bold text-white">
              $
              {affiliates
                .reduce((sum, a) => sum + a.totalEarnings, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : (
        <AffiliateTable
          affiliates={affiliates}
          onSelectAffiliate={setSelectedAffiliate}
          onRefresh={fetchAffiliates}
        />
      )}

      {/* Detail Modal */}
      {selectedAffiliate && (
        <AffiliateDetailModal
          affiliate={selectedAffiliate}
          onClose={() => setSelectedAffiliate(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRefresh={fetchAffiliates}
        />
      )}
    </div>
  );
}
