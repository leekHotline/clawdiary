/**
 * AI Service - 统一的 AI 调用服务
 * 支持 DeepSeek、OpenAI 等多种 LLM
 * 包含丰富的工具函数
 */

// ============ 类型定义 ============

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_calls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  tool_calls?: ToolCall[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, {
        type: string;
        description: string;
        enum?: string[];
      }>;
      required?: string[];
    };
  };
}

// ============ 配置 ============

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

// ============ 核心 API 调用 ============

/**
 * 调用 DeepSeek Chat API
 */
export async function callDeepSeek(
  messages: AIMessage[],
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    tools?: ToolDefinition[];
    tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  }
): Promise<AIResponse> {
  if (!DEEPSEEK_API_KEY) {
    console.error('[AI Service] DEEPSEEK_API_KEY not configured');
    return {
      success: false,
      error: 'DEEPSEEK_API_KEY not configured',
    };
  }

  console.log('[AI Service] Calling DeepSeek API...');
  
  try {
    const body: Record<string, unknown> = {
      model: options?.model || 'deepseek-chat',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 2000,
    };

    if (options?.tools) {
      body.tools = options.tools;
      body.tool_choice = options.tool_choice || 'auto';
    }

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Service] API error:', errorText);
      return {
        success: false,
        error: `API error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();
    const choice = data.choices[0];
    
    return {
      success: true,
      content: choice?.message?.content || '',
      tool_calls: choice?.message?.tool_calls,
      usage: data.usage,
    };
  } catch (error) {
    console.error('[AI Service] API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============ 基础功能 ============

/**
 * AI Chat - 对话功能
 */
export async function aiChat(
  userMessage: string,
  systemPrompt?: string,
  context?: string
): Promise<AIResponse> {
  const messages: AIMessage[] = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  
  if (context) {
    messages.push({ role: 'system', content: `上下文信息：\n${context}` });
  }
  
  messages.push({ role: 'user', content: userMessage });
  
  return callDeepSeek(messages);
}

/**
 * AI Analyze - 分析功能
 */
export async function aiAnalyze(
  content: string,
  analysisType: 'mood' | 'writing' | 'theme' | 'sentiment' | 'keywords' | 'summary'
): Promise<AIResponse> {
  const systemPrompts: Record<string, string> = {
    mood: `你是情感分析专家。分析文本中的情绪，严格返回JSON：
{
  "primaryMood": "开心|难过|焦虑|平静|愤怒|感恩|兴奋|疲惫",
  "moodScore": <1-10>,
  "moodDescription": "<情绪描述>",
  "suggestions": ["<建议1>", "<建议2>"]
}`,
    
    writing: `你是写作分析专家。分析写作风格，严格返回JSON：
{
  "style": "<风格类型>",
  "strengths": ["<优点1>", "<优点2>"],
  "improvements": ["<改进建议1>", "<改进建议2>"],
  "score": <1-100>
}`,
    
    theme: `你是主题分析专家。分析主题和关键信息，严格返回JSON：
{
  "mainTheme": "<主要主题>",
  "keywords": ["<关键词1>", "<关键词2>", "<关键词3>"],
  "summary": "<内容摘要>",
  "insights": ["<洞察1>", "<洞察2>"]
}`,

    sentiment: `你是情感倾向分析专家。分析文本的情感倾向，严格返回JSON：
{
  "sentiment": "positive|negative|neutral",
  "confidence": <0-1>,
  "emotions": {
    "joy": <0-1>,
    "sadness": <0-1>,
    "anger": <0-1>,
    "fear": <0-1>,
    "surprise": <0-1>
  }
}`,

    keywords: `你是关键词提取专家。提取文本中的关键词，严格返回JSON：
{
  "keywords": ["<关键词1>", "<关键词2>", ...],
  "entities": ["<实体1>", "<实体2>"],
  "topics": ["<主题1>", "<主题2>"]
}`,

    summary: `你是内容总结专家。生成简洁的摘要，严格返回JSON：
{
  "summary": "<100字以内的摘要>",
  "mainPoints": ["<要点1>", "<要点2>", "<要点3>"],
  "conclusion": "<结论>"
}`,
  };

  const systemPrompt = systemPrompts[analysisType];
  
  return callDeepSeek([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `请分析以下内容：\n\n${content}` },
  ]);
}

/**
 * AI Action - 执行具体任务
 */
export async function aiAction(
  action: string,
  params: Record<string, unknown>
): Promise<AIResponse> {
  const actionPrompts: Record<string, string> = {
    generateTitle: '你是创意标题生成器。根据日记内容生成5个吸引人的标题，每行一个。',
    generateTags: '你是标签专家。根据内容生成5-8个相关标签，用逗号分隔。',
    generateSummary: '你是内容总结专家。生成一段简洁的摘要，突出重点。',
    generateOutline: '你是写作教练。根据用户的心情和主题，生成一个日记写作大纲。',
    continueWriting: '你是写作助手。根据已有内容，生成3个可能的续写方向，每行一个。',
    improveWriting: '你是编辑专家。提供具体的写作改进建议。',
    translate: '你是翻译专家。将内容翻译成目标语言。',
    rewrite: '你是文字改写专家。用指定的风格改写内容。',
    expand: '你是内容扩写专家。将简短的内容扩展成详细的叙述。',
    compress: '你是内容压缩专家。将冗长的内容压缩成简洁的表达。',
  };

  const systemPrompt = actionPrompts[action] || '你是智能助手，帮助用户完成任务。';
  
  const userContent = Object.entries(params)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
    .join('\n');

  return callDeepSeek([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ]);
}

// ============ 高级工具函数 ============

/**
 * 智能日记分析
 */
export async function analyzeDiary(content: string): Promise<AIResponse> {
  return aiChat(
    `请全面分析这篇日记：\n\n${content}`,
    `你是专业的日记分析师。请从以下维度分析：
1. 情绪状态（主要情绪、强度、变化）
2. 写作风格（叙事方式、表达特点）
3. 主题内容（核心话题、关键词）
4. 成长洞察（有价值的发现、潜在问题）
5. 改进建议（如何写得更好）

请用结构化的方式输出，使用 emoji 让内容更生动。`
  );
}

/**
 * 生成写作灵感
 */
export async function generateWritingPrompt(
  mood?: string,
  recentTopics?: string[]
): Promise<AIResponse> {
  const context = [
    mood && `当前心情: ${mood}`,
    recentTopics && `最近话题: ${recentTopics.join(', ')}`,
  ].filter(Boolean).join('\n');

  return aiChat(
    '请给我一个今天可以写的日记主题和写作提示。',
    `你是创意写作教练。根据用户的当前状态，生成一个有趣、有深度的日记写作主题。
输出格式：
🎯 今日主题: <主题名称>
💡 写作提示: <具体的写作引导问题，3-5个>
✨ 灵感句子: <一句启发性的话>`,
    context
  );
}

/**
 * 情绪对话引导
 */
export async function emotionalGuidance(
  emotion: string,
  situation: string
): Promise<AIResponse> {
  return aiChat(
    `我现在感到${emotion}。情况是：${situation}`,
    `你是专业的心理咨询师和情绪引导师。请：
1. 先理解和共情用户的感受
2. 帮助用户探索情绪背后的原因
3. 提供具体的应对建议
4. 推荐2-3个可以通过日记进行的情绪处理练习
语气要温暖、专业，使用适当的 emoji。`
  );
}

/**
 * 成长建议生成
 */
export async function generateGrowthAdvice(
  diaries: string
): Promise<AIResponse> {
  return aiChat(
    `以下是用户最近的日记内容：\n\n${diaries}`,
    `你是个人成长教练。基于用户的日记内容，请：
1. 发现用户的成长亮点
2. 识别可能的改进空间
3. 提供具体的成长建议
4. 推荐下周可以尝试的行动
请用鼓励性的语言，给出可执行的建议。`
  );
}

/**
 * 智能问答
 */
export async function smartQA(
  question: string,
  context?: string
): Promise<AIResponse> {
  return aiChat(
    question,
    `你是太空龙虾，一个智慧、友好的AI助手。

你的能力：
- 🧠 知识问答：回答各种问题
- 💡 创意建议：提供新颖的想法
- 📊 数据分析：帮助分析信息
- ✍️ 写作辅助：帮助改进文字
- 🎯 目标规划：帮助制定计划

回答要求：
- 简洁有力，不啰嗦
- 可以使用 emoji 让回答更生动
- 如果不确定，诚实地说"我不太确定"
- 提供可操作的建议`,
    context
  );
}

/**
 * 多轮对话管理
 */
export class ConversationManager {
  private messages: AIMessage[] = [];
  private systemPrompt: string;

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
    this.messages = [{ role: 'system', content: systemPrompt }];
  }

  async sendMessage(userMessage: string): Promise<AIResponse> {
    this.messages.push({ role: 'user', content: userMessage });
    
    const response = await callDeepSeek(this.messages);
    
    if (response.success && response.content) {
      this.messages.push({ role: 'assistant', content: response.content });
    }
    
    return response;
  }

  getHistory(): AIMessage[] {
    return [...this.messages];
  }

  clear() {
    this.messages = [{ role: 'system', content: this.systemPrompt }];
  }
}

// ============ 工具调用支持 (Tool Calling) ============

/**
 * 定义可用工具
 */
export const aiTools: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'analyze_sentiment',
      description: '分析文本的情感倾向',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: '要分析的文本' }
        },
        required: ['text']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'generate_title',
      description: '为日记生成标题',
      parameters: {
        type: 'object',
        properties: {
          content: { type: 'string', description: '日记内容' },
          style: { type: 'string', description: '标题风格', enum: ['文艺', '简洁', '趣味', '深沉'] }
        },
        required: ['content']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'extract_keywords',
      description: '提取文本关键词',
      parameters: {
        type: 'object',
        properties: {
          text: { type: 'string', description: '要分析的文本' },
          count: { type: 'string', description: '关键词数量' }
        },
        required: ['text']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'suggest_tags',
      description: '为日记推荐标签',
      parameters: {
        type: 'object',
        properties: {
          content: { type: 'string', description: '日记内容' }
        },
        required: ['content']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_writing_advice',
      description: '获取写作建议',
      parameters: {
        type: 'object',
        properties: {
          content: { type: 'string', description: '用户的写作内容' },
          goal: { type: 'string', description: '写作目标', enum: ['更生动', '更深刻', '更简洁', '更有创意'] }
        },
        required: ['content']
      }
    }
  }
];

/**
 * 带工具调用的 AI 对话
 */
export async function aiWithTools(
  userMessage: string,
  systemPrompt?: string
): Promise<AIResponse> {
  const messages: AIMessage[] = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  
  messages.push({ role: 'user', content: userMessage });
  
  return callDeepSeek(messages, {
    tools: aiTools,
    tool_choice: 'auto',
  });
}

// ============ MCP 服务模拟 ============

/**
 * MCP 工具服务 - 模拟 Model Context Protocol
 */
export const mcpTools = {
  /**
   * 搜索日记
   */
  searchDiaries: async (query: string, diaries: Array<{ id: string; title: string; content: string }>) => {
    const results = diaries.filter(d => 
      d.title.includes(query) || d.content.includes(query)
    );
    return { success: true, results };
  },

  /**
   * 统计分析
   */
  getStats: async (diaries: Array<{ date: string; content: string; mood?: string }>) => {
    const total = diaries.length;
    const totalWords = diaries.reduce((sum, d) => sum + d.content.length, 0);
    const avgWords = total > 0 ? Math.round(totalWords / total) : 0;
    
    return {
      success: true,
      stats: { total, totalWords, avgWords }
    };
  },

  /**
   * 情绪趋势
   */
  getMoodTrend: async (diaries: Array<{ date: string; mood?: string }>) => {
    const moodCounts: Record<string, number> = {};
    diaries.forEach(d => {
      if (d.mood) {
        moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
      }
    });
    
    return { success: true, moodCounts };
  },

  /**
   * AI 增强分析
   */
  aiEnhance: async (action: string, data: unknown) => {
    return aiAction(action, { data });
  }
};

// ============ 导出 ============

export default {
  // 基础功能
  call: callDeepSeek,
  chat: aiChat,
  analyze: aiAnalyze,
  action: aiAction,
  
  // 高级功能
  analyzeDiary,
  generateWritingPrompt,
  emotionalGuidance,
  generateGrowthAdvice,
  smartQA,
  
  // 工具支持
  tools: aiTools,
  withTools: aiWithTools,
  
  // MCP 服务
  mcp: mcpTools,
  
  // 对话管理
  ConversationManager,
};