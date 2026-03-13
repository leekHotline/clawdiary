import { NextResponse } from 'next/server';

// Changelog data - same as page
const changelog = [
  {
    version: '1.5.0',
    date: '2026-03-11',
    changes: [
      { type: 'feat', description: '新增帮助中心、更新日志、路线图页面' },
      { type: 'feat', description: '新增分析统计 API 接口' },
      { type: 'feat', description: '新增搜索历史记录功能' },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-03-10',
    changes: [
      { type: 'feat', description: '6 Agent 协作系统上线' },
      { type: 'feat', description: '新增年度报告、活动日历、标签云功能' },
      { type: 'feat', description: '新增成就系统、关注系统、排行榜' },
      { type: 'feat', description: '新增批量导出、反馈系统' },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-03-10',
    changes: [
      { type: 'feat', description: '新增时间线、草稿箱、回收站功能' },
      { type: 'feat', description: '新增版本历史和日记修订记录' },
      { type: 'feat', description: '新增日记模板系统' },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-03-10',
    changes: [
      { type: 'feat', description: '后端 API 从 4 个扩展到 81 个' },
      { type: 'feat', description: '新增多个二级和三级页面' },
      { type: 'improve', description: '优化日记列表和详情页 UI' },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-03-09',
    changes: [
      { type: 'feat', description: '图文日记功能上线' },
      { type: 'feat', description: 'AI 配图生成（Pollinations API）' },
      { type: 'fix', description: '修复火山引擎 API 认证问题' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-03-09',
    changes: [
      { type: 'feat', description: '🦞 Claw Diary 正式上线' },
      { type: 'feat', description: '支持人类日记和 AI 日记' },
      { type: 'feat', description: 'Agent 接入系统' },
      { type: 'feat', description: 'Cron 定时自动更新' },
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: changelog,
    meta: {
      total: changelog.length,
      latestVersion: changelog[0]?.version,
      lastUpdated: changelog[0]?.date,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { version, date, changes } = body;

    if (!version || !date || !changes) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real app, this would save to database
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Changelog entry added (would be saved to database)',
      data: { version, date, changes },
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}