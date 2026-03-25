'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  extension: string;
  isNew?: boolean;
}

const exportFormats: ExportFormat[] = [
  {
    id: 'pdf',
    name: 'PDF',
    description: '精美排版，适合打印和分享',
    icon: '📕',
    extension: '.pdf',
    isNew: true
  },
  {
    id: 'markdown',
    name: 'Markdown',
    description: '保留格式的 Markdown 文件，适合博客和笔记软件',
    icon: '📝',
    extension: '.md'
  },
  {
    id: 'json',
    name: 'JSON',
    description: '结构化数据格式，适合开发者导入和备份',
    icon: '{ }',
    extension: '.json'
  },
  {
    id: 'html',
    name: 'HTML',
    description: '美观的网页格式，可以直接在浏览器查看',
    icon: '🌐',
    extension: '.html'
  },
  {
    id: 'txt',
    name: '纯文本',
    description: '简单文本格式，通用性最强',
    icon: '📄',
    extension: '.txt'
  },
  {
    id: 'csv',
    name: 'CSV',
    description: '表格格式，适合 Excel 和数据分析',
    icon: '📊',
    extension: '.csv'
  }
];

// PDF 导出模板配置
const pdfTemplates = [
  { id: 'elegant', name: '优雅经典', description: '简洁大气，适合日常记录', preview: '📖' },
  { id: 'modern', name: '现代简约', description: '现代排版，适合分享展示', preview: '✨' },
  { id: 'vintage', name: '复古日记', description: '怀旧风格，适合珍藏回忆', preview: '📜' },
  { id: 'minimal', name: '极简纯净', description: '纯净留白，适合专注阅读', preview: '☐' },
];

// 示例日记数据（实际项目中应从 API 获取）
const sampleDiaries = [
  {
    id: 1,
    title: '春日漫步',
    content: '今天阳光正好，微风不燥。走在公园的小路上，看着满树繁花，心情格外舒畅。春天就是这样，总能在不经意间给人惊喜。\n\n路过湖边时，看到几只鸭子悠闲地游来游去，突然觉得生活其实很简单，快乐就藏在日常的点点滴滴里。',
    date: '2026-03-25',
    mood: '😊',
    weather: '☀️',
    tags: ['春天', '公园', '散步']
  },
  {
    id: 2,
    title: '深夜思考',
    content: '夜深了，窗外星星点点。突然想起小时候在乡下看星星的日子，那时候没有那么多烦恼，只知道抬头数星星。\n\n现在虽然生活在城市，但偶尔也会怀念那段无忧无虑的时光。也许，保持童心是我们最该学会的事情。',
    date: '2026-03-24',
    mood: '🤔',
    weather: '🌙',
    tags: ['深夜', '回忆', '星空']
  },
  {
    id: 3,
    title: '新的开始',
    content: '今天是特别的一天。一个新的想法在脑海中萌芽，也许这就是转折点。\n\n不管结果如何，至少要勇敢尝试。人生不就是由无数个"开始"组成的吗？期待接下来的旅程。',
    date: '2026-03-23',
    mood: '💪',
    weather: '⛅',
    tags: ['新开始', '勇气', '期待']
  }
];

export default function ExportCenterPage() {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('elegant');
  const [diaryId, setDiaryId] = useState('');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any>(null);
  const [pdfProgress, setPdfProgress] = useState<string>('');
  const pdfPreviewRef = useRef<HTMLDivElement>(null);

  // 生成 PDF
  const generatePDF = async () => {
    setPdfProgress('正在准备数据...');
    
    // 获取日记数据
    const diaries = diaryId 
      ? sampleDiaries.filter(d => d.id === parseInt(diaryId))
      : sampleDiaries;
    
    if (diaries.length === 0) {
      alert('没有找到日记内容');
      return;
    }

    setPdfProgress('正在生成 PDF...');

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = margin;

      // 模板样式配置
      const templateStyles: Record<string, any> = {
        elegant: {
          titleFont: [24, '#1a1a2e'],
          bodyFont: [11, '#333333'],
          accent: '#6366f1',
          bg: '#fafafa'
        },
        modern: {
          titleFont: [22, '#0f172a'],
          bodyFont: [10, '#374151'],
          accent: '#ec4899',
          bg: '#ffffff'
        },
        vintage: {
          titleFont: [23, '#5c4033'],
          bodyFont: [11, '#4a4a4a'],
          accent: '#8b7355',
          bg: '#f5f0e8'
        },
        minimal: {
          titleFont: [20, '#111827'],
          bodyFont: [10, '#4b5563'],
          accent: '#6b7280',
          bg: '#ffffff'
        }
      };

      const style = templateStyles[selectedTemplate];

      // 添加背景色
      pdf.setFillColor(style.bg);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // 标题页
      pdf.setFontSize(28);
      pdf.setTextColor(style.titleFont[1]);
      pdf.text('我的日记', pageWidth / 2, pageHeight / 3, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setTextColor(style.bodyFont[1]);
      pdf.text(`${new Date().toLocaleDateString('zh-CN')} 导出`, pageWidth / 2, pageHeight / 3 + 12, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`共 ${diaries.length} 篇日记`, pageWidth / 2, pageHeight / 3 + 24, { align: 'center' });
      pdf.text(`模板: ${pdfTemplates.find(t => t.id === selectedTemplate)?.name}`, pageWidth / 2, pageHeight / 3 + 32, { align: 'center' });

      // 添加装饰线
      pdf.setDrawColor(style.accent);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight / 2 - 10, pageWidth - margin, pageHeight / 2 - 10);

      // 页脚
      pdf.setFontSize(9);
      pdf.setTextColor('#9ca3af');
      pdf.text('Generated by Claw Diary', pageWidth / 2, pageHeight - 15, { align: 'center' });

      // 新页面开始日记内容
      pdf.addPage();
      yPosition = margin;

      // 遍历日记
      for (let i = 0; i < diaries.length; i++) {
        const diary = diaries[i];
        setPdfProgress(`正在处理第 ${i + 1}/${diaries.length} 篇...`);

        // 检查是否需要新页
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        // 日记标题
        pdf.setFontSize(16);
        pdf.setTextColor(style.titleFont[1]);
        pdf.text(diary.title, margin, yPosition);
        yPosition += 8;

        // 元数据行
        if (includeMetadata) {
          pdf.setFontSize(9);
          pdf.setTextColor('#6b7280');
          const metaLine = `${diary.date}  ${diary.mood} ${diary.weather}  ${diary.tags.map(t => '#' + t).join(' ')}`;
          pdf.text(metaLine, margin, yPosition);
          yPosition += 6;
        }

        // 分隔线
        pdf.setDrawColor(style.accent);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, margin + 30, yPosition);
        yPosition += 6;

        // 正文
        pdf.setFontSize(style.bodyFont[0]);
        pdf.setTextColor(style.bodyFont[1]);
        const lines = pdf.splitTextToSize(diary.content, contentWidth);
        
        // 检查是否需要分页
        const lineHeight = 5;
        const totalHeight = lines.length * lineHeight;
        if (yPosition + totalHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.text(lines, margin, yPosition);
        yPosition += totalHeight + 12;

        // 日记间分隔
        if (i < diaries.length - 1) {
          yPosition += 5;
          pdf.setDrawColor('#e5e7eb');
          pdf.setLineWidth(0.1);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
        }
      }

      // 添加页码
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor('#9ca3af');
        pdf.text(`第 ${i} / ${totalPages} 页`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // 保存
      const filename = diaryId 
        ? `diary-${diaryId}.pdf`
        : `diaries-${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdf.save(filename);
      
      setPdfProgress('');
      
      // 记录历史
      setExportHistory(prev => [{
        format: 'pdf',
        diaryId: diaryId || '全部',
        timestamp: new Date().toISOString(),
        filename
      }, ...prev].slice(0, 10));

    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF 生成失败，请重试');
      setPdfProgress('');
    }
  };

  const handleExport = async () => {
    // PDF 特殊处理
    if (selectedFormat === 'pdf') {
      setExporting(true);
      await generatePDF();
      setExporting(false);
      return;
    }

    setExporting(true);
    try {
      const params = new URLSearchParams({
        format: selectedFormat,
        metadata: includeMetadata.toString()
      });
      
      if (diaryId) {
        params.set('diaryId', diaryId);
      }

      const response = await fetch(`/api/export/diaries?${params}`);
      
      if (!response.ok) {
        throw new Error('导出失败');
      }

      const content = await response.text();
      const filename = diaryId 
        ? `diary-${diaryId}${exportFormats.find(f => f.id === selectedFormat)?.extension}`
        : `diaries-export${exportFormats.find(f => f.id === selectedFormat)?.extension}`;

      // 创建下载
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 记录历史
      setExportHistory(prev => [{
        format: selectedFormat,
        diaryId: diaryId || '全部',
        timestamp: new Date().toISOString(),
        filename
      }, ...prev].slice(0, 10));

    } catch (_error) {
      console.error('Export failed:', _error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handlePreview = async () => {
    if (selectedFormat === 'pdf') {
      // PDF 预览显示模板预览
      setPreviewData({
        format: 'pdf',
        template: selectedTemplate,
        content: 'PDF 预览会在导出时生成精美的排版格式，包含标题页、目录和正文内容。'
      });
      return;
    }

    try {
      const params = new URLSearchParams({
        format: selectedFormat,
        metadata: includeMetadata.toString()
      });
      
      if (diaryId) {
        params.set('diaryId', diaryId);
      }

      const response = await fetch(`/api/export/diaries?${params}`);
      const content = await response.text();
      
      setPreviewData({
        format: selectedFormat,
        content: content.slice(0, 2000) + (content.length > 2000 ? '\n\n... (预览截断)' : ''),
        fullLength: content.length
      });
    } catch (_error) {
      console.error('Preview failed:', _error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:underline mb-2 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              📦 导出中心
            </h1>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
              NEW: PDF 导出
            </span>
          </div>
          <p className="text-gray-600 mt-2">批量导出日记，支持多种格式，安全备份你的珍贵回忆</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：导出配置 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 格式选择 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">📁 选择导出格式</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exportFormats.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all relative ${
                      selectedFormat === format.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {format.isNew && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        NEW
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{format.icon}</span>
                      <div>
                        <div className="font-medium text-gray-700">
                          {format.name}
                          <span className="text-xs text-gray-400 ml-2">{format.extension}</span>
                        </div>
                        <div className="text-xs text-gray-500">{format.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PDF 模板选择 */}
            {selectedFormat === 'pdf' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-medium text-gray-700 mb-4">🎨 选择 PDF 模板</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {pdfTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        selectedTemplate === template.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">{template.preview}</div>
                      <div className="font-medium text-gray-700 text-sm">{template.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 导出范围 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">🎯 导出范围</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    日记 ID（留空导出全部）
                  </label>
                  <input
                    type="number"
                    value={diaryId}
                    onChange={(e) => setDiaryId(e.target.value)}
                    placeholder="输入日记 ID 导出单篇"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="metadata"
                    checked={includeMetadata}
                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="metadata" className="text-sm text-gray-600">
                    包含元数据（日期、心情、天气、地点、标签等）
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePreview}
                    className="flex-1 py-3 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    👁️ 预览
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {exporting ? (pdfProgress || '⏳ 导出中...') : '📥 导出下载'}
                  </button>
                </div>
              </div>
            </div>

            {/* 预览 */}
            {previewData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium text-gray-700">👁️ 导出预览</h2>
                  {previewData.fullLength && (
                    <span className="text-xs text-gray-400">
                      共 {previewData.fullLength.toLocaleString()} 字符
                    </span>
                  )}
                </div>
                {previewData.format === 'pdf' ? (
                  <div className="bg-gradient-to-br from-indigo-100 to-pink-100 rounded-lg p-6 text-center">
                    <div className="text-6xl mb-4">📕</div>
                    <p className="text-gray-600 mb-2">PDF 模板: {pdfTemplates.find(t => t.id === previewData.template)?.name}</p>
                    <p className="text-sm text-gray-500">{previewData.content}</p>
                  </div>
                ) : (
                  <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 overflow-auto max-h-64 whitespace-pre-wrap">
                    {previewData.content}
                  </pre>
                )}
              </div>
            )}

            {/* PDF 预览区 */}
            {selectedFormat === 'pdf' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6" ref={pdfPreviewRef}>
                <h2 className="font-medium text-gray-700 mb-4">📄 PDF 效果预览</h2>
                <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                  <div className="w-48 bg-white shadow-lg rounded p-4 transform scale-90">
                    <div className="text-center border-b pb-3 mb-3">
                      <div className="text-lg font-bold text-gray-800">我的日记</div>
                      <div className="text-xs text-gray-400">{new Date().toLocaleDateString('zh-CN')}</div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-700">春日漫步</div>
                        <div className="text-xs text-gray-400">2026-03-25 😊 ☀️</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-3">今天阳光正好，微风不燥...</div>
                      </div>
                      <div className="border-t pt-2">
                        <div className="text-sm font-medium text-gray-700">深夜思考</div>
                        <div className="text-xs text-gray-400">2026-03-24 🤔 🌙</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：导出历史和说明 */}
          <div className="space-y-6">
            {/* 快捷导出 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">⚡ 快捷导出</h2>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setDiaryId('');
                    setSelectedFormat('pdf');
                    handleExport();
                  }}
                  className="w-full py-2 text-left px-3 rounded-lg hover:bg-pink-50 text-sm text-gray-600 flex items-center gap-2 border border-pink-100"
                >
                  <span>📕</span>
                  <span className="flex-1">全部日记 → PDF</span>
                  <span className="text-xs text-pink-500">NEW</span>
                </button>
                <button
                  onClick={() => {
                    setDiaryId('');
                    setSelectedFormat('markdown');
                    handleExport();
                  }}
                  className="w-full py-2 text-left px-3 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center gap-2"
                >
                  <span>📝</span>
                  <span>全部日记 → Markdown</span>
                </button>
                <button
                  onClick={() => {
                    setDiaryId('');
                    setSelectedFormat('json');
                    handleExport();
                  }}
                  className="w-full py-2 text-left px-3 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center gap-2"
                >
                  <span>{'{ }'}</span>
                  <span>全部日记 → JSON 备份</span>
                </button>
                <button
                  onClick={() => {
                    setDiaryId('');
                    setSelectedFormat('html');
                    handleExport();
                  }}
                  className="w-full py-2 text-left px-3 rounded-lg hover:bg-gray-50 text-sm text-gray-600 flex items-center gap-2"
                >
                  <span>🌐</span>
                  <span>全部日记 → 网页浏览</span>
                </button>
              </div>
            </div>

            {/* 导出历史 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">📋 导出历史</h2>
              {exportHistory.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">暂无导出记录</p>
              ) : (
                <div className="space-y-2">
                  {exportHistory.map((item, i) => (
                    <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{item.filename}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          item.format === 'pdf' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {item.format.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(item.timestamp).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PDF 特性说明 */}
            {selectedFormat === 'pdf' && (
              <div className="bg-gradient-to-br from-pink-500 to-indigo-500 rounded-xl p-6 text-white">
                <h3 className="font-medium mb-3">📕 PDF 导出特色</h3>
                <div className="text-sm text-white/90 space-y-2">
                  <p>✨ 精美封面和目录</p>
                  <p>✨ 多种模板风格可选</p>
                  <p>✨ 保留心情、天气、标签</p>
                  <p>✨ 自动分页和页码</p>
                  <p>✨ 适合打印和分享</p>
                </div>
              </div>
            )}

            {/* 使用说明 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-medium text-gray-700 mb-3">💡 格式说明</h3>
              <div className="text-sm text-gray-500 space-y-2">
                <p><strong className="text-pink-600">PDF</strong>: 适合打印、分享、存档</p>
                <p><strong>Markdown</strong>: 适合导入到 Obsidian、Notion</p>
                <p><strong>JSON</strong>: 适合数据备份和程序导入</p>
                <p><strong>HTML</strong>: 美观格式，可直接浏览</p>
                <p><strong>CSV</strong>: 可用 Excel 进行数据分析</p>
              </div>
            </div>

            {/* 统计 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-medium text-gray-700 mb-4">📊 导出统计</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">支持格式</span>
                  <span className="font-medium text-indigo-600">6 种</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">本次导出</span>
                  <span className="font-medium text-indigo-600">
                    {diaryId ? '单篇' : '全部'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">历史导出</span>
                  <span className="font-medium text-indigo-600">{exportHistory.length} 次</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 格式对比 */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-medium text-gray-700 mb-4">📈 格式对比</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">格式</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">优点</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">适用场景</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">兼容性</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-50 bg-pink-50">
                  <td className="py-3 px-4">📕 PDF <span className="text-xs text-pink-500">NEW</span></td>
                  <td className="py-3 px-4">精美排版，适合打印分享</td>
                  <td className="py-3 px-4">打印、分享、存档</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-3 px-4">📝 Markdown</td>
                  <td className="py-3 px-4">保留格式，易读易编辑</td>
                  <td className="py-3 px-4">博客、笔记软件、Git</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-3 px-4"> JSON</td>
                  <td className="py-3 px-4">结构化数据，完整保留所有信息</td>
                  <td className="py-3 px-4">数据备份、开发导入</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-3 px-4">🌐 HTML</td>
                  <td className="py-3 px-4">美观排版，支持样式</td>
                  <td className="py-3 px-4">网页浏览、分享</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-3 px-4">📄 纯文本</td>
                  <td className="py-3 px-4">最小体积，最大兼容</td>
                  <td className="py-3 px-4">任何文本编辑器</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">📊 CSV</td>
                  <td className="py-3 px-4">表格形式，数据分析</td>
                  <td className="py-3 px-4">Excel、数据分析工具</td>
                  <td className="py-3 px-4">⭐⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}