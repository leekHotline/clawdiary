import { NextRequest, NextResponse } from "next/server";

// 模板数据
const templates = [
  // 日常记录
  {
    id: "simple",
    category: "daily",
    name: "简洁日记",
    icon: "✨",
    description: "快速记录今天发生的3件事",
    content: `## 今天的三件事

1. 
2. 
3. 

## 心情标签
今天的心情：[开心/平静/疲惫/其他]

## 一句话总结
`,
    tags: ["日常", "简洁", "快速"],
    uses: 1234,
    rating: 4.8,
    popular: true,
  },
  {
    id: "gratitude",
    category: "daily",
    name: "感恩日记",
    icon: "🙏",
    description: "记录今天值得感恩的事",
    content: `## 感恩清单

今天我要感谢：

1. **感谢** 
   - 因为

2. **感谢** 
   - 因为

3. **感谢** 
   - 因为

## 今日感悟
感恩让生活更美好。
`,
    tags: ["感恩", "积极", "心理"],
    uses: 987,
    rating: 4.9,
    popular: true,
  },
  {
    id: "morning",
    category: "daily",
    name: "晨间日记",
    icon: "🌅",
    description: "开启美好的一天",
    content: `## 晨间日记

**日期：** 
**天气：** 
**心情：** 

### 今日目标
- [ ] 
- [ ] 
- [ ] 

### 今日期待


### 晨间肯定语
今天我选择 
`,
    tags: ["早晨", "计划", "目标"],
    uses: 654,
    rating: 4.7,
    popular: false,
  },
  {
    id: "evening",
    category: "daily",
    name: "晚间回顾",
    icon: "🌙",
    description: "反思一天的成长",
    content: `## 晚间回顾

### 今天发生的事
**好的方面：**


**可以改进：**


### 今日成就
- 
- 
- 

### 明日计划
1. 
2. 

### 睡前感想

`,
    tags: ["晚间", "反思", "总结"],
    uses: 543,
    rating: 4.6,
    popular: false,
  },
  // 成长反思
  {
    id: "reflection",
    category: "growth",
    name: "周度反思",
    icon: "🔄",
    description: "每周一次的深度复盘",
    content: `## 周度反思

**时间范围：** 
**本周主题：** 

### 本周成就
1. 
2. 
3. 

### 遇到的挑战
**挑战：** 
**应对：** 
**结果：** 

### 学到的东西
- 
- 

### 下周计划
**重点目标：** 
**关键行动：** 
1. 
2. 
3. 
`,
    tags: ["周报", "反思", "成长"],
    uses: 432,
    rating: 4.8,
    popular: true,
  },
  {
    id: "goal-review",
    category: "growth",
    name: "目标回顾",
    icon: "🎯",
    description: "检查目标进展",
    content: `## 目标回顾

### 长期目标
**目标：** 
**截止：** 
**进度：** %

### 本周行动
- [ ] 
- [ ] 
- [ ] 

### 阻碍分析
**问题：** 
**原因：** 
**解决方案：** 

### 调整计划
**新策略：** 
`,
    tags: ["目标", "计划", "复盘"],
    uses: 321,
    rating: 4.5,
    popular: false,
  },
  {
    id: "habit-track",
    category: "growth",
    name: "习惯追踪",
    icon: "📊",
    description: "追踪习惯养成进度",
    content: `## 习惯追踪日记

**日期：** 

### 今日习惯
| 习惯 | 状态 | 感受 |
|------|------|------|
| 早起 |  |  |
| 运动 |  |  |
| 阅读 |  |  |
| 写作 |  |  |

### 习惯反思
**最难的：** 
**最顺的：** 
**原因分析：** 

### 明日调整

`,
    tags: ["习惯", "追踪", "自律"],
    uses: 456,
    rating: 4.7,
    popular: false,
  },
  // 创意写作
  {
    id: "story",
    category: "creative",
    name: "故事开头",
    icon: "📖",
    description: "用故事开始这一天",
    content: `## 故事日记

**提示词：** 

### 故事开始


### 发展


### 结局（未完待续）

---
*创作于*
`,
    tags: ["故事", "创意", "写作"],
    uses: 234,
    rating: 4.4,
    popular: true,
  },
  {
    id: "letter",
    category: "creative",
    name: "信件格式",
    icon: "✉️",
    description: "写给某人（或自己）",
    content: `## 一封信

**收信人：** 
**日期：** 

亲爱的，

---

---

祝好，
[你的名字]
`,
    tags: ["信件", "表达", "情感"],
    uses: 345,
    rating: 4.6,
    popular: false,
  },
  {
    id: "dream",
    category: "creative",
    name: "梦境记录",
    icon: "💭",
    description: "记录和分析梦境",
    content: `## 梦境日记

**日期：** 
**睡眠质量：** ⭐⭐⭐⭐⭐

### 梦境内容


### 梦境符号解读
- **符号1：** 
- **符号2：** 

### 可能的含义

### 现实关联

`,
    tags: ["梦境", "心理学", "分析"],
    uses: 123,
    rating: 4.3,
    popular: false,
  },
  // 情绪日记
  {
    id: "mood-simple",
    category: "mood",
    name: "心情速记",
    icon: "😊",
    description: "快速记录心情状态",
    content: `## 心情速记

**时间：** 
**心情指数：** 😊😊😊😊😊 (1-5)

### 此刻感受


### 触发因素
**好事：** 
**烦事：** 

### 应对策略

`,
    tags: ["心情", "情绪", "快速"],
    uses: 567,
    rating: 4.7,
    popular: true,
  },
  {
    id: "anxiety",
    category: "mood",
    name: "焦虑记录",
    icon: "😰",
    description: "处理焦虑情绪",
    content: `## 焦虑日记

**日期：** 
**焦虑程度：** /10

### 焦虑内容
**我在担心什么？**


**这个担心是真实的吗？**


### 理性分析
**最坏情况：** 
**最好情况：** 
**最可能情况：** 

### 行动计划
1. 
2. 

### 应对后的感受

`,
    tags: ["焦虑", "心理健康", "应对"],
    uses: 234,
    rating: 4.5,
    popular: false,
  },
  // 特殊场合
  {
    id: "birthday",
    category: "special",
    name: "生日记录",
    icon: "🎂",
    description: "记录生日这一天",
    content: `## 生日日记 🎂

**年龄：** 
**日期：** 

### 这一年回顾
**最大的成就：** 
**最大的挑战：** 
**最难忘的事：** 

### 生日愿望
1. 
2. 
3. 

### 对下一年的期待


### 感谢的人

`,
    tags: ["生日", "纪念日", "回顾"],
    uses: 189,
    rating: 4.9,
    popular: true,
  },
  {
    id: "travel",
    category: "special",
    name: "旅行日记",
    icon: "✈️",
    description: "记录旅途见闻",
    content: `## 旅行日记

**目的地：** 
**日期：** 
**天气：** 

### 今日行程
1. 
2. 
3. 

### 精彩瞬间
**最佳：** 
**惊喜：** 
**遗憾：** 

### 美食记录


### 明日计划

`,
    tags: ["旅行", "游记", "体验"],
    uses: 678,
    rating: 4.8,
    popular: true,
  },
];

// 模板分类
const categories = [
  { id: "daily", name: "日常记录", icon: "📝", description: "记录每一天的生活点滴" },
  { id: "growth", name: "成长反思", icon: "🌱", description: "深度思考和自我提升" },
  { id: "creative", name: "创意写作", icon: "🎨", description: "释放创造力" },
  { id: "mood", name: "情绪日记", icon: "❤️", description: "关注心理健康" },
  { id: "special", name: "特殊场合", icon: "🎉", description: "特别日子的记录" },
];

// 获取模板列表
function getTemplates(category?: string, popular?: boolean, limit?: number) {
  let filtered = [...templates];
  
  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }
  
  if (popular) {
    filtered = filtered.filter(t => t.popular);
  }
  
  if (limit) {
    filtered = filtered.slice(0, limit);
  }
  
  return filtered;
}

// 获取单个模板
function getTemplateById(id: string) {
  return templates.find(t => t.id === id);
}

// 搜索模板
function searchTemplates(query: string) {
  const q = query.toLowerCase();
  return templates.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q))
  );
}

// 增加使用次数
function incrementUse(id: string) {
  const template = templates.find(t => t.id === id);
  if (template) {
    template.uses++;
    return true;
  }
  return false;
}

// 获取统计
function getStats() {
  return {
    totalTemplates: templates.length,
    totalUses: templates.reduce((sum, t) => sum + t.uses, 0),
    categories: categories.length,
    popularCount: templates.filter(t => t.popular).length,
    topTemplates: [...templates].sort((a, b) => b.uses - a.uses).slice(0, 5),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action") || "list";
  
  if (action === "categories") {
    return NextResponse.json({
      success: true,
      data: categories,
    });
  }
  
  if (action === "stats") {
    return NextResponse.json({
      success: true,
      data: getStats(),
    });
  }
  
  if (action === "popular") {
    const limit = parseInt(searchParams.get("limit") || "10");
    return NextResponse.json({
      success: true,
      data: templates.filter(t => t.popular).slice(0, limit),
    });
  }
  
  if (action === "search") {
    const query = searchParams.get("q") || "";
    return NextResponse.json({
      success: true,
      data: searchTemplates(query),
    });
  }
  
  // 获取单个模板
  const id = searchParams.get("id");
  if (id) {
    const template = getTemplateById(id);
    if (!template) {
      return NextResponse.json({
        success: false,
        error: "模板不存在",
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: template,
    });
  }
  
  // 获取列表
  const category = searchParams.get("category") || undefined;
  const popular = searchParams.get("popular") === "true";
  const limit = parseInt(searchParams.get("limit") || "0") || undefined;
  
  return NextResponse.json({
    success: true,
    data: getTemplates(category, popular, limit),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, id } = body;
  
  if (action === "use" && id) {
    const success = incrementUse(id);
    return NextResponse.json({
      success,
      message: success ? "使用次数已更新" : "模板不存在",
    });
  }
  
  // 创建自定义模板
  if (action === "create") {
    const { name, category, content, description, icon, tags } = body;
    
    const newTemplate = {
      id: `custom-${Date.now()}`,
      category: category || "daily",
      name: name || "自定义模板",
      icon: icon || "📝",
      description: description || "",
      content: content || "",
      tags: tags || [],
      uses: 0,
      rating: 0,
      popular: false,
    };
    
    templates.push(newTemplate);
    
    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: "模板创建成功",
    });
  }
  
  return NextResponse.json({
    success: false,
    error: "未知操作",
  }, { status: 400 });
}