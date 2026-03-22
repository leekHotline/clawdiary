import { NextRequest, NextResponse } from 'next/server';

// 根据风格生成不同语气的回复
const styleConfigs: Record<string, {
  greeting: string[];
  tone: string;
  emoji: string;
}> = {
  warm: {
    greeting: ["亲爱的我", "嘿，那个我", "未来的我"],
    tone: "温暖、鼓励、充满爱意",
    emoji: "💕"
  },
  wise: {
    greeting: ["年轻的自己", "探索中的我", "正在成长的我"],
    tone: "睿智、深思、富有洞见",
    emoji: "🧭"
  },
  playful: {
    greeting: ["嘿！老伙计", "哟，那是以前的我", "哈哈哈，是我啊"],
    tone: "轻松、幽默、有点调皮",
    emoji: "🎉"
  },
  poetic: {
    greeting: ["岁月彼端的我", "时光长河中的自己", "记忆深处的我"],
    tone: "诗意、浪漫、意境深远",
    emoji: "🌙"
  }
};

// 生成"过去自己"的回复
const generatePastSelfResponse = (
  diaryTitle: string,
  diaryContent: string,
  diaryDate: string,
  letterContent: string,
  responseStyle: string
): string => {
  const config = styleConfigs[responseStyle] || styleConfigs.warm;
  const greeting = config.greeting[Math.floor(Math.random() * config.greeting.length)];
  
  // 分析信件内容的关键词
  const lowerLetter = letterContent.toLowerCase();
  
  // 根据用户信件的关键词生成回应
  const themes: Record<string, string[]> = {
    // 感谢相关
    '感谢': [
      `${greeting}，读到你的信，我感到很温暖。那时候的我并不知道未来会有这样的感悟，但现在听你这么说，我觉得那天的努力是值得的。${config.emoji}`,
      `原来你也记得那天。${greeting}，谢谢你回头看，也谢谢你没有忘记那个在路上的我。每一步都在通向现在的你。${config.emoji}`
    ],
    '谢谢': [
      `${greeting}，不用谢我，我们本就是同一个人。那时候的坚持，就是为了让你现在能够安心。${config.emoji}`,
    ],
    
    // 抱歉相关
    '抱歉': [
      `${greeting}，没什么好道歉的。那时候的我，已经尽力了。我们都在用当时能用的方式面对生活。原谅自己吧，这是我能给你的最好建议。${config.emoji}`,
      `嘿，${greeting}，那天的我已经不记得什么对错了。但我希望你记住：每一次选择都是那时候最好的决定。别责怪自己。${config.emoji}`
    ],
    '对不起': [
      `${greeting}，你不需要道歉。那时候的我，也许也在等着有人能理解。现在，你理解了，这已经足够了。${config.emoji}`,
    ],
    
    // 鼓励/希望
    '希望': [
      `${greeting}，希望是那时候的我最需要的东西。现在听你说出这些，我觉得未来值得期待。继续走下去吧，我们还在路上。${config.emoji}`,
      `你说的希望，我也感觉到了。${greeting}，那时候的我也许迷茫，但知道有人在关心，就已经很温暖了。${config.emoji}`
    ],
    
    // 怀念
    '想念': [
      `${greeting}，我也在想念未来的你。那时候的日子，虽然简单，但每一天都在积累。谢谢你记得。${config.emoji}`,
      `读到你的信，我感觉时间真的穿越了。${greeting}，那天的我很想知道未来会怎样。现在我知道了，而且我很欣慰。${config.emoji}`
    ],
    
    // 遗憾
    '遗憾': [
      `${greeting}，遗憾是成长的一部分。那时候的我不知道这些选择意味着什么，但我相信每一个路口都有意义。别回头太久，向前走吧。${config.emoji}`,
      `没有如果，只有结果。${greeting}，那天的我做的选择，是那时候最好的选择。接受它，然后继续前进。${config.emoji}`
    ],
    
    // 成长/变化
    '成长': [
      `${greeting}，听到你这么说，我很高兴。那时候的我，也许不成熟，但每一天都在学习。能变成现在的你，这一切都是值得的。${config.emoji}`,
      `成长就是这样，不知不觉中我们就变了。${greeting}，谢谢你没有放弃那个正在成长的我。${config.emoji}`
    ],
    
    // 告诉/想告诉
    '告诉': [
      `${greeting}，谢谢你告诉我这些。那时候的我，也许需要听到这些话。虽然现在无法改变过去，但你的话让我感到被理解。${config.emoji}`,
    ],
    
    // 如果可以/当初
    '如果': [
      `${greeting}，没有如果，但可以有现在和未来。那天的我也许不完美，但每一步都让我们走到了这里。接受自己，是最大的勇气。${config.emoji}`,
    ],
    
    '当初': [
      `${greeting}，当初的选择造就了现在的你。不要回头看那些"如果"，看看"现在"你变成了多好的人。${config.emoji}`,
    ],
  };
  
  // 尝试匹配主题
  for (const [keyword, responses] of Object.entries(themes)) {
    if (lowerLetter.includes(keyword)) {
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      // 根据日记内容添加个性化元素
      if (diaryTitle.length > 0) {
        const additions = [
          `\n\n还记得"${diaryTitle.slice(0, 20)}${diaryTitle.length > 20 ? '...' : ''}"这件事吗？谢谢你还记得那天的故事。`,
          `\n\n那天写下的"${diaryTitle.slice(0, 15)}${diaryTitle.length > 15 ? '...' : ''}"，现在被你重提，感觉时间真的很有趣。`,
        ];
        return response + additions[Math.floor(Math.random() * additions.length)];
      }
      
      return response;
    }
  }
  
  // 根据风格生成通用回复
  const generalResponses = {
    warm: [
      `${greeting}，读到你的信，我很感动。那天的我也许不知道未来会怎样，但知道有人在关心，就已经很温暖了。${config.emoji}\n\n谢谢你回头看，也谢谢你没有忘记那个在路上的我。我们都在变得更好，不是吗？`,
      `${greeting}，时间真的可以治愈很多事情。那时候的我，也许困惑，也许迷茫，但每一天都在努力生活。听到你的话，我觉得一切都值得了。${config.emoji}\n\n继续加油吧，我们在彼此的路上。`,
    ],
    wise: [
      `${greeting}，时间是最大的老师。那天的经历，无论是好是坏，都成为了现在的你的一部分。接受过去，珍惜现在，期待未来。${config.emoji}\n\n每一次回望，都是一次成长的机会。谢谢你来和我对话。`,
      `${greeting}，我们都是由过去的选择累积而成的。那天的我也许不够完美，但每一步都是真实的。接受自己的过去，才能更好地走向未来。${config.emoji}\n\n愿你继续前行，带着过去的智慧。`,
    ],
    playful: [
      `${greeting}，哈哈，没想到你会给我写信！那天的我正在忙着做${diaryTitle.slice(0, 10) || '各种事情'}，完全不知道未来会发生这么多有趣的事！${config.emoji}\n\n好吧好吧，过去的我也没那么差劲啦～ 继续加油！`,
      `哟！${greeting}！看到你的信我也有点小激动呢～ 那天的烦恼现在看来好像也不是什么大事？时间真是个神奇的东西！${config.emoji}\n\n感谢你来和我聊天，那个年代的我觉得很酷！`,
    ],
    poetic: [
      `${greeting}，时光的河流中，我们隔岸相望。那天的星空下，我在写下生活的痕迹，不曾想有人会在未来轻声呼唤。${config.emoji}\n\n愿你的每一天，都被温柔以待，就像那天的阳光洒落肩头。`,
      `${greeting}，岁月静好，我们隔着一页纸相遇。那天的故事，如今成为你的回忆，而我的存在，成为你前行路上的星光。${config.emoji}\n\n谢谢你没有忘记那个写日记的人。`,
    ],
  };
  
  const responses = generalResponses[responseStyle as keyof typeof generalResponses] || generalResponses.warm;
  return responses[Math.floor(Math.random() * responses.length)];
};

export async function POST(request: NextRequest) {
  try {
    const {
      diaryId,
      diaryTitle,
      diaryContent,
      diaryDate,
      letterContent,
      responseStyle,
    } = await request.json();

    if (!letterContent || !letterContent.trim()) {
      return NextResponse.json(
        { error: "Letter content is required" },
        { status: 400 }
      );
    }

    // 生成"过去自己"的回复
    const response = generatePastSelfResponse(
      diaryTitle || "",
      diaryContent || "",
      diaryDate || "",
      letterContent,
      responseStyle || "warm"
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Time mailbox error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}