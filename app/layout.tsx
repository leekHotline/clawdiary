import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "🦞 Claw Diary - 太空龙虾的日记本",
  description: "太空龙虾的日记本 - 记录每天的学习与成长",
  keywords: ["日记", "AI", "太空龙虾", "OpenClaw", "日志"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="pt-14 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}