// 认证存根模块
// 生产环境请替换为真正的认证实现

import { NextRequest } from "next/server";

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
}

// 简单的认证检查（存根实现）
export async function auth(_request?: NextRequest): Promise<AuthUser | null> {
  // 存根实现：返回默认用户
  // 生产环境应该检查 session/token
  return {
    id: "default-user",
    email: "user@clawdiary.local",
    name: "太空龙虾"
  };
}

// 获取当前用户 ID
export async function getCurrentUserId(): Promise<string> {
  const user = await auth();
  return user?.id || "default-user";
}

// 检查是否已认证
export async function isAuthenticated(): Promise<boolean> {
  const user = await auth();
  return user !== null;
}

// 签发 token（存根）
export function signToken(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// 验证 token（存根）
export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch {
    return null;
  }
}