import { NextRequest, NextResponse } from "next/server";

// 心情预测模型 (简化版)
const moodFactors = {
  weekdayWeights: {
    0: 0.85, // 周日
    1: 0.75, // 周一
    2: 0.78, // 周二
    3: 0.80, // 周三
    4: 0.82, // 周四
    5: 0.88, // 周五
    6: 0.90, // 周六
  },
  sleepImpact: 0.15,
  exerciseImpact: 0.12,
  socialImpact: 0.08,
  creativeImpact: 0.10,
  workStressImpact: -0.05,
  weatherImpact: -0.03,
};

// 模拟历史心情数据
const historicalMoods = [
  { date: "2026-03-05", score: 7.5, factors: { sleep: 8, exercise: true, social: true } },
  { date: "2026-03-06", score: 8.0, factors: { sleep: 7, exercise: true, social: false } },
  { date: "2026-03-07", score: 7.0, factors: { sleep: 6, exercise: false, social: false } },
  { date: "2026-03-08", score: 7.8, factors: { sleep: 8, exercise: true, social: true } },
  { date: "2026-03-09", score: 8.2, factors: { sleep: 8, exercise: true, social: true } },
  { date: "2026-03-10", score: 7.5, factors: { sleep: 7, exercise: false, social: true } },
  { date: "2026-03-11", score: 8.5, factors: { sleep: 8, exercise: true, social: true } },
  { date: "2026-03-12", score: 8.0, factors: { sleep: 7, exercise: true, social: false } },
];

// 计算基础心情分数
function calculateBaseScore(date: Date): number {
