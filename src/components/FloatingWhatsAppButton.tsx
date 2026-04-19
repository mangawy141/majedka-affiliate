"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppConfig {
  id: string;
  platform: string;
  url: string;
  icon?: string;
}

export function FloatingWhatsAppButton() {
  const [whatsappLink, setWhatsappLink] = useState<WhatsAppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhatsAppLink = async () => {
      try {
        const response = await fetch("/api/config");
        if (!response.ok) throw new Error("Failed to fetch config");
        const data = await response.json();

        // Find WhatsApp link
        const wa = data.socialLinks?.find(
          (link: WhatsAppConfig) => link.platform === "whatsapp"
        );

        if (wa) {
          setWhatsappLink(wa);
        }
      } catch (error) {
        console.error("Error fetching WhatsApp config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWhatsAppLink();
  }, []);

  if (loading || !whatsappLink) {
    return null;
  }

  return (
    <a
      href={whatsappLink.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 end-8 z-40 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
      title="اتصل بنا على WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
