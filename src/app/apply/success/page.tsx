"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ApplySuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-green-500/50 bg-green-900/30">
          <span className="text-3xl">✓</span>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-white">
          تم تقديم الطلب بنجاح!
        </h1>

        <p className="mb-6 text-slate-300">
          شكراً على انضمامك إلى برنامج الشركاء. سيقوم فريقنا بمراجعة طلبك خلال
          24-48 ساعة وسنرسل لك رسالة بريد إلكتروني بالنتيجة.
        </p>

        {email && (
          <div className="mb-6 rounded-lg border border-slate-600 bg-slate-900/50 p-4">
            <p className="mb-1 text-sm text-slate-400">تم الإرسال إلى:</p>
            <p className="break-all font-semibold text-white">{email}</p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            ✓ تحقق من بريدك الإلكتروني (بما في ذلك مجلد البريد العشوائي)
          </p>
          <p className="text-sm text-slate-400">
            ✓ سنرسل لك نتائج المراجعة قريباً
          </p>
          <p className="text-sm text-slate-400">
            ✓ إذا كان لديك أي سؤال، تواصل معنا
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href="/"
            className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-blue-500/50"
          >
            العودة للرئيسية
          </a>
          <a
            href="/"
            className="rounded-lg border border-slate-500 px-6 py-3 font-semibold text-slate-300 transition hover:border-blue-400 hover:text-blue-400"
          >
            تعرف أكثر عن البرنامج
          </a>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-slate-400">
          جاري التحميل...
        </div>
      }
    >
      <ApplySuccessContent />
    </Suspense>
  );
}
