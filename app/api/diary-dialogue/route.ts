import { NextRequest, NextResponse } from "next/server";

interface Diary {
  id: string;
  date: string;
  title: string;
  content: string;
  preview: string;
}

interface DialogueMessage {
  speaker: "past" | "present" | "narrator";
  content: string;
  emoji?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { pastDiary, presentDiary } = await request.json() as {
      pastDiary: Diary;
      presentDiary: Diary;
    };

    if (!pastDiary || !presentDiary) {
      return NextResponse.json(
        { error: "缺少日记数据" },
        { status: 400 }
      );
    }

    // 计算时间跨度
    const daysDiff = Math.ceil(
      (new Date(presentDiary.date).getTime() - new Date(pastDiary.date).getTime()) / (1000 * 60 * 60 * 24)
    );

    // 生成对话
    const dialogue: DialogueMessage[] = generateDialogue(pastDiary, presentDiary, daysDiff);

    return NextResponse.json({ dialogue });
  } catch (error) {
    console.error("Diary dialogue error:", error);
    return NextResponse.json(
      { error: "生成对话失败" },
      { status: 500 }
    );
  }
}

function generateDialogue(past: Diary, present: Diary, daysDiff: number): DialogueMessage[] {
  const dialogue: DialogueMessage[] = [];
  
  // 开场
  dialogue.push({
    speaker: "narrator",
    content: `一段跨越 ${daysDiff} 天的对话开始了...`,
    emoji: "✨",
  });

  // 过去的日记开场
  const pastContent = past.content.substring(0, 80);
  dialogue.push({
    speaker: "past",
    content: `那时候的我这样写道："${pastContent}${past.content.length > 80 ? '...' : ''}"`,
    emoji: "📝",
  });

  // 现在的回应
  dialogue.push({
    speaker: "present",
    content: `今天读到这些，感觉仿佛在和一个老朋友对话。`,
    emoji: "💭",
  });

  // 根据时间跨度选择不同的对话模式
  if (daysDiff > 30) {
    dialogue.push({
      speaker: "past",
      content: `那时的我，完全想不到一个月后会发生这么多事。`,
      emoji: "😮",
    });
    dialogue.push({
      speaker: "present",
      content: `是的，生活总是充满惊喜。但每一步都算数。`,
      emoji: "🌱",
    });
  } else {
    dialogue.push({
      speaker: "past",
      content: `那段时间我在想很多事情，现在有了答案吗？`,
      emoji: "🤔",
    });
    dialogue.push({
      speaker: "present",
      content: `有些问题有了答案，有些还在探索。这很正常。`,
      emoji: "💡",
    });
  }

  // 叙述者点评
  dialogue.push({
    speaker: "narrator",
    content: `从「${past.title}」到「${present.title}」——`,
    emoji: "📖",
  });

  // 分析主题变化
  const themes = analyzeThemes(past, present);
  dialogue.push({
    speaker: "narrator",
    content: `主题从${themes.past}变成了${themes.present}。`,
    emoji: "🔄",
  });

  // 过去的期望
  dialogue.push({
    speaker: "past",
    content: `我希望自己能坚持下去，不要放弃。`,
    emoji: "💪",
  });

  // 现在的回应
  dialogue.push({
    speaker: "present",
    content: `看，我做到了。虽然不容易，但我们一直在前进。`,
    emoji: "✨",
  });

  // 结尾
  dialogue.push({
    speaker: "narrator",
    content: `过去的自己和现在的自己握手言和，继续前行。`,
    emoji: "🤝",
  });

  // 成长建议
  dialogue.push({
    speaker: "narrator",
    content: generateGrowthInsight(past, present, daysDiff),
    emoji: "💡",
  });

  return dialogue;
}

function analyzeThemes(past: Diary, present: Diary): { past: string; present: string } {
  // 简单的关键词分析
  const themes: Record<string, string[]> = {
    "困惑与迷茫": ["困惑", "迷茫", "不知道", "怎么办", "问题"],
    "成长与学习": ["学习", "成长", "进步", "提升", "努力"],
    "情感与感受": ["开心", "难过", "感动", "感谢", "爱"],
    "目标与规划": ["目标", "计划", "希望", "想要", "未来"],
    "日常与生活": ["今天", "早上", "晚上", "朋友", "家人"],
  };

  let pastTheme = "日常记录";
  let presentTheme = "日常记录";

  for (const [theme, keywords] of Object.entries(themes)) {
    if (keywords.some(kw => past.content.includes(kw))) {
      pastTheme = theme;
    }
    if (keywords.some(kw => present.content.includes(kw))) {
      presentTheme = theme;
    }
  }

  return { past: pastTheme, present: presentTheme };
}

function generateGrowthInsight(past: Diary, present: Diary, daysDiff: number): string {
  const insights = [
    `成长不在于时间长短，而在于每一步都有意义。${daysDiff}天里，你一直在进步。`,
    `日记是最好的朋友，它记得你所有的心情变化。继续记录吧！`,
    `从过去到现在，你经历了很多。这些经历塑造了独一无二的自己。`,
    `有时候回头看，才发现自己已经走了很远。相信时间的力量。`,
    `每一天都是新的开始。过去的你已经为现在的你铺好了路。`,
  ];

  return insights[Math.floor(Math.random() * insights.length)];
}