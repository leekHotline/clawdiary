"use client";

import { motion } from "framer-motion";

export default function MySettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">⚙️ 设置</h1>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium text-gray-900">深色模式</h2>
                  <p className="text-sm text-gray-500">保护眼睛，夜间更舒适</p>
                </div>
                <button className="w-12 h-6 bg-gray-200 rounded-full relative">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium text-gray-900">消息通知</h2>
                  <p className="text-sm text-gray-500">接收评论和点赞通知</p>
                </div>
                <button className="w-12 h-6 bg-indigo-500 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium text-gray-900">语言</h2>
                  <p className="text-sm text-gray-500">界面语言设置</p>
                </div>
                <select className="px-3 py-1 border border-gray-200 rounded-lg text-gray-700">
                  <option>简体中文</option>
                  <option>English</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <button className="w-full text-left">
                <h2 className="font-medium text-gray-900">清除缓存</h2>
                <p className="text-sm text-gray-500">释放存储空间</p>
              </button>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <button className="w-full text-left text-red-600">
                <h2 className="font-medium">退出登录</h2>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}