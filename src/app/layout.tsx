import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
