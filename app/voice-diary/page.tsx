"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface VoiceEntry {
  id: string;
  transcript: string;
  duration: number;
  emotion: string;
  emotionEmoji: string;
  timestamp: Date;
  saved: boolean;
}

// Web Speech API 类型定义
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// 情绪分析（基于关键词）
const analyzeEmotion = (text: string): { emotion: string; emoji: string } => {
  const emotions: Record<string, { keywords: string[]; emoji: string }> = {
    happy: { keywords: ["开心", "高兴", "快乐", "幸福", "棒", "好", "喜欢", "爱", "哈哈", "😊", "😄", "🎉"], emoji: "😊" },
    excited: { keywords: ["兴奋", "期待", "激动", "太棒", "终于", "成功", "赢", "胜利"], emoji: "🤩" },
    calm: { keywords: ["平静", "放松", "舒服", "安宁", "知足", "满足"], emoji: "😌" },
    sad: { keywords: ["难过", "伤心", "失落", "遗憾", "想哭", "悲伤", "孤独"], emoji: "😢" },
    anxious: { keywords: ["担心", "焦虑", "紧张", "不安", "害怕", "恐惧", "压力"], emoji: "😰" },
    angry: { keywords: ["生气", "愤怒", "烦躁", "讨厌", "无语", "气死"], emoji: "😤" },
    grateful: { keywords: ["感谢", "感恩", "谢谢", "幸运", "珍贵", "美好"], emoji: "🙏" },
    confused: { keywords: ["困惑", "迷茫", "不知道", "纠结", "犹豫", "难选"], emoji: "🤔" },
  };

  const lowerText = text.toLowerCase();
  
  for (const [emotion, data] of Object.entries(emotions)) {
    if (data.keywords.some(keyword => lowerText.includes(keyword))) {
      return { emotion, emoji: data.emoji };
    }
  }
  
  return { emotion: "neutral", emoji: "😐" };
};

// 格式化时间
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Helper function for localStorage initialization
function loadInitialEntries(): VoiceEntry[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("voice-diary-entries");
  if (!saved) return [];
  return JSON.parse(saved).map((e: VoiceEntry) => ({
    ...e,
    timestamp: new Date(e.timestamp),
  }));
}

export default function VoiceDiaryPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [duration, setDuration] = useState(0);
  const [entries, setEntries] = useState<VoiceEntry[]>(loadInitialEntries);
  const [selectedEntry, setSelectedEntry] = useState<VoiceEntry | null>(null);
  const [showTip, setShowTip] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // 初始化语音识别
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "zh-CN";
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interim = "";
        
        for (let i = event.results.length - 1; i >= 0; i--) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript = result[0].transcript + finalTranscript;
          } else {
            interim = result[0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
        setInterimTranscript(interim);
      };
      
      recognition.onerror = () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      
      recognition.onend = () => {
        if (isRecording) {
          // 如果还在录音状态，重新开始（连续模式）
          try {
            recognition.start();
          } catch {
            setIsRecording(false);
          }
        }
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 保存到本地存储
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem("voice-diary-entries", JSON.stringify(entries));
    }
  }, [entries]);

  // 开始录音
  const startRecording = useCallback(async () => {
    if (!recognitionRef.current) {
      alert("您的浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器");
      return;
    }

    try {
      // 请求麦克风权限（用于音量可视化）
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      recognitionRef.current.start();
      setIsRecording(true);
      setTranscript("");
      setInterimTranscript("");
      setDuration(0);
      setShowTip(false);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch {
      alert("请允许麦克风权限以使用语音日记功能");
    }
  }, []);

  // 停止录音
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
    setInterimTranscript("");
  }, []);

  // 保存日记
  const saveEntry = useCallback(() => {
    if (!transcript.trim()) return;
    
    const { emotion, emoji } = analyzeEmotion(transcript);
    
    const newEntry: VoiceEntry = {
      id: Date.now().toString(),
      transcript: transcript.trim(),
      duration,
      emotion,
      emotionEmoji: emoji,
      timestamp: new Date(),
      saved: true,
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setTranscript("");
    setDuration(0);
    setSelectedEntry(newEntry);
  }, [transcript, duration]);

  // 删除记录
  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  }, [selectedEntry]);

  // 复制文本
  const copyText = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  // 是否支持语音识别
  const isSupported = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-sky-50 to-blue-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-cyan-600 mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🎙️</span>
            <h1 className="text-3xl font-bold text-gray-800">语音日记</h1>
          </div>
          <p className="text-gray-500">
            用声音记录生活，AI 帮你转成文字并分析情绪
          </p>
        </div>

        {/* 不支持提示 */}
        {!isSupported && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-yellow-700">
              ⚠️ 您的浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器
            </p>
          </div>
        )}

        {/* 录音区域 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/50 mb-8">
          {/* 录音按钮 */}
          <div className="flex flex-col items-center mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isSupported}
              className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-200 animate-pulse"
                  : "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-200 hover:shadow-xl hover:scale-105"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRecording ? (
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-white rounded-sm animate-pulse" />
                  <span className="w-3 h-3 bg-white rounded-sm animate-pulse delay-75" />
                  <span className="w-3 h-3 bg-white rounded-sm animate-pulse delay-150" />
                </div>
              ) : (
                <span className="text-5xl">🎤</span>
              )}
              
              {/* 录音波纹效果 */}
              {isRecording && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-pulse" />
                </>
              )}
            </button>
            
            <p className="mt-4 text-gray-600 font-medium">
              {isRecording ? "点击停止录音" : "点击开始录音"}
            </p>
            
            {isRecording && (
              <p className="mt-2 text-2xl font-mono text-cyan-600">
                {formatDuration(duration)}
              </p>
            )}
          </div>

          {/* 转录文本显示 */}
          {(transcript || interimTranscript) && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">📝 转录结果</span>
                <span className="text-xs text-gray-400">{transcript.length} 字</span>
              </div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {transcript}
                <span className="text-gray-400">{interimTranscript}</span>
              </p>
            </div>
          )}

          {/* 操作按钮 */}
          {transcript && (
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setTranscript("")}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                🗑️ 清空
              </button>
              <button
                onClick={() => copyText(transcript)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                📋 复制
              </button>
              <button
                onClick={saveEntry}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                💾 保存日记
              </button>
            </div>
          )}

          {/* 使用提示 */}
          {showTip && !transcript && (
            <div className="mt-6 p-4 bg-cyan-50 rounded-xl text-sm text-cyan-700">
              <p className="font-medium mb-2">💡 使用提示：</p>
              <ul className="space-y-1 text-cyan-600">
                <li>• 点击麦克风开始录音，说出你想记录的内容</li>
                <li>• 系统会实时将语音转为文字</li>
                <li>• 录音结束后可以编辑或直接保存</li>
                <li>• AI 会分析你的情绪并标记</li>
              </ul>
            </div>
          )}
        </div>

        {/* 历史记录 */}
        {entries.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">📝 历史记录</h2>
              <span className="text-sm text-gray-500">{entries.length} 条语音日记</span>
            </div>
            
            <div className="space-y-3">
              {entries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className={`bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border transition-all cursor-pointer ${
                    selectedEntry?.id === entry.id
                      ? "border-cyan-300 ring-2 ring-cyan-100"
                      : "border-white/50 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">{entry.emotionEmoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 line-clamp-2">{entry.transcript}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>{new Date(entry.timestamp).toLocaleDateString("zh-CN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</span>
                        <span>⏱️ {formatDuration(entry.duration)}</span>
                        <span className="capitalize">{entry.emotion}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntry(entry.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 选中日记详情 */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedEntry.emotionEmoji}</span>
                  <div>
                    <p className="font-medium text-gray-800">语音日记</p>
                    <p className="text-xs text-gray-400">
                      {new Date(selectedEntry.timestamp).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEntry.transcript}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>⏱️ 录音时长: {formatDuration(selectedEntry.duration)}</span>
                <span>📝 {selectedEntry.transcript.length} 字</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => copyText(selectedEntry.transcript)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📋 复制文本
                </button>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 功能说明 */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
            <span className="text-3xl mb-2 block">🎯</span>
            <h3 className="font-medium text-gray-800 mb-1">实时转录</h3>
            <p className="text-sm text-gray-500">语音实时转为文字，解放双手</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
            <span className="text-3xl mb-2 block">🎭</span>
            <h3 className="font-medium text-gray-800 mb-1">情绪分析</h3>
            <p className="text-sm text-gray-500">AI 自动识别你的情绪状态</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
            <span className="text-3xl mb-2 block">🔒</span>
            <h3 className="font-medium text-gray-800 mb-1">隐私保护</h3>
            <p className="text-sm text-gray-500">所有数据仅保存在本地</p>
          </div>
        </div>
      </main>
    </div>
  );
}