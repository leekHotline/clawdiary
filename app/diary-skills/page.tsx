"use client";

import { useState } from "react";
import Link from "next/link";

// 技能类别和技能定义
const skillCategories = [
  {
    id: "self-awareness",
    name: "自我认知",
    icon: "🧠",
    color: "from-purple-500 to-indigo-500",
    description: "通过日记深入了解自己",
    skills: [
      {
        id: "emotion-awareness",
        name: "情绪觉察",
        icon: "🌊",
        description: "识别并理解自己的情绪变化",
        levels: [
          { level: 1, name: "初学者", requirement: "记录3篇情绪日记", tips: ["注意使用情绪词汇", "描述情绪的触发原因"] },
          { level: 2, name: "探索者", requirement: "分析10个情绪模式", tips: ["寻找情绪规律", "记录情绪强度变化"] },
          { level: 3, name: "觉察者", requirement: "预测5次情绪变化", tips: ["提前识别情绪信号", "练习情绪命名"] },
          { level: 4, name: "智者", requirement: "掌握情绪调节技巧", tips: ["建立情绪工具箱", "培养积极情绪习惯"] },
          { level: 5, name: "大师", requirement: "帮助他人理解情绪", tips: ["分享情绪智慧", "指导他人成长"] },
        ],
      },
      {
        id: "self-reflection",
        name: "自我反思",
        icon: "🪞",
        description: "深入审视自己的行为和想法",
        levels: [
          { level: 1, name: "初学者", requirement: "回答5个反思问题", tips: ["问自己'为什么'", "诚实面对自己"] },
          { level: 2, name: "探索者", requirement: "完成10次深度反思", tips: ["挖掘深层动机", "识别思维模式"] },
          { level: 3, name: "觉察者", requirement: "发现3个行为模式", tips: ["记录重复行为", "分析模式成因"] },
          { level: 4, name: "智者", requirement: "改变一个习惯", tips: ["制定改变计划", "追踪改变进度"] },
          { level: 5, name: "大师", requirement: "建立反思系统", tips: ["定期回顾总结", "持续优化改进"] },
        ],
      },
      {
        id: "value-clarity",
        name: "价值观清晰",
        icon: "💎",
        description: "明确什么对自己真正重要",
        levels: [
          { level: 1, name: "初学者", requirement: "列出5个重要价值观", tips: ["思考什么让你快乐", "回顾关键决定"] },
          { level: 2, name: "探索者", requirement: "分析价值观冲突", tips: ["记录价值观抉择", "理解优先级"] },
          { level: 3, name: "觉察者", requirement: "对齐行为与价值观", tips: ["检查日常行为", "识别不一致"] },
          { level: 4, name: "智者", requirement: "做出价值观驱动的决定", tips: ["用价值观指导选择", "勇敢说'不'"] },
          { level: 5, name: "大师", requirement: "活出价值观", tips: ["言行一致", "成为榜样"] },
        ],
      },
    ],
  },
  {
    id: "expression",
    name: "表达沟通",
    icon: "✍️",
    color: "from-pink-500 to-rose-500",
    description: "提升文字和情感表达能力",
    skills: [
      {
        id: "writing-expression",
        name: "文字表达",
        icon: "📝",
        description: "用文字清晰传达想法和感受",
        levels: [
          { level: 1, name: "初学者", requirement: "写10篇日记", tips: ["从简短开始", "不用追求完美"] },
          { level: 2, name: "探索者", requirement: "尝试3种写作风格", tips: ["描述性写作", "叙事性写作", "反思性写作"] },
          { level: 3, name: "觉察者", requirement: "收到写作反馈", tips: ["分享给朋友", "接受建议"] },
          { level: 4, name: "智者", requirement: "形成个人风格", tips: ["找到自己的声音", "保持真实性"] },
          { level: 5, name: "大师", requirement: "影响他人", tips: ["写出共鸣", "传递价值"] },
        ],
      },
      {
        id: "emotion-expression",
        name: "情感表达",
        icon: "💝",
        description: "真实表达内心感受",
        levels: [
          { level: 1, name: "初学者", requirement: "记录5种情绪", tips: ["使用情绪词汇表", "注意身体感受"] },
          { level: 2, name: "探索者", requirement: "深度描述10次情绪体验", tips: ["描述情绪的质感", "使用比喻"] },
          { level: 3, name: "觉察者", requirement: "表达复杂情绪", tips: ["矛盾情感", "混合感受"] },
          { level: 4, name: "智者", requirement: "建立情感词汇库", tips: ["收集情绪词汇", "创造个人表达"] },
          { level: 5, name: "大师", requirement: "自如表达任何感受", tips: ["无障碍表达", "帮助他人表达"] },
        ],
      },
      {
        id: "storytelling",
        name: "叙事能力",
        icon: "📖",
        description: "将经历转化为动人的故事",
        levels: [
          { level: 1, name: "初学者", requirement: "讲3个小故事", tips: ["有开头结尾", "包含情感"] },
          { level: 2, name: "探索者", requirement: "使用故事结构", tips: ["起承转合", "冲突解决"] },
          { level: 3, name: "觉察者", requirement: "加入细节和画面感", tips: ["感官描述", "对话引用"] },
          { level: 4, name: "智者", requirement: "讲述有影响力的故事", tips: ["发现意义", "传递启示"] },
          { level: 5, name: "大师", requirement: "成为故事讲述者", tips: ["收集人生故事", "激励他人"] },
        ],
      },
    ],
  },
  {
    id: "habits",
    name: "习惯养成",
    icon: "🔄",
    color: "from-green-500 to-emerald-500",
    description: "建立持久的积极习惯",
    skills: [
      {
        id: "consistency",
        name: "持续性",
        icon: "🔥",
        description: "保持日记写作的连贯性",
        levels: [
          { level: 1, name: "初学者", requirement: "连续7天写日记", tips: ["固定时间写", "设置提醒"] },
          { level: 2, name: "探索者", requirement: "连续21天写日记", tips: ["建立触发器", "绑定现有习惯"] },
          { level: 3, name: "觉察者", requirement: "连续60天写日记", tips: ["克服倦怠期", "寻找新动力"] },
          { level: 4, name: "智者", requirement: "连续100天写日记", tips: ["习惯自动化", "享受过程"] },
          { level: 5, name: "大师", requirement: "连续365天写日记", tips: ["成为身份", "影响他人"] },
        ],
      },
      {
        id: "goal-tracking",
        name: "目标追踪",
        icon: "🎯",
        description: "通过日记追踪和实现目标",
        levels: [
          { level: 1, name: "初学者", requirement: "记录3个目标", tips: ["SMART原则", "写下来"] },
          { level: 2, name: "探索者", requirement: "每周回顾目标进度", tips: ["定期检查", "调整计划"] },
          { level: 3, name: "觉察者", requirement: "分解一个长期目标", tips: ["里程碑分解", "小步前进"] },
          { level: 4, name: "智者", requirement: "实现一个重要目标", tips: ["庆祝成就", "分析成功因素"] },
          { level: 5, name: "大师", requirement: "帮助他人设定目标", tips: ["分享经验", "指导方法"] },
        ],
      },
      {
        id: "time-awareness",
        name: "时间觉察",
        icon: "⏰",
        description: "理解和管理自己的时间",
        levels: [
          { level: 1, name: "初学者", requirement: "记录一周的时间分配", tips: ["诚实记录", "分类统计"] },
          { level: 2, name: "探索者", requirement: "识别时间黑洞", tips: ["找浪费时间", "分析原因"] },
          { level: 3, name: "觉察者", requirement: "优化时间分配", tips: ["设定优先级", "保护重要时间"] },
          { level: 4, name: "智者", requirement: "建立时间管理系统", tips: ["时间块规划", "定期复盘"] },
          { level: 5, name: "大师", requirement: "活出想要的时间节奏", tips: ["时间自主", "平衡生活"] },
        ],
      },
    ],
  },
  {
    id: "mental-health",
    name: "心理健康",
    icon: "💚",
    color: "from-teal-500 to-cyan-500",
    description: "维护和提升心理福祉",
    skills: [
      {
        id: "stress-management",
        name: "压力管理",
        icon: "😌",
        description: "识别和应对压力",
        levels: [
          { level: 1, name: "初学者", requirement: "识别3个压力源", tips: ["身体信号", "情绪变化"] },
          { level: 2, name: "探索者", requirement: "记录压力反应模式", tips: ["身体反应", "行为模式"] },
          { level: 3, name: "觉察者", requirement: "学会2种减压技巧", tips: ["深呼吸", "正念练习"] },
          { level: 4, name: "智者", requirement: "建立压力管理工具箱", tips: ["预防策略", "应急方案"] },
          { level: 5, name: "大师", requirement: "压力下保持平衡", tips: ["压力智慧", "帮助他人"] },
        ],
      },
      {
        id: "gratitude",
        name: "感恩练习",
        icon: "🙏",
        description: "培养感恩的心态",
        levels: [
          { level: 1, name: "初学者", requirement: "记录10件感恩的事", tips: ["从小事开始", "具体描述"] },
          { level: 2, name: "探索者", requirement: "连续30天感恩日记", tips: ["每天3件事", "感受感恩"] },
          { level: 3, name: "觉察者", requirement: "感恩困难时刻", tips: ["挫折中的礼物", "成长机会"] },
          { level: 4, name: "智者", requirement: "表达感恩给他人", tips: ["感谢信", "当面表达"] },
          { level: 5, name: "大师", requirement: "活在感恩中", tips: ["感恩心态", "传递感恩"] },
        ],
      },
      {
        id: "mindfulness",
        name: "正念觉察",
        icon: "🧘",
        description: "活在当下，保持觉知",
        levels: [
          { level: 1, name: "初学者", requirement: "完成5次正念练习", tips: ["专注呼吸", "不评判"] },
          { level: 2, name: "探索者", requirement: "在日记中记录正念时刻", tips: ["日常正念", "觉察当下"] },
          { level: 3, name: "觉察者", requirement: "建立正念习惯", tips: ["固定时间", "融入日常"] },
          { level: 4, name: "智者", requirement: "正念应对困难情绪", tips: ["观察而不反应", "接纳感受"] },
          { level: 5, name: "大师", requirement: "活在觉知中", tips: ["持续正念", "智慧生活"] },
        ],
      },
    ],
  },
  {
    id: "creativity",
    name: "创造力",
    icon: "🎨",
    color: "from-amber-500 to-orange-500",
    description: "激发创意和想象力",
    skills: [
      {
        id: "creative-thinking",
        name: "创意思维",
        icon: "💡",
        description: "产生新的想法和解决方案",
        levels: [
          { level: 1, name: "初学者", requirement: "记录10个新想法", tips: ["不评判", "追求数量"] },
          { level: 2, name: "探索者", requirement: "尝试头脑风暴技巧", tips: ["思维导图", "自由写作"] },
          { level: 3, name: "觉察者", requirement: "连接不同领域的想法", tips: ["跨界思考", "寻找关联"] },
          { level: 4, name: "智者", requirement: "实现一个创意想法", tips: ["小步验证", "迭代改进"] },
          { level: 5, name: "大师", requirement: "培养创意习惯", tips: ["日常灵感收集", "分享创意"] },
        ],
      },
      {
        id: "association",
        name: "联想能力",
        icon: "🔗",
        description: "发现事物之间的联系",
        levels: [
          { level: 1, name: "初学者", requirement: "记录10个联想", tips: ["随机词汇联想", "寻找相似点"] },
          { level: 2, name: "探索者", requirement: "创建概念连接图", tips: ["视觉化思考", "连接点"] },
          { level: 3, name: "觉察者", requirement: "发现生活中的模式", tips: ["观察规律", "识别重复"] },
          { level: 4, name: "智者", requirement: "用联想解决问题", tips: ["类比思维", "迁移方案"] },
          { level: 5, name: "大师", requirement: "建立联想网络", tips: ["知识连接", "洞察涌现"] },
        ],
      },
      {
        id: "imagination",
        name: "想象力",
        icon: "🌈",
        description: "构想可能性和未来愿景",
        levels: [
          { level: 1, name: "初学者", requirement: "写5篇想象日记", tips: ["不设限制", "天马行空"] },
          { level: 2, name: "探索者", requirement: "描述理想的未来", tips: ["具体画面", "感受细节"] },
          { level: 3, name: "觉察者", requirement: "想象不同的可能性", tips: ["如果...会怎样", "探索选项"] },
          { level: 4, name: "智者", requirement: "将想象转化为计划", tips: ["可行性分析", "行动步骤"] },
          { level: 5, name: "大师", requirement: "活在创造中", tips: ["想象即创造", "影响现实"] },
        ],
      },
    ],
  },
];

// 模拟用户技能数据
function getUserSkillLevel(skillId: string): number {
  // 这里应该从实际数据获取，现在模拟一些数据
  const levels: Record<string, number> = {
    "emotion-awareness": 3,
    "self-reflection": 2,
    "value-clarity": 1,
    "writing-expression": 2,
    "emotion-expression": 2,
    "storytelling": 1,
    "consistency": 4,
    "goal-tracking": 2,
    "time-awareness": 1,
    "stress-management": 2,
    "gratitude": 3,
    "mindfulness": 1,
    "creative-thinking": 2,
    "association": 1,
    "imagination": 1,
  };
  return levels[skillId] || 0;
}

function getSkillProgress(skillId: string): number {
  const level = getUserSkillLevel(skillId);
  // 模拟进度百分比
  const progress: Record<string, number> = {
    "emotion-awareness": 65,
    "self-reflection": 40,
    "value-clarity": 25,
    "writing-expression": 55,
    "emotion-expression": 50,
    "storytelling": 30,
    "consistency": 85,
    "goal-tracking": 45,
    "time-awareness": 20,
    "stress-management": 50,
    "gratitude": 70,
    "mindfulness": 15,
    "creative-thinking": 60,
    "association": 35,
    "imagination": 28,
  };
  return progress[skillId] || 0;
}

export default function DiarySkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // 计算总体统计数据
  const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  const unlockedSkills = skillCategories.reduce((acc, cat) => {
    return acc + cat.skills.filter((s) => getUserSkillLevel(s.id) > 0).length;
  }, 0);
  const totalLevelPoints = skillCategories.reduce((acc, cat) => {
    return acc + cat.skills.reduce((a, s) => a + getUserSkillLevel(s.id), 0);
  }, 0);
  const maxLevelPoints = totalSkills * 5;

  const selectedCategoryData = skillCategories.find((c) => c.id === selectedCategory);
  const selectedSkillData = selectedCategoryData?.skills.find((s) => s.id === selectedSkill);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-fuchsia-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-violet-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">日记技能中心</h1>
          <p className="text-gray-500">通过日记养成好习惯，解锁人生技能</p>
        </div>

        {/* 总体进度 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">技能成长总览</h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-bold text-purple-600">{unlockedSkills}</span>/{totalSkills} 技能已解锁
              </div>
              <div className="text-sm text-gray-500">
                总等级: <span className="font-bold text-purple-600">{totalLevelPoints}</span>/{maxLevelPoints}
              </div>
            </div>
          </div>
          
          {/* 总进度条 */}
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-6">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${(totalLevelPoints / maxLevelPoints) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
              {Math.round((totalLevelPoints / maxLevelPoints) * 100)}%
            </div>
          </div>

          {/* 分类进度 */}
          <div className="grid grid-cols-5 gap-3">
            {skillCategories.map((cat) => {
              const catLevel = cat.skills.reduce((acc, s) => acc + getUserSkillLevel(s.id), 0);
              const catMax = cat.skills.length * 5;
              const progress = (catLevel / catMax) * 100;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`p-3 rounded-xl transition-all ${
                    selectedCategory === cat.id 
                      ? "bg-white shadow-md scale-105" 
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium text-gray-700 truncate">{cat.name}</div>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{Math.round(progress)}%</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 分类技能详情 */}
        {selectedCategoryData && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{selectedCategoryData.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedCategoryData.name}</h2>
                <p className="text-sm text-gray-500">{selectedCategoryData.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedCategoryData.skills.map((skill) => {
                const level = getUserSkillLevel(skill.id);
                const progress = getSkillProgress(skill.id);
                const currentLevel = skill.levels[level] || skill.levels[0];
                
                return (
                  <div 
                    key={skill.id}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedSkill === skill.id 
                        ? "border-purple-300 bg-purple-50" 
                        : "border-transparent bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{skill.icon}</span>
                        <div>
                          <h3 className="font-bold text-gray-800">{skill.name}</h3>
                          <p className="text-sm text-gray-500">{skill.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-purple-600">
                          Lv.{level} {currentLevel.name}
                        </div>
                        <div className="text-xs text-gray-400">{progress}% 完成</div>
                      </div>
                    </div>
                    
                    {/* 等级进度 */}
                    <div className="flex items-center gap-1 mb-3">
                      {skill.levels.map((l, idx) => (
                        <div 
                          key={l.level}
                          className={`flex-1 h-2 rounded-full ${
                            idx < level 
                              ? `bg-gradient-to-r ${selectedCategoryData.color}` 
                              : idx === level 
                                ? `bg-gradient-to-r ${selectedCategoryData.color} opacity-50 animate-pulse`
                                : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    {/* 展开详情 */}
                    {selectedSkill === skill.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            📌 当前任务: {currentLevel.requirement}
                          </div>
                          <div className="text-sm text-gray-500">
                            💡 建议: {currentLevel.tips.join(" · ")}
                          </div>
                        </div>
                        
                        {/* 等级路线图 */}
                        <div className="space-y-2">
                          {skill.levels.map((l, idx) => (
                            <div 
                              key={l.level}
                              className={`flex items-center gap-3 p-2 rounded-lg ${
                                idx < level 
                                  ? "bg-green-50" 
                                  : idx === level 
                                    ? "bg-purple-50 ring-2 ring-purple-200" 
                                    : "bg-gray-50 opacity-50"
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                                idx < level 
                                  ? "bg-green-500 text-white" 
                                  : idx === level 
                                    ? `bg-gradient-to-r ${selectedCategoryData.color} text-white`
                                    : "bg-gray-300 text-gray-500"
                              }`}>
                                {idx < level ? "✓" : l.level}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{l.name}</div>
                                <div className="text-xs text-gray-500">{l.requirement}</div>
                              </div>
                              {idx === level && (
                                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                                  进行中
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* 行动按钮 */}
                        <div className="mt-4 flex gap-3">
                          <Link
                            href="/chat-diary"
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-center text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            ✍️ 写日记提升技能
                          </Link>
                          <button className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            📚 查看教程
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 成就展示 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 技能成就</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: "🔥", name: "连续打卡", desc: "30天连续写日记", unlocked: true },
              { icon: "📝", name: "笔耕不辍", desc: "写满100篇日记", unlocked: true },
              { icon: "🧠", name: "自我洞察", desc: "解锁自我认知全部技能", unlocked: false },
              { icon: "🎨", name: "创意大师", desc: "解锁创造力全部技能", unlocked: false },
              { icon: "💫", name: "情感达人", desc: "情绪表达达到Lv.5", unlocked: false },
              { icon: "🌟", name: "技能大师", desc: "任一技能达到Lv.5", unlocked: false },
              { icon: "📚", name: "博学者", desc: "解锁所有技能类别", unlocked: true },
              { icon: "🏆", name: "传奇", desc: "所有技能达到Lv.3", unlocked: false },
            ].map((achievement, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl text-center ${
                  achievement.unlocked 
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200" 
                    : "bg-gray-50 opacity-50"
                }`}
              >
                <div className={`text-3xl mb-2 ${!achievement.unlocked && "grayscale"}`}>
                  {achievement.icon}
                </div>
                <div className="text-sm font-medium text-gray-700">{achievement.name}</div>
                <div className="text-xs text-gray-400 mt-1">{achievement.desc}</div>
                {achievement.unlocked && (
                  <div className="text-xs text-green-500 mt-2">✓ 已解锁</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 技能建议 */}
        <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-bold mb-4">💡 今日技能建议</h2>
          <div className="space-y-3">
            {[
              { skill: "情绪觉察", action: "今天记录一个让你印象深刻的情绪时刻", category: "self-awareness" },
              { skill: "感恩练习", action: "写下今天发生的3件值得感恩的小事", category: "mental-health" },
              { skill: "持续性", action: "你已经连续写了28天，继续加油！", category: "habits" },
            ].map((tip, idx) => (
              <Link 
                key={idx}
                href="/chat-diary"
                className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              >
                <span className="text-2xl">→</span>
                <div>
                  <div className="font-medium">{tip.skill}</div>
                  <div className="text-sm text-white/80">{tip.action}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 返回链接 */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </main>
    </div>
  );
}