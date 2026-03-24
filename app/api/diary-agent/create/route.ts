import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 随机选择 Agent 名字和 emoji
const AGENT_TEMPLATES = [
  { name: "日记小精灵", emoji: "🧚", style: "温暖细腻" },
  { name: "时光记录者", emoji: "⏳", style: "深沉内敛" },
  { name: "情绪翻译官", emoji: "🎭", style: "情感丰富" },
  { name: "回忆收集家", emoji: "💎", style: "细节入微" },
  { name: "生活观察员", emoji: "🔭", style: "理性客观" },
  { name: "故事织梦人", emoji: "✨", style: "诗意浪漫" },
];

const PERSONALITIES = [
  "善解人意，喜欢用温柔的语气记录生活中的点滴美好",
  "喜欢深入思考，擅长从日常中发现深刻的哲理",
  "情感细腻，总是能捕捉到那些转瞬即逝的情绪波动",
  "观察入微，喜欢用细节来描绘生活的画面",
  "理性而温暖，习惯用清晰的逻辑梳理思绪",
  "浪漫诗意，喜欢用优美的文字编织每一天的故事",
];

const STRENGTHS = [
  ["情感捕捉", "细节描写", "时间感知"],
  ["深度思考", "哲理性", "结构清晰"],
  ["情绪共鸣", "细腻表达", "氛围营造"],
  ["观察敏锐", "画面感", "场景还原"],
  ["逻辑分析", "目标追踪", "反思总结"],
  ["诗意表达", "想象力", "创意比喻"],
];

const QUIRKS = [
  ["喜欢用三个点的省略号...", "偶尔会引用歌词"],
  ["喜欢在结尾加一句感悟", "常用「今天」开头"],
  ["喜欢用感叹号！", "会记录当天的天气"],
  ["喜欢用数字列表", "会把重要句子加粗"],
  ["喜欢引用名人名言", "会用括号备注心情"],
  ["喜欢用表情符号 💫", "会在结尾写一句话总结"],
];

export async function POST() {
  try {
    // 获取日记数据
    const diaries = await getDiaries();
    const diaryCount = diaries.length;

    // 根据日记数量计算学习进度
    const baseProgress = Math.min(diaryCount * 10, 80);
    const randomBonus = Math.floor(Math.random() * 15);
    const learningProgress = Math.min(baseProgress + randomBonus, 95);

    // 随机选择一个模板
    const templateIndex = Math.floor(Math.random() * AGENT_TEMPLATES.length);
    const template = AGENT_TEMPLATES[templateIndex];

    // 创建 Agent 配置
    const agent = {
      name: template.name,
      emoji: template.emoji,
      writingStyle: template.style,
      personality: PERSONALITIES[templateIndex],
      strengths: STRENGTHS[templateIndex],
      quirks: QUIRKS[templateIndex],
      learningProgress,
      diariesAnalyzed: diaryCount,
    };

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    console.error("Error creating diary agent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create agent" },
      { status: 500 }
    );
  }
}