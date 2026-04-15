"use client";

interface Props {
  affiliates: any[];
  onSelectAffiliate: (affiliate: any) => void;
  onRefresh: () => void;
}

export function AffiliateTable({
  affiliates,
  onSelectAffiliate,
  onRefresh,
}: Props) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs">
            قيد المراجعة
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-xs">
            موافق عليه
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 py-1 bg-red-900/30 text-red-300 rounded-full text-xs">
            مرفوض
          </span>
        );
      default:
        return null;
    }
  };

  if (affiliates.length === 0) {
    return <div className="text-center py-8 text-slate-400">لا توجد نتائج</div>;
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50">
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                الاسم
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                البريد
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                الكود
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                الكليكات
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                المبيعات
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                الأرباح
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">
                الإجراء
              </th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((affiliate) => (
              <tr
                key={affiliate.id}
                className="border-b border-slate-700 hover:bg-slate-800/50 transition"
              >
                <td className="px-6 py-3 text-white font-medium">
                  {affiliate.name}
                </td>
                <td className="px-6 py-3 text-slate-300 text-sm">
                  {affiliate.email}
                </td>
                <td className="px-6 py-3">
                  <code className="bg-slate-900 text-cyan-400 px-2 py-1 rounded text-sm">
                    {affiliate.affiliateCode}
                  </code>
                </td>
                <td className="px-6 py-3">
                  {getStatusBadge(affiliate.status)}
                </td>
                <td className="px-6 py-3 text-white">
                  {affiliate.totalClicks}
                </td>
                <td className="px-6 py-3 text-white">{affiliate.totalSales}</td>
                <td className="px-6 py-3 text-green-400 font-semibold">
                  ${affiliate.totalEarnings.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => onSelectAffiliate(affiliate)}
                    className="text-blue-400 hover:text-blue-300 transition text-sm font-medium"
                  >
                    عرض
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
