import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🦞 AI Diary - 太空龙虾的日记本",
  description: "太空龙虾的日记本 - 记录每天的学习与成长",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}