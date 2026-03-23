'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface EmotionTransaction {
  id: string;
  date: string;
  emotion: string;
  emoji: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  category: string;
}

interface EmotionStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savingsRate: number;
  topIncomeEmotion: string;
  topExpenseEmotion: string;
}

const EMOTION_CATEGORIES = {
  income: [
    { emotion: '快乐', emoji: '😊', multiplier: 1.5, category: '正面收入' },
    { emotion: '感恩', emoji: '🙏', multiplier: 1.3, category: '正面收入' },
    { emotion: '成就', emoji: '🏆', multiplier: 2.0, category: '正面收入' },
    { emotion: '爱', emoji: '❤️', multiplier: 1.8, category: '正面收入' },
    { emotion: '希望', emoji: '🌟', multiplier: 1.2, category: '正面收入' },
    { emotion: '平静', emoji: '😌', multiplier: 1.0, category: '正面收入' },
    { emotion: '兴奋', emoji: '🤩', multiplier: 1.6, category: '正面收入' },
  ],
  expense: [
    { emotion: '焦虑', emoji: '😰', multiplier: 1.5, category: '负面支出' },
    { emotion: '愤怒', emoji: '😠', multiplier: 2.0, category: '负面支出' },
    { emotion: '悲伤', emoji: '😢', multiplier: 1.8, category: '负面支出' },
    { emotion: '恐惧', emoji: '😨', multiplier: 1.3, category: '负面支出' },
    { emotion: '孤独', emoji: '😔', multiplier: 1.2, category: '负面支出' },
    { emotion: '压力', emoji: '😤', multiplier: 1.4, category: '负面支出' },
    { emotion: '沮丧', emoji: '😞', multiplier: 1.6, category: '负面支出' },
  ],
};

// 生成模拟交易数据
function generateMockTransactions(): EmotionTransaction[] {
  const transactions: EmotionTransaction[] = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // 随机生成1-3笔交易
    const count = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < count; j++) {
      const isIncome = Math.random() > 0.4;
      const emotionList = isIncome ? EMOTION_CATEGORIES.income : EMOTION_CATEGORIES.expense;
      const emotion = emotionList[Math.floor(Math.random() * emotionList.length)];
      const baseAmount = Math.floor(Math.random() * 50) + 10;
      const amount = Math.round(baseAmount * emotion.multiplier);
      
      transactions.push({
        id: `${dateStr}-${j}`,
        date: dateStr,
        emotion: emotion.emotion,
        emoji: emotion.emoji,
        amount,
        type: isIncome ? 'income' : 'expense',
        description: getRandomDescription(emotion.emotion, isIncome),
        category: emotion.category,
      } as EmotionTransaction);
    }
  }
  
  return transactions;
}

function getRandomDescription(emotion: string, isIncome: boolean): string {
  const incomeDesc: Record<string, string[]> = {
    '快乐': ['和朋友聚会', '完成了一个小目标', '收到了好消息', '天气很好'],
    '感恩': ['家人健康', '朋友帮助', '工作顺利', '生活小确幸'],
    '成就': ['项目成功上线', '获得认可', '学习新技能', '解决问题'],
    '爱': ['陪伴家人', '收到关心', '表达爱意', '感受到被爱'],
    '希望': ['未来可期', '新的开始', '找到方向', '充满动力'],
    '平静': ['冥想放松', '读书时光', '散步思考', '早睡早起'],
    '兴奋': ['新项目启动', '旅行计划', '创意灵感', '期待的事情'],
  };
  
  const expenseDesc: Record<string, string[]> = {
    '焦虑': ['deadline压力', '未来不确定性', '健康担忧', '财务压力'],
    '愤怒': ['被误解', '不公平待遇', '沟通不畅', '预期落空'],
    '悲伤': ['失去联系', '计划取消', '失望情绪', '想念某人'],
    '恐惧': ['未知挑战', '风险评估', '能力担忧', '环境变化'],
    '孤独': ['独处时光', '社交缺失', '缺少倾诉', '节日独处'],
    '压力': ['工作任务', '期望过高', '责任重担', '时间紧迫'],
    '沮丧': ['挫折经历', '努力无果', '比较心理', '状态不佳'],
  };
  
  const desc = isIncome ? incomeDesc[emotion] : expenseDesc[emotion];
  return desc ? desc[Math.floor(Math.random() * desc.length)] : '日常记录';
}

function calculateStats(transactions: EmotionTransaction[]): EmotionStats {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  const incomeEmotions: Record<string, number> = {};
  const expenseEmotions: Record<string, number> = {};
  
  transactions.forEach(t => {
    if (t.type === 'income') {
      incomeEmotions[t.emotion] = (incomeEmotions[t.emotion] || 0) + t.amount;
    } else {
      expenseEmotions[t.emotion] = (expenseEmotions[t.emotion] || 0) + t.amount;
    }
  });
  
  const topIncomeEmotion = Object.entries(incomeEmotions).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  const topExpenseEmotion = Object.entries(expenseEmotions).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  
  return {
    totalBalance: income - expense,
    monthlyIncome: income,
    monthlyExpense: expense,
    savingsRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
    topIncomeEmotion,
    topExpenseEmotion,
  };
}

export default function EmotionBankPage() {
  const [transactions, setTransactions] = useState<EmotionTransaction[]>(() => generateMockTransactions());
  const [stats, setStats] = useState<EmotionStats | null>(() => calculateStats(generateMockTransactions()));
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmotion, setNewEmotion] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('income');
  const [newDescription, setNewDescription] = useState('');

  const filteredTransactions = transactions.filter(t => 
    selectedType === 'all' || t.type === selectedType
  ).slice(-10).reverse();

  const handleAddTransaction = () => {
    if (!newEmotion || !newDescription) return;
    
    const emotionList = newType === 'income' ? EMOTION_CATEGORIES.income : EMOTION_CATEGORIES.expense;
    const emotionData = emotionList.find(e => e.emotion === newEmotion);
    
    if (!emotionData) return;
    
    const baseAmount = Math.floor(Math.random() * 30) + 20;
    const amount = Math.round(baseAmount * emotionData.multiplier);
    
    const newTransaction: EmotionTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      emotion: newEmotion,
      emoji: emotionData.emoji,
      amount,
      type: newType,
      description: newDescription,
      category: emotionData.category,
    } as EmotionTransaction;
    
    setTransactions(prev => [...prev, newTransaction]);
    setStats(calculateStats([...transactions, newTransaction]));
    setShowAddModal(false);
    setNewEmotion('');
    setNewDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-cyan-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部导航 */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← 返回
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">🏦 情绪银行</h1>
        </div>

        {/* 介绍 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/50">
          <p className="text-gray-600 leading-relaxed">
            把情绪当作货币来管理。快乐的情绪是<strong className="text-emerald-600">收入</strong>，
            负面的情绪是<strong className="text-rose-600">支出</strong>。
            看看你的情绪账户是盈还是亏？
          </p>
        </div>

        {/* 账户概览 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50">
              <div className="text-sm text-gray-500 mb-1">情绪余额</div>
              <div className={`text-3xl font-bold ${stats.totalBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stats.totalBalance >= 0 ? '+' : ''}{stats.totalBalance}
              </div>
              <div className="text-xs text-gray-400 mt-1">情绪货币</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50">
              <div className="text-sm text-gray-500 mb-1">本月收入</div>
              <div className="text-3xl font-bold text-emerald-600">+{stats.monthlyIncome}</div>
              <div className="text-xs text-gray-400 mt-1">正面情绪</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50">
              <div className="text-sm text-gray-500 mb-1">本月支出</div>
              <div className="text-3xl font-bold text-rose-600">-{stats.monthlyExpense}</div>
              <div className="text-xs text-gray-400 mt-1">负面情绪</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50">
              <div className="text-sm text-gray-500 mb-1">储蓄率</div>
              <div className={`text-3xl font-bold ${stats.savingsRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stats.savingsRate}%
              </div>
              <div className="text-xs text-gray-400 mt-1">情绪投资回报</div>
            </div>
          </div>
        )}

        {/* 快捷记录 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💎 快速存取</h2>
          
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">记录一笔正面情绪（收入）</div>
            <div className="flex flex-wrap gap-2">
              {EMOTION_CATEGORIES.income.map(emotion => (
                <button
                  key={emotion.emotion}
                  onClick={() => {
                    setNewEmotion(emotion.emotion);
                    setNewType('income');
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-full text-sm flex items-center gap-1 transition-colors"
                >
                  <span>{emotion.emoji}</span>
                  <span>{emotion.emotion}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-2">记录一笔负面情绪（支出）</div>
            <div className="flex flex-wrap gap-2">
              {EMOTION_CATEGORIES.expense.map(emotion => (
                <button
                  key={emotion.emotion}
                  onClick={() => {
                    setNewEmotion(emotion.emotion);
                    setNewType('expense');
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 rounded-full text-sm flex items-center gap-1 transition-colors"
                >
                  <span>{emotion.emoji}</span>
                  <span>{emotion.emotion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 情绪分析 */}
        {stats && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📈</span>
                <h3 className="text-lg font-bold">主要收入来源</h3>
              </div>
              <div className="text-4xl font-bold mb-2">{stats.topIncomeEmotion}</div>
              <p className="text-white/80 text-sm">你最常体验到的正面情绪</p>
            </div>
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📉</span>
                <h3 className="text-lg font-bold">主要支出项</h3>
              </div>
              <div className="text-4xl font-bold mb-2">{stats.topExpenseEmotion}</div>
              <p className="text-white/80 text-sm">你最常体验到的负面情绪</p>
            </div>
          </div>
        )}

        {/* 交易记录 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">📋 最近交易</h2>
            <div className="flex gap-2">
              {(['all', 'income', 'expense'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedType === type
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? '全部' : type === 'income' ? '收入' : '支出'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTransactions.map(transaction => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-3 bg-white/50 rounded-xl"
              >
                <div className="text-2xl">{transaction.emoji}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{transaction.emotion}</div>
                  <div className="text-sm text-gray-500">{transaction.description}</div>
                  <div className="text-xs text-gray-400">{transaction.date}</div>
                </div>
                <div className={`text-lg font-bold ${
                  transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 理财建议 */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3">💡 情绪理财建议</h3>
          {stats && stats.savingsRate >= 50 && (
            <p className="text-gray-600">
              🎉 太棒了！你的情绪储蓄率超过50%，说明你的生活充满了正能量！继续保持，
              并尝试帮助身边的人也积累情绪财富。
            </p>
          )}
          {stats && stats.savingsRate >= 0 && stats.savingsRate < 50 && (
            <p className="text-gray-600">
              ⚖️ 你的情绪账户略有盈余。建议关注你的主要支出项「{stats.topExpenseEmotion}」，
              尝试找到减少这种负面情绪的方法。
            </p>
          )}
          {stats && stats.savingsRate < 0 && (
            <p className="text-gray-600">
              ⚠️ 你的情绪账户出现赤字。建议：1）增加更多正面情绪收入（如运动、社交、学习新技能）；
              2）找到负面情绪的根源并寻求解决；3）如果需要，不要犹豫寻求专业帮助。
            </p>
          )}
        </div>

        {/* 底部导航 */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-medium hover:shadow-lg transition-shadow"
          >
            返回首页
          </Link>
        </div>
      </main>

      {/* 添加交易弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              {newType === 'income' ? '💰 记录一笔情绪收入' : '💸 记录一笔情绪支出'}
            </h3>
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">情绪类型</div>
              <div className="text-lg font-medium">{newEmotion}</div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-500 mb-1 block">描述</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="是什么让你有这种感觉？"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}