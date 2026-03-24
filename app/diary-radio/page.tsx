"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// 音乐类型
interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  mood: string;
  previewUrl?: string;
}

// 播放列表
interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  mood: string;
  tracks: Track[];
  color: string;
}

// 心情选项
const MOODS = [
  { id: "calm", name: "平静", emoji: "😌", color: "from-blue-400 to-cyan-400", desc: "舒缓放松" },
  { id: "happy", name: "开心", emoji: "😊", color: "from-yellow-400 to-orange-400", desc: "轻快愉悦" },
  { id: "reflective", name: "思考", emoji: "🤔", color: "from-purple-400 to-indigo-400", desc: "深沉内省" },
  { id: "sad", name: "忧伤", emoji: "😢", color: "from-slate-400 to-gray-500", desc: "温柔陪伴" },
  { id: "energetic", name: "充满活力", emoji: "⚡", color: "from-pink-400 to-rose-400", desc: "活力满满" },
  { id: "romantic", name: "浪漫", emoji: "💕", color: "from-rose-400 to-pink-400", desc: "甜蜜温暖" },
  { id: "focused", name: "专注", emoji: "🎯", color: "from-green-400 to-emerald-400", desc: "清晰思路" },
  { id: "nostalgic", name: "怀旧", emoji: "🕰️", color: "from-amber-400 to-orange-400", desc: "回忆往事" },
];

// 模拟播放列表数据
const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: "peaceful-morning",
    name: "宁静晨光",
    description: "适合清晨写作的轻音乐",
    cover: "🌅",
    mood: "calm",
    color: "from-blue-500 to-cyan-400",
    tracks: [
      { id: "1", title: "晨曦", artist: "自然之声", cover: "🌄", duration: "4:32", mood: "calm" },
      { id: "2", title: "湖畔晨雾", artist: "冥想音乐", cover: "🌫️", duration: "5:18", mood: "calm" },
      { id: "3", title: "第一缕阳光", artist: "钢琴诗人", cover: "☀️", duration: "3:45", mood: "calm" },
      { id: "4", title: "鸟语花香", artist: "自然白噪音", cover: "🐦", duration: "6:20", mood: "calm" },
      { id: "5", title: "茶香袅袅", artist: "东方禅意", cover: "🍵", duration: "4:55", mood: "calm" },
    ],
  },
  {
    id: "happy-vibes",
    name: "快乐节奏",
    description: "让心情飞扬的欢快旋律",
    cover: "🎵",
    mood: "happy",
    color: "from-yellow-400 to-orange-400",
    tracks: [
      { id: "6", title: "阳光灿烂的日子", artist: "快乐乐队", cover: "🌞", duration: "3:22", mood: "happy" },
      { id: "7", title: "午后漫步", artist: "清新小调", cover: "🚶", duration: "4:15", mood: "happy" },
      { id: "8", title: "冰淇淋的味道", artist: "夏日时光", cover: "🍦", duration: "3:48", mood: "happy" },
      { id: "9", title: "彩虹糖", artist: "甜蜜旋律", cover: "🌈", duration: "4:02", mood: "happy" },
      { id: "10", title: "跳跃的音符", artist: "活力四射", cover: "🎶", duration: "3:30", mood: "happy" },
    ],
  },
  {
    id: "deep-thoughts",
    name: "深度思考",
    description: "适合写深度日记的背景音乐",
    cover: "💭",
    mood: "reflective",
    color: "from-purple-500 to-indigo-500",
    tracks: [
      { id: "11", title: "星光独白", artist: "夜思者", cover: "✨", duration: "5:45", mood: "reflective" },
      { id: "12", title: "雨声敲窗", artist: "城市夜曲", cover: "🌧️", duration: "6:30", mood: "reflective" },
      { id: "13", title: "内心独白", artist: "钢琴冥想", cover: "🎹", duration: "4:55", mood: "reflective" },
      { id: "14", title: "深夜电台", artist: "爵士夜话", cover: "📻", duration: "5:12", mood: "reflective" },
      { id: "15", title: "回忆长廊", artist: "时光漫步", cover: "🖼️", duration: "4:38", mood: "reflective" },
    ],
  },
  {
    id: "gentle-comfort",
    name: "温柔陪伴",
    description: "忧伤时的治愈旋律",
    cover: "🤗",
    mood: "sad",
    color: "from-slate-400 to-gray-500",
    tracks: [
      { id: "16", title: "雨后的彩虹", artist: "治愈系", cover: "🌈", duration: "4:20", mood: "sad" },
      { id: "17", title: "温暖的拥抱", artist: "温柔时光", cover: "🫂", duration: "5:15", mood: "sad" },
      { id: "18", title: "泪水之后", artist: "新生", cover: "💧", duration: "4:45", mood: "sad" },
      { id: "19", title: "星空下的安慰", artist: "夜语", cover: "🌙", duration: "5:30", mood: "sad" },
      { id: "20", title: "明天的太阳", artist: "希望之光", cover: "🌅", duration: "4:10", mood: "sad" },
    ],
  },
  {
    id: "energy-boost",
    name: "能量满满",
    description: "激发创造力和活力",
    cover: "⚡",
    mood: "energetic",
    color: "from-pink-500 to-rose-500",
    tracks: [
      { id: "21", title: "闪电风暴", artist: "电子脉冲", cover: "⚡", duration: "3:45", mood: "energetic" },
      { id: "22", title: "跑步者的高潮", artist: "运动节拍", cover: "🏃", duration: "4:20", mood: "energetic" },
      { id: "23", title: "无限可能", artist: "梦想驱动", cover: "🚀", duration: "3:55", mood: "energetic" },
      { id: "24", title: "节拍星球", artist: "未来之声", cover: "🪐", duration: "4:30", mood: "energetic" },
      { id: "25", title: "燃起来", artist: "热血沸腾", cover: "🔥", duration: "3:38", mood: "energetic" },
    ],
  },
  {
    id: "romantic-moments",
    name: "浪漫时光",
    description: "记录爱与温暖的时刻",
    cover: "💕",
    mood: "romantic",
    color: "from-rose-400 to-pink-400",
    tracks: [
      { id: "26", title: "月光下的告白", artist: "爱情故事", cover: "🌙", duration: "4:15", mood: "romantic" },
      { id: "27", title: "玫瑰花园", artist: "浪漫钢琴", cover: "🌹", duration: "5:02", mood: "romantic" },
      { id: "28", title: "心跳的节奏", artist: "甜蜜旋律", cover: "💗", duration: "3:48", mood: "romantic" },
      { id: "29", title: "夕阳漫步", artist: "温柔时光", cover: "🌅", duration: "4:35", mood: "romantic" },
      { id: "30", title: "两个人的世界", artist: "爱的乐章", cover: "💑", duration: "5:10", mood: "romantic" },
    ],
  },
  {
    id: "focus-zone",
    name: "专注时刻",
    description: "帮助集中注意力的白噪音",
    cover: "🎯",
    mood: "focused",
    color: "from-green-500 to-emerald-500",
    tracks: [
      { id: "31", title: "咖啡厅氛围", artist: "环境音", cover: "☕", duration: "10:00", mood: "focused" },
      { id: "32", title: "图书馆", artist: "安静空间", cover: "📚", duration: "8:30", mood: "focused" },
      { id: "33", title: "森林雨声", artist: "自然白噪音", cover: "🌲", duration: "12:00", mood: "focused" },
      { id: "34", title: "海浪轻拍", artist: "海洋之声", cover: "🌊", duration: "15:00", mood: "focused" },
      { id: "35", title: "深夜办公室", artist: "城市声音", cover: "🌃", duration: "9:45", mood: "focused" },
    ],
  },
  {
    id: "nostalgic-journey",
    name: "怀旧之旅",
    description: "穿越时光的旋律",
    cover: "🕰️",
    mood: "nostalgic",
    color: "from-amber-400 to-orange-400",
    tracks: [
      { id: "36", title: "老照片", artist: "时光机器", cover: "📷", duration: "4:40", mood: "nostalgic" },
      { id: "37", title: "童年记忆", artist: "纯真年代", cover: "🎈", duration: "5:15", mood: "nostalgic" },
      { id: "38", title: "校园时光", artist: "青春纪念", cover: "🎒", duration: "4:28", mood: "nostalgic" },
      { id: "39", title: "故乡的路", artist: "思乡曲", cover: "🏠", duration: "5:50", mood: "nostalgic" },
      { id: "40", title: "旧时光电台", artist: "岁月留声", cover: "📻", duration: "4:12", mood: "nostalgic" },
    ],
  },
];

// 当前播放状态
interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentPlaylist: Playlist | null;
  progress: number;
  volume: number;
}

export default function DiaryRadioPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"mood-select" | "playlist" | "player">("mood-select");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [player, setPlayer] = useState<PlayerState>({
    isPlaying: false,
    currentTrack: null,
    currentPlaylist: null,
    progress: 0,
    volume: 80,
  });
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPlaylists(MOCK_PLAYLISTS);
  }, []);

  // 选择心情
  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    const matchingPlaylists = playlists.filter(p => p.mood === moodId);
    if (matchingPlaylists.length > 0) {
      setCurrentPlaylist(matchingPlaylists[0]);
    }
    setCurrentView("playlist");
  };

  // 播放曲目
  const playTrack = (track: Track, playlist: Playlist) => {
    setPlayer({
      ...player,
      isPlaying: true,
      currentTrack: track,
      currentPlaylist: playlist,
      progress: 0,
    });
    startProgress();
  };

  // 开始进度条
  const startProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    progressInterval.current = setInterval(() => {
      setPlayer(prev => {
        if (prev.progress >= 100) {
          // 自动播放下一首
          return { ...prev, progress: 0 };
        }
        return { ...prev, progress: prev.progress + 0.5 };
      });
    }, 100);
  };

  // 暂停/播放
  const togglePlay = () => {
    if (player.isPlaying) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      startProgress();
    }
    setPlayer(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  // 返回心情选择
  const backToMoodSelect = () => {
    setCurrentView("mood-select");
    setSelectedMood(null);
    setCurrentPlaylist(null);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setPlayer(prev => ({ ...prev, isPlaying: false, progress: 0 }));
  };

  // 播放整个列表
  const playPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist);
    }
  };

  // 上一首
  const prevTrack = () => {
    if (!player.currentTrack || !player.currentPlaylist) return;
    const currentIndex = player.currentPlaylist.tracks.findIndex(t => t.id === player.currentTrack?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : player.currentPlaylist.tracks.length - 1;
    playTrack(player.currentPlaylist.tracks[prevIndex], player.currentPlaylist);
  };

  // 下一首
  const nextTrack = () => {
    if (!player.currentTrack || !player.currentPlaylist) return;
    const currentIndex = player.currentPlaylist.tracks.findIndex(t => t.id === player.currentTrack?.id);
    const nextIndex = currentIndex < player.currentPlaylist.tracks.length - 1 ? currentIndex + 1 : 0;
    playTrack(player.currentPlaylist.tracks[nextIndex], player.currentPlaylist);
  };

  // 获取当前心情信息
  const currentMoodInfo = MOODS.find(m => m.id === selectedMood);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentMoodInfo?.color || 'from-indigo-900 via-purple-900 to-pink-900'}`}>
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        {/* 音符装饰 */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/10 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          >
            {["♪", "♫", "♬", "🎵", "🎶"][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">日记音乐电台</h1>
                <p className="text-xs text-white/60">让音乐陪伴你的写作时光</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentView !== "mood-select" && (
                <button
                  onClick={backToMoodSelect}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                >
                  换个心情
                </button>
              )}
              <Link
                href="/chat-diary"
                className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm hover:bg-white/30 transition-colors"
              >
                📝 写日记
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-8">
        {/* 心情选择视图 */}
        {currentView === "mood-select" && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🎵</div>
              <h2 className="text-3xl font-bold text-white mb-4">你现在的心情如何？</h2>
              <p className="text-white/60">选择你的心情，我们为你推荐最适合的音乐</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className="group relative overflow-hidden rounded-2xl p-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all hover:scale-105 hover:bg-white/20"
                >
                  <div className="text-4xl mb-3">{mood.emoji}</div>
                  <div className="text-lg font-bold text-white">{mood.name}</div>
                  <div className="text-sm text-white/60 mt-1">{mood.desc}</div>
                  
                  {/* 悬浮效果 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                </button>
              ))}
            </div>

            {/* 快速开始 */}
            <div className="text-center mt-12">
              <p className="text-white/40 text-sm mb-4">不确定？试试这些：</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleMoodSelect("calm")}
                  className="px-4 py-2 rounded-full bg-blue-500/30 text-white/80 text-sm hover:bg-blue-500/50 transition-colors"
                >
                  🌅 早安电台
                </button>
                <button
                  onClick={() => handleMoodSelect("reflective")}
                  className="px-4 py-2 rounded-full bg-purple-500/30 text-white/80 text-sm hover:bg-purple-500/50 transition-colors"
                >
                  🌙 深夜电台
                </button>
                <button
                  onClick={() => handleMoodSelect("focused")}
                  className="px-4 py-2 rounded-full bg-green-500/30 text-white/80 text-sm hover:bg-green-500/50 transition-colors"
                >
                  🎯 专注电台
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 播放列表视图 */}
        {currentView === "playlist" && currentPlaylist && (
          <div className="animate-fadeIn">
            {/* 播放列表头部 */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-48 h-48 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl">
                {currentPlaylist.cover}
              </div>
              <div className="flex-1">
                <div className="text-white/60 text-sm mb-2">播放列表</div>
                <h2 className="text-3xl font-bold text-white mb-2">{currentPlaylist.name}</h2>
                <p className="text-white/70 mb-4">{currentPlaylist.description}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => playPlaylist(currentPlaylist)}
                    className="px-6 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-white/90 transition-colors flex items-center gap-2"
                  >
                    <span>▶️</span>
                    <span>播放全部</span>
                  </button>
                  <button
                    onClick={() => {
                      // 随机播放
                      const randomIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
                      playTrack(currentPlaylist.tracks[randomIndex], currentPlaylist);
                    }}
                    className="px-6 py-3 rounded-full bg-white/20 text-white font-bold hover:bg-white/30 transition-colors flex items-center gap-2"
                  >
                    <span>🔀</span>
                    <span>随机播放</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 曲目列表 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
              {currentPlaylist.tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, currentPlaylist)}
                  className={`flex items-center gap-4 p-4 hover:bg-white/10 cursor-pointer transition-colors ${
                    player.currentTrack?.id === track.id ? "bg-white/20" : ""
                  }`}
                >
                  <div className="w-8 text-center text-white/40">
                    {player.currentTrack?.id === track.id && player.isPlaying ? (
                      <span className="text-white">🎵</span>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-xl">
                    {track.cover}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${player.currentTrack?.id === track.id ? "text-white" : "text-white/80"}`}>
                      {track.title}
                    </div>
                    <div className="text-sm text-white/50">{track.artist}</div>
                  </div>
                  <div className="text-white/40 text-sm">{track.duration}</div>
                  <div className="text-white/40">
                    {player.currentTrack?.id === track.id && player.isPlaying ? (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: "0s" }} />
                        <span className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: "0.1s" }} />
                        <span className="w-1 h-5 bg-white animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <span className="w-1 h-2 bg-white animate-pulse" style={{ animationDelay: "0.3s" }} />
                      </div>
                    ) : (
                      <span>▶️</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 其他推荐 */}
            <div className="mt-8">
              <h3 className="text-white/60 text-sm mb-4">更多推荐</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {playlists
                  .filter(p => p.mood === selectedMood && p.id !== currentPlaylist.id)
                  .slice(0, 4)
                  .map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => {
                        setCurrentPlaylist(playlist);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors text-left"
                    >
                      <div className="text-3xl mb-2">{playlist.cover}</div>
                      <div className="text-white font-medium text-sm">{playlist.name}</div>
                      <div className="text-white/50 text-xs mt-1">{playlist.tracks.length} 首</div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部播放器 */}
      {player.currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10">
          {/* 进度条 */}
          <div className="h-1 bg-white/20">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${player.progress}%` }}
            />
          </div>

          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* 曲目信息 */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
                  {player.currentTrack.cover}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-medium truncate">{player.currentTrack.title}</div>
                  <div className="text-white/50 text-sm truncate">{player.currentTrack.artist}</div>
                </div>
              </div>

              {/* 播放控制 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevTrack}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                >
                  ⏮️
                </button>
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors text-xl"
                >
                  {player.isPlaying ? "⏸️" : "▶️"}
                </button>
                <button
                  onClick={nextTrack}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                >
                  ⏭️
                </button>
              </div>

              {/* 音量 */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-white/50">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={player.volume}
                  onChange={(e) => setPlayer(prev => ({ ...prev, volume: Number(e.target.value) }))}
                  className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
              </div>

              {/* 写日记入口 */}
              <Link
                href="/chat-diary"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm hover:bg-white/20 transition-colors"
              >
                <span>📝</span>
                <span>写日记</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 自定义动画样式 */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}