import { NextRequest, NextResponse } from "next/server";

interface DecisionRequest {
  question: string;
  options: string[];
  style: "rational" | "emotional" | "balanced" | "growth";
}

// 生成选项分析
function generateOptionAnalysis(
  question: string,
  options: string[],
  style: string
) {
  return options.map((text, index) => {
    const pros: string[] = [];
    const cons: string[] = [];

    // 基于风格和选项内容生成优劣势
    const lowerText = text.toLowerCase();

    // 通用优势判断
    if (lowerText.includes("学") || lowerText.includes("新")) {
      pros.push("有助于个人成长和能力提升");
      pros.push("开拓新视野和可能性");
    }
    if (lowerText.includes("换") || lowerText.includes("改")) {
      pros.push("打破现状，可能带来新机遇");
      pros.push("摆脱当前不满意的状态");
    }
    if (lowerText.includes("保持") || lowerText.includes("继续")) {
      pros.push("稳定可靠，风险较低");
      pros.push("延续已有优势和资源");
    }
    if (lowerText.includes("沟通") || lowerText.includes("主动")) {
      pros.push("增进了解和信任");
      pros.push("可能化解误会或问题");
    }
    if (lowerText.includes("搬") || lowerText.includes("城市")) {
      pros.push("新环境可能带来新机遇");
      pros.push("拓展人际网络和生活体验");
    }

    // 通用劣势判断
    if (lowerText.includes("换") || lowerText.includes("改")) {
      cons.push("存在不确定性，可能面临风险");
      cons.push("需要适应新环境或方式");
    }
    if (lowerText.includes("学") || lowerText.includes("新")) {
      cons.push("需要投入时间和精力");
      cons.push("可能面临学习曲线");
    }
    if (lowerText.includes("搬") || lowerText.includes("城市")) {
      cons.push("搬迁成本和生活调整");
      cons.push("可能离开熟悉的环境和人际圈");
    }
    if (lowerText.includes("主动") || lowerText.includes("沟通")) {
      cons.push("可能面临拒绝或尴尬");
      cons.push("需要勇气和准备");
    }

    // 如果没有生成足够的优劣势，添加通用分析
    if (pros.length < 2) {
      pros.push("这个选择有其合理性");
      pros.push("值得认真考虑");
    }
    if (cons.length < 2) {
      cons.push("需要权衡利弊");
      cons.push("考虑可能的挑战");
    }

    return {
      id: `option-${index}`,
      text,
      pros: pros.slice(0, 3),
      cons: cons.slice(0, 3),
    };
  });
}

// 生成推荐建议
function generateRecommendation(
  question: string,
  options: string[],
  style: string
): { recommendation: string; confidence: number; analysis: string } {
  const styleAnalysis: Record<string, { intro: string; focus: string }> = {
    rational: {
      intro: "从理性分析角度，",
      focus: "建议优先考虑风险收益比和可行性",
    },
    emotional: {
      intro: "从内心感受角度，",
      focus: "建议倾听自己真正的渴望和直觉",
    },
    balanced: {
      intro: "综合考虑理性与感性，",
      focus: "建议平衡短期影响和长期价值",
    },
    growth: {
      intro: "从成长视角，",
      focus: "建议选择能带来更多学习和成长机会的方向",
    },
  };

  const styleInfo = styleAnalysis[style] || styleAnalysis.balanced;

  // 生成推荐
  const recommendation = "";
  const confidence = 70 + Math.floor(Math.random() * 20);

  // 根据问题类型生成建议
  if (question.includes("换工作") || question.includes("换工作")) {
    recommendation = `${styleInfo.intro}如果当前工作让你感到停滞或不满，而新机会能带来更好的成长空间，建议考虑改变。但在此之前，建议你：1）明确自己真正想要的；2）评估新机会的风险；3）做好过渡准备。`;
  } else if (question.includes("学习") || question.includes("新技能")) {
    recommendation = `${styleInfo.intro}学习新技能几乎总是有价值的投资。建议选择与你当前目标最相关、最能带来复利效应的技能开始。小步快跑，持续实践。`;
  } else if (question.includes("搬") || question.includes("城市")) {
    recommendation = `${styleInfo.intro}搬到新城市是重大决定。建议先短期体验目标城市生活，评估工作机会、生活成本和社交网络，再做最终决定。`;
  } else if (question.includes("沟通") || question.includes("主动")) {
    recommendation = `${styleInfo.intro}主动沟通通常是解决问题最好的方式。建议选择合适的时机和方式，表达你的真实想法，同时做好倾听的准备。`;
  } else {
    // 通用建议
    const firstOption = options[0];
    recommendation = `${styleInfo.intro}经过分析，"${firstOption}"看起来是一个值得尝试的选择。但最终决定应该基于你的实际情况、价值观和直觉。${styleInfo.focus}，做出选择后坚定执行。`;
  }

  // 生成详细分析
  const analysis = `## 决策分析报告

**问题：** ${question}

### 分析框架

本次分析采用"${style === "rational" ? "理性分析" : style === "emotional" ? "内心感受" : style === "balanced" ? "平衡模式" : "成长视角"}"模式。

### 关键考虑因素

1. **长期影响** - 这个决定对你的未来有什么影响？
2. **资源投入** - 需要投入多少时间、金钱、精力？
3. **风险评估** - 最坏的情况是什么？你能承受吗？
4. **成长价值** - 哪个选择能带来更多学习和成长？

### 决策建议

${recommendation}

### 最后的话

记住：没有完美的决定。重要的是做出选择后，全力以赴让它成为正确的决定。犹豫不决本身也是一种选择——选择让机会流逝。

信任自己，你已经具备做出好决定的能力。💪`;

  return {
    recommendation,
    confidence,
    analysis,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: DecisionRequest = await request.json();
    const { question, options, style } = body;

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: "请提供问题和至少两个选项" },
        { status: 400 }
      );
    }

    // 生成选项分析
    const optionAnalysis = generateOptionAnalysis(question, options, style);

    // 生成推荐
    const { recommendation, confidence, analysis } = generateRecommendation(
      question,
      options,
      style
    );

    const decision = {
      question,
      options: optionAnalysis,
      criteria: ["长期影响", "资源投入", "风险评估", "成长价值"],
      recommendation,
      confidence,
      analysis,
    };

    // 模拟延迟让用户感觉在分析
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json(decision);
  } catch (error) {
    console.error("Decision helper error:", error);
    return NextResponse.json(
      { error: "分析失败，请重试" },
      { status: 500 }
    );
  }
}