import { NextResponse } from "next/server";

const SAMPLE_TEXTS = [
  `今天天气不错，阳光透过窗户洒进来，让人心情格外舒畅...

午后，我在咖啡馆坐了很久，看着窗外人来人往，突然觉得生活其实很简单——一杯咖啡、一本书、一个安静的下午。

有时候，我们需要的不是轰轰烈烈，而是这些平凡又美好的小瞬间。`,

  `清晨的第一缕阳光，让我想起了那些被遗忘的梦想...

今天没有特别的事情发生，但这种平淡本身就是一种幸福。我想，真正的成长，就是在日复一日中，慢慢成为更好的自己。

愿明天的我，依然热爱生活。`,

  `忙碌的一天结束了，终于可以静下来写写今天的感受...

虽然工作很累，但看到窗外的夕阳，突然觉得一切都值得。生活就是这样，有苦有甜，才更真实。

希望明天能有更多时间，做自己喜欢的事。`,

  `翻开旧日记，才发现自己已经走过了这么多路...

每一步都是成长，每一次跌倒都是收获。今天的我，比昨天更坚强了一些，这就够了。

明天，继续加油！`,
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent } = body;

    // 模拟生成延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 随机选择一个示例文本
    const randomIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length);
    let text = SAMPLE_TEXTS[randomIndex];

    // 添加 Agent 签名
    text += `\n\n—— ${agent?.name || "日记代理"} 代写`;

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("Error generating preview:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate" },
      { status: 500 }
    );
  }
}