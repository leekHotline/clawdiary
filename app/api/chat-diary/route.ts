import { NextRequest, NextResponse } from 'next/server';

// AI生成回复 - 使用简单的启发式规则 + 随机提示
const generateReply = (userMessage: string, conversationHistory: {role: string, content: string}[]): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  // 上下文感知的追问
  const followUpPrompts = [
    "这让你感觉如何？",
    "能多说说这个吗？",
    "你觉得为什么会这样呢？",
    "有没有想过其他可能？",
    "这件事对你意味着什么？",
    "之后你是怎么处理的？",
    "如果是你朋友遇到这事，你会怎么建议？",
  ];
  
  // 情绪关键词检测
  const emotionResponses: Record<string, string[]> = {
    '开心': ['太棒了！🎉 能和我分享更多这个开心的时刻吗？', '听到这个好消息真让人高兴！是什么让你这么开心呢？'],
    '难过': ['我能感受到你的心情。💙 有什么我可以倾听的吗？', '有时候难过也是正常的，想说说是什么让你难过吗？'],
    '累': ['辛苦了！🙏 今天发生了什么让你觉得累呢？', '记得照顾好自己。有没有什么可以让你放松的方式？'],
    '焦虑': ['焦虑是很常见的感受。💙 是什么让你感到焦虑呢？', '深呼吸～ 能告诉我你在担心什么吗？'],
    '感谢': ['感恩的心让生活更美好！🌸 还有什么让你感激的吗？', '能发现生活中的美好很棒！今天还有其他开心的事吗？'],
    '学习': ['学习新东西总让人充实！📚 今天学了什么特别的吗？', '知识是最好的投资！你是怎么学到这些的？'],
    '工作': ['工作是生活的重要部分。💪 工作中有什么想分享的吗？', '工作有时候也很有挑战性，今天怎么样？'],
    '朋友': ['朋友是珍贵的财富！👥 今天和朋友发生了什么？', '友谊让生活更丰富～ 能说说你的朋友吗？'],
    '家人': ['家人是我们最重要的人。❤️ 今天和家人有什么互动吗？', '家庭时光总是特别的～ 今天发生了什么？'],
  };
  
  // 检测关键词并匹配回复
  for (const [keyword, responses] of Object.entries(emotionResponses)) {
    if (lowerMsg.includes(keyword)) {
      const response = responses[Math.floor(Math.random() * responses.length)];
      return response + '\n\n' + followUpPrompts[Math.floor(Math.random() * followUpPrompts.length)];
    }
  }
  
  // 根据消息长度调整回复
  const msgLength = userMessage.length;
  
  if (msgLength < 20) {
    // 短消息，鼓励多说
    const encouragePrompts = [
      "能再详细说说吗？我很想了解更多～",
      "这听起来很有意思！能展开讲讲吗？",
      "嗯嗯，然后呢？我在听～",
      "感谢分享！还有什么想补充的吗？",
    ];
    return encouragePrompts[Math.floor(Math.random() * encouragePrompts.length)];
  } else if (msgLength > 200) {
    // 长消息，给予肯定并引导反思
    const reflectPrompts = [
      "感谢你这么详细的分享！🌹 回顾一下，你觉得今天最重要的事情是什么？",
      "你能这么深入地思考和表达真棒！💫 这件事对你来说有什么特别的意义吗？",
      "写得很深刻！📚 如果用一个词总结今天的感受，你会选什么？",
    ];
    return reflectPrompts[Math.floor(Math.random() * reflectPrompts.length)];
  }
  
  // 中等长度，通用追问
  const generalPrompts = [
    "谢谢分享！✨ 还有什么想记录下来的吗？",
    "我听到了～ 💭 这对你来说意味着什么呢？",
    "很好的记录！有什么特别想记住的时刻吗？",
    "继续告诉我更多吧～ 我在这里倾听 🌟",
    "写得真好！还有什么想补充的吗？",
  ];
  
  return generalPrompts[Math.floor(Math.random() * generalPrompts.length)] + '\n\n' + followUpPrompts[Math.floor(Math.random() * followUpPrompts.length)];
};

export async function POST(request: NextRequest) {
  try {
    const { messages, userId } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }
    
    // 获取最后一条用户消息
    const lastUserMessage = messages.filter((m: {role: string}) => m.role === 'user').pop();
    
    if (!lastUserMessage) {
      return NextResponse.json({ reply: '你好！让我们开始聊天吧～ 今天过得怎么样？' });
    }
    
    // 生成AI回复
    const reply = generateReply(lastUserMessage.content, messages);
    
    return NextResponse.json({ reply });
    
  } catch (error) {
    console.error('Chat diary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}