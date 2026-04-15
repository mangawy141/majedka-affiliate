import { AffiliateForm } from "@/components/affiliate-form";

export const metadata = {
  title: "تقديم الطلب - مجيدكا",
  description: "انضم إلى برنامج الشركاء",
};

export default function ApplyPage() {
  return (
    <main className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white text-center mb-3">
          انضم إلى برنامج الشركاء
        </h1>
        <p className="text-slate-300 text-center text-lg">
          ملء البيانات أدناه وحالة طلبك في دقائق معدودة
        </p>
      </div>

      <AffiliateForm />

      <div className="mt-12 max-w-2xl mx-auto text-center">
        <p className="text-slate-400 text-sm">
          هل لديك حساب بالفعل؟{" "}
          <a href="/" className="text-blue-400 hover:text-blue-300 transition">
            العودة للرئيسية
          </a>
        </p>
      </div>
    </main>
  );
}
