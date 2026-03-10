import { NextRequest, NextResponse } from "next/server";

// GET /api/weather - 获取天气信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Shanghai";
    
    // 使用 wttr.in 获取天气（免费，无需 API key）
    const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
    }
    
    const data = await response.json();
    
    // 提取关键信息
    const current = data.current_condition?.[0];
    const today = data.weather?.[0];
    
    return NextResponse.json({
      location: city,
      current: {
        temp: current?.temp_C,
        feelsLike: current?.FeelsLikeC,
        humidity: current?.humidity,
        wind: current?.windspeedKmph,
        description: current?.weatherDesc?.[0]?.value,
        icon: current?.weatherCode,
      },
      today: {
        maxTemp: today?.maxtempC,
        minTemp: today?.mintempC,
        avgTemp: today?.avgtempC,
        sunriseTime: today?.astronomy?.[0]?.sunrise,
        sunsetTime: today?.astronomy?.[0]?.sunset,
      },
      forecast: data.weather?.slice(1, 4).map((day: any) => ({
        date: day.date,
        maxTemp: day.maxtempC,
        minTemp: day.mintempC,
        avgTemp: day.avgtempC,
        description: day.hourly?.[4]?.weatherDesc?.[0]?.value,
      })),
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}