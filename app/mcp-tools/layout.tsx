import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP 工具箱 - ClawDiary",
  description: "发现和集成 AI Agent 的必备工具 │ Model Context Protocol 生态",
};

export default function MCPToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}