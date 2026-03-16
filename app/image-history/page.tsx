'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ImageItem {
  id: string;
  prompt: string;
  model: string;
  seed: number;
  width: number;
  height: number;
  imageData: string;
  timestamp: string;
}

export default function ImageHistoryPage() {
  const [history, setHistory] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/txt2img');
      const data = await res.json();
      if (data.success && data.history) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    // 每 10 秒刷新一次
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [fetchHistory]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-slate-900 text-white p-6">
      {/* 导航 */}
      <div className="mb-6">
        <Link href="/" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
          <span>←</span>
          <span>返回首页</span>
        </Link>
      </div>

      {/* 标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🎨 图片生成历史</h1>
        <p className="text-gray-400">
          显示最近生成的图片（内存存储，重启后清空）
        </p>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      {/* 空状态 */}
      {!loading && history.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🖼️</div>
          <p>暂无生成记录</p>
          <p className="text-sm mt-2">去 <Link href="/txt2img" className="text-purple-400 hover:underline">生成图片</Link> 页面试试吧！</p>
        </div>
      )}

      {/* 图片网格 */}
      {!loading && history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              {/* 图片 */}
              <div className="aspect-square relative bg-black/20">
                <img
                  src={item.imageData}
                  alt={item.prompt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* 信息 */}
              <div className="p-3">
                <p className="text-sm text-gray-300 line-clamp-2 mb-2">{item.prompt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(item.timestamp)}</span>
                  <span>{item.width}×{item.height}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 图片 */}
            <div className="relative bg-black">
              <img
                src={selectedImage.imageData}
                alt={selectedImage.prompt}
                className="w-full max-h-[60vh] object-contain"
              />
            </div>
            
            {/* 信息 */}
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">📋 生成信息</h2>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Prompt:</span>
                  <p className="text-white mt-1">{selectedImage.prompt}</p>
                </div>
                <div>
                  <span className="text-gray-400">模型:</span>
                  <p className="text-white mt-1">{selectedImage.model}</p>
                </div>
                <div>
                  <span className="text-gray-400">尺寸:</span>
                  <p className="text-white mt-1">{selectedImage.width} × {selectedImage.height}</p>
                </div>
                <div>
                  <span className="text-gray-400">Seed:</span>
                  <p className="text-white mt-1">{selectedImage.seed}</p>
                </div>
                <div>
                  <span className="text-gray-400">时间:</span>
                  <p className="text-white mt-1">{new Date(selectedImage.timestamp).toLocaleString('zh-CN')}</p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedImage.imageData;
                    link.download = `${selectedImage.id}.png`;
                    link.click();
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                >
                  💾 下载图片
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedImage.prompt);
                    alert('Prompt 已复制！');
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                >
                  📋 复制 Prompt
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  ✕ 关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}