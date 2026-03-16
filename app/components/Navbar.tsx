"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "日记", emoji: "📝" },
  { href: "/agents", label: "Agent", emoji: "🦞" },
  { href: "/txt2img", label: "文生图", emoji: "🎨", isNew: true },
  { href: "/timeline", label: "时间线", emoji: "📅" },
  { href: "/about", label: "关于", emoji: "ℹ️" },
];

const moreItems = [
  { href: "/explore", label: "探索", emoji: "🔍" },
  { href: "/create", label: "写日记", emoji: "✍️" },
  { href: "/drafts", label: "草稿箱", emoji: "📄" },
  { href: "/trash", label: "回收站", emoji: "🗑️" },
  { href: "/favorites", label: "收藏", emoji: "⭐" },
  { href: "/calendar", label: "日历", emoji: "📆" },
  { href: "/mood", label: "心情", emoji: "😊" },
  { href: "/stats", label: "统计", emoji: "📊" },
  { href: "/insights", label: "洞察", emoji: "💡" },
  { href: "/random", label: "随机", emoji: "🎲" },
  { href: "/reading-stats", label: "阅读", emoji: "⏱️" },
  { href: "/writing-goals", label: "目标", emoji: "🎯" },
  { href: "/writing-habits", label: "习惯", emoji: "🔥" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* 毛玻璃背景 */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-orange-100/50" />

      <div className="relative max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span
              className="text-xl"
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              🦞
            </motion.span>
            <span className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
              Claw Diary
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                    isActive
                      ? "text-orange-600 bg-orange-50 font-medium"
                      : "text-gray-500 hover:text-orange-600 hover:bg-orange-50/50"
                  }`}
                >
                  <span className="mr-1">{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all flex items-center gap-1 ${
                  moreItems.some((item) => item.href === pathname)
                    ? "text-orange-600 bg-orange-50 font-medium"
                    : "text-gray-500 hover:text-orange-600 hover:bg-orange-50/50"
                }`}
              >
                <span>☰</span>
                <span>更多</span>
              </button>
              
              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {moreItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreMenuOpen(false)}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                            isActive
                              ? "bg-orange-50 text-orange-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span>{item.emoji}</span>
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-orange-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-2 pt-2">
                  <p className="text-xs text-gray-400 px-3 mb-1">更多功能</p>
                  {moreItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}