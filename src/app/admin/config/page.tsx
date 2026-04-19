"use client";

import { useState } from "react";
import { QuestionsManager } from "@/components/admin/questions-manager";
import { SocialMediaManager } from "@/components/admin/social-media-manager";

export default function AdminConfigPage() {
  const [activeTab, setActiveTab] = useState<"questions" | "social">(
    "questions",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">إدارة الموقع</h1>
          <p className="text-slate-400">
            إدارة أسئلة النموذج ووسائل التواصل الاجتماعي
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "questions"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            أسئلة النموذج
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === "social"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            وسائل التواصل
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-900/50 p-8 rounded-lg border border-slate-800">
          {activeTab === "questions" && <QuestionsManager />}
          {activeTab === "social" && <SocialMediaManager />}
        </div>
      </div>
    </div>
  );
}
