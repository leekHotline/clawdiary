// 日记模板系统

export interface DiaryTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  icon: string;
  tags: string[];
  sections: TemplateSection[];
  prompts: string[];
  wordCount: { min: number; max: number };
  difficulty: 'easy' | 'medium' | 'hard';
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

export type TemplateCategory = 
  | 'daily'      // 日常记录
  | 'emotion'    // 情绪表达
  | 'growth'     // 成长反思
  | 'creative'   // 创意写作
  | 'work'       // 工作日志
  | 'travel'     // 旅行日记
  | 'gratitude'  // 感恩日记
  | 'review'     // 复盘总结
  | 'dream'      // 梦境记录
  | 'learning';  // 学习笔记

export interface TemplateSection {
  title: string;
  placeholder: string;
  required: boolean;
  maxLength?: number;
  suggestions?: string[];
}

export interface TemplateUsage {
  templateId: string;
  userId: string;
  diaryId: string;
  usedAt: string;
}

// 预设模板数据
export const defaultTemplates: DiaryTemplate[] = [
  {
    id: 'daily-simple',
    name: '日常简记',
    description: '简洁记录每一天的美好时光',
    category: 'daily',
    icon: '📝',
    tags: ['日常', '简单', '入门'],
    sections: [
      {
        title: '今日亮点',
        placeholder: '今天最值得记录的一件事...',
        required: true,
        maxLength: 500,
        suggestions: ['遇到了有趣的人', '完成了一个小目标', '学到了新东西']
      },
      {
        title: '心情记录',
        placeholder: '用三个词形容今天的心情',
        required: false,
        maxLength: 100
      },
      {
        title: '明天期待',
        placeholder: '对明天的期待...',
        required: false,
        maxLength: 200
      }
    ],
    prompts: [
      '今天做了什么让你感到满足？',
      '有什么意想不到的小惊喜吗？',
      '今天学到了什么新东西？'
    ],
    wordCount: { min: 50, max: 300 },
    difficulty: 'easy',
    popularity: 95,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-10'
  },
  {
    id: 'gratitude-journal',
    name: '感恩日记',
    description: '记录生活中的美好与感恩，培养积极心态',
    category: 'gratitude',
    icon: '🙏',
    tags: ['感恩', '正向', '心理健康'],
    sections: [
      {
        title: '今日感恩三件事',
        placeholder: '今天最让我感恩的三件事...',
        required: true,
        maxLength: 800,
        suggestions: ['家人的关怀', '朋友的帮助', '自己的进步']
      },
      {
        title: '感恩的人',
        placeholder: '今天想感谢的人...',
        required: false,
        maxLength: 300
      },
      {
        title: '感恩感悟',
        placeholder: '这些事情让我意识到...',
        required: false,
        maxLength: 500
      }
    ],
    prompts: [
      '今天谁给了你帮助或支持？',
      '有什么小事情让你感到幸运？',
      '今天有什么让你微笑的瞬间？'
    ],
    wordCount: { min: 100, max: 500 },
    difficulty: 'easy',
    popularity: 88,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-08'
  },
  {
    id: 'emotion-deep',
    name: '情绪深挖',
    description: '深入探索内心世界，理解自己的情绪',
    category: 'emotion',
    icon: '💭',
    tags: ['情绪', '内省', '心理健康'],
    sections: [
      {
        title: '当前情绪状态',
        placeholder: '用一段话描述现在的情绪...',
        required: true,
        maxLength: 600,
        suggestions: ['焦虑', '平静', '兴奋', '低落', '感恩']
      },
      {
        title: '情绪触发点',
        placeholder: '是什么触发了这种情绪？',
        required: true,
        maxLength: 400
      },
      {
        title: '身体感受',
        placeholder: '这种情绪在身体上的感觉是...',
        required: false,
        maxLength: 300
      },
      {
        title: '应对策略',
        placeholder: '我可以如何应对这种情绪...',
        required: false,
        maxLength: 400
      }
    ],
    prompts: [
      '如果给现在的情绪打个分（1-10），你会打几分？',
      '这种情绪想告诉你什么？',
      '以前有类似的感觉吗？你是怎么度过的？'
    ],
    wordCount: { min: 200, max: 800 },
    difficulty: 'medium',
    popularity: 72,
    createdAt: '2026-03-02',
    updatedAt: '2026-03-10'
  },
  {
    id: 'work-daily',
    name: '工作日志',
    description: '高效记录工作进展，提升职场表现',
    category: 'work',
    icon: '💼',
    tags: ['工作', '效率', '职场'],
    sections: [
      {
        title: '今日完成',
        placeholder: '今天完成的主要工作...',
        required: true,
        maxLength: 500
      },
      {
        title: '遇到的问题',
        placeholder: '工作中遇到的困难和挑战...',
        required: false,
        maxLength: 400
      },
      {
        title: '明日计划',
        placeholder: '明天需要完成的任务...',
        required: true,
        maxLength: 300
      },
      {
        title: '心得体会',
        placeholder: '今日工作的收获和感悟...',
        required: false,
        maxLength: 400
      }
    ],
    prompts: [
      '今天最有成就感的工作是什么？',
      '有什么可以改进的地方？',
      '学到了什么新技能或知识？'
    ],
    wordCount: { min: 150, max: 600 },
    difficulty: 'easy',
    popularity: 85,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-09'
  },
  {
    id: 'growth-reflection',
    name: '成长反思',
    description: '深度反思个人成长，明确前进方向',
    category: 'growth',
    icon: '🌱',
    tags: ['成长', '反思', '目标'],
    sections: [
      {
        title: '今日成长',
        placeholder: '今天我在哪些方面有了成长...',
        required: true,
        maxLength: 500
      },
      {
        title: '认知突破',
        placeholder: '今天有什么新的认知或领悟...',
        required: false,
        maxLength: 400
      },
      {
        title: '待改进',
        placeholder: '还有哪些方面需要改进...',
        required: false,
        maxLength: 300
      },
      {
        title: '行动计划',
        placeholder: '基于今天的反思，我的行动计划是...',
        required: false,
        maxLength: 400
      }
    ],
    prompts: [
      '今天的经历让我学到了什么？',
      '我是否突破了某个舒适区？',
      '什么阻止了我做得更好？'
    ],
    wordCount: { min: 200, max: 700 },
    difficulty: 'medium',
    popularity: 78,
    createdAt: '2026-03-02',
    updatedAt: '2026-03-10'
  },
  {
    id: 'creative-writing',
    name: '创意写作',
    description: '释放创造力，记录灵感闪现',
    category: 'creative',
    icon: '✨',
    tags: ['创意', '灵感', '写作'],
    sections: [
      {
        title: '灵感来源',
        placeholder: '今天是什么激发了我的灵感...',
        required: true,
        maxLength: 400
      },
      {
        title: '创意内容',
        placeholder: '我的创意想法是...',
        required: true,
        maxLength: 1000
      },
      {
        title: '延伸思考',
        placeholder: '这个创意还可以如何发展...',
        required: false,
        maxLength: 500
      }
    ],
    prompts: [
      '如果这是一个故事的开始，接下来会发生什么？',
      '如果用比喻来描述今天，会是什么？',
      '有什么疯狂的想法想要记录下来？'
    ],
    wordCount: { min: 150, max: 1000 },
    difficulty: 'medium',
    popularity: 65,
    createdAt: '2026-03-03',
    updatedAt: '2026-03-08'
  },
  {
    id: 'travel-diary',
    name: '旅行日记',
    description: '记录旅途中的风景与感悟',
    category: 'travel',
    icon: '🗺️',
    tags: ['旅行', '探索', '回忆'],
    sections: [
      {
        title: '今日行程',
        placeholder: '今天去了哪些地方...',
        required: true,
        maxLength: 500
      },
      {
        title: '精彩瞬间',
        placeholder: '旅途中最难忘的瞬间...',
        required: true,
        maxLength: 600
      },
      {
        title: '美食记录',
        placeholder: '品尝到的特色美食...',
        required: false,
        maxLength: 300
      },
      {
        title: '旅途感悟',
        placeholder: '这次旅行带给我的感受...',
        required: false,
        maxLength: 500
      }
    ],
    prompts: [
      '今天最惊喜的发现是什么？',
      '有没有遇到有趣的人或事？',
      '这个地方和想象中有什么不同？'
    ],
    wordCount: { min: 200, max: 800 },
    difficulty: 'easy',
    popularity: 82,
    createdAt: '2026-03-03',
    updatedAt: '2026-03-09'
  },
  {
    id: 'dream-journal',
    name: '梦境记录',
    description: '捕捉清晨的梦境碎片，探索潜意识',
    category: 'dream',
    icon: '🌙',
    tags: ['梦境', '潜意识', '神秘'],
    sections: [
      {
        title: '梦境描述',
        placeholder: '记得的梦境内容...',
        required: true,
        maxLength: 800
      },
      {
        title: '梦中情绪',
        placeholder: '梦中的情绪感受...',
        required: false,
        maxLength: 300
      },
      {
        title: '醒来感受',
        placeholder: '醒来时的感受...',
        required: false,
        maxLength: 200
      },
      {
        title: '梦境联想',
        placeholder: '这个梦境可能和什么有关...',
        required: false,
        maxLength: 400
      }
    ],
    prompts: [
      '梦中有哪些特别清晰的形象？',
      '梦境是在白天还是夜晚？',
      '有认识的人出现在梦里吗？'
    ],
    wordCount: { min: 100, max: 600 },
    difficulty: 'easy',
    popularity: 58,
    createdAt: '2026-03-04',
    updatedAt: '2026-03-08'
  },
  {
    id: 'weekly-review',
    name: '周度复盘',
    description: '每周总结得失，规划下周行动',
    category: 'review',
    icon: '📊',
    tags: ['复盘', '计划', '效率'],
    sections: [
      {
        title: '本周成就',
        placeholder: '这周完成的重要事项...',
        required: true,
        maxLength: 600
      },
      {
        title: '本周挑战',
        placeholder: '遇到的困难和挑战...',
        required: false,
        maxLength: 400
      },
      {
        title: '学到的教训',
        placeholder: '从这周的经历中学到...',
        required: true,
        maxLength: 500
      },
      {
        title: '下周计划',
        placeholder: '下周的目标和计划...',
        required: true,
        maxLength: 500
      },
      {
        title: '习惯追踪',
        placeholder: '本周习惯养成情况...',
        required: false,
        maxLength: 300
      }
    ],
    prompts: [
      '本周最自豪的成就是什么？',
      '什么占用了最多时间？是否值得？',
      '下周最重要的三件事是什么？'
    ],
    wordCount: { min: 300, max: 1000 },
    difficulty: 'medium',
    popularity: 90,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-10'
  },
  {
    id: 'learning-notes',
    name: '学习笔记',
    description: '记录学习过程，巩固知识要点',
    category: 'learning',
    icon: '📚',
    tags: ['学习', '知识', '笔记'],
    sections: [
      {
        title: '今日学习',
        placeholder: '今天学习了什么内容...',
        required: true,
        maxLength: 600
      },
      {
        title: '核心概念',
        placeholder: '最重要的概念或知识点...',
        required: true,
        maxLength: 500
      },
      {
        title: '疑问困惑',
        placeholder: '还不理解的地方...',
        required: false,
        maxLength: 300
      },
      {
        title: '实践计划',
        placeholder: '如何将所学应用到实践...',
        required: false,
        maxLength: 400
      },
      {
        title: '资源记录',
        placeholder: '参考资料和学习资源...',
        required: false,
        maxLength: 300
      }
    ],
    prompts: [
      '这个知识点可以用来解决什么问题？',
      '和我之前学过的内容有什么联系？',
      '如何用简单的话向别人解释这个概念？'
    ],
    wordCount: { min: 200, max: 800 },
    difficulty: 'easy',
    popularity: 75,
    createdAt: '2026-03-04',
    updatedAt: '2026-03-09'
  },
  {
    id: 'morning-pages',
    name: '晨间书写',
    description: '清晨的自由书写，唤醒创造力',
    category: 'creative',
    icon: '🌅',
    tags: ['晨间', '自由书写', '创意'],
    sections: [
      {
        title: '意识流',
        placeholder: '让思绪自由流淌，不加评判地写下任何出现在脑海中的东西...',
        required: true,
        maxLength: 2000,
        suggestions: ['现在的感受', '昨晚的梦', '今天的期待']
      },
      {
        title: '今日意图',
        placeholder: '今天想要保持的心态或焦点...',
        required: false,
        maxLength: 300
      }
    ],
    prompts: [
      '现在脑海中浮现的第一个念头是什么？',
      '如果我没有任何限制，今天想做什么？',
      '有什么在心里想要表达出来？'
    ],
    wordCount: { min: 300, max: 1500 },
    difficulty: 'hard',
    popularity: 62,
    createdAt: '2026-03-05',
    updatedAt: '2026-03-09'
  },
  {
    id: 'monthly-review',
    name: '月度回顾',
    description: '月度总结与规划，把握人生方向',
    category: 'review',
    icon: '📅',
    tags: ['月度', '总结', '规划'],
    sections: [
      {
        title: '本月概览',
        placeholder: '这个月总体如何...',
        required: true,
        maxLength: 500
      },
      {
        title: '目标达成',
        placeholder: '本月目标的完成情况...',
        required: true,
        maxLength: 600
      },
      {
        title: '重要事件',
        placeholder: '这个月发生的重大事件...',
        required: false,
        maxLength: 500
      },
      {
        title: '成长收获',
        placeholder: '本月的成长和收获...',
        required: true,
        maxLength: 500
      },
      {
        title: '遗憾反思',
        placeholder: '有什么遗憾或做得不够好的...',
        required: false,
        maxLength: 400
      },
      {
        title: '下月规划',
        placeholder: '下个月的目标和计划...',
        required: true,
        maxLength: 600
      }
    ],
    prompts: [
      '如果用一个词形容这个月，会是什么？',
      '这一个月最大的变化是什么？',
      '下个月最想改变的一件事是什么？'
    ],
    wordCount: { min: 500, max: 2000 },
    difficulty: 'hard',
    popularity: 88,
    createdAt: '2026-03-01',
    updatedAt: '2026-03-10'
  }
];

// 模板使用历史
const templateUsageHistory: TemplateUsage[] = [];

// 获取所有模板
export function getAllTemplates(): DiaryTemplate[] {
  return defaultTemplates;
}

// 获取单个模板
export function getTemplateById(id: string): DiaryTemplate | undefined {
  return defaultTemplates.find(t => t.id === id);
}

// 按分类获取模板
export function getTemplatesByCategory(category: TemplateCategory): DiaryTemplate[] {
  return defaultTemplates.filter(t => t.category === category);
}

// 搜索模板
export function searchTemplates(query: string): DiaryTemplate[] {
  const lowerQuery = query.toLowerCase();
  return defaultTemplates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// 获取热门模板
export function getPopularTemplates(limit: number = 5): DiaryTemplate[] {
  return [...defaultTemplates]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

// 获取推荐模板
export function getRecommendedTemplates(
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night',
  dayOfWeek: number
): DiaryTemplate[] {
  // 根据时间和星期推荐合适的模板
  if (timeOfDay === 'morning') {
    return defaultTemplates.filter(t => 
      t.id === 'morning-pages' || t.id === 'daily-simple' || t.id === 'gratitude-journal'
    );
  }
  
  if (timeOfDay === 'evening' || timeOfDay === 'night') {
    return defaultTemplates.filter(t => 
      t.id === 'emotion-deep' || t.id === 'dream-journal' || t.id === 'gratitude-journal'
    );
  }
  
  // 工作日推荐工作相关模板
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return defaultTemplates.filter(t => 
      t.id === 'work-daily' || t.id === 'learning-notes' || t.id === 'daily-simple'
    );
  }
  
  // 周末推荐休闲模板
  return defaultTemplates.filter(t => 
    t.id === 'creative-writing' || t.id === 'travel-diary' || t.id === 'weekly-review'
  );
}

// 记录模板使用
export function recordTemplateUsage(templateId: string, userId: string, diaryId: string): void {
  templateUsageHistory.push({
    templateId,
    userId,
    diaryId,
    usedAt: new Date().toISOString()
  });
}

// 获取用户常用模板
export function getUserFrequentTemplates(userId: string, limit: number = 3): DiaryTemplate[] {
  const userUsage = templateUsageHistory.filter(u => u.userId === userId);
  const templateCounts = new Map<string, number>();
  
  userUsage.forEach(u => {
    templateCounts.set(u.templateId, (templateCounts.get(u.templateId) || 0) + 1);
  });
  
  const sortedTemplateIds = [...templateCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
  
  return sortedTemplateIds
    .map(id => getTemplateById(id))
    .filter((t): t is DiaryTemplate => t !== undefined);
}

// 根据模板生成日记草稿
export function generateDraftFromTemplate(template: DiaryTemplate): {
  title: string;
  content: string;
  tags: string[];
} {
  const title = `${template.name} - ${new Date().toLocaleDateString('zh-CN')}`;
  
  const content = template.sections.map(section => {
    return `## ${section.title}\n\n${section.placeholder}\n\n`;
  }).join('');
  
  return {
    title,
    content,
    tags: [...template.tags]
  };
}