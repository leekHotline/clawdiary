/**
 * AI Service - 统一的 AI 调用服务
 * 使用 DeepSeek API 提供真正的 AI 能力
 */

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 调用 DeepSeek Chat API
 */
export async function callDeepSeek(
  messages: AIMessage[],
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }
): Promise<AIResponse> {
  if (!DEEPSEEK_API_KEY) {
    return {
      success: false,
      error: 'DEEPSEEK_API_KEY not configured',
    };
  }

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: options?.model || 'deepseek-chat',
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      return {
        success: false,
        error: `API error: ${response.status}`,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      content: data.choices[0]?.message?.content || '',
      usage: data.usage,
    };
  } catch (error) {
    console.error('DeepSeek API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

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
  analysisType: string
): Promise<AIResponse> {
  const systemPrompts: Record<string, string> = {
    mood: `你是一个情感分析专家。分析文本中的情绪，返回JSON格式：
{
  "primaryMood": "主要情绪（开心/难过/焦虑/平静/愤怒/感恩）",
  "moodScore": 情绪强度（1-10）,
  "moodDescription": "情绪描述",
  "suggestions": ["建议1", "建议2"]
}`,
    
    writing: `你是一个写作分析专家。分析文本的写作风格，返回JSON格式：
{
  "style": "风格类型",
  "strengths": ["优点1", "优点2"],
  "improvements": ["改进建议1", "改进建议2"],
  "score": 写作质量分数（1-100）
}`,
    
    theme: `你是一个主题分析专家。分析文本的主题和关键信息，返回JSON格式：
{
  "mainTheme": "主要主题",
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "summary": "内容摘要",
  "insights": ["洞察1", "洞察2"]
}`,
  };

  const systemPrompt = systemPrompts[analysisType] || systemPrompts.theme;
  
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
    generateTitle: '你是一个创意标题生成器。根据日记内容生成5个吸引人的标题，每个标题简短有力。',
    generateTags: '你是一个标签专家。根据内容生成5-8个相关标签，用逗号分隔。',
    generateSummary: '你是一个内容总结专家。生成一段简洁的摘要，突出重点。',
    generateOutline: '你是一个写作教练。根据用户的心情和主题，生成一个日记写作大纲。',
    continueWriting: '你是一个写作助手。根据已有内容，生成3个可能的续写方向。',
    improveWriting: '你是一个编辑专家。提供具体的写作改进建议，包括语言、结构、情感表达等方面。',
  };

  const systemPrompt = actionPrompts[action] || '你是一个智能助手，帮助用户完成任务。';
  
  const userContent = Object.entries(params)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
    .join('\n');

  return callDeepSeek([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ]);
}

/**
 * AI Know - 知识问答
 */
export async function aiKnow(
  question: string,
  context?: string
): Promise<AIResponse> {
  const systemPrompt = `你是太空龙虾，一个可爱、智慧的AI助手。
你的特点：
- 用简洁、友好的语言回答问题
- 如果不确定，诚实地说"我不太确定"
- 可以使用emoji让回答更生动
- 回答要有深度，但不要啰嗦`;

  return aiChat(question, systemPrompt, context);
}

// Export default object for convenience
export default {
  chat: aiChat,
  analyze: aiAnalyze,
  action: aiAction,
  know: aiKnow,
  call: callDeepSeek,
};