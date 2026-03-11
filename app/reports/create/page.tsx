"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const reportTypes = [
  { value: "spam", label: "垃圾内容", icon: "🗑️", description: "广告、垃圾信息" },
  { value: "harassment", label: "骚扰", icon: "😠", description: "骚扰、欺凌行为" },
  { value: "hate_speech", label: "仇恨言论", icon: "🚫", description: "歧视性言论" },
  { value: "violence", label: "暴力内容", icon: "⚠️", description: "暴力、血腥内容" },
  { value: "adult", label: "成人内容", icon: "🔞", description: "不适内容" },
  { value: "misinformation", label: "虚假信息", icon: "❌", description: "错误、虚假信息" },
  { value: "copyright", label: "版权问题", icon: "©️", description: "侵犯版权" },
  { value: "other", label: "其他", icon: "📝", description: "其他问题" },
];

const targetTypes = [
  { value: "diary", label: "日记", icon: "📔" },
  { value: "comment", label: "评论", icon: "💬" },
  { value: "user", label: "用户", icon: "👤" },
  { value: "inspiration", label: "灵感", icon: "💡" },
  { value: "challenge", label: "挑战", icon: "🏆" },
  { value: "collab", label: "协作", icon: "🤝" },
];

export default function CreateReportPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 表单数据
  const [formData, setFormData] = useState({
    type: "",
    targetType: "",
    targetId: "",
    reporterId: "user_current",
    reporterName: "当前用户",
    reason: "",
    description: "",
  });

  const [preview, setPreview] = useState<{
    title?: string;
    content?: string;
  } | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          snapshot: preview,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/reports?success=true");
      } else {
        alert(data.error || "提交失败");
      }
    } catch (error) {
      alert("提交失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 模拟获取目标内容预览
  useEffect(() => {
    if (formData.targetType && formData.targetId) {
      // 模拟预览
      setPreview({
        title: formData.targetType === "diary" ? "示例日记标题" : undefined,
        content: "这是目标内容的预览...",
      });
    }
  }, [formData.targetType, formData.targetId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-amber-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🚨</div>
          <h1 className="text-2xl font-bold text-gray-800">提交举报</h1>
          <p className="text-gray-500 mt-2">帮助我们维护社区环境</p>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s <= step
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 ${s < step ? "bg-red-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* 步骤 1: 选择举报类型 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              选择举报原因
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {reportTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setFormData({ ...formData, type: type.value });
                    setStep(2);
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.type === type.value
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-gray-800">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 步骤 2: 选择目标和详情 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                选择举报目标类型
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {targetTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, targetType: type.value })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.targetType === type.value
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium text-gray-800">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                输入目标 ID
              </h2>
              <input
                type="text"
                value={formData.targetId}
                onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                placeholder="例如: diary_123, comment_456"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {preview && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500 mb-2">内容预览</div>
                  {preview.title && (
                    <div className="font-medium text-gray-800 mb-1">{preview.title}</div>
                  )}
                  <div className="text-sm text-gray-600">{preview.content}</div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                详细说明
              </h2>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请详细描述问题..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                上一步
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.targetType || !formData.targetId}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* 步骤 3: 确认提交 */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              确认举报信息
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">举报类型</span>
                <span className="font-medium text-gray-800">
                  {reportTypes.find(t => t.value === formData.type)?.label}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">目标类型</span>
                <span className="font-medium text-gray-800">
                  {targetTypes.find(t => t.value === formData.targetType)?.label}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">目标 ID</span>
                <span className="font-medium text-gray-800 font-mono text-sm">
                  {formData.targetId}
                </span>
              </div>
              {formData.description && (
                <div className="py-3">
                  <div className="text-gray-500 mb-2">详细说明</div>
                  <div className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {formData.description}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2">
                <span className="text-amber-500">⚠️</span>
                <div className="text-sm text-amber-800">
                  请确保举报内容真实有效。恶意举报可能会导致账号受限。
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                上一步
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "提交中..." : "确认提交"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}