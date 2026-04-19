"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, Send, Zap, Users, Mail, Phone, MapPin } from "lucide-react";
import type { SiteContentMap } from "@/lib/site-content";

type FooterProps = {
  tagline: SiteContentMap["footer.tagline"];
};

export default function Footer({ tagline }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-cyan-500/20 glass-sm bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.jpg"
                alt="مجيدكا"
                width={40}
                height={40}
                className="rounded"
              />
              <span className="text-xl font-bold gradient-text">مجيدكا</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">{tagline}</p>
            <div className="flex gap-3">
              {[Globe, Send, Zap, Users].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 rounded-lg glass-sm border-cyan-500/20 hover:bg-cyan-500/20 transition"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                </button>
              ))}
            </div>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-bold text-white mb-4">عن المتجر</h3>
            <ul className="space-y-2">
              {["عن مجيدكا", "الميزات", "الأسعار", "الدعم"].map((item, i) => (
                <li key={i}>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-cyan-400 transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Player Links */}
          <div>
            <h3 className="font-bold text-white mb-4">للاعبين</h3>
            <ul className="space-y-2">
              {[
                "متجر الألعاب",
                "أفضل العروض",
                "الألعاب الجديدة",
                "قائمة الرغبات",
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href="#"
                    className="text-sm text-slate-400 hover:text-cyan-400 transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-bold text-white mb-4">التواصل</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>support@majedka.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cyan-500/20 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© 2024 مجيدكا. جميع الحقوق محفوظة.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-cyan-400 transition">
                سياسة الخصوصية
              </Link>
              <Link href="#" className="hover:text-cyan-400 transition">
                شروط الخدمة
              </Link>
              <Link href="#" className="hover:text-cyan-400 transition">
                سياسة الملفات
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/966501234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 p-4 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow z-40 text-white"
        title="تواصل معنا عبر WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.782 1.146 9.9 9.9 0 003.636 18.14c2.498.136 4.9-.899 6.623-2.745l.846-1.948-2.335-.662c-.72-.206-1.402-.624-1.96-1.239-.529-.583-.939-1.379-1.146-2.258.016-.035.031-.071.047-.108a9.9 9.9 0 00-1.9-11.326m5.421 7.403c.074.124.074.719-.173 1.413-.248.694-1.295 1.328-2.006 1.413-.511.077-1.159.109-1.871-.118-.432-.136-.985-.319-1.694-.625-2.98-1.287-4.927-4.289-5.076-4.487-.148-.199-1.213-1.612-1.213-3.074 0-1.463.768-2.182 1.04-2.479.272-.298.594-.372.792-.372.199 0 .397.002.57.01.182.01.427.032.669.51.247.595.841 2.058.916 2.207.075.149.024.322-.025.52-.1.199-.149.323-.298.497-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.298.77 1.271 1.653 2.059 1.135 1.012 2.093 1.325 2.39 1.475.297.148.471.124.644-.075.173-.198.743-.867.94-1.164.199-.298.397-.249.67-.15.272.1 1.733.718 2.03.967z" />
        </svg>
      </a>
    </footer>
  );
}
