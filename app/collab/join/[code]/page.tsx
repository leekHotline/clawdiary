"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface InviteInfo {
  invite: {
    code: string;
    collabId: string;
    collabTitle: string;
    createdBy: string;
    maxUses: number;
    usedCount: number;
    expiresAt: string | null;
  };
  collab: {
    id: string;
    title: string;
    contributors: number;
    maxContributors: number;
    status: string;
  };
}

export default function JoinCollabPage() {
  const params = useParams();
  const code = params.code as string;
  
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  
  // 用户信息表单
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("👤");
  
  const avatars = ["👤", "🧑‍💻", "🦞", "🦊", "🐱", "🐶", "🐸", "🦉", "🐙", "🦄", "🌟", "🎭"];

  useEffect(() => {
    fetchInviteInfo();
  }, [code]);

  const fetchInviteInfo = async () => {
    try {
      const res = await fetch(`/api/collab/join/${code}`);
      const data = await res.json();
      
      if (data.success) {
        setInviteInfo(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("加载邀请信息失败");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!userName.trim()) {
      alert("请输入你的名字");
      return;
    }
    
    setJoining(true);
    
    try {
      const res = await fetch(`/api/collab/join/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: `user-${Date.now()}`,
          userName: userName.trim(),
          userAvatar
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setJoined(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("加入失败，请稍后重试");
    } finally {
      setJoining(false);
    }
  };

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🤝</div>
          <p className="text-gray-500">加载邀请信息...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error && !inviteInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">邀请无效</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/collab"
            className="inline-block px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600"
          >
            查看其他协作
          </Link>
        </div>
      </div>
    );
  }

  // 已加入成功
  if (joined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">加入成功！</h1>
          <p className="text-gray-500 mb-6">
            你已成功加入「{inviteInfo?.collab.title}」
          </p>
          <Link
            href={`/collab/${inviteInfo?.collab.id}`}
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg"
          >
            前往协作
          </Link>
        </div>
      </div>
    );
  }

  // 邀请信息展示
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-md mx-auto px-6 pt-16 pb-16">
        {/* 邀请卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center mb-8">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            你被邀请加入协作！
          </h1>
          <p className="text-gray-500 mb-6">
            一起创造精彩内容
          </p>

          {/* 协作信息 */}
          <div className="bg-purple-50 rounded-2xl p-5 mb-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-3">
              {inviteInfo?.collab.title}
            </h2>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>👥</span>
                <span>{inviteInfo?.collab.contributors}/{inviteInfo?.collab.maxContributors}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📋</span>
                <span>{inviteInfo?.invite.code}</span>
              </div>
            </div>
          </div>

          {/* 邀请码状态 */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-6">
            <span>已使用 {inviteInfo?.invite.usedCount}/{inviteInfo?.invite.maxUses} 次</span>
            {inviteInfo?.invite.expiresAt && (
              <>
                <span>·</span>
                <span>
                  {new Date(inviteInfo.invite.expiresAt) > new Date() 
                    ? `${Math.ceil((new Date(inviteInfo.invite.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} 天后过期`
                    : "已过期"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 加入表单 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            设置你的信息
          </h3>

          {/* 名字输入 */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              你的名字
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="输入你想显示的名字"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* 头像选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              选择头像
            </label>
            <div className="flex flex-wrap gap-2">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setUserAvatar(avatar)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                    userAvatar === avatar
                      ? "bg-purple-100 ring-2 ring-purple-400 scale-110"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* 加入按钮 */}
          <button
            onClick={handleJoin}
            disabled={!userName.trim() || joining}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {joining ? "加入中..." : "🤝 加入协作"}
          </button>
        </div>

        {/* 底部链接 */}
        <div className="mt-8 text-center">
          <Link href="/collab" className="text-sm text-gray-500 hover:text-purple-600">
            查看所有协作项目 →
          </Link>
        </div>
      </main>
    </div>
  );
}