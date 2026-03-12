// 日记版本历史页面
export const dynamic = 'force-dynamic';

import { getDiary } from "@/lib/diaries";
import { getVersions, getVersionStats, getVersion, compareVersions } from "@/lib/versions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DiaryHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  const diary = await getDiary(params.id);

  if (!diary) {
    notFound();
  }

  const versions = getVersions(params.id);
  const stats = getVersionStats(params.id);

  // 如果没有版本历史，初始化一个
  const displayVersions = versions.length > 0 ? versions : [{
    id: `ver_${params.id}_1`,
    diaryId: params.id,
    versionNumber: 1,
    title: diary.title,
    content: diary.content,
    tags: diary.tags || [],
    changedAt: diary.date || new Date().toISOString(),
    changedBy: diary.author || "我",
    changeReason: "当前版本",
    wordCount: diary.content?.length || 0,
    checksum: ""
  }];

  // 计算字数变化
  const wordCountChanges = displayVersions.map((v, i) => {
    if (i === 0) return { change: 0, percent: 0 };
    const prevCount = displayVersions[i - 1].wordCount;
    const change = v.wordCount - prevCount;
    const percent = prevCount > 0 ? Math.round((change / prevCount) * 100) : 0;
    return { change, percent };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* 返回导航 */}
        <Link
          href={`/diary/${params.id}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-violet-600 mb-6 transition-colors"
        >
          <span>←</span>
          <span>返回日记</span>
        </Link>

        {/* 头部 */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-violet-200">
            📜
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">版本历史</h1>
            <p className="text-gray-500">{diary.title}</p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="text-2xl font-bold text-violet-600">{stats.totalVersions || 1}</div>
            <div className="text-sm text-gray-500">版本数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="text-2xl font-bold text-purple-600">{stats.totalChanges || 0}</div>
            <div className="text-sm text-gray-500">修改次数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="text-2xl font-bold text-fuchsia-600">{stats.averageWordCount || 0}</div>
            <div className="text-sm text-gray-500">平均字数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="text-2xl font-bold text-violet-600">{diary.content?.length || 0}</div>
            <div className="text-sm text-gray-500">当前字数</div>
          </div>
        </div>

        {/* 版本时间线 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🕐</span>
            <span>修改时间线</span>
          </h2>

          <div className="relative">
            {/* 时间线轴 */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-300 via-purple-300 to-fuchsia-300" />

            {/* 版本列表 */}
            <div className="space-y-6">
              {[...displayVersions].reverse().map((version, index) => {
                const actualIndex = displayVersions.length - 1 - index;
                const changeInfo = wordCountChanges[actualIndex];
                const isLatest = index === 0;
                const isFirst = actualIndex === 0;

                return (
                  <div key={version.id} className="relative pl-16">
                    {/* 时间线节点 */}
                    <div className={`absolute left-3 w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                      isLatest 
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg' 
                        : 'bg-white border-2 border-violet-300 text-violet-500'
                    }`}>
                      {version.versionNumber}
                    </div>

                    {/* 版本卡片 */}
                    <div className={`rounded-xl p-5 ${
                      isLatest 
                        ? 'bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200' 
                        : 'bg-gray-50 border border-gray-100'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {isFirst ? '初始版本' : isLatest ? '当前版本' : `版本 ${version.versionNumber}`}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {new Date(version.changedAt).toLocaleString('zh-CN')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-600">
                            {version.wordCount} 字
                          </div>
                          {changeInfo && changeInfo.change !== 0 && (
                            <div className={`text-xs mt-1 ${
                              changeInfo.change > 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {changeInfo.change > 0 ? '+' : ''}{changeInfo.change} ({changeInfo.percent}%)
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 标题 */}
                      <div className="mb-2">
                        <span className="text-gray-600 font-medium">{version.title}</span>
                      </div>

                      {/* 标签 */}
                      {version.tags && version.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {version.tags.map(tag => (
                            <span 
                              key={tag}
                              className="px-2 py-0.5 bg-violet-100 text-violet-600 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 修改原因 */}
                      {version.changeReason && (
                        <div className="text-sm text-gray-500 mb-3">
                          📝 {version.changeReason}
                        </div>
                      )}

                      {/* 内容预览 */}
                      <div className="text-sm text-gray-600 line-clamp-3 bg-white/50 rounded-lg p-3">
                        {version.content.substring(0, 200)}...
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex gap-2 mt-4">
                        <Link
                          href={`/diary/${params.id}/history/${version.versionNumber}`}
                          className="px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                        >
                          查看详情
                        </Link>
                        {!isLatest && (
                          <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                            恢复此版本
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 版本对比 */}
        {displayVersions.length > 1 && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔍</span>
              <span>版本对比</span>
            </h2>
            <div className="flex gap-4">
              <select 
                id="version1" 
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-300 focus:border-transparent"
              >
                {displayVersions.map(v => (
                  <option key={v.id} value={v.versionNumber}>
                    版本 {v.versionNumber} - {v.title.substring(0, 20)}...
                  </option>
                ))}
              </select>
              <span className="self-center text-gray-400">vs</span>
              <select 
                id="version2" 
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-300 focus:border-transparent"
              >
                {[...displayVersions].reverse().map(v => (
                  <option key={v.id} value={v.versionNumber}>
                    版本 {v.versionNumber} - {v.title.substring(0, 20)}...
                  </option>
                ))}
              </select>
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">
              开始对比
            </button>
          </div>
        )}

        {/* 底部提示 */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            💡 版本历史记录每次编辑，可以随时回滚到之前的版本
          </p>
        </div>
      </div>
    </div>
  );
}