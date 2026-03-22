import { NextRequest, NextResponse } from "next/server";

// 情绪关键词映射
const emotionKeywords: Record<string, { weather: string; weight: number }> = {
  // 快乐/积极
  快乐: { weather: "sunny", weight: 2 },
  开心: { weather: "sunny", weight: 2 },
  高兴: { weather: "sunny", weight: 2 },
  幸福: { weather: "sunny", weight: 2 },
  兴奋: { weather: "sunny", weight: 1.5 },
  愉快: { weather: "sunny", weight: 1.5 },
  满足: { weather: "sunny", weight: 1.5 },
  喜悦: { weather: "sunny", weight: 2 },
  成功: { weather: "sunny", weight: 1.5 },
  美好: { weather: "partly_cloudy", weight: 1 },
  不错: { weather: "partly_cloudy", weight: 1 },
  平静: { weather: "partly_cloudy", weight: 1 },
  舒适: { weather: "partly_cloudy", weight: 1 },

  // 悲伤/低落
  难过: { weather: "rainy", weight: 2 },
  悲伤: { weather: "rainy", weight: 2 },
  失落: { weather: "rainy", weight: 1.5 },
  沮丧: { weather: "rainy", weight: 2 },
  痛苦: { weather: "stormy", weight: 2 },
  哭泣: { weather: "rainy", weight: 1.5 },
  眼泪: { weather: "rainy", weight: 1.5 },
  孤独: { weather: "foggy", weight: 1.5 },
  寂寞: { weather: "foggy", weight: 1.5 },

  // 焦虑/压力
  焦虑: { weather: "cloudy", weight: 1.5 },
  紧张: { weather: "cloudy", weight: 1 },
  压力: { weather: "cloudy", weight: 1 },
  烦躁: { weather: "cloudy", weight: 1.5 },
  疲惫: { weather: "foggy", weight: 1.5 },
  累: { weather: "cloudy", weight: 1 },
  困惑: { weather: "foggy", weight: 1.5 },
  迷茫: { weather: "foggy", weight: 2 },

  // 愤怒/激烈
  生气: { weather: "stormy", weight: 2 },
  愤怒: { weather: "stormy", weight: 2.5 },
  爆发: { weather: "stormy", weight: 2 },
  崩溃: { weather: "stormy", weight: 2.5 },
  绝望: { weather: "stormy", weight: 2.5 },

  // 宁静/平和
  安宁: { weather: "snowy", weight: 2 },
  宁静: { weather: "snowy", weight: 2 },
  平和: { weather: "partly_cloudy", weight: 1.5 },
  淡定: { weather: "partly_cloudy", weight: 1 },
  冷静: { weather: "snowy", weight: 1.5 },

  // 希望/转折
  希望: { weather: "rainbow", weight: 2 },
  好转: { weather: "rainbow", weight: 1.5 },
  释然: { weather: "rainbow", weight: 2 },
  成长: { weather: "rainbow", weight: 1.5 },
  感谢: { weather: "rainbow", weight: 1.5 },
  感恩: { weather: "sunny", weight: 1.5 },
};

// 天气名称
const weatherNames: Record<string, string> = {
  sunny: "晴朗",
  partly_cloudy: "多云转晴",
  cloudy: "多云",
  rainy: "小雨",
  stormy: "雷雨",
  snowy: "雪天",
  foggy: "雾天",
  rainbow: "彩虹",
};

export async function POST(request: NextRequest) {
  try {
    const { diaries } = await request.json();

    if (!diaries || diaries.length === 0) {
      return NextResponse.json({
        currentWeather: "partly_cloudy",
        forecast: generateEmptyForecast(),
        summary: "开始记录你的日记，解锁情绪天气预报功能！每一天的记录都是了解自己的一步。",
      });
    }

    // 分析每天的情绪天气
    const dailyWeathers: { date: string; weather: string; score: number }[] = [];

    for (const diary of diaries) {
      const text = `${diary.title} ${diary.content}`.toLowerCase();
      const weatherScores: Record<string, number> = {};

      // 计算每种天气的得分
      for (const [keyword, mapping] of Object.entries(emotionKeywords)) {
        if (text.includes(keyword)) {
          if (!weatherScores[mapping.weather]) {
            weatherScores[mapping.weather] = 0;
          }
          weatherScores[mapping.weather] += mapping.weight;
        }
      }

      // 找出得分最高的天气
      let maxWeather = "partly_cloudy";
      let maxScore = 0;
      for (const [weather, score] of Object.entries(weatherScores)) {
        if (score > maxScore) {
          maxScore = score;
          maxWeather = weather;
        }
      }

      dailyWeathers.push({
        date: diary.date,
        weather: maxWeather,
        score: maxScore,
      });
    }

    // 当前天气（最近的日记）
    const currentWeather = dailyWeathers[0]?.weather || "partly_cloudy";

    // 生成预报
    const forecast = generateForecast(dailyWeathers);

    // 生成总结
    const summary = generateSummary(dailyWeathers, currentWeather);

    return NextResponse.json({
      currentWeather,
      forecast,
      summary,
    });
  } catch (error) {
    console.error("情绪天气分析失败:", error);
    return NextResponse.json({
      currentWeather: "partly_cloudy",
      forecast: generateEmptyForecast(),
      summary: "暂时无法分析情绪天气，请稍后再试。",
    });
  }
}

// 生成7天预报
function generateForecast(
  dailyWeathers: { date: string; weather: string; score: number }[]
) {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const forecast = [];
  const today = new Date();

  // 分析趋势
  const recentWeathers = dailyWeathers.slice(0, 3);
  const trendUp =
    recentWeathers.length >= 2 &&
    recentWeathers[0].score > recentWeathers[1]?.score;
  const trendDown =
    recentWeathers.length >= 2 &&
    recentWeathers[0].score < recentWeathers[1]?.score;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayName = days[date.getDay()];

    // 根据已有数据和趋势预测
    let weather = i === 0 ? dailyWeathers[0]?.weather : "partly_cloudy";

    if (i > 0 && dailyWeathers.length > 0) {
      // 基于趋势预测
      if (trendUp) {
        weather = improveWeather(weather);
      } else if (trendDown) {
        weather = worsenWeather(weather);
      }
    }

    forecast.push({
      day: dayName,
      weather,
      trend: trendUp ? "up" : trendDown ? "down" : "stable",
    });
  }

  return forecast;
}

// 天气好转
function improveWeather(weather: string): string {
  const improvements: Record<string, string> = {
    stormy: "rainy",
    rainy: "cloudy",
    cloudy: "partly_cloudy",
    foggy: "partly_cloudy",
    partly_cloudy: "sunny",
    snowy: "partly_cloudy",
  };
  return improvements[weather] || weather;
}

// 天气变差
function worsenWeather(weather: string): string {
  const worsens: Record<string, string> = {
    sunny: "partly_cloudy",
    partly_cloudy: "cloudy",
    rainbow: "partly_cloudy",
    cloudy: "rainy",
    snowy: "cloudy",
  };
  return worsens[weather] || weather;
}

// 生成空预报
function generateEmptyForecast() {
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const today = new Date();

  return days.slice(0, 7).map((day, i) => ({
    day,
    weather: "partly_cloudy",
    trend: "stable",
  }));
}

// 生成总结
function generateSummary(
  dailyWeathers: { date: string; weather: string; score: number }[],
  currentWeather: string
): string {
  if (dailyWeathers.length === 0) {
    return "开始记录你的日记，解锁情绪天气预报功能！每一天的记录都是了解自己的一步。";
  }

  const weatherCounts: Record<string, number> = {};
  for (const dw of dailyWeathers) {
    weatherCounts[dw.weather] = (weatherCounts[dw.weather] || 0) + 1;
  }

  const dominantWeather = Object.entries(weatherCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const summaries: Record<string, string[]> = {
    sunny: [
      "本周你的内心充满阳光！保持这份积极的能量，同时记得关注自己的情绪需求。",
      "你的情绪状态非常棒！这是做有挑战性事情的好时机。",
      "阳光灿烂的一周！记得把这份快乐分享给身边的人。",
    ],
    partly_cloudy: [
      "本周你的心情整体平稳，有小波动但都在可控范围内。继续关注自己的感受。",
      "情绪像多云天气一样，有起有落。这是很正常的状态，接纳它就好。",
    ],
    cloudy: [
      "本周你有些沉闷，但请记住：云层之上永远有阳光。适当给自己一些温暖的关怀。",
      "心情有些低沉？试试做些让你愉快的小事，哪怕只是喝杯热茶。",
    ],
    rainy: [
      "本周你的内心有些潮湿。允许自己有这些情绪，哭泣也是一种释放。",
      "小雨淅沥，心情有些低落。找信任的人聊聊，或者写写日记，让情绪流淌出来。",
    ],
    stormy: [
      "本周你经历了较大的情绪波动。请记住：风暴总会过去，你比你想象的更坚强。",
      "内心有雷雨？深呼吸，这个困难会过去的。如果需要，寻求支持是勇敢的选择。",
    ],
    snowy: [
      "本周你的内心宁静如雪。这是反思和内省的好时机。",
      "宁静的一周。享受这份平和，做些让心灵安静的事情。",
    ],
    foggy: [
      "本周你有些迷茫和困惑。不必急着看清所有，雾会慢慢散去。",
      "思绪模糊时，试着写下来，让想法变得清晰。耐心等待，方向会出现的。",
    ],
    rainbow: [
      "本周你经历了起伏后看到了希望的光芒。这份彩虹值得珍惜！",
      "风雨后见彩虹！你正在成长，为这份进步感到骄傲吧。",
    ],
  };

  const weatherName = weatherNames[dominantWeather[0]] || "多云";
  const summaryOptions = summaries[dominantWeather[0]] || summaries.partly_cloudy;
  const randomSummary = summaryOptions[Math.floor(Math.random() * summaryOptions.length)];

  return `${randomSummary} 本周主要情绪天气：${weatherName}（${dominantWeather[1]}天）。`;
}