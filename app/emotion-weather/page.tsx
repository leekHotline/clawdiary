"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 情绪天气类型
interface EmotionWeather {
  condition: string;
  emoji: string;
  color: string;
  bgGradient: string;
  description: string;
  advice: string[];
  intensity: number;
}

// 日记数据
interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
}

// 天气映射
const weatherMap: Record<string, EmotionWeather> = {
  sunny: {
    condition: "晴朗",
    emoji: "☀️",
    color: "from-amber-400 to-orange-400",
    bgGradient: "from-amber-50 via-orange-50 to-yellow-50",
    description: "阳光明媚，内心充满能量和喜悦",
    advice: ["享受这份好心情，做些有挑战的事", "分享你的快乐，让阳光照耀他人", "记录这份美好，作为低谷时的提醒"],
    intensity: 90,
  },
  partly_cloudy: {
    condition: "多云转晴",
    emoji: "⛅",
    color: "from-blue-400 to-cyan-400",
    bgGradient: "from-blue-50 via-cyan-50 to-sky-50",
    description: "心情平稳，偶有波动但整体向好",
    advice: ["保持开放，接纳情绪的小波动", "做些轻松的事，享受当下", "留意那些让云朵散开的时刻"],
    intensity: 70,
  },
  cloudy: {
    condition: "多云",
    emoji: "☁️",
    color: "from-gray-400 to-slate-400",
    bgGradient: "from-gray-50 via-slate-50 to-zinc-50",
    description: "心情有些低沉，思绪飘忽不定",
    advice: ["不必强求开心，允许自己有些沉闷", "写写日记，理清思绪", "找个安静的地方，和自己对话"],
    intensity: 50,
  },
  rainy: {
    condition: "小雨",
    emoji: "🌧️",
    color: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-100 via-indigo-50 to-slate-100",
    description: "心情有些低落，需要一些抚慰",
    advice: ["哭泣也是释放，让情绪流淌", "听听音乐，看看电影，给自己一点温暖", "和朋友聊聊，或者写封信给自己"],
    intensity: 40,
  },
  stormy: {
    condition: "雷雨",
    emoji: "⛈️",
    color: "from-purple-600 to-violet-700",
    bgGradient: "from-purple-100 via-violet-100 to-indigo-100",
    description: "内心波动较大，需要安抚和平静",
    advice: ["深呼吸，这个风暴会过去的", "暂时放下复杂的事，照顾好自己", "寻求支持，你不需要独自承受"],
    intensity: 30,
  },
  snowy: {
    condition: "雪天",
    emoji: "❄️",
    color: "from-cyan-300 to-blue-300",
    bgGradient: "from-cyan-50 via-blue-50 to-indigo-50",
    description: "内心宁静，如同被雪覆盖的世界",
    advice: ["享受这份宁静，做些冥想或阅读", "放慢脚步，感受当下的平和", "记录这份静谧，它很珍贵"],
    intensity: 60,
  },
  foggy: {
    condition: "雾天",
    emoji: "🌫️",
    color: "from-gray-300 to-gray-400",
    bgGradient: "from-gray-100 via-zinc-100 to-neutral-100",
    description: "思绪模糊，对未来有些迷茫",
    advice: ["不必急着看清，雾会慢慢散去", "写下来，让思绪变得清晰", "从小事做起，一步步找到方向"],
    intensity: 45,
  },
  rainbow: {
    condition: "彩虹",
    emoji: "🌈",
    color: "from-pink-400 via-purple-400 to-cyan-400",
    bgGradient: "from-pink-50 via-purple-50 to-cyan-50",
    description: "经历风雨后，看到了希望的光芒",
    advice: ["庆祝这份来之不易的美好", "记住这个时刻，你挺过来了", "分享你的彩虹故事，给别人希望"],
    intensity: 85,
  },
};

// 情绪预报
interface Forecast {
  day: string;
  weather: EmotionWeather;
  trend: "up" | "stable" | "down";
}

export default function EmotionWeatherPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState<EmotionWeather | null>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    // 加载日记数据
    fetch("/api/diaries")
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setDiaries(sorted);
        analyzeWeather(sorted);
      })
      .catch((err) => console.error("加载日记失败:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // 分析情绪天气
  const analyzeWeather = async (diaryList: Diary[]) => {
    if (diaryList.length === 0) {
      setCurrentWeather(weatherMap.sunny);
      return;
    }

    try {
      const res = await fetch("/api/emotion-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diaries: diaryList.slice(0, 7).map((d) => ({
            title: d.title,
            content: d.content,
            date: d.date,
            mood: d.mood,
          })),
        }),
      });
      const data = await res.json();
      
      if (data.currentWeather && weatherMap[data.currentWeather]) {
        setCurrentWeather(weatherMap[data.currentWeather]);
      } else {
        setCurrentWeather(weatherMap.partly_cloudy);
      }

      if (data.forecast) {
        setForecast(data.forecast.map((f: { day: string; weather: string; trend: string }) => ({
          day: f.day,
          weather: weatherMap[f.weather] || weatherMap.cloudy,
          trend: f.trend,
        })));
      }

      if (data.summary) {
        setWeeklySummary(data.summary);
      }
    } catch (error) {
      console.error("分析失败:", error);
      setCurrentWeather(weatherMap.partly_cloudy);
    }
  };

  // 获取天气图标（小型）
  const getMiniWeather = (weatherKey: string) => {
    const w = weatherMap[weatherKey];
    return w ? w.emoji : "☁️";
  };

  // 计算趋势图标
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      default:
        return "➡️";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🌤️</div>
          <p className="text-gray-500">正在分析情绪天气...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentWeather?.bgGradient || "from-blue-50 to-indigo-50"}`}>
      {/* 动态背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl opacity-10 animate-pulse">
          {currentWeather?.emoji || "☀️"}
        </div>
        <div className="absolute top-1/3 right-20 text-6xl opacity-10 animate-pulse delay-300">
          {currentWeather?.emoji || "☁️"}
        </div>
        <div className="absolute bottom-20 left-1/4 text-7xl opacity-10 animate-pulse delay-500">
          {currentWeather?.emoji || "⛅"}
        </div>
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-12">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 当前天气 */}
        {currentWeather && (
          <div className="text-center mb-12">
            <div className="text-8xl mb-4 animate-bounce">{currentWeather.emoji}</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4"
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
              <span className={`bg-gradient-to-r ${currentWeather.color} bg-clip-text text-transparent`}>
                情绪{currentWeather.condition}
              </span>
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto text-lg">
              {currentWeather.description}
            </p>
          </div>
        )}

        {/* 建议卡片 */}
        {currentWeather && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💡</span>
              <span>今日建议</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentWeather.advice.map((tip, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{["🌱", "✨", "💫"][index]}</span>
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 情绪预报 */}
        {forecast.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📅</span>
              <span>情绪预报</span>
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {forecast.map((f, index) => (
                <div
                  key={index}
                  className="text-center p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedDate(f.day)}
                >
                  <div className="text-xs text-gray-500 mb-1">{f.day}</div>
                  <div className="text-2xl mb-1">{f.weather.emoji}</div>
                  <div className="text-xs">{getTrendIcon(f.trend)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 周总结 */}
        {weeklySummary && (
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 mb-8 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span>
              <span>本周情绪总结</span>
            </h2>
            <p className="text-gray-700 leading-relaxed">{weeklySummary}</p>
          </div>
        )}

        {/* 情绪天气图例 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🌈</span>
            <span>情绪天气图例</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(weatherMap).map(([key, weather]) => (
              <div
                key={key}
                className="bg-white/50 rounded-xl p-4 hover:bg-white/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl group-hover:scale-125 transition-transform">
                    {weather.emoji}
                  </span>
                  <span className="font-medium text-gray-800">{weather.condition}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {weather.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 功能说明 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>💭 情绪天气根据你最近的日记内容智能分析</p>
          <p className="mt-1">坚持记录，让你的情绪预报更加准确</p>
        </div>
      </main>
    </div>
  );
}