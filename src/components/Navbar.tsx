"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import type { SiteContentMap } from "@/lib/site-content";

type NavbarProps = {
  middleLabel: SiteContentMap["nav.middleLabel"];
  middleUrl: SiteContentMap["nav.middleUrl"];
  ctaLabel: SiteContentMap["nav.ctaLabel"];
};

export default function Navbar({
  middleLabel,
  middleUrl,
  ctaLabel,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="مجيدكا"
                width={36}
                height={36}
                className="rounded"
              />
              <span>مجيدكا</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="hover:text-cyan-400 transition text-sm font-medium"
            >
              الرئيسية
            </Link>
            <a
              href={middleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition text-sm font-medium"
            >
              {middleLabel}
            </a>
          </div>

          {/* Search & Icons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#apply"
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition rounded-lg border border-cyan-500/40 font-medium text-sm"
            >
              {ctaLabel}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-cyan-500/20 transition rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-cyan-500/20 glass-sm">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block hover:text-cyan-400 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              الرئيسية
            </Link>
            <a
              href={middleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-cyan-400 transition py-2"
              onClick={() => setIsOpen(false)}
            >
              {middleLabel}
            </a>
            <Link
              href="#apply"
              className="block bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition py-2 px-3 rounded-lg border border-cyan-500/40 text-center font-medium"
              onClick={() => setIsOpen(false)}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
