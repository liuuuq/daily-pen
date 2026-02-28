import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DailyPen - 每日表达力训练",
  description: "写作、演讲、表达，每天进步一点点",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased warm-pattern min-h-screen`}
      >
        <TooltipProvider>
          <main className="pb-20 md:pb-0 md:pl-20">{children}</main>
          <BottomNav />
        </TooltipProvider>
      </body>
    </html>
  );
}
