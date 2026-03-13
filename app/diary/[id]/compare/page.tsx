'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Version {
  id: string;
  version: number;
  createdAt: string;
  title: string;
  content: string;
  wordCount: number;
  changeType: 'create' | 'edit' | 'major';
  changes?: {
    added: number;
    removed: number;
    unchanged: number;
  };
}

interface Diary {
  id: string;
  title: string;
  currentVersion: number;
  versions: Version[];
}

export default function DiaryComparePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [version1, setVersion1] = useState<string>('');
  const [version2, setVersion2] = useState<string>('');
  const [diff, setDiff] = useState<{ type: 'add' | 'remove' | 'unchanged'; text: string }[][]>([]);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified' | 'diff'>('diff');

  useEffect(() => {
    fetchDiary();
  }, [params.id]);

  useEffect(() => {
    const v1 = searchParams.get('v1');
    const v2 = searchParams.get('v2');
    if (v1) setVersion1(v1);
    if (v2) setVersion2(v2);
  }, [searchParams]);

  const fetchDiary = async () => {
    try {
      const res = await fetch(`/api/diaries/${params.id}/versions`);
      if (res.ok) {
        const data = await res.json();
        setDiary(data);
        
        // Set default versions (current vs previous)
        if (data.versions.length >= 2) {
          setVersion1(data.versions[1].id);
          setVersion2(data.versions[0].id);
        }
      }
    } catch (_error) {
      console.error('Failed to fetch diary versions:', _error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (version1 && version2 && diary) {
      calculateDiff();
    }
  }, [version1, version2, diary]);

  const calculateDiff = () => {
    const v1Data = diary?.versions.find(v => v.id === version1);
    const v2Data = diary?.versions.find(v => v.id === version2);
    
    if (!v1Data || !v2Data) return;

    // Simple line-by-line diff
    const lines1 = v1Data.content.split('\n');
    const lines2 = v2Data.content.split('\n');
    
    const diffResult: { type: 'add' | 'remove' | 'unchanged'; text: string }[][] = [[], []];
    
    // Simple diff algorithm
    let i = 0, j = 0;
    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        // Remaining lines in v2 are additions
        diffResult[1].push({ type: 'add', text: lines2[j] });
        j++;
      } else if (j >= lines2.length) {
        // Remaining lines in v1 are removals
        diffResult[0].push({ type: 'remove', text: lines1[i] });
        i++;
      } else if (lines1[i] === lines2[j]) {
        // Unchanged line
        diffResult[0].push({ type: 'unchanged', text: lines1[i] });
        diffResult[1].push({ type: 'unchanged', text: lines2[j] });
        i++;
        j++;
      } else {
        // Check if line was added or removed
        const foundInV1 = lines2.slice(j).indexOf(lines1[i]);
        const foundInV2 = lines1.slice(i).indexOf(lines2[j]);
        
        if (foundInV1 === -1 && foundInV2 === -1) {
          // Line changed
          diffResult[0].push({ type: 'remove', text: lines1[i] });
          diffResult[1].push({ type: 'add', text: lines2[j] });
          i++;
          j++;
        } else if (foundInV1 !== -1 && (foundInV2 === -1 || foundInV1 <= foundInV2)) {
          // Lines added in v2
          diffResult[1].push({ type: 'add', text: lines2[j] });
          j++;
        } else {
          // Lines removed in v1
          diffResult[0].push({ type: 'remove', text: lines1[i] });
          i++;
        }
      }
    }
    
    setDiff(diffResult);
  };

  const getVersionLabel = (version: Version) => {
    const date = new Date(version.createdAt).toLocaleString('zh-CN');
    return `V${version.version} - ${date}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!diary) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">📝</div>
        <h1 className="text-2xl font-bold text-gray-800">日记不存在</h1>
        <Link href="/" className="text-purple-600 hover:text-purple-700">
          返回首页
        </Link>
      </div>
    );
  }

  const v1Data = diary.versions.find(v => v.id === version1);
  const v2Data = diary.versions.find(v => v.id === version2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/diary/${params.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              ←
            </Link>
            <div>
              <h1 className="text-xl font-bold">版本对比</h1>
              <p className="text-sm text-gray-500">{diary.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(['diff', 'side-by-side', 'unified'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  viewMode === mode
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {mode === 'diff' ? '差异视图' : mode === 'side-by-side' ? '并排视图' : '统一视图'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Version Selectors */}
        <div className="bg-white rounded-xl p-4 border flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">版本 A</label>
            <select
              value={version1}
              onChange={(e) => setVersion1(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {diary.versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {getVersionLabel(v)}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              const temp = version1;
              setVersion1(version2);
              setVersion2(temp);
            }}
            className="mt-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="交换版本"
          >
            ⇄
          </button>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">版本 B</label>
            <select
              value={version2}
              onChange={(e) => setVersion2(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {diary.versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {getVersionLabel(v)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Comparison */}
        {v1Data && v2Data && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-sm text-gray-500">字数变化</div>
              <div className="text-2xl font-bold mt-1">
                <span className={v2Data.wordCount > v1Data.wordCount ? 'text-green-500' : 'text-red-500'}>
                  {v2Data.wordCount > v1Data.wordCount ? '+' : ''}
                  {v2Data.wordCount - v1Data.wordCount}
                </span>
                <span className="text-sm text-gray-400 ml-2">
                  ({v1Data.wordCount} → {v2Data.wordCount})
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-sm text-gray-500">版本 A</div>
              <div className="text-2xl font-bold mt-1">{v1Data.wordCount} 字</div>
              <div className="text-sm text-gray-400">
                {new Date(v1Data.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-sm text-gray-500">版本 B</div>
              <div className="text-2xl font-bold mt-1">{v2Data.wordCount} 字</div>
              <div className="text-sm text-gray-400">
                {new Date(v2Data.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>
        )}

        {/* Diff View */}
        {viewMode === 'diff' && diff.length === 2 && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="grid grid-cols-2 divide-x">
              {/* Left Panel - Version 1 */}
              <div>
                <div className="bg-red-50 px-4 py-2 border-b font-medium text-red-700">
                  {v1Data && getVersionLabel(v1Data)}
                </div>
                <div className="p-4 font-mono text-sm space-y-0.5 max-h-[600px] overflow-auto">
                  {diff[0].map((line, i) => (
                    <div
                      key={i}
                      className={`px-2 py-0.5 ${
                        line.type === 'remove'
                          ? 'bg-red-100 text-red-800'
                          : line.type === 'unchanged'
                          ? 'text-gray-600'
                          : 'bg-transparent'
                      }`}
                    >
                      <span className="inline-block w-6 text-gray-400 text-xs mr-2">
                        {line.type === 'remove' ? '-' : ' '}
                      </span>
                      {line.text || ' '}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel - Version 2 */}
              <div>
                <div className="bg-green-50 px-4 py-2 border-b font-medium text-green-700">
                  {v2Data && getVersionLabel(v2Data)}
                </div>
                <div className="p-4 font-mono text-sm space-y-0.5 max-h-[600px] overflow-auto">
                  {diff[1].map((line, i) => (
                    <div
                      key={i}
                      className={`px-2 py-0.5 ${
                        line.type === 'add'
                          ? 'bg-green-100 text-green-800'
                          : line.type === 'unchanged'
                          ? 'text-gray-600'
                          : 'bg-transparent'
                      }`}
                    >
                      <span className="inline-block w-6 text-gray-400 text-xs mr-2">
                        {line.type === 'add' ? '+' : ' '}
                      </span>
                      {line.text || ' '}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Side by Side View */}
        {viewMode === 'side-by-side' && v1Data && v2Data && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b font-medium">
                {getVersionLabel(v1Data)}
              </div>
              <div className="p-4 prose max-w-none max-h-[600px] overflow-auto">
                {v1Data.content.split('\n').map((line, i) => (
                  <p key={i}>{line || '\u00A0'}</p>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b font-medium">
                {getVersionLabel(v2Data)}
              </div>
              <div className="p-4 prose max-w-none max-h-[600px] overflow-auto">
                {v2Data.content.split('\n').map((line, i) => (
                  <p key={i}>{line || '\u00A0'}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Unified View */}
        {viewMode === 'unified' && diff.length === 2 && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b font-medium">
              统一差异视图
            </div>
            <div className="p-4 font-mono text-sm space-y-0.5 max-h-[600px] overflow-auto">
              {diff[0].map((line, i) => (
                <div
                  key={`left-${i}`}
                  className={`px-2 py-0.5 ${
                    line.type === 'remove'
                      ? 'bg-red-100 text-red-800'
                      : 'text-gray-600'
                  }`}
                >
                  <span className="inline-block w-6 text-gray-400 text-xs mr-2">
                    {line.type === 'remove' ? '-' : ' '}
                  </span>
                  {line.text || ' '}
                </div>
              ))}
              {diff[1].filter(l => l.type === 'add').map((line, i) => (
                <div
                  key={`right-${i}`}
                  className="px-2 py-0.5 bg-green-100 text-green-800"
                >
                  <span className="inline-block w-6 text-gray-400 text-xs mr-2">+</span>
                  {line.text || ' '}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}