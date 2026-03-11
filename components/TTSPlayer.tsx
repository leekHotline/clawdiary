"use client";

import { useState, useEffect, useRef } from "react";

interface TTSPlayerProps {
  text: string;
  title?: string;
  onClose?: () => void;
}

export default function TTSPlayer({ text, title, onClose }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // 加载可用语音
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // 默认选择中文语音
      const chineseVoice = availableVoices.find(v => v.lang.includes("zh"));
      if (chineseVoice) {
        setSelectedVoice(chineseVoice.name);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    if (isPlaying && !isPaused) {
      // 暂停
      speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      // 继续
      speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // 开始新朗读
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // 设置语音
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔊</span>
          <span className="font-medium">{title ? `${title} - 朗读` : "日记朗读"}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/80 hover:text-white">
            ✕
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={speak}
          className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
        >
          {isPlaying && !isPaused ? "⏸" : "▶"}
        </button>
        <button
          onClick={stop}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
        >
          ⏹
        </button>
        <div className="flex-1 text-sm text-white/80">
          {isPlaying ? (isPaused ? "已暂停" : "正在朗读...") : "点击播放"}
        </div>
      </div>

      {/* Settings */}
      <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
        {/* Voice Selection */}
        <div>
          <label className="text-sm text-white/70 block mb-1">语音</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full px-3 py-1.5 rounded bg-white/20 text-white text-sm"
          >
            {voices.filter(v => v.lang.includes("zh") || v.lang.includes("en")).map((voice) => (
              <option key={voice.name} value={voice.name} className="text-gray-900">
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Rate */}
        <div>
          <label className="text-sm text-white/70 block mb-1">语速: {rate}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Pitch */}
        <div>
          <label className="text-sm text-white/70 block mb-1">音调: {pitch}</label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}