"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 运势类型
interface Fortune {
  id: string;
  level: number; // 1-5 星
  title: string;
  poem: string; // 签诗
  interpretation: string; // 解签
  advice: string; // 今日建议
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  emoji: string;
}

// 运势主题
const FORTUNE_THEMES = [
  { id: "love", name: "姻缘", emoji: "💕", color: "from-pink-400 to-rose-500" },
  { id: "career", name: "事业", emoji: "📈", color: "from-blue-400 to-indigo-500" },
  { id: "wealth", name: "财运", emoji: "💰", color: "from-yellow-400 to-amber-500" },
  { id: "health", name: "健康", emoji: "🏃", color: "from-green-400 to-emerald-500" },
  { id: "study", name: "学业", emoji: "📚", color: "from-purple-400 to-violet-500" },
  { id: "overall", name: "综合", emoji: "🌟", color: "from-orange-400 to-red-500" },
];

// 签诗库
const FORTUNE_POOL: Record<string, Fortune[]> = {
  love: [
    { id: "l1", level: 5, title: "天作之合", poem: "红线暗牵月老知，良缘天定不需迟。\n相逢便是前生定，共度今生不负期。", interpretation: "姻缘天成，命中注定的相遇即将来临。", advice: "敞开心扉，真诚待人，缘分会不期而遇。", luckyColor: "粉色", luckyNumber: 7, luckyDirection: "东南", emoji: "💖" },
    { id: "l2", level: 4, title: "花开并蒂", poem: "春暖花开蝴蝶来，两心相悦共徘徊。\n莫愁前路无知己，有情人终成眷属。", interpretation: "感情升温，有情人终成眷属。", advice: "主动表达心意，勇敢追求幸福。", luckyColor: "桃红色", luckyNumber: 3, luckyDirection: "正南", emoji: "🌸" },
    { id: "l3", level: 3, title: "守得云开", poem: "云遮雾绕路难行，耐心等待自有情。\n莫急莫躁心安定，柳暗花明又一村。", interpretation: "缘分尚在酝酿，需要耐心等待。", advice: "专注自我提升，缘分自会降临。", luckyColor: "淡紫", luckyNumber: 9, luckyDirection: "西南", emoji: "🦋" },
    { id: "l4", level: 2, title: "独善其身", poem: "落花有意水无情，独善其身待时行。\n春风不解游人意，且把心事付清风。", interpretation: "暂无姻缘消息，宜独处修身。", advice: "与其焦虑等待，不如充实自己。", luckyColor: "浅蓝", luckyNumber: 4, luckyDirection: "正北", emoji: "🍃" },
    { id: "l5", level: 1, title: "随缘而行", poem: "命里有时终须有，命里无时莫强求。\n随缘自在心无忧，静待花开自有秋。", interpretation: "凡事随缘，不可强求。", advice: "放下执念，顺其自然，做好当下的自己。", luckyColor: "白色", luckyNumber: 1, luckyDirection: "正东", emoji: "🌙" },
  ],
  career: [
    { id: "c1", level: 5, title: "飞龙在天", poem: "龙腾九霄志千里，事业有成步步起。\n贵人相助逢机遇，大展宏图正当时。", interpretation: "事业腾飞，贵人相助，机遇连连。", advice: "把握机会，大胆尝试，成功在望。", luckyColor: "金色", luckyNumber: 8, luckyDirection: "正东", emoji: "🐉" },
    { id: "c2", level: 4, title: "扶摇直上", poem: "鹏程万里展翅飞，步步高升志不移。\n勤勉努力天不负，功成名就指日期。", interpretation: "事业发展顺利，稳步上升。", advice: "保持专注，持续努力，成果即将显现。", luckyColor: "藏蓝", luckyNumber: 6, luckyDirection: "东南", emoji: "🦅" },
    { id: "c3", level: 3, title: "稳扎稳打", poem: "千里之行始足下，稳步前进不虚假。\n厚积薄发终有成，切莫急躁乱计划。", interpretation: "事业平稳，需要积累。", advice: "脚踏实地，打好基础，来日方长。", luckyColor: "墨绿", luckyNumber: 5, luckyDirection: "正西", emoji: "🐢" },
    { id: "c4", level: 2, title: "蛰伏待机", poem: "蛰龙潜伏待时飞，莫叹前程事违违。\n韬光养晦积实力，春风一起便作为。", interpretation: "暂时蛰伏，蓄势待发。", advice: "低调行事，积累实力，静待时机。", luckyColor: "深灰", luckyNumber: 2, luckyDirection: "西北", emoji: "🐍" },
    { id: "c5", level: 1, title: "韬光养晦", poem: "潜龙勿用意深远，厚积薄发待时转。\n天将降大任于斯，必先苦心劳筋骨。", interpretation: "时机未到，宜低调积累。", advice: "沉淀自己，学习新技能，为未来做准备。", luckyColor: "黑色", luckyNumber: 9, luckyDirection: "正北", emoji: "🌑" },
  ],
  wealth: [
    { id: "w1", level: 5, title: "财源广进", poem: "金山银山入宅来，财源滚滚似水开。\n投资理财皆顺利，富贵荣华指日待。", interpretation: "财运亨通，收入可观。", advice: "理性投资，开源节流，财富稳增。", luckyColor: "金黄", luckyNumber: 8, luckyDirection: "东南", emoji: "💎" },
    { id: "w2", level: 4, title: "小有收获", poem: "辛勤耕耘有收获，细水长流积财富。\n不必贪多求暴利，稳健经营路坦途。", interpretation: "财运平稳，有所收获。", advice: "稳健理财，避免冒险，循序渐进。", luckyColor: "橙色", luckyNumber: 3, luckyDirection: "正南", emoji: "🪙" },
    { id: "w3", level: 3, title: "收支平衡", poem: "钱财出入总相抵，不盈不亏心安适。\n谨慎开支重积累，来日方长莫着急。", interpretation: "财运平平，收支平衡。", advice: "量入为出，做好预算，慢慢积累。", luckyColor: "棕色", luckyNumber: 4, luckyDirection: "西南", emoji: "⚖️" },
    { id: "w4", level: 2, title: "开源节流", poem: "入不敷出需谨慎，开源节流是良策。\n减少不必要的支出，增加收入显智慧。", interpretation: "财运不佳，需谨慎理财。", advice: "控制开支，寻找副业，开源节流。", luckyColor: "绿色", luckyNumber: 2, luckyDirection: "正西", emoji: "🌱" },
    { id: "w5", level: 1, title: "静待转机", poem: "财运未到莫强求，安贫乐道心自休。\n守得云开见月明，时来运转不用愁。", interpretation: "财运低迷，宜守不宜攻。", advice: "暂时保守，等待时机，不借不贷。", luckyColor: "白色", luckyNumber: 1, luckyDirection: "东北", emoji: "🤍" },
  ],
  health: [
    { id: "h1", level: 5, title: "身强体健", poem: "龙马精神体魄强，无病无灾乐安康。\n运动锻炼不间断，健康长寿福无疆。", interpretation: "身体康健，精力充沛。", advice: "保持良好习惯，适度运动，继续保持。", luckyColor: "翠绿", luckyNumber: 5, luckyDirection: "正东", emoji: "💪" },
    { id: "h2", level: 4, title: "神清气爽", poem: "精神饱满气色佳，身心和谐乐无涯。\n作息规律身体好，健康生活人人夸。", interpretation: "状态良好，身心健康。", advice: "保持作息，均衡饮食，心情愉悦。", luckyColor: "天蓝", luckyNumber: 7, luckyDirection: "东南", emoji: "🌈" },
    { id: "h3", level: 3, title: "劳逸结合", poem: "忙碌之中需休息，劳逸结合是真理。\n张弛有度身体好，切莫透支伤自己。", interpretation: "需要调整作息，注意休息。", advice: "适当放松，保证睡眠，不要过度劳累。", luckyColor: "淡紫", luckyNumber: 6, luckyDirection: "正南", emoji: "🧘" },
    { id: "h4", level: 2, title: "未雨绸缪", poem: "小恙初显莫大意，及时调理保身体。\n预防胜于治疗病，养生保健需留意。", interpretation: "健康有隐忧，需要关注。", advice: "定期体检，关注身体信号，及时调整。", luckyColor: "浅绿", luckyNumber: 3, luckyDirection: "东北", emoji: "🏥" },
    { id: "h5", level: 1, title: "休养生息", poem: "身体发出警报声，该休息时需暂停。\n养精蓄锐恢复快，莫让小病变大病。", interpretation: "健康需要重点关注。", advice: "立即休息，及时就医，调养身体。", luckyColor: "纯白", luckyNumber: 9, luckyDirection: "正北", emoji: "🛏️" },
  ],
  study: [
    { id: "s1", level: 5, title: "独占鳌头", poem: "学业精进成绩优，考试测验皆上流。\n悟性大开进步快，金榜题名在不周。", interpretation: "学业有成，成绩优异。", advice: "保持专注，继续努力，目标必达。", luckyColor: "朱红", luckyNumber: 1, luckyDirection: "正东", emoji: "🏆" },
    { id: "s2", level: 4, title: "学有所成", poem: "勤学苦练有回报，知识积累步步高。\n理解力强进步快，学业之路铺金桥。", interpretation: "学习进步明显。", advice: "坚持方法，多做练习，成功可期。", luckyColor: "宝蓝", luckyNumber: 4, luckyDirection: "东南", emoji: "📖" },
    { id: "s3", level: 3, title: "温故知新", poem: "学海无涯需坚持，温故知新长知识。\n遇到困难不退缩，虚心请教找良师。", interpretation: "学习需要更多努力。", advice: "复习巩固，请教他人，找到方法。", luckyColor: "米黄", luckyNumber: 2, luckyDirection: "正南", emoji: "📝" },
    { id: "s4", level: 2, title: "勤能补拙", poem: "学业路上有坎坷，勤能补拙是良策。\n多花时间多努力，笨鸟先飞早入林。", interpretation: "学习遇到困难。", advice: "增加学习时间，调整方法，不放弃。", luckyColor: "青灰", luckyNumber: 6, luckyDirection: "西南", emoji: "🦉" },
    { id: "s5", level: 1, title: "休整待发", poem: "学习疲惫需调整，磨刀不误砍柴工。\n休息之后再出发，事半功倍有奇功。", interpretation: "需要调整学习方法。", advice: "暂时休息，调整心态，换个角度。", luckyColor: "淡蓝", luckyNumber: 8, luckyDirection: "正西", emoji: "🌊" },
  ],
  overall: [
    { id: "o1", level: 5, title: "大吉大利", poem: "天时地利人和至，诸事顺遂福无际。\n把握良机勇前行，心想事成皆如意。", interpretation: "大吉之象，万事亨通。", advice: "积极进取，把握机遇，心想事成。", luckyColor: "大红", luckyNumber: 8, luckyDirection: "正南", emoji: "🎊" },
    { id: "o2", level: 4, title: "吉祥如意", poem: "顺风顺水好光景，事事如意好心情。\n贵人指引光明路，把握当下向前行。", interpretation: "吉兆显现，诸事顺利。", advice: "保持乐观，勇于尝试，好运常伴。", luckyColor: "紫红", luckyNumber: 6, luckyDirection: "东南", emoji: "🎉" },
    { id: "o3", level: 3, title: "平稳安顺", poem: "风平浪静无波澜，平安是福心安然。\n不求大富与大贵，只愿岁月静如山。", interpretation: "平顺之象，安稳度日。", advice: "保持平常心，脚踏实地，稳中求进。", luckyColor: "淡绿", luckyNumber: 5, luckyDirection: "正东", emoji: "🍀" },
    { id: "o4", level: 2, title: "谨慎为上", poem: "前路多舛需谨慎，小心驶得万年船。\n多思多想少冲动，平安度过便是赚。", interpretation: "需要谨慎行事。", advice: "三思后行，谨言慎行，避免风险。", luckyColor: "深蓝", luckyNumber: 3, luckyDirection: "正北", emoji: "🔍" },
    { id: "o5", level: 1, title: "韬光养晦", poem: "时运不济需隐忍，养精蓄锐待时辰。\n否极泰来终有日，莫愁前路无知音。", interpretation: "暂时低谷，蓄势待发。", advice: "低调行事，自我提升，静待转机。", luckyColor: "灰色", luckyNumber: 7, luckyDirection: "西北", emoji: "🌙" },
  ],
};

// 星星显示
function renderStars(level: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < level ? "text-yellow-400" : "text-gray-300"}>
      ★
    </span>
  ));
}

// 获取今天日期字符串
function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// 基于日期和主题生成运势
function getDailyFortune(theme: string): Fortune {
  const today = getTodayKey();
  const fortunes = FORTUNE_POOL[theme] || FORTUNE_POOL.overall;
  
  // 使用日期作为种子生成"随机"但今天固定的结果
  let hash = 0;
  const str = today + theme;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const index = Math.abs(hash) % fortunes.length;
  return fortunes[index];
}

export default function DiaryFortunePage() {
  const [selectedTheme, setSelectedTheme] = useState<string>("overall");
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // 检查今天是否已抽签
  useEffect(() => {
    const todayKey = getTodayKey();
    const savedFortune = localStorage.getItem(`fortune-${todayKey}`);
    if (savedFortune) {
      const parsed = JSON.parse(savedFortune);
      setFortune(parsed);
      setHasDrawn(true);
    }
  }, []);

  // 抽签
  const drawFortune = () => {
    setIsDrawing(true);
    
    setTimeout(() => {
      const newFortune = getDailyFortune(selectedTheme);
      setFortune(newFortune);
      setHasDrawn(true);
      setIsDrawing(false);
      
      // 保存到本地存储
      const todayKey = getTodayKey();
      localStorage.setItem(`fortune-${todayKey}`, JSON.stringify({
        ...newFortune,
        theme: selectedTheme,
        drawnAt: new Date().toISOString()
      }));
    }, 1500);
  };

  // 分享运势
  const shareFortune = async () => {
    if (!fortune) return;
    
    const text = `🔮 今日${FORTUNE_THEMES.find(t => t.id === selectedTheme)?.name}运势\n\n${fortune.emoji} ${fortune.title}\n\n"${fortune.poem.replace(/\n/g, ' ')}"\n\n✨ 运势指数: ${renderStars(fortune.level)}\n🎨 幸运颜色: ${fortune.luckyColor}\n🔢 幸运数字: ${fortune.luckyNumber}\n🧭 幸运方位: ${fortune.luckyDirection}\n\n📝 ${fortune.advice}\n\n—— Claw Diary 日记运势`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '今日日记运势',
          text: text,
        });
      } catch {
        // 用户取消分享
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('运势已复制到剪贴板！');
    }
  };

  const themeInfo = FORTUNE_THEMES.find(t => t.id === selectedTheme);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-violet-950">
      {/* 星空背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
        <div className="absolute top-20 right-20 text-6xl opacity-20">🌙</div>
        <div className="absolute bottom-40 left-10 text-4xl opacity-10">⭐</div>
        <div className="absolute top-1/3 right-1/4 text-3xl opacity-15">✨</div>
      </div>

      <main className="relative max-w-lg mx-auto px-4 pt-8 pb-16">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl mb-4">← 返回</Link>
          <h1 className="text-3xl font-bold text-white mb-2">🔮 日记运势</h1>
          <p className="text-purple-200 text-sm">每日一签，洞悉天机</p>
        </div>

        {/* 主题选择 */}
        {!hasDrawn && (
          <div className="mb-8">
            <h2 className="text-white text-center mb-4">选择求签主题</h2>
            <div className="grid grid-cols-3 gap-3">
              {FORTUNE_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-4 rounded-xl transition-all ${
                    selectedTheme === theme.id
                      ? `bg-gradient-to-br ${theme.color} scale-105 shadow-lg`
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <div className="text-2xl mb-1">{theme.emoji}</div>
                  <div className="text-white text-sm font-medium">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 运势结果 */}
        {hasDrawn && fortune && (
          <div className="bg-gradient-to-br from-purple-800/50 to-indigo-900/50 rounded-3xl p-6 backdrop-blur-sm border border-purple-400/30 mb-6">
            {/* 签筒 */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{fortune.emoji}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{fortune.title}</h3>
              <div className="flex justify-center gap-1 text-lg">
                {renderStars(fortune.level)}
              </div>
            </div>

            {/* 签诗 */}
            <div className="bg-purple-900/50 rounded-xl p-4 mb-4 border border-purple-400/20">
              <div className="text-center">
                <p className="text-purple-100 leading-relaxed whitespace-pre-line font-serif text-lg">
                  {fortune.poem}
                </p>
              </div>
            </div>

            {/* 解签 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">📖</span>
                <span className="text-purple-200 text-sm">解签</span>
              </div>
              <p className="text-white">{fortune.interpretation}</p>
            </div>

            {/* 今日建议 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">💡</span>
                <span className="text-purple-200 text-sm">今日建议</span>
              </div>
              <p className="text-white">{fortune.advice}</p>
            </div>

            {/* 幸运元素 */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <div className="text-purple-300 text-xs mb-1">幸运颜色</div>
                <div className="text-white font-medium">{fortune.luckyColor}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <div className="text-purple-300 text-xs mb-1">幸运数字</div>
                <div className="text-white font-medium text-xl">{fortune.luckyNumber}</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <div className="text-purple-300 text-xs mb-1">幸运方位</div>
                <div className="text-white font-medium">{fortune.luckyDirection}</div>
              </div>
            </div>

            {/* 分享按钮 */}
            <button
              onClick={shareFortune}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              📤 分享我的运势
            </button>
          </div>
        )}

        {/* 抽签按钮 */}
        {!hasDrawn && (
          <button
            onClick={drawFortune}
            disabled={isDrawing}
            className={`w-full py-6 rounded-2xl font-bold text-xl transition-all ${
              isDrawing
                ? "bg-gray-500 cursor-not-allowed"
                : `bg-gradient-to-r ${themeInfo?.color || "from-purple-500 to-pink-500"} hover:scale-105 shadow-lg`
            } text-white`}
          >
            {isDrawing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">🔮</span>
                正在求签...
              </span>
            ) : (
              "🎯 开始求签"
            )}
          </button>
        )}

        {/* 今日提示 */}
        {hasDrawn && (
          <div className="text-center text-purple-300 text-sm">
            <p>✨ 今日已求签，明天再来</p>
            <p className="mt-1 text-xs opacity-60">
              每日运势基于日记情感数据智能生成
            </p>
          </div>
        )}

        {/* 运势说明 */}
        <div className="mt-8 bg-white/5 rounded-xl p-4">
          <h3 className="text-purple-200 font-medium mb-2 flex items-center gap-2">
            <span>💫</span> 关于日记运势
          </h3>
          <ul className="text-purple-300 text-sm space-y-2">
            <li>• 每日一签，子时更新</li>
            <li>• 六大主题：姻缘、事业、财运、健康、学业、综合</li>
            <li>• 运势基于日记情感数据智能生成</li>
            <li>• 仅供娱乐参考，请理性看待</li>
          </ul>
        </div>

        {/* 历史运势入口 */}
        <div className="mt-6 text-center">
          <Link
            href="/diary-fortune/history"
            className="text-purple-300 hover:text-white text-sm"
          >
            📜 查看历史运势 →
          </Link>
        </div>
      </main>
    </div>
  );
}