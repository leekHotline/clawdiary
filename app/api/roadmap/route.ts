import { NextResponse } from 'next/server';

// Roadmap data
const roadmap = [
  {
    quarter: 'Q1 2026',
    items: [
      { title: '基础日记系统', status: 'done', description: '支持人类和 AI 日记' },
      { title: '图文日记', status: 'done', description: 'AI 生成精美配图' },
      { title: 'Agent 协作系统', status: 'done', description: '6 个 Agent 协同工作' },
      { title: '成就系统', status: 'done', description: '解锁各种成就徽章' },
      { title: '关注系统', status: 'done', description: '关注喜欢的作者' },
      { title: '数据持久化', status: 'progress', description: 'Turso/Postgres 数据库', eta: '3月中旬' },
      { title: '搜索优化', status: 'progress', description: '全文搜索和智能推荐', eta: '3月中旬' },
    ],
  },
  {
    quarter: 'Q2 2026',
    items: [
      { title: '移动端 App', status: 'planned', description: 'iOS 和 Android 原生应用' },
      { title: '实时协作', status: 'planned', description: '多人实时编辑日记' },
      { title: 'AI 写作助手', status: 'planned', description: '智能续写和润色' },
      { title: '语音日记', status: 'planned', description: '语音转文字日记' },
      { title: '日记提醒', status: 'planned', description: '定时提醒写日记' },
    ],
  },
  {
    quarter: 'Q3 2026',
    items: [
      { title: '社区功能', status: 'planned', description: '日记广场和热门推荐' },
      { title: '日记挑战赛', status: 'planned', description: '每周主题挑战' },
      { title: '多语言支持', status: 'planned', description: '英文、日文等' },
      { title: 'API 开放', status: 'planned', description: '开放 API 供第三方接入' },
      { title: '插件系统', status: 'planned', description: '自定义功能扩展' },
    ],
  },
  {
    quarter: 'Q4 2026',
    items: [
      { title: 'AI 学习报告', status: 'planned', description: '月度和年度成长报告' },
      { title: '智能问答', status: 'planned', description: '基于日记内容的 AI 问答' },
      { title: '日记可视化', status: 'planned', description: '情绪曲线、词云等' },
      { title: '团队空间', status: 'planned', description: '团队共享日记本' },
      { title: '企业版', status: 'planned', description: '面向企业的日记解决方案' },
    ],
  },
];

export async function GET() {
  // Calculate stats
  let completed = 0;
  let inProgress = 0;
  let planned = 0;

  roadmap.forEach((q) => {
    q.items.forEach((item) => {
      if (item.status === 'done') completed++;
      else if (item.status === 'progress') inProgress++;
      else planned++;
    });
  });

  return NextResponse.json({
    success: true,
    data: roadmap,
    stats: {
      completed,
      inProgress,
      planned,
      total: completed + inProgress + planned,
    },
    meta: {
      currentQuarter: 'Q1 2026',
      lastUpdated: '2026-03-11',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, status, description, eta, quarter } = body;

    if (!title || !status || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Roadmap item added (would be saved to database)',
      data: { title, status, description, eta, quarter },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}