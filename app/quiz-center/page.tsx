'use client';

import { useState } from 'react';
import Link from 'next/link';

// 测验类型定义
interface Quiz {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: number;
  duration: string;
  color: string;
  gradient: string;
}

// 所有测验
const QUIZZES: Quiz[] = [
  {
    id: 'personality',
    title: '人格类型测验',
    description: '发现你的独特人格特质，了解真实的自己',
    icon: '🧠',
    questions: 10,
    duration: '3分钟',
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'emotion',
    title: '情绪智力测试',
    description: '测测你的情绪感知和管理能力',
    icon: '💡',
    questions: 8,
    duration: '2分钟',
    color: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'habit',
    title: '习惯养成力',
    description: '评估你的习惯养成潜力，找到适合你的方法',
    icon: '🌱',
    questions: 12,
    duration: '4分钟',
    color: 'text-green-600',
    gradient: 'from-green-500 to-teal-600',
  },
  {
    id: 'creativity',
    title: '创造力评估',
    description: '探索你的创造性思维潜能',
    icon: '✨',
    questions: 10,
    duration: '3分钟',
    color: 'text-pink-600',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'stress',
    title: '压力承受度',
    description: '了解你的抗压能力和应对策略',
    icon: '🎯',
    questions: 8,
    duration: '2分钟',
    color: 'text-red-600',
    gradient: 'from-red-500 to-orange-600',
  },
  {
    id: 'growth',
    title: '成长型思维',
    description: '你有多相信能力是可以培养的？',
    icon: '🚀',
    questions: 10,
    duration: '3分钟',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-600',
  },
];

// 每日精选测验
const DAILY_QUIZ = {
  id: 'daily',
  title: '今日心情测验',
  description: '快速了解今天的你，只需1分钟',
  icon: '📅',
  questions: 5,
  duration: '1分钟',
  color: 'text-orange-600',
  gradient: 'from-orange-500 to-amber-600',
};

// 人格测验题目
const PERSONALITY_QUESTIONS = [
  {
    question: '在社交聚会中，你通常会：',
    options: [
      { text: '主动与陌生人交谈', score: 'E' },
      { text: '和熟悉的朋友待在一起', score: 'I' },
      { text: '找个安静角落观察', score: 'I' },
      { text: '根据心情灵活应对', score: 'E' },
    ],
  },
  {
    question: '面对问题时，你倾向于：',
    options: [
      { text: '分析逻辑，寻找规律', score: 'T' },
      { text: '考虑他人感受', score: 'F' },
      { text: '两者平衡', score: 'X' },
      { text: '凭直觉判断', score: 'N' },
    ],
  },
  {
    question: '周末你更喜欢：',
    options: [
      { text: '计划好的活动', score: 'J' },
      { text: '随心所欲，随机应变', score: 'P' },
      { text: '混合安排', score: 'X' },
      { text: '在家放松', score: 'I' },
    ],
  },
  {
    question: '当你学习新事物时：',
    options: [
      { text: '喜欢理论和概念', score: 'N' },
      { text: '偏好具体实例和练习', score: 'S' },
      { text: '边做边学', score: 'S' },
      { text: '先看整体框架', score: 'N' },
    ],
  },
  {
    question: '做决定时，你更看重：',
    options: [
      { text: '客观公平', score: 'T' },
      { text: '人际和谐', score: 'F' },
      { text: '效率和结果', score: 'T' },
      { text: '各方感受', score: 'F' },
    ],
  },
  {
    question: '在团队中，你通常：',
    options: [
      { text: '担任领导角色', score: 'E' },
      { text: '默默支持贡献', score: 'I' },
      { text: '协调各方关系', score: 'F' },
      { text: '提供创意想法', score: 'N' },
    ],
  },
  {
    question: '对于规则和期限：',
    options: [
      { text: '严格遵守', score: 'J' },
      { text: '灵活处理', score: 'P' },
      { text: '看情况而定', score: 'X' },
      { text: '挑战不合理的规定', score: 'P' },
    ],
  },
  {
    question: '压力下你会：',
    options: [
      { text: '变得更加高效', score: 'J' },
      { text: '需要独处充电', score: 'I' },
      { text: '寻求他人支持', score: 'E' },
      { text: '暂时逃避', score: 'P' },
    ],
  },
  {
    question: '你更享受：',
    options: [
      { text: '深入几个爱好', score: 'I' },
      { text: '尝试各种体验', score: 'E' },
      { text: '创造新事物', score: 'N' },
      { text: '完善现有技能', score: 'S' },
    ],
  },
  {
    question: '理想的工作环境是：',
    options: [
      { text: '安静独立的空间', score: 'I' },
      { text: '开放协作的氛围', score: 'E' },
      { text: '结构有序的安排', score: 'J' },
      { text: '灵活自由的环境', score: 'P' },
    ],
  },
];

// 人格类型描述
const PERSONALITY_TYPES: Record<string, { name: string; desc: string; emoji: string; strengths: string[]; tips: string[] }> = {
  'ENFJ': {
    name: '教育家',
    desc: '热情、有魅力的领导者，善于激励他人成长',
    emoji: '🌟',
    strengths: ['富有同理心', '天生的领导者', '善于沟通'],
    tips: ['学会拒绝', '给自己留出独处时间', '接受不完美'],
  },
  'ENFP': {
    name: '竞选者',
    desc: '热情、有创造力的自由灵魂，总是充满新点子',
    emoji: '🎯',
    strengths: ['创意无限', '感染力强', '适应力好'],
    tips: ['专注完成任务', '建立常规习惯', '学会说"不"'],
  },
  'ENTJ': {
    name: '指挥官',
    desc: '大胆、有策略的领导者，总能实现目标',
    emoji: '👑',
    strengths: ['战略思维', '决策果断', '执行力强'],
    tips: ['多倾听他人', '适当放松', '培养耐心'],
  },
  'ENTP': {
    name: '辩论家',
    desc: '聪明、好奇的思想家，热爱智力挑战',
    emoji: '💡',
    strengths: ['思维敏捷', '创新能力强', '善于辩论'],
    tips: ['避免过度分析', '专注执行', '尊重他人节奏'],
  },
  'ESFJ': {
    name: '执政官',
    desc: '热心、有责任心的人们帮手',
    emoji: '❤️',
    strengths: ['善于照顾他人', '可靠负责', '社交能力强'],
    tips: ['照顾好自己', '学会接受帮助', '设立界限'],
  },
  'ESFP': {
    name: '表演者',
    desc: '热情、友好、开放的娱乐家',
    emoji: '🎭',
    strengths: ['活力四射', '善于社交', '活在当下'],
    tips: ['长远规划', '深度思考', '培养专注'],
  },
  'ESTJ': {
    name: '总经理',
    desc: '实际、事实导向的管理者，善于组织',
    emoji: '📋',
    strengths: ['组织能力强', '可靠负责', '执行力高'],
    tips: ['保持开放心态', '尊重不同风格', '培养灵活性'],
  },
  'ESTP': {
    name: '企业家',
    desc: '聪明、精力充沛的行动派',
    emoji: '⚡',
    strengths: ['反应迅速', '善于应变', '行动力强'],
    tips: ['培养耐心', '长远思考', '注意风险'],
  },
  'INFJ': {
    name: '提倡者',
    desc: '安静、神秘的理想主义者，以改善世界为己任',
    emoji: '🌈',
    strengths: ['洞察力强', '富有同理心', '坚定的理想'],
    tips: ['保护个人能量', '学会表达需求', '接受现实'],
  },
  'INFP': {
    name: '调停者',
    desc: '安静、开放、有想象力的理想主义者',
    emoji: '🕊️',
    strengths: ['创意丰富', '深度思考', '真诚善良'],
    tips: ['采取行动', '处理批评', '管理时间'],
  },
  'INTJ': {
    name: '建筑师',
    desc: '有想象力的战略家，总能找到解决方案',
    emoji: '🏗️',
    strengths: ['战略思维', '独立自主', '追求卓越'],
    tips: ['培养社交技能', '接受他人帮助', '享受过程'],
  },
  'INTP': {
    name: '逻辑学家',
    desc: '创新的发明家，对知识有着无尽的渴望',
    emoji: '🔬',
    strengths: ['分析能力强', '逻辑清晰', '好奇心强'],
    tips: ['付诸行动', '社交互动', '完成项目'],
  },
  'ISFJ': {
    name: '守卫者',
    desc: '安静、友好、负责，致力于服务他人',
    emoji: '🛡️',
    strengths: ['忠诚可靠', '观察敏锐', '勤劳负责'],
    tips: ['表达自己需求', '接受变化', '设立界限'],
  },
  'ISFP': {
    name: '探险家',
    desc: '灵活、有魅力的艺术家，随时准备探索',
    emoji: '🎨',
    strengths: ['艺术天赋', '灵活适应', '温和体贴'],
    tips: ['制定长期计划', '表达观点', '培养自信'],
  },
  'ISTJ': {
    name: '物流师',
    desc: '实际、可靠、诚实的人，重视传统和忠诚',
    emoji: '📦',
    strengths: ['可靠负责', '注重细节', '组织能力强'],
    tips: ['尝试新方法', '表达情感', '培养灵活性'],
  },
  'ISTP': {
    name: '鉴赏家',
    desc: '灵活、理性的观察者，善于解决问题',
    emoji: '🔧',
    strengths: ['动手能力强', '冷静理智', '适应力好'],
    tips: ['培养情感表达', '长远规划', '保持承诺'],
  },
};

export default function QuizCenter() {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // 开始测验
  const startQuiz = (quizId: string) => {
    setActiveQuiz(quizId);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setQuizStarted(true);
  };

  // 回答问题
  const answerQuestion = (score: string) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < PERSONALITY_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  // 计算人格类型
  const calculatePersonality = () => {
    const counts: Record<string, number> = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
    answers.forEach(a => {
      if (counts[a] !== undefined) counts[a]++;
    });

    let result = '';
    result += counts.E >= counts.I ? 'E' : 'I';
    result += counts.N >= counts.S ? 'N' : 'S';
    result += counts.T >= counts.F ? 'T' : 'F';
    result += counts.J >= counts.P ? 'J' : 'P';

    return result;
  };

  // 重置测验
  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setQuizStarted(false);
  };

  // 测验进行中
  if (quizStarted && activeQuiz === 'personality') {
    if (showResult) {
      const personalityType = calculatePersonality();
      const result = PERSONALITY_TYPES[personalityType] || PERSONALITY_TYPES['INFP'];

      return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-50">
          <div className="max-w-2xl mx-auto px-6 py-12">
            {/* 结果卡片 */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">{result.emoji}</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{personalityType}</h1>
              <h2 className="text-xl text-purple-600 mb-4">{result.name}</h2>
              <p className="text-gray-600 mb-8">{result.desc}</p>

              {/* 优势 */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">你的优势</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {result.strengths.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* 成长建议 */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">成长建议</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {result.tips.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  再测一次
                </button>
                <Link
                  href="/quiz-center"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  返回测验中心
                </Link>
              </div>
            </div>

            {/* 分享卡片 */}
            <div className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white text-center">
              <p className="text-lg mb-2">🎉 我是 {personalityType} - {result.name}!</p>
              <p className="text-sm opacity-90">来 Claw Diary 发现你的人格类型</p>
            </div>
          </div>
        </div>
      );
    }

    // 问答界面
    const question = PERSONALITY_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / PERSONALITY_QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* 进度条 */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>问题 {currentQuestion + 1}/{PERSONALITY_QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 问题卡片 */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => answerQuestion(option.score)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all group"
                >
                  <span className="text-gray-700 group-hover:text-purple-700">{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 返回按钮 */}
          <button
            onClick={resetQuiz}
            className="mt-6 text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 mx-auto"
          >
            ← 返回测验中心
          </button>
        </div>
      </div>
    );
  }

  // 测验中心主页
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🧠</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">AI 问答中心</h1>
          <p className="text-gray-500">探索内在自我，发现独特潜能</p>
        </div>

        {/* 每日精选 */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">⚡ 今日精选</h2>
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
               onClick={() => alert('每日测验即将推出！')}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{DAILY_QUIZ.icon}</span>
                  <h3 className="text-xl font-bold">{DAILY_QUIZ.title}</h3>
                </div>
                <p className="text-white/80 mb-3">{DAILY_QUIZ.description}</p>
                <div className="flex gap-4 text-sm text-white/70">
                  <span>📝 {DAILY_QUIZ.questions} 道题</span>
                  <span>⏱️ {DAILY_QUIZ.duration}</span>
                </div>
              </div>
              <div className="text-4xl opacity-20">→</div>
            </div>
          </div>
        </div>

        {/* 测验分类 */}
        <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">🎯 测验库</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {QUIZZES.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => quiz.id === 'personality' && startQuiz('personality')}
              className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 ${
                quiz.id === 'personality' ? 'hover:border-purple-200' : 'opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-3xl`}>{quiz.icon}</div>
                <div className="flex-1">
                  <h3 className={`font-bold text-gray-800 mb-1 ${quiz.color}`}>{quiz.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{quiz.description}</p>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>📝 {quiz.questions} 题</span>
                    <span>⏱️ {quiz.duration}</span>
                  </div>
                </div>
                {quiz.id === 'personality' ? (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">可测试</span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">即将上线</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 功能说明 */}
        <div className="mt-10 bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4">💡 关于测验</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="text-purple-500 font-medium mb-1">科学设计</div>
              <p>基于心理学理论，精心设计题目</p>
            </div>
            <div>
              <div className="text-purple-500 font-medium mb-1">隐私保护</div>
              <p>测验结果仅你可见，不会存储或分享</p>
            </div>
            <div>
              <div className="text-purple-500 font-medium mb-1">持续更新</div>
              <p>更多有趣测验正在开发中</p>
            </div>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">
            ← 返回首页
          </Link>
        </div>
      </main>
    </div>
  );
}