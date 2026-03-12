import { NextRequest, NextResponse } from 'next/server';

// 模拟敏感词库
const sensitiveWords = new Set([
  '密码', '信用卡', '身份证', '手机号', '地址',
  '银行卡', '账号', '口令', '验证码',
]);

// 敏感内容检测结果缓存
const sensitiveResults: Map<string, {
  hasSensitive: boolean;
  words: string[];
  score: number;
  checkedAt: string;
}> = new Map();

// GET - 检查日记敏感内容
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const diaryId = params.id;
  
  const cached = sensitiveResults.get(diaryId);
  if (cached) {
    return NextResponse.json({
      diaryId,
      ...cached,
      cached: true
    });
  }
  
  return NextResponse.json({
    diaryId,
    hasSensitive: false,
    words: [],
    score: 0,
    checkedAt: new Date().toISOString()
  });
}

// POST - 扫描敏感内容
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diaryId = params.id;
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return NextResponse.json({
        success: false,
        error: '缺少内容参数'
      }, { status: 400 });
    }
    
    // 扫描敏感词
    const foundWords: string[] = [];
    sensitiveWords.forEach(word => {
      if (content.includes(word)) {
        foundWords.push(word);
      }
    });
    
    // 计算敏感度评分
    const score = Math.min(100, foundWords.length * 20);
    const hasSensitive = foundWords.length > 0;
    
    // 缓存结果
    sensitiveResults.set(diaryId, {
      hasSensitive,
      words: foundWords,
      score,
      checkedAt: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      diaryId,
      hasSensitive,
      words: foundWords,
      score,
      suggestion: hasSensitive 
        ? '检测到可能的敏感内容，建议添加密码保护'
        : '未检测到敏感内容',
      checkedAt: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '扫描失败'
    }, { status: 500 });
  }
}

// PUT - 添加自定义敏感词
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { word } = body;
    
    if (!word || typeof word !== 'string') {
      return NextResponse.json({
        success: false,
        error: '无效的敏感词'
      }, { status: 400 });
    }
    
    sensitiveWords.add(word);
    
    return NextResponse.json({
      success: true,
      message: `已添加敏感词: ${word}`,
      totalWords: sensitiveWords.size
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '添加失败'
    }, { status: 500 });
  }
}

// DELETE - 移除敏感词
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word');
    
    if (!word) {
      return NextResponse.json({
        success: false,
        error: '缺少参数'
      }, { status: 400 });
    }
    
    const deleted = sensitiveWords.delete(word);
    
    return NextResponse.json({
      success: deleted,
      message: deleted 
        ? `已移除敏感词: ${word}` 
        : `敏感词不存在: ${word}`,
      totalWords: sensitiveWords.size
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '删除失败'
    }, { status: 500 });
  }
}