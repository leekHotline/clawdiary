import { NextRequest, NextResponse } from 'next/server';

// 模拟日记数据
const MOCK_DIARIES = [
  {
    id: '1',
    title: '今天完成了一个重要项目',
    date: '2026-03-24',
    content: '终于把那个困扰我两周的项目完成了！过程中遇到了很多挑战，但最终都一一克服。特别是那个性能优化的部分，原本以为需要重写整个模块，结果发现只是几个小问题导致的。',
    tags: ['工作', '成就', '成长']
  },
  {
    id: '2',
    title: '周末的咖啡时光',
    date: '2026-03-23',
    content: '今天和朋友约在了一家新开的咖啡馆。阳光很好，咖啡也很香。我们聊了很多，从工作到生活，从过去到未来。',
    tags: ['生活', '朋友', '放松']
  },
  {
    id: '3',
    title: '关于学习的一点思考',
    date: '2026-03-22',
    content: '今天读到一句话：学习的本质不是记住知识，而是改变思维方式。这让我反思自己的学习习惯。',
    tags: ['学习', '思考']
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const action = searchParams.get('action');

  if (action === 'list') {
    // 返回最近日记列表
    return NextResponse.json({
      diaries: MOCK_DIARIES
    });
  }

  if (action === 'generate') {
    const diaryId = searchParams.get('id');
    const diary = MOCK_DIARIES.find(d => d.id === diaryId) || MOCK_DIARIES[0];

    // 生成播客脚本
    const podcast = generatePodcastScript(diary);
    return NextResponse.json(podcast);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diaryId, diary } = body;

    const targetDiary = diary || MOCK_DIARIES.find(d => d.id === diaryId);
    if (!targetDiary) {
      return NextResponse.json({ error: 'Diary not found' }, { status: 404 });
    }

    // 生成播客脚本
    const podcast = generatePodcastScript(targetDiary);
    return NextResponse.json(podcast);
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

function generatePodcastScript(diary: any) {
  const title = `《${diary.title}》- 日记播客`;

  return {
    title,
    diary: {
      id: diary.id,
      title: diary.title,
      date: diary.date,
    },
    intro: [
      {
        speaker: 'host1',
        name: '小播',
        content: `欢迎来到今天的日记播客！我是主持人小播。`,
        emotion: 'happy'
      },
      {
        speaker: 'host2',
        name: '小客',
        content: `我是小客！今天我们要分享的是一篇写于${diary.date}的日记。`,
        emotion: 'neutral'
      }
    ],
    mainStory: [
      {
        speaker: 'host2',
        name: '小客',
        content: `在这篇日记中，作者写道："${diary.content.substring(0, 100)}..."`,
        emotion: 'thoughtful'
      },
      {
        speaker: 'host1',
        name: '小播',
        content: `这段文字让我感受到了作者当时的真实情感。`,
        emotion: 'thoughtful'
      }
    ],
    insights: [
      {
        speaker: 'host2',
        name: '小客',
        content: `从这篇日记中，我们可以看到作者是一个善于观察和思考的人。`,
        emotion: 'thoughtful'
      },
      {
        speaker: 'host1',
        name: '小播',
        content: `日记不仅仅是记录，更是与自己对话的过程。`,
        emotion: 'happy'
      }
    ],
    outro: [
      {
        speaker: 'host1',
        name: '小播',
        content: `感谢大家收听今天的日记播客！`,
        emotion: 'happy'
      },
      {
        speaker: 'host2',
        name: '小客',
        content: `下期再见！`,
        emotion: 'excited'
      }
    ],
    backgroundMusic: '舒缓钢琴曲',
    totalDuration: '约 3-5 分钟',
    tags: diary.tags || []
  };
}