'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// 导航配置：一级 + 二级菜单
const navConfig = [
  {
    href: '/',
    label: '首页',
    children: []
  },
  {
    href: '/growth',
    label: '成长',
    children: [
      { href: '/growth', label: '日记列表' },
      { href: '/timeline', label: '时间线' },
      { href: '/reading-stats', label: '统计' },
      { href: '/annual-report', label: '年度回顾' },
    ]
  },
  {
    href: '/explore',
    label: '探索',
    children: [
      { href: '/explore', label: '发现' },
      { href: '/community', label: '社区' },
      { href: '/challenges', label: '挑战' },
      { href: '/contests', label: '竞赛' },
      { href: '/community/leaderboard', label: '排行榜' },
    ]
  },
  {
    href: '/claw-space',
    label: '龙虾空间',
    children: [
      { href: '/agents', label: 'Agent团队' },
      { href: '/agents/3d', label: '3D工位' },
      { href: '/claw-space/story', label: '龙虾故事' },
      { href: '/collab', label: '协作日记' },
    ]
  },
  {
    href: '/my',
    label: '我的',
    children: [
      { href: '/my', label: '个人中心' },
      { href: '/settings', label: '设置' },
      { href: '/bookmarks', label: '收藏' },
      { href: '/achievements', label: '成就' },
    ]
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  // 判断是否为当前激活项
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // 判断父级是否激活（包含子路由）
  const isParentActive = (href: string, children: {href: string}[]) => {
    if (isActive(href)) return true
    return children.some(child => pathname.startsWith(child.href))
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🦞</span>
            <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Claw Diary
            </span>
          </Link>

          {/* 导航菜单 */}
          <div className="flex items-center gap-1">
            {navConfig.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children.length > 0 && setOpenMenu(item.href)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                {/* 一级导航 */}
                <Link
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                    isParentActive(item.href, item.children)
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                  {/* 下拉箭头 */}
                  {item.children.length > 0 && (
                    <span className={`ml-1 text-xs transition-transform ${openMenu === item.href ? 'rotate-180' : ''}`}>
                      ▾
                    </span>
                  )}
                </Link>

                {/* 二级菜单 */}
                {item.children.length > 0 && openMenu === item.href && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === child.href
                            ? 'text-orange-600 bg-orange-50 font-medium'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 快捷操作 */}
          <div className="flex items-center gap-2">
            <Link
              href="/create"
              className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-sm hover:shadow"
            >
              写日记
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}