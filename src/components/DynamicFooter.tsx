"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Camera,
  Music,
  Mail,
  Smartphone,
  Phone,
  Send,
} from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon?: string;
  order: number;
}

const iconMap: Record<string, React.ReactNode> = {
  whatsapp: <MessageCircle size={24} />,
  instagram: <Camera size={24} />,
  tiktok: <Music size={24} />,
  email: <Mail size={24} />,
  phone: <Smartphone size={24} />,
};

export function DynamicFooter() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("/api/config");
        if (!response.ok) throw new Error("Failed to fetch social links");
        const data = await response.json();
        setSocialLinks(data.socialLinks || []);
      } catch (error) {
        console.error("Error fetching social links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const currentYear = new Date().getFullYear();

  if (loading) {
    return null;
  }

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="مجيدكا"
                width={48}
                height={48}
                className="rounded"
              />
              <div className="flex flex-col">
                <div className="text-2xl font-bold gradient-text">مجيدكا</div>
              </div>
            </Link>
            <p className="text-slate-400">
              برنامج التسويق بالعمولة الأول في الشرق الأوسط للألعاب الرقمية
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-100">روابط سريعة</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-cyan-400 transition-colors"
                >
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  شروط الاستخدام
                </a>
              </li>
            </ul>
          </div>

          {/* Social media section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-100">تابعنا</h3>
            <div className="flex gap-4 flex-wrap">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => {
                  // Get the icon to display
                  let icon = iconMap[link.platform];

                  // For WhatsApp, check if there's a custom icon preference
                  if (link.platform === "whatsapp" && link.icon) {
                    const customIcons: Record<string, React.ReactNode> = {
                      "message-circle": <MessageCircle size={24} />,
                      phone: <Phone size={24} />,
                      send: <Send size={24} />,
                    };
                    icon = customIcons[link.icon] || icon;
                  }

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.label}
                      className="p-3 glass rounded-full hover:bg-cyan-500/30 transition-all duration-300 transform hover:scale-110 text-cyan-400"
                    >
                      {icon || <span className="text-lg">{link.icon}</span>}
                    </a>
                  );
                })
              ) : (
                <div className="text-slate-400 text-sm">
                  لا توجد وسائل تواصل مضافة بعد
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              &copy; {currentYear} GameStore. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                شروط الخدمة
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
