"use client";

import { useState } from "react";
import type { SiteContentMap } from "@/lib/site-content";

type FAQSectionProps = {
  title: SiteContentMap["faq.title"];
  description: SiteContentMap["faq.description"];
  items: SiteContentMap["faq.items"];
};

export function FAQSection({ title, description, items }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-4 bg-slate-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-slate-300">{description}</p>
        </div>

        <div className="space-y-4">
          {items.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500/30 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800 transition-colors"
              >
                <h3 className="text-white font-semibold text-left">
                  {faq.question}
                </h3>
                <span
                  className={`text-blue-400 text-xl transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700">
                  <p className="text-slate-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
