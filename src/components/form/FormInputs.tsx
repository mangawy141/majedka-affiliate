"use client";

import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * Enhanced form input with better styling and accessibility
 */
export function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText,
  disabled = false,
  icon,
}: FormInputProps) {
  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-200 mb-3"
      >
        {label}
        {required && <span className="text-cyan-400 ml-1">*</span>}
      </label>

      {/* Input Container with Icon */}
      <div className="relative group">
        {icon && (
          <div className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-cyan-400">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg transition-all duration-300
            bg-slate-900/50 border-2
            text-white placeholder-slate-500
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
            disabled:opacity-50 disabled:cursor-not-allowed

            ${icon ? "ps-12" : ""}

            ${
              error
                ? "border-red-500/50 focus:border-red-400 focus:bg-red-500/5"
                : "border-slate-700 focus:border-cyan-400 focus:bg-cyan-500/5"
            }
          `}
        />

        {/* Focus glow */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 bg-cyan-400/5 pointer-events-none" />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm mt-2 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-slate-400 text-sm mt-2">{helpText}</p>
      )}
    </div>
  );
}

interface FormSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Enhanced select input with better styling
 */
export function FormSelect({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  placeholder,
}: FormSelectProps) {
  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-200 mb-3"
      >
        {label}
        {required && <span className="text-cyan-400 ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg transition-all duration-300
            bg-slate-900/50 border-2
            text-white appearance-none cursor-pointer
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
            disabled:opacity-50 disabled:cursor-not-allowed

            ${
              error
                ? "border-red-500/50 focus:border-red-400 focus:bg-red-500/5"
                : "border-slate-700 focus:border-cyan-400 focus:bg-cyan-500/5"
            }
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm mt-2 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

/**
 * Enhanced textarea input with character counter
 */
export function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  rows = 5,
  maxLength,
  showCharCount = true,
}: FormTextareaProps) {
  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-200 mb-3"
      >
        {label}
        {required && <span className="text-cyan-400 ms-1">*</span>}
      </label>

      {/* Textarea */}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-4 py-3 rounded-lg transition-all duration-300
          bg-slate-900/50 border-2 resize-y min-h-[6rem]
          text-white placeholder-slate-500 font-sans leading-relaxed
          focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
          disabled:opacity-50 disabled:cursor-not-allowed

          ${
            error
              ? "border-red-500/50 focus:border-red-400 focus:bg-red-500/5"
              : "border-slate-700 focus:border-cyan-400 focus:bg-cyan-500/5"
          }
        `}
      />

      {/* Character Count and Error */}
      <div className="flex justify-between items-start mt-2">
        {error ? (
          <p className="text-red-400 text-sm flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        ) : null}

        {showCharCount && maxLength && (
          <p
            className={`text-sm ml-auto ${
              value.length > maxLength * 0.9
                ? "text-amber-400"
                : "text-slate-400"
            }`}
          >
            {value.length} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
