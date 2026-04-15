"use client";

import React, { useId } from "react";

export interface CardSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface CardSelectProps {
  options: CardSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  className?: string;
  /** Accessible label for the group (renders legend + aria-labelledby) */
  legend: string;
  name: string;
  error?: string;
  describedById?: string;
  /** Extra classes for the option grid (e.g. sm:grid-cols-2) */
  gridClassName?: string;
}

/**
 * Card-based selection (single or multi) with strong focus/hover/active states for dark UI.
 */
export function CardSelect({
  options,
  selected,
  onChange,
  multiSelect = false,
  className = "",
  legend,
  name,
  error,
  describedById,
  gridClassName = "",
}: CardSelectProps) {
  const baseId = useId();
  const groupId = `${baseId}-group`;
  const legendId = `${baseId}-legend`;

  const handleSelect = (value: string) => {
    if (multiSelect) {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(next);
    } else {
      onChange([value]);
    }
  };

  return (
    <fieldset className={`min-w-0 border-0 p-0 ${className}`}>
      <legend
        id={legendId}
        className="mb-4 block text-base font-semibold leading-snug tracking-tight text-cyan-200/95"
      >
        {legend}
      </legend>

      <div
        role={multiSelect ? "group" : "radiogroup"}
        id={groupId}
        aria-labelledby={legendId}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [describedById, error ? `${groupId}-err` : ""]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 ${gridClassName}`}
      >
        {options.map((option, index) => {
          const isSelected = selected.includes(option.value);
          const optionId = `${groupId}-opt-${index}`;

          return (
            <button
              key={option.value}
              id={optionId}
              type="button"
              name={name}
              role={multiSelect ? "checkbox" : "radio"}
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => handleSelect(option.value)}
              className={[
                "relative flex min-h-[5.5rem] flex-col items-center justify-center rounded-xl border-2 p-5 text-center transition-all duration-200",
                "outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                "active:scale-[0.98]",
                isSelected
                  ? "border-cyan-400 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40"
                  : "border-slate-600/80 bg-slate-900/60 text-slate-200 hover:border-cyan-500/60 hover:bg-slate-800/70",
              ].join(" ")}
            >
              {isSelected && (
                <span className="absolute end-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-sm">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}

              {option.icon && (
                <span
                  className={`mb-2 text-2xl sm:text-3xl ${isSelected ? "opacity-100" : "opacity-85"}`}
                  aria-hidden
                >
                  {option.icon}
                </span>
              )}

              <span
                className={`text-sm font-semibold leading-tight sm:text-[0.95rem] ${isSelected ? "text-white" : "text-slate-100"}`}
              >
                {option.label}
              </span>

              {option.description && (
                <span
                  className={`mt-1 text-xs leading-relaxed sm:text-sm ${isSelected ? "text-cyan-100/85" : "text-slate-400"}`}
                >
                  {option.description}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p
          id={`${groupId}-err`}
          className="mt-3 text-sm font-medium text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}

export default CardSelect;
