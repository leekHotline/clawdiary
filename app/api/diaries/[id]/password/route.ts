import { NextRequest, NextResponse } from 'next/server';

// 模拟密码保护的日记存储
const protectedDiaries: Record<string, { 
  password: string; 
  hint?: string;
  createdAt: string;
  attempts: number;
  lockedUntil?: string;
}> = {};

// 验证密码的哈希函数（简化版）
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// GET - 获取日记保护状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const diaryId = (await params).id;
  
  const protection = protectedDiaries[diaryId];
  
  return NextResponse.json({
    isProtected: !!protection,
    hint: protection?.hint,
    attempts: protection?.attempts || 0,
    isLocked: protection?.lockedUntil ? new Date(protection.lockedUntil) > new Date() : false,
    lockedUntil: protection?.lockedUntil
  });
}

// POST - 设置密码保护
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { password, hint, action } = body;
    const diaryId = (await params).id;

    if (action === 'verify') {
      // 验证密码
      const protection = protectedDiaries[diaryId];
      
      if (!protection) {
        return NextResponse.json({ 
          success: false, 
          error: '此日记未设置密码保护' 
        }, { status: 400 });
      }

      // 检查是否被锁定
      if (protection.lockedUntil && new Date(protection.lockedUntil) > new Date()) {
        const remainingTime = Math.ceil((new Date(protection.lockedUntil).getTime() - Date.now()) / 60000);
        return NextResponse.json({ 
          success: false, 
          error: `密码错误次数过多，请 ${remainingTime} 分钟后重试`,
          locked: true,
          remainingTime
        }, { status: 403 });
      }

      const hashedPassword = hashPassword(password);
      
      if (hashedPassword === protection.password) {
        // 重置尝试次数
        protection.attempts = 0;
        protection.lockedUntil = undefined;
        
        return NextResponse.json({ 
          success: true, 
          message: '密码验证成功' 
        });
      } else {
        // 增加尝试次数
        protection.attempts += 1;
        
        // 如果尝试次数过多，锁定账户
        if (protection.attempts >= 5) {
          const lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 锁定30分钟
          protection.lockedUntil = lockUntil.toISOString();
          
          return NextResponse.json({ 
            success: false, 
            error: '密码错误次数过多，账户已被锁定30分钟',
            locked: true,
            attempts: protection.attempts
          }, { status: 403 });
        }
        
        return NextResponse.json({ 
          success: false, 
          error: `密码错误，还剩 ${5 - protection.attempts} 次尝试机会`,
          attempts: protection.attempts
        }, { status: 401 });
      }
    }

    if (action === 'set') {
      // 设置密码保护
      if (!password || password.length < 4) {
        return NextResponse.json({ 
          success: false, 
          error: '密码至少需要4个字符' 
        }, { status: 400 });
      }

      protectedDiaries[diaryId] = {
        password: hashPassword(password),
        hint: hint || undefined,
        createdAt: new Date().toISOString(),
        attempts: 0
      };

      return NextResponse.json({ 
        success: true, 
        message: '密码保护设置成功' 
      });
    }

    if (action === 'remove') {
      // 移除密码保护
      const { currentPassword } = body;
      const protection = protectedDiaries[diaryId];
      
      if (!protection) {
        return NextResponse.json({ 
          success: false, 
          error: '此日记未设置密码保护' 
        }, { status: 400 });
      }

      if (hashPassword(currentPassword) !== protection.password) {
        return NextResponse.json({ 
          success: false, 
          error: '密码错误，无法移除保护' 
        }, { status: 401 });
      }

      delete protectedDiaries[diaryId];
      
      return NextResponse.json({ 
        success: true, 
        message: '密码保护已移除' 
      });
    }

    if (action === 'change') {
      // 修改密码
      const { oldPassword, newPassword, newHint } = body;
      const protection = protectedDiaries[diaryId];
      
      if (!protection) {
        return NextResponse.json({ 
          success: false, 
          error: '此日记未设置密码保护' 
        }, { status: 400 });
      }

      if (hashPassword(oldPassword) !== protection.password) {
        return NextResponse.json({ 
          success: false, 
          error: '原密码错误' 
        }, { status: 401 });
      }

      if (!newPassword || newPassword.length < 4) {
        return NextResponse.json({ 
          success: false, 
          error: '新密码至少需要4个字符' 
        }, { status: 400 });
      }

      protection.password = hashPassword(newPassword);
      protection.hint = newHint || undefined;
      protection.attempts = 0;
      protection.lockedUntil = undefined;

      return NextResponse.json({ 
        success: true, 
        message: '密码修改成功' 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: '未知操作' 
    }, { status: 400 });

  } catch (error) {
    console.error('Password protection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: '操作失败' 
    }, { status: 500 });
  }
}

// DELETE - 强制移除保护（需要管理员权限）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const diaryId = (await params).id;
  
  if (protectedDiaries[diaryId]) {
    delete protectedDiaries[diaryId];
    return NextResponse.json({ 
      success: true, 
      message: '密码保护已强制移除' 
    });
  }

  return NextResponse.json({ 
    success: false, 
    error: '未找到密码保护' 
  }, { status: 404 });
}