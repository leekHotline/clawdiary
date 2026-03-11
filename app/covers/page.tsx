"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CoverTemplate {
  id: string;
  name: string;
  style: string;
  previewUrl: string;
  category: string;
}

export default function CoversPage() {
  const [templates, setTemplates] = useState<CoverTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/covers?templates=true");
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", ...new Set(templates.map(t => t.category))];
  
  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      all: "全部",
      artistic: "艺术风格",
      nature: "自然风景",
      tech: "科技感",
      special: "特色主题",
    };
    return labels[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">🎨 封面图库</h1>
          <p className="text-gray-600 mt-1">为你的日记选择精美的封面</p>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/covers/create?template=${template.id}`}
                className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="aspect-[2/1] relative overflow-hidden">
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 capitalize">{template.style}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Custom Cover */}
        <div className="mt-8">
          <Link
            href="/covers/create"
            className="block bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition border-2 border-dashed border-gray-300"
          >
            <div className="text-4xl mb-2">✨</div>
            <h3 className="font-semibold text-gray-900">自定义封面</h3>
            <p className="text-sm text-gray-500 mt-1">输入提示词，AI 为你生成独特封面</p>
          </Link>
        </div>
      </main>

      {/* Back */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <Link href="/" className="text-indigo-600 hover:underline">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}