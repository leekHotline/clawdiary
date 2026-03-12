import Link from "next/link";

export const metadata = {
  title: "日记模板 - Claw Diary",
  description: "丰富的日记模板，助你快速开始写作",
};

// 模板分类
const templateCategories = [
  {
    id: "daily",
    name: "日常记录",
    icon: "📝",
    description: "记录每一天的生活点滴",
    templates: [
      {
        id: "simple",
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
        popular: true,
      },
      {
        id: "gratitude",
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
        popular: true,
      },
      {
        id: "morning",
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
        popular: false,
      },
      {
        id: "evening",
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
        popular: false,
      },
    ],
  },
  {
    id: "growth",
    name: "成长反思",
    icon: "🌱",
    description: "深度思考和自我提升",
    templates: [
      {
        id: "reflection",
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
        popular: true,
      },
      {
        id: "goal-review",
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
        popular: false,
      },
      {
        id: "habit-track",
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
        popular: false,
      },
      {
        id: "learning",
        name: "学习笔记",
        icon: "📚",
        description: "记录学习收获",
        content: `## 学习笔记

**主题：** 
**日期：** 

### 学到了什么


### 关键概念
1. 
2. 
3. 

### 如何应用


### 下一步学习

`,
        popular: false,
      },
    ],
  },
  {
    id: "creative",
    name: "创意写作",
    icon: "🎨",
    description: "释放创造力",
    templates: [
      {
        id: "story",
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
        popular: true,
      },
      {
        id: "poetry",
        name: "诗歌创作",
        icon: "🎭",
        description: "用诗意的语言表达",
        content: `## 诗歌日记

**主题：** 
**风格：** 

### 诗作

---

### 写作背景

`,
        popular: false,
      },
      {
        id: "letter",
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
        popular: false,
      },
      {
        id: "dream",
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
        popular: false,
      },
    ],
  },
  {
    id: "mood",
    name: "情绪日记",
    icon: "❤️",
    description: "关注心理健康",
    templates: [
      {
        id: "mood-simple",
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
        popular: true,
      },
      {
        id: "anxiety",
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
        popular: false,
      },
      {
        id: "therapy",
        name: "治疗日记",
        icon: "💊",
        description: "心理治疗记录",
        content: `## 治疗日记

**日期：** 
**类型：** 

### 本次重点


### 收获和洞察
1. 
2. 

### 需要练习的


### 下次要讨论的

`,
        popular: false,
      },
    ],
  },
  {
    id: "special",
    name: "特殊场合",
    icon: "🎉",
    description: "特别日子的记录",
    templates: [
      {
        id: "birthday",
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
        popular: true,
      },
      {
        id: "travel",
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
        popular: true,
      },
      {
        id: "anniversary",
        name: "纪念日",
        icon: "💕",
        description: "记录特别的日子",
        content: `## 纪念日日记

**纪念日：** 
**第几年：** 

### 回忆
**那一天：** 


### 这一路
**开心的：** 
**克服的：** 

### 未来的约定


### 此刻想说

`,
        popular: false,
      },
    ],
  },
];

// 使用统计
const usageStats = {
  totalTemplates: 20,
  popularTemplates: [
    { name: "简洁日记", uses: 1234 },
    { name: "感恩日记", uses: 987 },
    { name: "周度反思", uses: 654 },
  ],
  recentCreated: 156,
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ← 返回首页
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  📝 日记模板
                </h1>
                <p className="text-sm text-gray-500">
                  {templateCategories.length} 个分类 · {usageStats.totalTemplates} 个模板
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                我的模板
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                + 创建模板
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 热门模板 */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🔥 热门模板
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {usageStats.popularTemplates.map((template, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-sm opacity-80">{template.uses} 次使用</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 模板分类 */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        <div className="space-y-6">
          {templateCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* 分类标题 */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{category.templates.length} 个模板</span>
                </div>
              </div>

              {/* 模板列表 */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.templates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-100 rounded-xl p-4 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{template.icon}</span>
                          <h4 className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                            {template.name}
                          </h4>
                        </div>
                        {template.popular && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">
                            热门
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                          使用模板 →
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <span>👁️ 预览</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 自定义模板提示 */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">创建你的专属模板</h3>
              <p className="text-sm text-gray-600">
                根据你的写作习惯，定制个性化日记模板
              </p>
            </div>
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              开始创建
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">{usageStats.totalTemplates}</div>
            <div className="text-sm text-gray-500">可用模板</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-pink-600">{usageStats.recentCreated}</div>
            <div className="text-sm text-gray-500">本周创建</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-indigo-600">∞</div>
            <div className="text-sm text-gray-500">创意可能</div>
          </div>
        </div>
      </main>
    </div>
  );
}