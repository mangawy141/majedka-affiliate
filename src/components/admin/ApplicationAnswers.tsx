import React from "react";

interface Props {
  data?: Record<string, any> | null;
  questionsMap?: Record<string, string>;
}

export default function ApplicationAnswers({ data, questionsMap = {} }: Props) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-slate-400">لا توجد بيانات إضافية</div>;
  }

  const entries = Object.entries(data);

  return (
    <div className="grid gap-3">
      {entries.map(([key, value]) => {
        const label = questionsMap[key] || key;
        const display =
          value === null || value === undefined
            ? "-"
            : typeof value === "object"
              ? JSON.stringify(value)
              : String(value);

        return (
          <div
            key={key}
            className="flex items-start justify-between gap-4 bg-slate-900/30 rounded-lg p-3 border border-slate-700"
          >
            <div className="text-sm text-slate-400 w-1/3">{label}</div>
            <div className="text-sm text-white break-words">{display}</div>
          </div>
        );
      })}
    </div>
  );
}
