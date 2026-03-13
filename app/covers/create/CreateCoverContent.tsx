"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface CoverTemplate {
  id: string;
  name: string;
  style: string;
  promptTemplate: string;
}

export default function CreateCoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  
  const [templates, setTemplates] = useState<CoverTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    prompt: "",
    style: "default",
    templateId: "",
    width: 1200,
    height: 630,
    diaryId: "",
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (templateId && templates.length > 0) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setFormData(prev => ({
          ...prev,
          templateId: template.id,
          style: template.style,
          prompt: template.promptTemplate.replace("{topic}", ""),
        }));
      }
    }
  }, [templateId, templates]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/covers?templates=true");
      const data = await res.json();
      setTemplates(data);
    } catch (_error) {
      console.error("Failed to fetch templates:", _error);
    }
  };

  const generateCover = async () => {
    if (!formData.prompt) {
      alert("请输入提示词");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/covers/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: formData.prompt,
          style: formData.style,
          templateId: formData.templateId || undefined,
          width: formData.width,
          height: formData.height,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPreviewUrl(data.imageUrl);
      } else {
        alert(data.error || "生成失败");
      }
    } catch (_error) {
      console.error("Failed to generate cover:", _error);
      alert("生成失败");
    } finally {
      setGenerating(false);
    }
  };

  const saveCover = async () => {
    if (!previewUrl) {
      alert("请先生成封面");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/covers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diaryId: formData.diaryId || "standalone",
          imageUrl: previewUrl,
          source: "ai",
          prompt: formData.prompt,
          style: formData.style,
          width: formData.width,
          height: formData.height,
        }),
      });

      if (res.ok) {
        alert("封面已保存！");
        router.push("/covers");
      } else {
        const data = await res.json();
        alert(data.error || "保存失败");
      }
    } catch (_error) {
      console.error("Failed to save cover:", _error);
      alert("保存失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">🎨 创建封面</h1>
          <p className="text-gray-600 mt-1">AI 生成独特的日记封面图</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">选择风格模板</h3>
              <div className="grid grid-cols-2 gap-2">
                {templates.slice(0, 4).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      templateId: template.id,
                      style: template.style,
                      prompt: template.promptTemplate.replace("{topic}", formData.prompt),
                    }))}
                    className={`p-3 text-left rounded-lg border transition ${
                      formData.templateId === template.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">描述你想要的封面</h3>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="例如：一只可爱的太空龙虾漂浮在星空中的卡通风格插画"
              />
              <p className="text-xs text-gray-500 mt-2">
                提示：描述越详细，生成的效果越好
              </p>
            </div>

            {/* Size */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">封面尺寸</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">宽度</label>
                  <select
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={800}>800px</option>
                    <option value={1200}>1200px</option>
                    <option value={1600}>1600px</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">高度</label>
                  <select
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={400}>400px</option>
                    <option value={630}>630px</option>
                    <option value={800}>800px</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={generateCover}
                disabled={generating || !formData.prompt}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {generating ? "生成中..." : "✨ 生成封面"}
              </button>
              <button
                onClick={saveCover}
                disabled={loading || !previewUrl}
                className="px-4 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition disabled:opacity-50"
              >
                {loading ? "保存中..." : "保存"}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">预览</h3>
            <div className="aspect-[2/1] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p>封面预览</p>
                </div>
              )}
            </div>
            {previewUrl && (
              <div className="mt-4 flex gap-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  查看原图
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Back */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Link href="/covers" className="text-indigo-600 hover:underline">
          ← 返回封面库
        </Link>
      </div>
    </div>
  );
}