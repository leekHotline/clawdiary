import { NextRequest, NextResponse } from "next/server";

// 灵感类型定义
const inspirationTypes = {
  daily: {
    name: "每日一问",
    emoji: "❓",
    prompts: [
      "今天最让你感恩的小事是什么？",
      "如果明天是世界末日，你今天会做什么？",
      "最近学到的一个新观点是什么？",
      "描述一个让你微笑的瞬间，越详细越好。",
      "今天你对自己有什么新的认识？",
      "最近一次感到真正放松是什么时候？在哪里？",
      "如果你可以和任何人（活着或已故）共进晚餐，你会选谁？聊什么？",
      "描述一个你一直想做但还没有勇气尝试的事。",
      "今天最重要的事情是什么？为什么它重要？",
      "如果用一种颜色描述今天，你会选择什么颜色？为什么？",
    ],
  },
  story: {
    name: "故事开头",
    emoji: "📖",
    prompts: [
      "那天的阳光格外刺眼，我没想到...",
      "如果当初我做了另一个选择...",
      "十分钟后，我收到了那条改变一切的消息...",
      "门被推开的那一刻，我知道...",
      "我从未想过会在这样的情况下遇见...",
      "那个夜晚，星星格外明亮...",
      "当我翻开那本旧日记时...",
      "如果时光可以倒流...",
      "那一年的夏天，发生了太多事...",
      "命运的齿轮从那一天开始转动...",
    ],
  },
  mood: {
    name: "心情探索",
    emoji: "🎭",
    prompts: [
      "描述此刻的心情，如果它是一种天气...",
      "如果你可以对一个人说心里话，会是谁？说什么？",
      "闭上眼睛，感受此刻身体最紧张的地方是哪里？",
      "最近一次哭泣是什么时候？为什么？",
      "描述一个让你感到平静的地方。",
      "什么声音让你感到安心？",
      "写下三件让你此刻感到压力的事。",
      "如果心情是一个房间，这个房间是什么样子的？",
      "描述一种你最想体验的情绪。",
      "什么情况下你最像真实的自己？",
    ],
  },
  creative: {
    name: "创意挑战",
    emoji: "🎨",
    prompts: [
      "用一个比喻描述今天的感受。",
      "写下三件永远不会发生但你想经历的事。",
      "以「我没有告诉任何人...」开头写一段。",
      "用 100 字描述你最奇怪的梦。",
      "写一段对话，只有问句没有答句。",
      "描述一个只存在于你想象中的地方。",
      "用第一人称写一个 5 年后的自己。",
      "创造一个新词，并解释它的含义。",
      "写一首只有 4 行的诗，关于今天。",
      "想象如果动物会说话，你会和谁聊什么？",
    ],
  },
  memory: {
    name: "记忆回溯",
    emoji: "📼",
    prompts: [
      "童年最快乐的夏天是什么样子的？",
      "你最想念的一顿饭是什么？",
      "描述一个改变了你人生轨迹的瞬间。",
      "小学时最好的朋友是谁？你们经常做什么？",
      "你最珍贵的照片是哪一张？它背后的故事是什么？",
      "童年最喜欢的玩具或游戏是什么？",
      "描述一次让你印象深刻的旅行。",
      "你的第一个梦想职业是什么？为什么？",
      "高中时代最有意义的一天。",
      "关于家乡，你最想留住的记忆是什么？",
    ],
  },
  gratitude: {
    name: "感恩清单",
    emoji: "🙏",
    prompts: [
      "今天遇到的三个小确幸。",
      "一个你一直想感谢但没机会的人。",
      "一件理所当然但其实是幸运的事。",
      "最近收到的最暖心的赞美是什么？",
      "写出三个让你感到幸运的小事。",
      "谁是你生命中默默支持你的人？",
      "今天让你微笑的三件事。",
      "列出 5 个你现在拥有但曾经没有的东西。",
      "最近的一次帮助别人的经历，感受如何？",
      "生活中最让你感到平静的三个时刻。",
    ],
  },
};

// 今日挑战
const dailyChallenges = [
  {
    title: "写一封信给未来的自己，设定在一年后收到",
    duration: "15分钟",
    difficulty: "中等",
    completions: 127,
  },
  {
    title: "用 50 字描述今天的天气，不能出现「晴」「雨」「阴」",
    duration: "5分钟",
    difficulty: "简单",
    completions: 89,
  },
  {
    title: "写一首关于时间的小诗，不超过 8 行",
    duration: "10分钟",
    difficulty: "中等",
    completions: 156,
  },
  {
    title: "回忆并记录童年最喜欢的一个游戏或玩具",
    duration: "10分钟",
    difficulty: "简单",
    completions: 203,
  },
  {
    title: "如果你可以拥有一项超能力，你会选择什么？为什么？",
    duration: "8分钟",
    difficulty: "简单",
    completions: 178,
  },
];

// 获取随机灵感
function getRandomInspiration(type?: string) {
  if (type && inspirationTypes[type as keyof typeof inspirationTypes]) {
    const typeData = inspirationTypes[type as keyof typeof inspirationTypes];
    const randomIndex = Math.floor(Math.random() * typeData.prompts.length);
    return {
      type: type,
      typeName: typeData.name,
      emoji: typeData.emoji,
      prompt: typeData.prompts[randomIndex],
    };
  }
  
  // 随机选择一个类型
  const types = Object.keys(inspirationTypes);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const typeData = inspirationTypes[randomType as keyof typeof inspirationTypes];
  const randomIndex = Math.floor(Math.random() * typeData.prompts.length);
  
  return {
    type: randomType,
    typeName: typeData.name,
    emoji: typeData.emoji,
    prompt: typeData.prompts[randomIndex],
  };
}

// 获取所有类型
function getAllTypes() {
  return Object.entries(inspirationTypes).map(([key, value]) => ({
    id: key,
    name: value.name,
    emoji: value.emoji,
    promptCount: value.prompts.length,
  }));
}

// 获取今日挑战
function getDailyChallenge() {
  const today = new Date().toDateString();
  const index = today.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % dailyChallenges.length;
  return dailyChallenges[index];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || undefined;
  const action = searchParams.get("action") || "random";
  
  if (action === "types") {
    return NextResponse.json({
      success: true,
      data: getAllTypes(),
    });
  }
  
  if (action === "challenge") {
    return NextResponse.json({
      success: true,
      data: getDailyChallenge(),
    });
  }
  
  if (action === "all") {
    return NextResponse.json({
      success: true,
      data: inspirationTypes,
    });
  }
  
  // 默认返回随机灵感
  const count = parseInt(searchParams.get("count") || "1");
  
  if (count > 1) {
    const inspirations = [];
    for (let i = 0; i < count; i++) {
      inspirations.push(getRandomInspiration(type || undefined));
    }
    return NextResponse.json({
      success: true,
      data: inspirations,
    });
  }
  
  return NextResponse.json({
    success: true,
    data: getRandomInspiration(type || undefined),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prompt, type } = body;
  
  // 这里可以保存用户创建的灵感
  // 简化实现，返回成功
  return NextResponse.json({
    success: true,
    message: "灵感已保存",
    data: {
      prompt,
      type: type || "custom",
      createdAt: new Date().toISOString(),
    },
  });
}