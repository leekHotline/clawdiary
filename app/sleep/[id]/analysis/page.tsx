'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Brain,
  Heart,
  Zap,
  Coffee,
  Wind
} from 'lucide-react';

interface SleepAnalysis {
  id: string;
  date: string;
  totalSleep: number; // minutes
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
  awakeTime: number;
  sleepQuality: number;
  sleepStages: {
    time: string;
    stage: 'deep' | 'light' | 'rem' | 'awake';
  }[];
  heartRate: {
    time: string;
    rate: number;
  }[];
  insights: {
    type: 'positive' | 'neutral' | 'improvement';
    title: string;
    description: string;
    recommendation?: string;
  }[];
  comparison: {
    avgSleep: number;
    avgQuality: number;
    sleepDiff: number;
    qualityDiff: number;
  };
}

export default function SleepAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const sleepId = params.id as string;
  
  const [analysis, setAnalysis] = useState<SleepAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stages' | 'heart'>('stages');

  useEffect(() => {
    fetchAnalysis();
  }, [sleepId]);

  const fetchAnalysis = async () => {
    try {
      const res = await fetch(`/api/sleep/${sleepId}/analysis`);
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      } else {
        setAnalysis(generateMockAnalysis());
      }
    } catch (_error) {
      setAnalysis(generateMockAnalysis());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalysis = (): SleepAnalysis => {
    const stages: SleepAnalysis['sleepStages'] = [];
    const heartRates: SleepAnalysis['heartRate'] = [];
    const startTime = new Date();
    startTime.setHours(22, 0, 0, 0);
    
    let currentTime = new Date(startTime);
    const totalMinutes = 480; // 8 hours
    
    for (let i = 0; i < totalMinutes; i += 15) {
      const stageRand = Math.random();
      let stage: 'deep' | 'light' | 'rem' | 'awake' = 'light';
      if (i < 60) {
        stage = 'light';
      } else if (i < 120) {
        stage = stageRand > 0.3 ? 'deep' : 'light';
      } else if (i < 180) {
        stage = stageRand > 0.5 ? 'rem' : 'light';
      } else if (i < 300) {
        stage = stageRand > 0.6 ? 'light' : (stageRand > 0.3 ? 'deep' : 'rem');
      } else {
        stage = stageRand > 0.7 ? 'rem' : 'light';
        if (Math.random() > 0.9) stage = 'awake';
      }
      
      stages.push({
        time: currentTime.toTimeString().slice(0, 5),
        stage
      });
      
      const baseRate = stage === 'deep' ? 55 : stage === 'rem' ? 65 : stage === 'awake' ? 72 : 60;
      heartRates.push({
        time: currentTime.toTimeString().slice(0, 5),
        rate: baseRate + Math.floor(Math.random() * 6) - 3
      });
      
      currentTime = new Date(currentTime.getTime() + 15 * 60000);
    }
    
    return {
      id: sleepId,
      date: new Date().toISOString().split('T')[0],
      totalSleep: 468, // 7.8 hours
      deepSleep: 98,
      lightSleep: 234,
      remSleep: 112,
      awakeTime: 24,
      sleepQuality: 85,
      sleepStages: stages,
      heartRate: heartRates,
      insights: [
        {
          type: 'positive',
          title: '深度睡眠充足',
          description: '你的深度睡眠占比 21%，高于平均水平（15-20%）',
          recommendation: '继续保持规律的睡眠时间'
        },
        {
          type: 'neutral',
          title: 'REM 睡眠正常',
          description: 'REM 睡眠占比 24%，在正常范围内'
        },
        {
          type: 'improvement',
          title: '睡眠效率可提升',
          description: '夜间清醒时间稍长（24分钟）',
          recommendation: '睡前避免使用电子设备，保持卧室安静'
        }
      ],
      comparison: {
        avgSleep: 450,
        avgQuality: 80,
        sleepDiff: 18,
        qualityDiff: 5
      }
    };
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'deep': return 'bg-indigo-600';
      case 'light': return 'bg-blue-400';
      case 'rem': return 'bg-purple-500';
      case 'awake': return 'bg-red-400';
      default: return 'bg-gray-300';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'improvement': return <Activity className="w-5 h-5 text-yellow-500" />;
      default: return <Brain className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <p className="text-white/70">睡眠记录不存在</p>
      </div>
    );
  }

  const sleepHours = Math.floor(analysis.totalSleep / 60);
  const sleepMinutes = analysis.totalSleep % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <Moon className="w-8 h-8 text-indigo-300" />
              <div>
                <h1 className="text-xl font-bold text-white">睡眠分析</h1>
                <p className="text-sm text-white/60">
                  {new Date(analysis.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Sleep Score Hero */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(analysis.sleepQuality / 100) * 440} 440`}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold text-white">{analysis.sleepQuality}</p>
              <p className="text-sm text-white/60">睡眠质量</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Clock className="w-5 h-5" />
            <span className="text-lg">{sleepHours}小时{sleepMinutes}分钟</span>
          </div>
        </div>

        {/* Comparison Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">睡眠时长</span>
              {analysis.comparison.sleepDiff > 0 ? (
                <span className="text-green-400 text-xs flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{analysis.comparison.sleepDiff}分钟
                </span>
              ) : (
                <span className="text-red-400 text-xs flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  {analysis.comparison.sleepDiff}分钟
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{sleepHours}h {sleepMinutes}m</p>
            <p className="text-xs text-white/40">平均 {formatDuration(analysis.comparison.avgSleep)}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">睡眠质量</span>
              {analysis.comparison.qualityDiff > 0 ? (
                <span className="text-green-400 text-xs flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{analysis.comparison.qualityDiff}%
                </span>
              ) : (
                <span className="text-red-400 text-xs flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  {analysis.comparison.qualityDiff}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{analysis.sleepQuality}%</p>
            <p className="text-xs text-white/40">平均 {analysis.comparison.avgQuality}%</p>
          </div>
        </div>

        {/* Sleep Stages */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">睡眠阶段分布</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 mx-auto mb-2 flex items-center justify-center">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <p className="text-lg font-bold text-white">{formatDuration(analysis.deepSleep)}</p>
              <p className="text-xs text-white/60">深度睡眠</p>
              <p className="text-xs text-indigo-400">{Math.round(analysis.deepSleep / analysis.totalSleep * 100)}%</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-400 mx-auto mb-2 flex items-center justify-center">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <p className="text-lg font-bold text-white">{formatDuration(analysis.lightSleep)}</p>
              <p className="text-xs text-white/60">浅度睡眠</p>
              <p className="text-xs text-blue-400">{Math.round(analysis.lightSleep / analysis.totalSleep * 100)}%</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500 mx-auto mb-2 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <p className="text-lg font-bold text-white">{formatDuration(analysis.remSleep)}</p>
              <p className="text-xs text-white/60">REM 睡眠</p>
              <p className="text-xs text-purple-400">{Math.round(analysis.remSleep / analysis.totalSleep * 100)}%</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-400 mx-auto mb-2 flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <p className="text-lg font-bold text-white">{formatDuration(analysis.awakeTime)}</p>
              <p className="text-xs text-white/60">清醒时间</p>
              <p className="text-xs text-red-400">{Math.round(analysis.awakeTime / analysis.totalSleep * 100)}%</p>
            </div>
          </div>
        </div>

        {/* Sleep Stages Timeline */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">睡眠时间线</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('stages')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  activeTab === 'stages' ? 'bg-white/20 text-white' : 'text-white/60'
                }`}
              >
                睡眠阶段
              </button>
              <button
                onClick={() => setActiveTab('heart')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  activeTab === 'heart' ? 'bg-white/20 text-white' : 'text-white/60'
                }`}
              >
                心率
              </button>
            </div>
          </div>
          
          {activeTab === 'stages' ? (
            <div className="space-y-2">
              <div className="flex gap-0.5 h-16">
                {analysis.sleepStages.slice(0, 32).map((stage, i) => (
                  <div 
                    key={i}
                    className={`flex-1 rounded-sm ${getStageColor(stage.stage)}`}
                    title={`${stage.time}: ${stage.stage}`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>22:00</span>
                <span>02:00</span>
                <span>06:00</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-white/60 pt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-indigo-600"></div>
                  <span>深度</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                  <span>浅度</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
                  <span>REM</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-red-400"></div>
                  <span>清醒</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="h-16 flex items-end gap-0.5">
                {analysis.heartRate.slice(0, 32).map((hr, i) => {
                  const height = ((hr.rate - 50) / 30) * 100;
                  return (
                    <div 
                      key={i}
                      className="flex-1 bg-gradient-to-t from-red-500 to-pink-400 rounded-t-sm"
                      style={{ height: `${Math.max(10, height)}%` }}
                      title={`${hr.time}: ${hr.rate} bpm`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>22:00</span>
                <span>02:00</span>
                <span>06:00</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-white/60 pt-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span>平均心率: {Math.round(analysis.heartRate.reduce((a, b) => a + b.rate, 0) / analysis.heartRate.length)} bpm</span>
              </div>
            </div>
          )}
        </div>

        {/* Insights */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            睡眠洞察
          </h3>
          <div className="space-y-3">
            {analysis.insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${
                  insight.type === 'positive' ? 'bg-green-500/20 border border-green-500/30' :
                  insight.type === 'improvement' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                  'bg-blue-500/20 border border-blue-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <p className="font-medium text-white">{insight.title}</p>
                    <p className="text-sm text-white/70 mt-1">{insight.description}</p>
                    {insight.recommendation && (
                      <p className="text-sm text-white/50 mt-2 italic">
                        💡 建议：{insight.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            睡眠建议
          </h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">•</span>
              保持规律的作息时间，即使在周末
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              睡前1小时避免使用电子设备
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400">•</span>
              保持卧室温度在18-22°C
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400">•</span>
              睡前可以进行轻度伸展或冥想
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}