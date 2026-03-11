"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function CreateGroupPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
    maxMembers: 200,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 创建群组逻辑
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      <section className="pt-16 pb-6 px-6">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <Link href="/groups" className="text-gray-500 hover:text-gray-700 text-sm">
              ← 返回群组
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span>✨</span> 创建群组
          </h1>
          <p className="text-gray-500 mt-1">创建一个群组，邀请好友一起交流</p>
        </motion.div>
      </section>

      <section className="px-6 pb-12">
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* 群组名称 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              群组名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例如：写作爱好者联盟"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              maxLength={50}
            />
            <p className="text-xs text-gray-400 mt-1">{formData.name.length}/50</p>
          </div>

          {/* 群组简介 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              群组简介
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="简单描述一下群组的主题和目的..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-400 mt-1">{formData.description.length}/200</p>
          </div>

          {/* 群组类型 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              群组类型
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPublic: true })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.isPublic
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span className="text-2xl">🌍</span>
                <h4 className="font-medium text-gray-900 mt-2">公开群组</h4>
                <p className="text-xs text-gray-500 mt-1">任何人都可以搜索和加入</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPublic: false })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  !formData.isPublic
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span className="text-2xl">🔒</span>
                <h4 className="font-medium text-gray-900 mt-2">私密群组</h4>
                <p className="text-xs text-gray-500 mt-1">需要邀请码才能加入</p>
              </button>
            </div>
          </div>

          {/* 最大成员数 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              最大成员数
            </label>
            <select
              value={formData.maxMembers}
              onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value={50}>50 人</option>
              <option value={100}>100 人</option>
              <option value={200}>200 人</option>
              <option value={500}>500 人</option>
              <option value={1000}>1000 人</option>
            </select>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3">
            <Link
              href="/groups"
              className="flex-1 bg-gray-100 text-gray-600 px-4 py-3 rounded-xl text-sm font-medium text-center hover:bg-gray-200 transition-colors"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={!formData.name.trim()}
              className="flex-1 bg-amber-500 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              创建群组
            </button>
          </div>
        </motion.form>
      </section>
    </div>
  );
}