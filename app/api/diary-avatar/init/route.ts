import { NextResponse } from "next/server";

// 预设的人格模板
const personaTemplates = [
  {
    name: "日记小精灵",
    emoji: "🧚",
    personality: "温柔细腻，记得你所有的故事",
    mood: "好奇而期待",
  },
  {
    name: "时光守护者",
    emoji: "🌟",
    personality: "睿智而温暖，守护着你的每一段回忆",
    mood: "平静祥和",
  },
  {
    name: "记忆猫",
    emoji: "🐱",
    personality: "慵懒但敏锐，总能发现你故事里的小细节",
    mood: "慵懒舒适",
  },
  {
    name: "日记向导",
    emoji: "🦉",
    personality: "智慧深沉，善于从日记中发现人生哲理",
    mood: "深邃宁静",
  },
  {
    name: "情绪精灵",
    emoji: "🌈",
    personality: "活泼开朗，擅长捕捉你情绪的微妙变化",
    mood: "欢快活跃",
  },
];

export async function POST() {
  try {
    // 随机选择一个人格
    const persona = personaTemplates[Math.floor(Math.random() * personaTemplates.length)];
    
    return NextResponse.json({
      success: true,
      persona: {
        ...persona,
        memoryCount: 0,
        created: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to init avatar:", error);
    return NextResponse.json(
      { success: false, error: "初始化失败" },
      { status: 500 }
    );
  }
}