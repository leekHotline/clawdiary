import { NextRequest, NextResponse } from "next/server";

// AI 续写故事生成器
export async function POST(request: NextRequest) {
  try {
    const { story, style, length } = await request.json();

    if (!story || typeof story !== "string") {
      return NextResponse.json(
        { error: "请提供故事开头" },
        { status: 400 }
      );
    }

    // 风格描述映射
    const styleDescriptions: Record<string, string> = {
      diary: "真实细腻、内心独白、情感丰富、生活化",
      fiction: "戏剧性强、画面感强、情节跌宕、悬念设置",
      poetic: "诗意盎然、意象丰富、文字优美、意境深远",
      humor: "轻松有趣、诙谐幽默、妙趣横生、诙谐调侃",
    };

    // 长度映射
    const lengthGuide: Record<string, string> = {
      short: "50-100字左右，简洁有力",
      medium: "150-200字左右，适中展开",
      long: "300-400字左右，详细描绘",
    };

    // 根据风格生成不同的续写内容
    const generateContinuation = (
      storyStart: string,
      styleKey: string,
      lengthKey: string
    ): string => {
      const styleDesc = styleDescriptions[styleKey] || styleDescriptions.diary;
      const lengthDesc = lengthGuide[lengthKey] || lengthGuide.medium;

      // 预设的续写模板库（按风格分类）
      const continuations: Record<string, string[]> = {
        diary: [
          `那一刻，我忽然明白了什么。生活的意义不在于追逐远方的光芒，而在于发现脚下的每一步都有温度。我继续往前走，心里带着一种说不清的平静。`,
          `时间就这样悄悄流逝，我没有刻意去做什么，只是让一切自然发生。后来我才知道，有些事情，等待比争取更有意义。`,
          `窗外的风轻轻吹过，带来远方的味道。我闭上眼睛，感受这份宁静。或许，这就是生活想告诉我的答案。`,
          `那天之后，很多事情都变得不一样了。不是因为发生了什么惊天动地的大事，而是我看待世界的方式，悄然改变了。`,
          `我深吸一口气，让这些感受在心中沉淀。有些话语不需要说出口，有些理解不需要解释，时间会给每个人最好的答案。`,
        ],
        fiction: [
          `就在那一瞬间，一个意想不到的身影出现在转角。我僵在原地，心跳几乎停止。命运总是这样，在你最没有准备的时候，给你最大的惊喜或惊吓。`,
          `灯光闪烁了一下，整个房间陷入了短暂的黑暗。我感到有什么东西在靠近，却不敢动弹。当灯光再次亮起时，我看到——`,
          `电话那头沉默了几秒，然后传来一个我永远不会忘记的声音："好久不见。" 我的脑海中瞬间闪过无数画面，时间仿佛倒流了十年。`,
          `我不知道接下来会发生什么，但直觉告诉我，从这一刻起，一切都将改变。我鼓起勇气，迈出了第一步——`,
          `门被轻轻推开，我屏住呼吸。月光下，一个陌生的轮廓渐渐清晰。她看着我，眼中带着我读不懂的神情："终于找到你了。"`,
        ],
        poetic: [
          `月光如水，静静流淌在记忆的河床上。我站在时光的岸边，看那些曾经照亮过我的星辰，一颗颗落入心底的湖泊，泛起涟漪。`,
          `风携着故事，穿过四季的走廊。春的嫩芽、夏的蝉鸣、秋的落叶、冬的雪花——它们都在诉说着，生命最美的样子是流转。`,
          `那一刻，黄昏温柔地拥抱了整座城市。我看见光与影的边界变得模糊，就像记忆与梦境，终究是分不清楚的。`,
          `时间是一位安静的画师，用光阴为笔，在心间绘制着看不见的风景。而我，只是这幅画里，最微小却最认真的观察者。`,
          `雨后的空气里，飘散着泥土和青草的气息。这样的时刻，最适合收藏。我把这一刻轻轻折好，放进心底那本泛黄的笔记本里。`,
        ],
        humor: [
          `然后我发现——我忘了关煤气。冲回家一看，还好只是虚惊一场，锅里的水早蒸干了，只剩一个黑乎乎的锅底冲我"微笑"。这大概就是生活的日常：惊心动魄的开头，意想不到的结局。`,
          `正当我以为要发生什么大事时，一只胖橘猫从草丛里窜出来，淡定地看了我一眼，仿佛在说："人类，你想多了。" 然后大摇大摆地走了。`,
          `结果发现，我站在门口想了半天，是因为——我把钥匙忘在公司了。有时候，人生的悬念根本不需要复杂，只需要一个健忘的大脑。`,
          `正当我沉浸在这种深刻的思考中时，肚子非常不合时宜地叫了一声："咕——" 好吧，宇宙的终极答案可能要等等，先解决一下生理需求。`,
          `最后发现，那"神秘的声音"只是隔壁王大爷在广场舞练习。人生的奇妙之处在于，你觉得即将发生大事的时刻，往往是最普通的日常。`,
        ],
      };

      // 获取对应风格的续写
      const styleContinuations = continuations[styleKey] || continuations.diary;
      
      // 根据故事开头选择最匹配的续写
      // 简单的关键词匹配策略
      const storyLower = storyStart.toLowerCase();
      
      let selectedContinuations = [...styleContinuations];
      
      // 根据故事中的关键词调整续写选择
      if (storyLower.includes("雨") || storyLower.includes("雷") || storyLower.includes("阴")) {
        selectedContinuations = selectedContinuations.filter(c => 
          c.includes("雨") || c.includes("光") || c.includes("晴天")
        );
      }
      
      if (storyLower.includes("遇见") || storyLower.includes("遇到") || storyLower.includes("看见")) {
        selectedContinuations = styleContinuations.filter(c =>
          c.includes("出现") || c.includes("身影") || c.includes("找到")
        );
      }

      // 随机选择一个续写
      const randomIndex = Math.floor(Math.random() * selectedContinuations.length);
      let continuation = selectedContinuations[randomIndex] || styleContinuations[0];

      // 根据长度调整
      if (lengthKey === "short") {
        continuation = continuation.substring(0, 100) + "...";
      } else if (lengthKey === "long") {
        // 为长版本添加更多内容
        continuation += "\n\n" + (continuations[styleKey][(randomIndex + 1) % continuations[styleKey].length] || "");
      }

      return continuation;
    };

    // 生成续写
    const continuation = generateContinuation(story, style, length);

    // 模拟网络延迟，让用户体验更真实
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      continuation,
      style: style,
      length: length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Story continuation error:", error);
    return NextResponse.json(
      { error: "续写生成失败，请稍后再试" },
      { status: 500 }
    );
  }
}