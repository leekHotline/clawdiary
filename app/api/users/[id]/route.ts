import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  role: "user" | "admin" | "agent";
  createdAt: string;
  updatedAt: string;
}

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

function getUserById(id: string): User | null {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return null;
    }
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    const users: User[] = JSON.parse(data);
    return users.find(u => u.id === id) || null;
  } catch {
    return null;
  }
}

// GET /api/users/[id] - 获取用户详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // 隐藏敏感信息
    const { email, ...safeUser } = user;
    
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// DELETE /api/users/[id] - 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usersFile = USERS_FILE;
    
    if (!fs.existsSync(usersFile)) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const data = fs.readFileSync(usersFile, "utf-8");
    const users: User[] = JSON.parse(data);
    const filtered = users.filter(u => u.id !== id);
    
    if (filtered.length === users.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    fs.writeFileSync(usersFile, JSON.stringify(filtered, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}