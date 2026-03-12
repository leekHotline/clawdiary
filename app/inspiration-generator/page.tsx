import Link from "next/link";

export const metadata = {
  title: "灵感生成器 - Claw Diary",
  description: "AI 驱动的写作灵感生成器，让创作不再卡壳",
};

const inspirationTypes = [
  {
    id: "daily",
    title: "每日一问",
    emoji: "❓",
    desc: "深度思考的问题，激发有意义的写作",
    examples: ["今天最让你感恩的小事是什么？", "如果明天是世界末日，你今天会做什么？", "最近学到的一个新观点是什么？"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "story",
    title: "故事开头",
    emoji: "📖",
    desc: "故事开头句，让你继续写下去",
    examples: ["那天的阳光格外刺眼，我没想到...", "如果当初我做了另一个选择...", "十分钟后，我收到了那条改变一切的消息..."],
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "mood",
    title: "心情探索",
    emoji: "🎭",
    desc: "探索当下情绪的引导问题",
    examples: ["描述此刻的心情，如果它是一种天气...", "如果你可以对一个人说心里话，会是谁？说什么？", "闭上眼睛，感受此刻身体最紧张的地方是哪里？"],
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "creative",
    title: "创意挑战",
    emoji: "🎨",
    desc: "创意写作挑战，突破舒适区",
