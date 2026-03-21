import { NextRequest, NextResponse } from "next/server";

// AI 日记润色 API
export async function POST(request: NextRequest) {
  try {
    const { text, style } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "请提供要润色的日记内容" },
        { status: 400 }
      );
    }

    // 风格模板配置
    const styleTemplates = {
      literary: {
        name: "文艺风",
        prefix: ["时光悄然流淌，", "岁月静好，", "记忆深处的画面，", "在光阴的故事里，"],
        middle: ["，那一份", "，这份", "，恰似", "，宛如"],
        suffix: ["，在心底悄然绽放。", "，成为生命中最温柔的印记。", "，被岁月温柔收藏。", "，如诗如画地镌刻在心间。"],
        vocabulary: {
          "今天": "这一天",
          "开心": "心间盈满欢喜",
          "难过": "心绪低落如秋叶",
          "很好": "格外美好",
          "朋友": "挚友",
          "工作": "事务",
        },
      },
      poetic: {
        name: "诗意版",
        templates: [
          (t: string) => `风翻开今日的书页，
字里行间都是光阴的诗。
${t.replace(/[。，]/g, "，\n").substring(0, 50)}...
如落叶般，
悄然落在心底。`,
          (t: string) => `晨曦微露，
${t.substring(0, 30)}
...

岁月不语，
却在眉间心上，
写下最温柔的诗行。`,
          (t: string) => `今天的阳光
穿过时间的缝隙
落在 ${t.substring(0, 20)}...

这一刻
被悄悄收入心底的锦盒`,
        ],
      },
      simple: {
        name: "简洁版",
        transform: (t: string) => {
          return t
            .replace(/今天/g, "")
            .replace(/非常/g, "")
            .replace(/特别/g, "")
            .replace(/真的/g, "")
            .replace(/我觉得/g, "")
            .replace(/\s+/g, " ")
            .trim() + "。简单记录，安心留存。";
        },
      },
      warm: {
        name: "温暖版",
        prefix: ["想给你一个大大的拥抱 💝 ", "愿这一刻被温柔以待 💛 ", "心里暖暖的记录 ✨ "],
        suffix: [" 这一刻的美好，值得被温柔珍藏。", " 愿你的每一天，都闪闪发光。", " 生活的小确幸，值得被铭记。"],
        emojis: [" 💕", " 🌸", " ✨", " 💫", " 🌙"],
      },
    };

    // 根据原文生成润色结果
    const generatePolish = (originalText: string, styleKey: string) => {
      if (styleKey === "poetic") {
        const poeticTemplate = styleTemplates.poetic;
        const templates = poeticTemplate.templates;
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        return randomTemplate(originalText);
      }
      
      if (styleKey === "simple") {
        const simpleTemplate = styleTemplates.simple;
        return simpleTemplate.transform(originalText);
      }
      
      if (styleKey === "literary") {
        const literaryTemplate = styleTemplates.literary;
        let result = originalText;
        for (const [key, value] of Object.entries(literaryTemplate.vocabulary)) {
          result = result.replace(new RegExp(key, "g"), value);
        }
        const prefix = literaryTemplate.prefix[Math.floor(Math.random() * literaryTemplate.prefix.length)];
        const suffix = literaryTemplate.suffix[Math.floor(Math.random() * literaryTemplate.suffix.length)];
        return prefix + result + suffix;
      }
      
      if (styleKey === "warm") {
        const warmTemplate = styleTemplates.warm;
        const prefix = warmTemplate.prefix[Math.floor(Math.random() * warmTemplate.prefix.length)];
        const suffix = warmTemplate.suffix[Math.floor(Math.random() * warmTemplate.suffix.length)];
        const emoji = warmTemplate.emojis[Math.floor(Math.random() * warmTemplate.emojis.length)];
        return prefix + originalText + suffix + emoji;
      }
      
      return originalText;
    };

    // 生成所有风格的结果
    const results = Object.keys(styleTemplates).map((styleKey) => ({
      style: styleKey,
      result: generatePolish(text, styleKey),
    }));

    // 模拟处理延迟
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return NextResponse.json({
      success: true,
      original: text,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Diary polish error:", error);
    return NextResponse.json(
      { error: "润色失败，请稍后再试" },
      { status: 500 }
    );
  }
}