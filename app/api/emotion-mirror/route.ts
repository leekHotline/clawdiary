import { NextRequest, NextResponse } from 'next/server';

interface EmotionInput {
  emotion: string;
  emoji: string;
  intensity: number;
  context: string;
  color: string;
}

interface EmotionAnalysis {
  summary: string;
  insight: string;
  suggestion: string;
  affirmation: string;
  reflectionQuestions: string[];
}

// 情绪分析和回应模板
const EMOTION_RESPONSES: Record<string, Record<number, Omit<EmotionAnalysis, 'reflectionQuestions'>>> = {
  '开心': {
    1: {
      summary: '你内心有一丝愉悦在萌芽，这很美好。',
      insight: '即使是一点点的开心，也是值得珍惜的积极信号。这说明生活中有让你感到满足的小事存在。',
      suggestion: '试着留意是什么带来了这份愉悦，哪怕是很小的事情。可以拍张照片或写下一句话记录这一刻。',
      affirmation: '你值得拥有这些美好时刻，它们是你生命中闪耀的光点。',
    },
    2: {
      summary: '你正处于一个积极的状态，内心有稳定的愉悦感。',
      insight: '这种程度的开心通常来自于生活的正常运转和内心的平衡。这是一个好兆头，说明你的状态在正轨上。',
      suggestion: '做一些能够延长这种状态的事情，比如和喜欢的人聊聊天，或者做一件让你有成就感的小事。',
      affirmation: '你的笑容有力量，不仅照亮自己，也能温暖身边的人。',
    },
    3: {
      summary: '你的快乐很强烈，整个人被积极的能量包围。',
      insight: '这种强烈的开心往往来自于某件具体的好事发生，或是努力后得到的回报。这是一种值得珍藏的高光时刻。',
      suggestion: '考虑把这份快乐分享给你信任的人。研究表明，分享快乐会让快乐加倍。',
      affirmation: '你此刻的快乐是你应得的，它证明你的生活正在向好的方向发展。',
    },
    4: {
      summary: '你被深深的喜悦充满，这是人生中值得铭记的时刻！',
      insight: '这种主导性的快乐非常珍贵，可能来自于重大突破、期待已久的好消息，或深刻的情感连接。请好好感受这一刻。',
      suggestion: '深呼吸，让这份喜悦渗透全身。可以写一封信给未来的自己，描述这一刻的感受。',
      affirmation: '你的快乐是真实的、完全的、美丽的。这一刻的你，闪闪发光。',
    },
  },
  '平静': {
    1: {
      summary: '你的内心有一丝安宁，像微风拂过湖面。',
      insight: '平静是最被低估的情绪之一。它不是空虚，而是内心的秩序和稳定。',
      suggestion: '享受这种宁静，可以做一个简短的冥想，或者只是静静地呼吸几分钟。',
      affirmation: '平静的你，拥有与世界对话的力量。',
    },
    2: {
      summary: '你处于一种舒适平和的状态，内心没有波澜。',
      insight: '这种平静是心理健康的重要指标。它意味着你能够接受当下，不被外界的起伏轻易扰动。',
      suggestion: '这是一个适合做计划和思考的好时机。你的头脑清晰，可以做出更好的决策。',
      affirmation: '你内在的宁静，是你最强大的力量源泉。',
    },
    3: {
      summary: '你感受到深深的安宁，仿佛与周围的一切和谐共处。',
      insight: '这种强烈的平静往往来自于深刻的自我接纳、与自然的连接，或是长期的修行/成长。',
      suggestion: '可以尝试一些创造性的活动，你的内心平静会帮助创意流动。',
      affirmation: '你找到的这份宁静，是生命给你最好的礼物之一。',
    },
    4: {
      summary: '你沉浸在一种近乎禅定的状态，完全地平静和满足。',
      insight: '这种主导性的平静是非常难得的境界。你可能正在经历深刻的精神体验或人生顿悟。',
      suggestion: '珍惜这个时刻，可以写下你此刻的感受和思考，未来翻看会很有意义。',
      affirmation: '你已触及内心最深处的那片净土，带着它继续前行吧。',
    },
  },
  '难过': {
    1: {
      summary: '你有一丝忧郁在心头，这是很正常的感受。',
      insight: '难过是心灵在呼唤关注。轻微的难过可能是身体累了，或者某些需求没有得到满足。',
      suggestion: '对自己温柔一点。可以听一首喜欢的歌，或者泡一杯热茶，给自己一点温暖。',
      affirmation: '难过没关系，这说明你在乎，你有心。',
    },
    2: {
      summary: '你心中有一种明显的沉重感，这种感觉值得关注。',
      insight: '中度的难过通常有明确的原因。可能是某个期待落空，或者感到被忽视。这份难过想告诉你一些重要的事情。',
      suggestion: '试着写下你的感受，不用很长，只是让情绪有一个出口。也可以找一个信任的人聊聊。',
      affirmation: '你的难过是真实的，你的感受值得被看见和尊重。',
    },
    3: {
      summary: '你的心很沉重，这份难过正在影响你的状态。',
      insight: '这种强烈的难过可能已经持续了一段时间。它可能在提醒你某些深层次的需求或伤痛需要被看见。',
      suggestion: '请认真对待这份感受。如果可能，找一个专业的人聊聊，或者给自己放一个短暂的假。',
      affirmation: '你不是一个人。难过是你内心勇敢的表达，它在寻求帮助和疗愈。',
    },
    4: {
      summary: '你被深深的悲伤笼罩，此刻很难看到光明。',
      insight: '这种主导性的难过是生命中非常沉重的时刻。它可能来自重大失去、长期压抑或深刻的不被理解。',
      suggestion: '现在最重要的是照顾好自己。请考虑联系专业人士或信任的人。你不需要独自承受这一切。',
      affirmation: '你的痛苦是真实的，但请相信，黑暗不会永远持续。你值得被帮助，值得被爱。',
    },
  },
  '愤怒': {
    1: {
      summary: '你感到有些不快，内心有一丝躁动。',
      insight: '愤怒是边界的守护者。轻微的愤怒可能是有人越过了你的界限，或者事情没有按照公平的方式进行。',
      suggestion: '留意是什么触发了这份情绪。可以在纸上快速写下你的不满，不需要修饰。',
      affirmation: '你的愤怒是合理的，它在保护你。',
    },
    2: {
      summary: '你感到明显的愤怒，有些事情让你不舒服。',
      insight: '愤怒往往是力量和改变的信号。它告诉你某些事情不对劲，需要采取行动或做出改变。',
      suggestion: '找一个安全的方式释放这股能量，比如快走、用力捶打枕头，或者大声唱歌。',
      affirmation: '你有权利生气，愤怒是生命力的表现。',
    },
    3: {
      summary: '你非常愤怒，这股能量在体内涌动。',
      insight: '强烈的愤怒通常意味着重要的价值观被侵犯，或者长期的忍耐达到了临界点。这是需要认真对待的信号。',
      suggestion: '先让身体释放这股能量，然后冷静下来后再思考如何回应。不要在愤怒时做重大决定。',
      affirmation: '你的愤怒是正义的火焰，但请小心地使用它，不要让它伤害到你。',
    },
    4: {
      summary: '你被极度的愤怒支配，整个人处于战斗状态。',
      insight: '这种程度的愤怒往往是长期压抑后爆发的结果。它可能来自持续的不公、背叛或深层的无力感。',
      suggestion: '现在最重要的是安全地释放这股能量，然后寻求帮助。不要让它消耗你。专业咨询可以帮助你处理这种强烈的情绪。',
      affirmation: '你的愤怒背后是深深的伤害。请给自己时间和空间去疗愈。',
    },
  },
  '焦虑': {
    1: {
      summary: '你感到有些不安，心里有轻微的担忧。',
      insight: '轻微的焦虑是大脑在提醒你注意某些事情。它可能是对未知的担忧或对即将发生的事情感到紧张。',
      suggestion: '做几次深呼吸，告诉自己：我能处理好。把担心的事情写下来，看看哪些是可以控制的。',
      affirmation: '你的焦虑是想保护你，但你比你的担忧更强大。',
    },
    2: {
      summary: '你感到明显的焦虑，思绪有些纷乱。',
      insight: '中度的焦虑通常来自不确定性。你可能面临重要的选择或变化，大脑在试图找出所有可能的风险。',
      suggestion: '尝试5分钟的正念练习：专注呼吸，感受此刻。然后把大问题分解成小步骤，一次只处理一个。',
      affirmation: '你不需要掌控一切，你只需要走好眼前的这一步。',
    },
    3: {
      summary: '你非常焦虑，难以集中注意力，心里很不踏实。',
      insight: '强烈的焦虑可能来自重大压力、未知的变化或深层的恐惧。你的大脑在过度预警，让你感到不堪重负。',
      suggestion: '请给自己一些喘息的空间。做一些能让你感到安全感的事情，比如和信任的人聊天，或做一些熟悉的日常活动。',
      affirmation: '焦虑是暂时的，它会过去。你是安全的，你是被爱的。',
    },
    4: {
      summary: '你被严重的焦虑困扰，感到难以呼吸。',
      insight: '这种程度的焦虑已经影响到了正常生活。它可能需要专业的帮助来处理。',
      suggestion: '请认真考虑寻求专业帮助。焦虑是可以被治疗的，你不需要一直承受这种痛苦。',
      affirmation: '你的痛苦是真实的，也是可以被帮助的。请勇敢地伸出手，让专业的人支持你。',
    },
  },
  '疲惫': {
    1: {
      summary: '你感到有些累了，身体在提醒你需要休息。',
      insight: '轻微的疲惫是身体发出的正常信号，提示你需要补充能量。',
      suggestion: '如果可以，小憩15分钟，或者喝杯水、吃点健康的食物。你的身体需要你的关爱。',
      affirmation: '累了就休息，这是对自己的尊重，不是软弱。',
    },
    2: {
      summary: '你感到明显的疲惫，精力不太充沛。',
      insight: '中度的疲惫可能来自一段时间的高强度付出，或者是睡眠、营养不足。你的身体在请求更多的关照。',
      suggestion: '检查一下最近的作息和饮食。如果有条件，可以早睡一些，或者安排一个轻松的周末。',
      affirmation: '你不是机器，你是有血有肉的人。休息是必须的，不是奢侈。',
    },
    3: {
      summary: '你非常疲惫，身体和心灵都感到沉重。',
      insight: '强烈的疲惫可能来自长期的过度付出、压力或情绪消耗。这是一种需要认真对待的信号。',
      suggestion: '请考虑减少一些负担，学会说"不"。如果可能，安排一次真正的休息，哪怕是半天。',
      affirmation: '你的疲惫是你付出的证明，但请记住，照顾好自己才能更好地照顾其他。',
    },
    4: {
      summary: '你精疲力尽，几乎没有任何力气了。',
      insight: '这种程度的疲惫可能接近倦怠（burnout）。你的身心已经发出了强烈的求救信号。',
      suggestion: '请认真对待这个状态。考虑请假休息、寻求专业帮助、重新评估生活的优先级。',
      affirmation: '你已经承受了太多。请允许自己停下来，你不是永动机，你需要被照顾。',
    },
  },
  '困惑': {
    1: {
      summary: '你对某些事情感到有些不确定。',
      insight: '轻微的困惑是思考的开始。它意味着你在认真面对一个问题，还没有找到答案。',
      suggestion: '把困惑的问题写下来，有时候写出来答案就会浮现。',
      affirmation: '困惑是智慧的开端。不急，答案会慢慢显现。',
    },
    2: {
      summary: '你对目前的处境感到明显的迷茫。',
      insight: '中度的困惑通常来自选择的多样性或信息的不足。你可能站在十字路口，不确定该往哪个方向走。',
      suggestion: '试着把选项都列出来，然后问自己：哪个选择让5年后的自己更感激现在的我？',
      affirmation: '迷路也没关系，每条路都有风景，你会找到属于你的方向。',
    },
    3: {
      summary: '你非常困惑，不知道该往哪里走。',
      insight: '强烈的困惑往往来自价值观的冲突、身份的动摇或重大的人生转折。这是一个需要时间和耐心的阶段。',
      suggestion: '也许现在不是做决定的时候。给自己时间，和信任的人聊聊，或者寻求专业的指导。',
      affirmation: '迷茫是成长的一部分。你不是在原地踏步，你是在为下一步积蓄力量。',
    },
    4: {
      summary: '你完全迷失了方向，不知道自己是谁、该往哪里去。',
      insight: '这种深度的困惑可能是一次存在主义危机或人生转折点。虽然痛苦，但它也可能是重大突破的前夜。',
      suggestion: '请寻求专业帮助，比如心理咨询师或人生教练。有人可以陪你一起走过这段迷雾。',
      affirmation: '最深处的迷茫之后，往往是最明亮的黎明。你不是一个人在战斗。',
    },
  },
  '感恩': {
    1: {
      summary: '你心中有一丝温暖的感激。',
      insight: '感恩是最滋养心灵的积极情绪之一。哪怕一点点感恩，都能让你的视角更加积极。',
      suggestion: '可以想想是什么让你产生这份感恩，把它记录下来。',
      affirmation: '你有一颗感恩的心，这会让你的生活更加丰盈。',
    },
    2: {
      summary: '你感受到明显的感恩，心里充满暖意。',
      insight: '中度的感恩说明你意识到了生命中的美好和善意。这是一种健康的心态，能够带来更多积极的体验。',
      suggestion: '可以考虑向让你感恩的人表达感谢，研究表明表达感恩会让双方都更幸福。',
      affirmation: '你的感恩让世界更加温暖，也让你自己更加幸福。',
    },
    3: {
      summary: '你被深深的感恩之情充满，内心非常感动。',
      insight: '强烈的感恩通常来自经历了困难后得到的帮助，或是对生命有深刻的体会。这是一种非常珍贵的情感。',
      suggestion: '可以把这份感恩化作行动，去帮助别人，或者写一封感谢信给生命中重要的人。',
      affirmation: '你的感恩是心灵最美的状态，带着它继续前行吧。',
    },
    4: {
      summary: '你被感恩完全包围，对生命充满敬畏和感谢。',
      insight: '这种主导性的感恩是一种近乎灵性的体验。你可能刚刚经历了重大的人生转变或顿悟。',
      suggestion: '珍惜这个时刻，记录下你的感受和让你感恩的一切。这会成为你人生中珍贵的记忆。',
      affirmation: '你此刻的状态是生命给你最好的礼物。带着这份感恩，你的人生会更加闪耀。',
    },
  },
};

// 生成反思问题
function generateReflectionQuestions(emotion: string, intensity: number, context: string): string[] {
  const baseQuestions: Record<string, string[]> = {
    '开心': [
      '是什么让你现在感到开心？',
      '你可以做些什么让这份快乐延续？',
      '有没有人是你想分享这份快乐的？',
    ],
    '平静': [
      '这种平静来自哪里？',
      '有什么可以帮助你更多地保持这种状态？',
      '在这种平静中，你对自己有什么新的认识？',
    ],
    '难过': [
      '如果这份难过会说话，它想告诉你什么？',
      '有什么是你现在最需要的？',
      '有没有一件小事可以让今天的自己舒服一点？',
    ],
    '愤怒': [
      '是什么触发了这份愤怒？',
      '你的愤怒想保护的是什么？',
      '有什么建设性的方式可以表达这份情绪？',
    ],
    '焦虑': [
      '你现在最担心的是什么？',
      '在这些担忧中，哪些是你能控制的？',
      '有什么可以帮助你回到当下这一刻？',
    ],
    '疲惫': [
      '是什么消耗了你的能量？',
      '你可以在哪里给自己减负？',
      '有什么小事情可以让你恢复一点能量？',
    ],
    '困惑': [
      '你现在最大的疑问是什么？',
      '有什么信息或资源可以帮助你更清楚地看待这个问题？',
      '如果你相信一切都会好起来，你会怎么选择？',
    ],
    '感恩': [
      '是什么让你此刻感到感恩？',
      '这份感恩如何影响你看待生活的态度？',
      '你可以如何让更多人感受到这份温暖？',
    ],
  };

  let questions = [...(baseQuestions[emotion] || baseQuestions['平静'])];

  // 如果有上下文，添加更个性化的问题
  if (context && context.length > 10) {
    questions = [
      '回顾你写下的内容，最触动你的是什么？',
      ...questions.slice(0, 2),
    ];
  }

  return questions.slice(0, 3);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EmotionInput;
    const { emotion, intensity = 2, context = '' } = body;

    // 获取基础回应
    const emotionResponses = EMOTION_RESPONSES[emotion] || EMOTION_RESPONSES['平静'];
    const baseResponse = emotionResponses[intensity] || emotionResponses[2];

    // 生成反思问题
    const reflectionQuestions = generateReflectionQuestions(emotion, intensity, context);

    // 如果有上下文，调整摘要
    let summary = baseResponse.summary;
    if (context && context.trim().length > 20) {
      summary = `根据你分享的内容，${summary}`;
    }

    const analysis: EmotionAnalysis = {
      summary,
      insight: baseResponse.insight,
      suggestion: baseResponse.suggestion,
      affirmation: baseResponse.affirmation,
      reflectionQuestions,
    };

    // 模拟分析延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Emotion mirror analysis error:', error);
    return NextResponse.json(
      { error: '分析失败，请重试' },
      { status: 500 }
    );
  }
}