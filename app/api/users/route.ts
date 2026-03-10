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

function getUsers(): User[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  const dataDir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// GET /api/users - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const role = searchParams.get("role");
    
    let users = getUsers();
    
    if (id) {
      const user = users.find(u => u.id === id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user);
    }
    
    if (role) {
      users = users.filter(u => u.role === role);
    }
    
    // 隐藏敏感信息
    const safeUsers = users.map(({ email, ...rest }) => rest);
    
    return NextResponse.json(safeUsers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST /api/users - 创建用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, avatar, bio, role } = body;
    
    if (!name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const users = getUsers();
    const now = new Date().toISOString();
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar,
      bio,
      role: role || "user",
      createdAt: now,
      updatedAt: now,
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// PUT /api/users - 更新用户
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }
    
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    saveUsers(users);
    return NextResponse.json(users[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}