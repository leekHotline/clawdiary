// 日记对比页面 - 对比两篇日记的差异
export const dynamic = 'force-dynamic';

import { getDiaries } from "@/lib/diaries";
import Link from "next/link";

export const metadata = {
  title: '日记对比 - Claw Diary',
  description: '对比两篇日记的差异'
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const diaries = await getDiaries();
  const leftId = typeof searchParams.left === 'string' ? parseInt(searchParams.left) : null;
  const rightId = typeof searchParams.right === 'string' ? parseInt(searchParams.right) : null;

  const leftDiary = leftId ? diaries.find(d => d.id === leftId) : null;
  const rightDiary = rightId ? diaries.find(d => d.id === rightId) : null;

  // 计算差异
  const getDifferences = (left: string, right: string) => {
    const leftLines = left.split('\n');
    const rightLines = right.split('\n');
    const maxLen = Math.max(leftLines.length, rightLines.length);
    
    const result: Array<{
      type: 'same' | 'add' | 'remove' | 'change';
      left?: string;
      right?: string;
      leftNum: number;
      rightNum: number;
    }> = [];
    
    let leftIdx = 0;
    let rightIdx = 0;
    
    while (leftIdx < leftLines.length || rightIdx < rightLines.length) {
      const leftLine = leftLines[leftIdx];
      const rightLine = rightLines[rightIdx];
      
      if (leftIdx >= leftLines.length) {
        result.push({ type: 'add', right: rightLine, leftNum: 0, rightNum: rightIdx + 1 });
        rightIdx++;
      } else if (rightIdx >= rightLines.length) {
        result.push({ type: 'remove', left: leftLine, leftNum: leftIdx + 1, rightNum: 0 });
        leftIdx++;
      } else if (leftLine === rightLine) {
        result.push({ type: 'same', left: leftLine, right: rightLine, leftNum: leftIdx + 1, rightNum: rightIdx + 1 });
        leftIdx++;
        rightIdx++;
      } else {
        // 检查是否是修改还是插入/删除
        const leftInRight = rightLines.slice(rightIdx).indexOf(leftLine);
        const rightInLeft = leftLines.slice(leftIdx).indexOf(rightLine);
        
        if (leftInRight === -1 && rightInLeft === -1) {
          result.push({ type: 'change', left: leftLine, right: rightLine, leftNum: leftIdx + 1, rightNum: rightIdx + 1 });
          leftIdx++;
          rightIdx++;
        } else if (leftInRight !== -1 && (rightInLeft === -1 || leftInRight <= rightInLeft)) {
          // 右侧添加了行
          for (let i = 0; i < leftInRight; i++) {
            result.push({ type: 'add', right: rightLines[rightIdx + i], leftNum: 0, rightNum: rightIdx + i + 1 });
          }
          rightIdx += leftInRight;
        } else {
          // 左侧删除了行
          for (let i = 0; i < rightInLeft!; i++) {
            result.push({ type: 'remove', left: leftLines[leftIdx + i], leftNum: leftIdx + i + 1, rightNum: 0 });
          }
          leftIdx += rightInLeft!;
        }
      }
    }
    
    return result;
  };

  const differences = leftDiary && rightDiary 
    ? getDifferences(leftDiary.content || '', rightDiary.content || '')
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl">🦞</Link>
              <div>
                <h1 className="text-xl font-bold text-gray-800">日记对比</h1>
                <p className="text-sm text-gray-500">对比两篇日记的差异</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/stats"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                📊 统计
              </Link>
              <Link
                href="/timeline"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ⏳ 时间线
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 选择器 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左侧选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 左侧日记 (旧版)
              </label>
              <select
                name="left"
                form="compare-form"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                defaultValue={leftId || ''}
              >
                <option value="">选择日记...</option>
                {diaries
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map(d => (
                    <option key={d.id} value={d.id}>
                      {d.date} - {d.title}
                    </option>
                  ))}
              </select>
              {leftDiary && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-800">{leftDiary.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {leftDiary.date} · {leftDiary.content?.length || 0} 字
                    {leftDiary.tags && leftDiary.tags.length > 0 && (
                      <span className="ml-2">{leftDiary.tags.map(t => `#${t}`).join(' ')}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 右侧选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 右侧日记 (新版)
              </label>
              <select
                name="right"
                form="compare-form"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                defaultValue={rightId || ''}
              >
                <option value="">选择日记...</option>
                {diaries
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map(d => (
                    <option key={d.id} value={d.id}>
                      {d.date} - {d.title}
                    </option>
                  ))}
              </select>
              {rightDiary && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-800">{rightDiary.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {rightDiary.date} · {rightDiary.content?.length || 0} 字
                    {rightDiary.tags && rightDiary.tags.length > 0 && (
                      <span className="ml-2">{rightDiary.tags.map(t => `#${t}`).join(' ')}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <form id="compare-form" className="mt-4">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-200"
            >
              🔍 开始对比
            </button>
          </form>
        </div>

        {/* 对比结果 */}
        {leftDiary && rightDiary && differences && (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <div className="text-2xl font-bold text-gray-800">{leftDiary.content?.length || 0}</div>
                <div className="text-sm text-gray-500">左侧字数</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <div className="text-2xl font-bold text-gray-800">{rightDiary.content?.length || 0}</div>
                <div className="text-sm text-gray-500">右侧字数</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <div className="text-2xl font-bold text-green-600">
                  +{differences.filter(d => d.type === 'add').length}
                </div>
                <div className="text-sm text-gray-500">新增行</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <div className="text-2xl font-bold text-red-600">
                  -{differences.filter(d => d.type === 'remove').length}
                </div>
                <div className="text-sm text-gray-500">删除行</div>
              </div>
            </div>

            {/* 元数据对比 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📋 元数据对比</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">标题</td>
                      <td className={`py-2 text-right ${leftDiary.title !== rightDiary.title ? 'bg-yellow-50' : ''}`}>
                        {leftDiary.title}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">日期</td>
                      <td className="py-2 text-right">{leftDiary.date}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">心情</td>
                      <td className={`py-2 text-right ${leftDiary.mood !== rightDiary.mood ? 'bg-yellow-50' : ''}`}>
                        {leftDiary.mood || '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">天气</td>
                      <td className={`py-2 text-right ${leftDiary.weather !== rightDiary.weather ? 'bg-yellow-50' : ''}`}>
                        {leftDiary.weather || '-'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-500">标签</td>
                      <td className={`py-2 text-right ${JSON.stringify(leftDiary.tags) !== JSON.stringify(rightDiary.tags) ? 'bg-yellow-50' : ''}`}>
                        {leftDiary.tags?.join(', ') || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">标题</td>
                      <td className={`py-2 text-right ${leftDiary.title !== rightDiary.title ? 'bg-yellow-50' : ''}`}>
                        {rightDiary.title}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">日期</td>
                      <td className="py-2 text-right">{rightDiary.date}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">心情</td>
                      <td className={`py-2 text-right ${leftDiary.mood !== rightDiary.mood ? 'bg-yellow-50' : ''}`}>
                        {rightDiary.mood || '-'}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-gray-500">天气</td>
                      <td className={`py-2 text-right ${leftDiary.weather !== rightDiary.weather ? 'bg-yellow-50' : ''}`}>
                        {rightDiary.weather || '-'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-500">标签</td>
                      <td className={`py-2 text-right ${JSON.stringify(leftDiary.tags) !== JSON.stringify(rightDiary.tags) ? 'bg-yellow-50' : ''}`}>
                        {rightDiary.tags?.join(', ') || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 内容对比 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">📝 内容对比</h2>
                <p className="text-sm text-gray-500">
                  共 {differences.length} 行，{differences.filter(d => d.type === 'same').length} 行相同，
                  <span className="text-green-600"> {differences.filter(d => d.type === 'add').length} 行新增</span>，
                  <span className="text-red-600"> {differences.filter(d => d.type === 'remove').length} 行删除</span>，
                  <span className="text-yellow-600"> {differences.filter(d => d.type === 'change').length} 行修改</span>
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {differences.slice(0, 200).map((diff, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-2 gap-0 ${
                      diff.type === 'add' ? 'bg-green-50' :
                      diff.type === 'remove' ? 'bg-red-50' :
                      diff.type === 'change' ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <div className={`px-4 py-2 font-mono text-sm border-r border-gray-100 ${
                      diff.type === 'remove' ? 'bg-red-100/50' :
                      diff.type === 'change' ? 'bg-yellow-100/50' : ''
                    }`}>
                      <span className="text-gray-400 mr-2">{diff.leftNum || ''}</span>
                      {diff.type === 'remove' && <span className="text-red-500 mr-1">-</span>}
                      {diff.type === 'change' && <span className="text-yellow-500 mr-1">~</span>}
                      <span className={diff.type === 'remove' ? 'text-red-700 line-through' : 'text-gray-700'}>
                        {diff.left || ''}
                      </span>
                    </div>
                    <div className={`px-4 py-2 font-mono text-sm ${
                      diff.type === 'add' ? 'bg-green-100/50' :
                      diff.type === 'change' ? 'bg-yellow-100/50' : ''
                    }`}>
                      <span className="text-gray-400 mr-2">{diff.rightNum || ''}</span>
                      {diff.type === 'add' && <span className="text-green-500 mr-1">+</span>}
                      {diff.type === 'change' && <span className="text-yellow-500 mr-1">~</span>}
                      <span className={diff.type === 'add' ? 'text-green-700' : 'text-gray-700'}>
                        {diff.right || ''}
                      </span>
                    </div>
                  </div>
                ))}
                {differences.length > 200 && (
                  <div className="px-4 py-8 text-center text-gray-500">
                    ... 还有 {differences.length - 200} 行未显示 ...
                  </div>
                )}
              </div>
            </div>

            {/* 快速导航 */}
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href={`/diary/${leftDiary.id}`}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                📖 查看左侧日记
              </Link>
              <Link
                href={`/diary/${rightDiary.id}`}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                📖 查看右侧日记
              </Link>
            </div>
          </>
        )}

        {/* 未选择时的提示 */}
        {(!leftDiary || !rightDiary) && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">选择两篇日记进行对比</h2>
            <p className="text-gray-500">
              在上方选择器中选择两篇日记，点击"开始对比"查看差异
            </p>
          </div>
        )}
      </main>
    </div>
  );
}