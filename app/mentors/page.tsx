'use client';

import { useState } from 'react';
import { 
  Brain, Sparkles, MessageCircle, ArrowLeft, RefreshCw,
  User, Quote, Lightbulb, Heart, Target, Compass
} from 'lucide-react';
import Link from 'next/link';

// 历史导师库
const mentors = [
  {
    id: 'socrates',
    name: '苏格拉底',
    nameEn: 'Socrates',
    era: '公元前470-399',
    avatar: '🏛️',
    specialty: '思辨与自我认知',
    style: '苏格拉底式提问',
    quotes: [
      '认识你自己',
      '我唯一知道的，就是我一无所知',
      '未经审视的人生不值得过',
    ],
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'confucius',
    name: '孔子',
    nameEn: 'Confucius',
    era: '公元前551-479',
    avatar: '🐉',
    specialty: '修身与处世智慧',
    style: '温和而深刻的指导',
    quotes: [
      '学而不思则罔，思而不学则殆',
      '三人行，必有我师焉',
      '知之者不如好之者，好之者不如乐之者',
    ],
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
  },
  {
    id: 'davinci',
    name: '达芬奇',
    nameEn: 'Leonardo da Vinci',
    era: '1452-1519',
    avatar: '🎨',
    specialty: '创造力与好奇心',
    style: '启发式探索',
    quotes: [
      '学习永远不会让心智疲倦',
      '简单是终极的复杂',
      '一旦你尝过飞翔的滋味，你将永远行走在大地上，眼睛望着天空',
    ],
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'curie',
    name: '居里夫人',
    nameEn: 'Marie Curie',
    era: '1867-1934',
    avatar: '⚗️',
    specialty: '坚持与专注',
    style: '理性而坚韧',
    quotes: [
      '生活中没有什么可怕的东西，只有需要理解的东西',
      '我们必须相信，我们对一件事情是有天赋的，无论代价如何，都要把这件事做好',
      '我从来不曾有过幸运，将来也永远不指望幸运',
    ],
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50',
  },
  {
    id: 'marcus',
    name: '马可·奥勒留',
    nameEn: 'Marcus Aurelius',
    era: '公元121-180',
    avatar: '⚔️',
    specialty: '斯多葛哲学与内心平静',
    style: '冷静反思',
    quotes: [
      '你有力量控制你的思想——而非外界事件。认识到这一点，你就找到了力量',
      '不要因为过去而担忧，不要因为未来而焦虑，活在当下',
      '阻碍行动的，就是行动本身的阻碍；阻碍前进的，就是前进本身',
    ],
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'musk',
    name: '埃隆·马斯克',
    nameEn: 'Elon Musk',
    era: '1971-',
    avatar: '🚀',
    specialty: '第一性原理与突破思维',
    style: '直接而挑战性',
    quotes: [
      '当一件事足够重要时，即使胜算不大，你也要去做',
      '如果一件事没有失败过，说明创新不够',
      '第一性原理思维——把事情拆解到最基本的真理，然后从那里开始推理',
    ],
    color: 'from-slate-600 to-slate-800',
    bgColor: 'bg-slate-50',
  },
];

// 情境类型
const situations = [
  { id: 'confused', label: '感到迷茫', icon: '🌫️', desc: '不知道下一步该怎么走' },
  { id: 'anxious', label: '焦虑不安', icon: '😰', desc: '对未来充满担忧' },
  { id: 'stuck', label: '遇到瓶颈', icon: '🧱', desc: '工作或学习停滞不前' },
  { id: 'sad', label: '心情低落', icon: '😔', desc: '需要一些鼓励和安慰' },
  { id: 'proud', label: '取得成就', icon: '🎉', desc: '想要更好地前进' },
  { id: 'inspired', label: '想要成长', icon: '🌱', desc: '寻求进步的方向' },
];

// 生成导师指导
function generateGuidance(mentor: typeof mentors[0], situation: typeof situations[0], userInput: string): string {
  const templates: Record<string, Record<string, string[]>> = {
    socrates: {
      confused: [
        '让我问你一个问题：你认为迷茫的本质是什么？是因为选择太多，还是因为不了解自己？',
        '当你感到迷失时，也许正是发现自己真正渴望的机会。告诉我，你内心深处最渴望的是什么？',
        '困惑往往意味着你的认知边界正在扩展。让我们一起来审视：你认为什么是确定无疑的？',
      ],
      anxious: [
        '焦虑来源于对未知的恐惧。但你害怕的具体是什么？把它说出来，它就不再那么可怕了。',
        '你担心的事情，有多少是真正可能发生的？又有多少是你的想象？',
        '让我们用理性来审视：最坏的结果是什么？如果发生了，你有什么应对之策？',
      ],
      stuck: [
        '停滞不前可能意味着你在用错误的方法前进。你有没有想过，也许需要换个角度？',
        '告诉我，你尝试过哪些方法？哪些是你没有尝试的？为什么？',
        '瓶颈往往是一个信号——提示你需要学习新的技能或获得新的视角。',
      ],
      sad: [
        '悲伤是灵魂在诉说。它在告诉你什么？也许有一件重要的事情被忽略了。',
        '即使是最黑暗的时刻，也蕴含着智慧的种子。你能从这个经历中学到什么？',
        '让我问你：如果你最尊敬的人遇到这种情况，你会怎么建议他？',
      ],
      proud: [
        '成就固然值得庆祝，但更重要的是：是什么让你达成了这个目标？',
        '你克服的最大障碍是什么？这个能力会帮助你走得更远。',
        '现在，让我们看看：下一步你想成为什么样的人？',
      ],
      inspired: [
        '成长的渴望是一种智慧的体现。你想在哪方面成长？为什么是这方面？',
        '告诉我，你心中的理想自我是什么样子？它与现在的你有什么不同？',
        '成长需要方向。你有没有想过，什么样的成长对你来说最有意义？',
      ],
    },
    confucius: {
      confused: [
        '子曰："知者不惑，仁者不忧，勇者不惧。"迷茫时，先问自己：我真正了解自己吗？',
        '古人云："吾日三省吾身。"不妨静下心来，审视自己的言行与内心。',
        '路漫漫其修远兮。迷茫是成长的必经之路，关键在于你是否在寻找正确的方向。',
      ],
      anxious: [
        '"君子坦荡荡，小人长戚戚。"焦虑源于内心的不安定。修身养性，自然心安。',
        '不要为明天忧虑，今天自有今天的烦恼。专注于当下你能掌控的事。',
        '"不患寡而患不均，不患贫而患不安。"内心的平静来自于知足与中庸。',
      ],
      stuck: [
        '"学而不思则罔，思而不学则殆。"瓶颈之时，正是学思结合的最佳时机。',
        '"温故而知新，可以为师矣。"回顾过去，也许能找到新的突破口。',
        '困境如同磨刀石，它正在打磨你的能力与意志。',
      ],
      sad: [
        '"岁寒，然后知松柏之后凋也。"艰难时刻正是锻炼品格的机会。',
        '哀伤使人深思。不妨问问自己：这件事对我真正意味着什么？',
        '人生不如意十之八九，但正是这些经历塑造了我们的智慧。',
      ],
      proud: [
        '"满招损，谦受益。"成就之时，更需保持谦逊之心。',
        '你已经证明了能力。现在问自己：如何将这份成功转化为更大的价值？',
        '成功的背后是什么？是运气、努力，还是他人的帮助？记住这些。',
      ],
      inspired: [
        '"志于道，据于德，依于仁，游于艺。"确定你的方向，然后坚定不移地前进。',
        '"君子求诸己，小人求诸人。"成长的力量来自于内求，而非外求。',
        '立定志向，循序渐进。每一步都是通往理想自我的阶梯。',
      ],
    },
    davinci: {
      confused: [
        '困惑是创造力的温床。当我不懂某件事时，我会画出来，或者从不同的角度观察它。',
        '你知道吗？我曾经设计飞行器失败了无数次。每一次失败都让我离成功更近一步。',
        '尝试把你现在的问题画成一幅图，或者想象它是一个谜题的答案。答案往往藏在问题之中。',
      ],
      anxious: [
        '焦虑是因为你试图控制无法控制的事物。专注于你能创造的部分。',
        '我在创作《蒙娜丽莎》时花了十六年。伟大的事情需要时间。不必急于求成。',
        '把你的担忧变成一个问题：如果一切皆有可能，我会怎么做？',
      ],
      stuck: [
        '瓶颈是创新的机会。问问自己：如果没有人教过我这样做，我会怎么做？',
        '我常常从自然界寻找灵感。去散步，观察一片叶子、一朵云、一滴水。',
        '当你被困住时，试着完全反转你的假设。也许答案就在相反的方向。',
      ],
      sad: [
        '悲伤是灵魂深处的音符，它可以成为最动人的乐章。把你的情感转化为创作。',
        '即使是最黑暗的夜晚，也总会有黎明。我见过无数次黑夜转变为灿烂的晨光。',
        '允许自己感受。真正的艺术家从不逃避情感，而是拥抱它们。',
      ],
      proud: [
        '庆祝你的成就！然后问自己：这只是一个开始，还有什么更伟大的等着我去创造？',
        '成功是甜蜜的，但不要让它使你满足。保持好奇心，继续探索。',
        '你做到了！现在，如何让这个成就帮助他人？',
      ],
      inspired: [
        '好奇是通往奇迹的钥匙。保持那颗探索的心，世界会向你展示无尽的奥秘。',
        '不要满足于学会，要追求精通。然后，超越精通，创造新的可能。',
        '我已经描绘了飞翔的梦想。你的梦想是什么？画出它，然后让它成为现实。',
      ],
    },
    curie: {
      confused: [
        '迷茫是科学探索的开始。每一个伟大的发现都始于"我不知道"。',
        '把你的困惑当作一个研究课题。收集数据，分析原因，得出结论。',
        '我花了四年时间从成吨的沥青铀矿中提取出一克镭。耐心和专注是克服迷茫的最好武器。',
      ],
      anxious: [
        '焦虑来自于对未知的恐惧。但我们科学家知道：未知是可以被理解的。',
        '把你担心的事情列出来，一件一件分析。恐惧在逻辑面前会退缩。',
        '我曾经面对过战争、贫困和学术界的偏见。专注是你最好的盾牌。',
      ],
      stuck: [
        '我尝试过的实验失败了几百次。每一次失败都让我排除了一种可能性。',
        '瓶颈是研究的一部分。重新审视你的假设，也许问题出在前提上。',
        '当我卡住时，我会回到基础。最简单的真理往往被复杂所掩盖。',
      ],
      sad: [
        '失去丈夫后，我全身心投入到工作中。工作是最好的疗愈。',
        '痛苦是暂时的，而你所追求的真理是永恒的。让时间成为你的朋友。',
        '坚强的外表下，我也是一个普通人。接受脆弱，才能找到真正的力量。',
      ],
      proud: [
        '成功是努力的回报。但不要忘记，还有更多的未知等待你去发现。',
        '第一个诺贝尔奖后，我没有停下脚步。科学是无限的，你的潜力也是。',
        '你已经证明了坚持的价值。现在，用你的成就激励更多的后来者。',
      ],
      inspired: [
        '热情是最好的老师。找到你真正热爱的事物，然后全身心投入。',
        '我曾经是一个在寒冷的阁楼里学习的女孩。梦想不分起点。',
        '成长需要牺牲和决心。问问自己：你愿意为你的目标付出多少？',
      ],
    },
    marcus: {
      confused: [
        '你感到迷茫，是因为你在意外界的评价多于内心的声音。问问自己：什么对你真正重要？',
        '障碍并不阻止你前进，障碍本身就是道路。每一步困惑都是在塑造更强大的你。',
        '不要让过去困扰你，不要让未来吓到你。这一刻，你能做什么？',
      ],
      anxious: [
        '你焦虑的事情，有多少在你的控制范围内？专注于你能改变的，接受你不能改变的。',
        '今天逃避的痛苦，明天会以更强大的形式回来。直面它，它会消失。',
        '想象最坏的情况。如果你能接受它，你就没有什么可怕的了。',
      ],
      stuck: [
        '停滞不前时，问问自己：我是否在正确的方向上用力？',
        '一个圆柱体不会自己滚动。你需要的不是等待，而是推动自己。',
        '每一个困难都是考验你品格的机会。用坚韧和智慧面对它。',
      ],
      sad: [
        '悲伤来自于你对事物的执着。不是事物本身让你悲伤，而是你对它的看法。',
        '即使在最艰难的时刻，也要记住：这只是人生长河中的一瞬间。',
        '接受发生的一切。宇宙有它的计划，我们只需要扮演好自己的角色。',
      ],
      proud: [
        '成功不会改变你，除非你让它改变。保持谦逊，记住你的渺小。',
        '你已经做到了。现在问自己：我是否配得上这份成功？',
        '骄傲是失败的前奏。用理性和谦逊来对待你的成就。',
      ],
      inspired: [
        '想要成长是好的。但问问自己：我是为了外界的认可，还是内心的完善？',
        '每一天都是新的开始。过去不代表未来，你现在就可以选择成为更好的自己。',
        '真正的成长是内在的。外在的成就只是副产品。',
      ],
    },
    musk: {
      confused: [
        '迷茫？让我告诉你一个方法：第一性原理思维。把问题拆解到最基本的真理，然后从那里重新构建。',
        '如果你不知道往哪走，那就选一个最难的问题去解决。反正都是走，不如走一条有意义的路。',
        '停止想"我应该做什么"，开始问"什么是最重要的"。然后去做那个。',
      ],
      anxious: [
        '焦虑是因为你在担心失败。但失败只是数据点。收集更多数据，你就不会焦虑了。',
        '最坏的情况是什么？公司倒闭？那就再开一家。你不会死。那就去冒险。',
        '如果你在做的事情不够疯狂，那你就错了。焦虑是正常的，说明你在挑战极限。',
      ],
      stuck: [
        '瓶颈说明你在用错误的方法。推翻你的假设，重新思考。为什么必须是这样？',
        '我每周工作100小时，不是因为我喜欢累，而是因为我在解决重要的问题。你的瓶颈值得你投入多少？',
        '如果你觉得卡住了，也许你在解决错误的问题。找一个更大的问题。',
      ],
      sad: [
        '悲伤？把它变成燃料。我童年很悲惨，但我把它变成了动力。',
        '情绪是化学反应。改变你的输入，改变你的思考，改变你的产出。',
        '世界不关心你的感受。做点有用的事，感觉会变好。',
      ],
      proud: [
        '成功了？好。下一个目标是什么？别躺在功劳簿上。',
        '你做到了别人认为不可能的事。现在去证明他们又错了。',
        '成功只是一个里程碑。如果你停下来，别人会超过你。继续前进。',
      ],
      inspired: [
        '想要成长？找一个你热爱的问题，然后投入你所有的时间和精力。',
        '普通人追求舒适。杰出的人追求挑战。你是哪一种？',
        '如果你的梦想不让你害怕，说明你的梦想太小了。',
      ],
    },
  };

  const mentorTemplates = templates[mentor.id];
  const situationTemplates = mentorTemplates?.[situation.id] || [
    `作为${mentor.name}，我建议你深入思考这个问题。`,
    '每个人都会遇到困难，关键是如何从中学习。',
    '让我分享一个观点，希望能给你启发。',
  ];
  
  const randomIndex = Math.floor(Math.random() * situationTemplates.length);
  let guidance = situationTemplates[randomIndex];
  
  if (userInput.trim()) {
    guidance += `\n\n关于你提到的"${userInput.slice(0, 50)}${userInput.length > 50 ? '...' : ''}"，我想补充：`;
    guidance += `\n\n${mentor.quotes[Math.floor(Math.random() * mentor.quotes.length)]}`;
  }
  
  return guidance;
}

export default function MentorsPage() {
  const [selectedMentor, setSelectedMentor] = useState<typeof mentors[0] | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<typeof situations[0] | null>(null);
  const [userInput, setUserInput] = useState('');
  const [guidance, setGuidance] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'mentor', content: string}>>([]);

  const handleGetGuidance = () => {
    if (!selectedMentor || !selectedSituation) return;
    
    setIsLoading(true);
    
    // 模拟 AI 响应延迟
    setTimeout(() => {
      const newGuidance = generateGuidance(selectedMentor, selectedSituation, userInput);
      setGuidance(newGuidance);
      if (userInput.trim()) {
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: userInput },
          { role: 'mentor', content: newGuidance }
        ]);
      }
      setUserInput('');
      setIsLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setSelectedMentor(null);
    setSelectedSituation(null);
    setUserInput('');
    setGuidance('');
    setConversationHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              AI 生命导师
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            🧙 与历史智者对话
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            选择一位导师，分享你的困惑，获得跨越千年的智慧启迪
          </p>
        </div>

        {/* Step 1: Select Mentor */}
        {!selectedMentor && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">1</span>
              选择你的导师
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mentors.map((mentor) => (
                <button
                  key={mentor.id}
                  onClick={() => setSelectedMentor(mentor)}
                  className={`p-4 rounded-2xl border-2 border-slate-100 hover:border-slate-300 transition-all hover:shadow-lg text-left group ${mentor.bgColor}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{mentor.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        {mentor.name}
                        <span className="text-xs text-slate-400 font-normal">{mentor.nameEn}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{mentor.era}</p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${mentor.color} text-white`}>
                          {mentor.specialty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 italic line-clamp-2">
                    "{mentor.quotes[0]}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Situation */}
        {selectedMentor && !selectedSituation && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">2</span>
                你现在的状态
              </h2>
              <button
                onClick={handleReset}
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                重新选择
              </button>
            </div>
            
            {/* Selected Mentor Badge */}
            <div className={`p-4 rounded-xl ${selectedMentor.bgColor} border border-slate-200`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedMentor.avatar}</span>
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedMentor.name}</h3>
                  <p className="text-sm text-slate-600">{selectedMentor.specialty}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {situations.map((situation) => (
                <button
                  key={situation.id}
                  onClick={() => setSelectedSituation(situation)}
                  className="p-4 rounded-xl border-2 border-slate-100 hover:border-amber-300 hover:bg-amber-50/50 transition-all text-left group"
                >
                  <span className="text-2xl mb-2 block">{situation.icon}</span>
                  <h4 className="font-medium text-slate-800">{situation.label}</h4>
                  <p className="text-xs text-slate-500 mt-1">{situation.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Get Guidance */}
        {selectedMentor && selectedSituation && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">3</span>
                获得智慧指导
              </h2>
              <button
                onClick={handleReset}
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                重新开始
              </button>
            </div>

            {/* Context Summary */}
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl">
              <span className="text-2xl">{selectedMentor.avatar}</span>
              <span className="text-slate-400">→</span>
              <span className="text-2xl">{selectedSituation.icon}</span>
              <span className="text-slate-600">
                向 <strong>{selectedMentor.name}</strong> 咨询关于 <strong>{selectedSituation.label}</strong> 的智慧
              </span>
            </div>

            {/* Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                想分享更多细节吗？（可选）
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="描述你的具体情况，导师会给出更有针对性的建议..."
                className="w-full h-24 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-300 resize-none"
              />
              <button
                onClick={handleGetGuidance}
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r ${selectedMentor.color} hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    思考中...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    获得导师指导
                  </>
                )}
              </button>
            </div>

            {/* Guidance Result */}
            {guidance && (
              <div className={`p-6 rounded-2xl ${selectedMentor.bgColor} border border-slate-200 space-y-4`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{selectedMentor.avatar}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{selectedMentor.name}</h3>
                    <p className="text-xs text-slate-500">{selectedMentor.era}</p>
                  </div>
                </div>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {guidance}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                  <Quote className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500 italic">
                    "{selectedMentor.quotes[Math.floor(Math.random() * selectedMentor.quotes.length)]}"
                  </span>
                </div>
              </div>
            )}

            {/* Conversation History */}
            {conversationHistory.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  对话记录
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {conversationHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-slate-100 ml-8'
                          : `${selectedMentor.bgColor} mr-8`
                      }`}
                    >
                      {msg.content.slice(0, 200)}{msg.content.length > 200 ? '...' : ''}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleGetGuidance}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 flex items-center gap-1 transition"
              >
                <RefreshCw className="w-4 h-4" />
                换一个建议
              </button>
              <button
                onClick={() => setSelectedSituation(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 flex items-center gap-1 transition"
              >
                <Target className="w-4 h-4" />
                换一个情境
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <Brain className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-slate-800 mb-2">历史智慧</h3>
            <p className="text-sm text-slate-600">
              六位跨越东西方的智者，涵盖哲学、科学、艺术等领域
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
            <Compass className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="font-semibold text-slate-800 mb-2">情境匹配</h3>
            <p className="text-sm text-slate-600">
              根据你当前的状态，获得最相关的指导
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <Heart className="w-8 h-8 text-amber-500 mb-3" />
            <h3 className="font-semibold text-slate-800 mb-2">深度对话</h3>
            <p className="text-sm text-slate-600">
              分享你的具体情况，获得个性化的建议
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}