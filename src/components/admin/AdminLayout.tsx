// 后台布局：侧边栏 + 顶栏，与前台布局相互独立
import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Icon } from '@/components/ui/Icon'

const navItems = [
  { to: '/admin', label: '仪表盘', end: true },
  { to: '/admin/profile', label: '个人信息' },
  { to: '/admin/skills', label: '技能管理' },
  { to: '/admin/projects', label: '项目管理' },
  { to: '/admin/posts', label: '博客管理' },
  { to: '/admin/settings', label: '站点设置' },
]

/** 侧边栏内容（桌面与移动抽屉共用） */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex h-full flex-col">
      <Link
        to="/admin"
        onClick={onNavigate}
        className="border-b border-white/5 px-6 py-5 text-lg font-bold text-foreground"
      >
        管理后台
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `block rounded-chip px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-accent/15 text-accent-soft'
                  : 'text-muted hover:bg-white/5 hover:text-foreground'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 p-4">
        <p className="px-2 pb-3 text-xs text-muted">
          已登录：{user?.name ?? user?.username}
        </p>
        <div className="space-y-1">
          <Link
            to="/"
            onClick={onNavigate}
            className="block rounded-chip px-3 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
          >
            查看前台
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full rounded-chip px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-white/5 hover:text-red-400"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* 桌面侧边栏 */}
      <aside className="hidden w-60 shrink-0 border-r border-white/5 bg-surface/40 lg:block">
        <SidebarContent />
      </aside>

      {/* 移动端抽屉 */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-surface shadow-xl">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶栏 */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-background/70 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="打开菜单"
              className="rounded-chip p-2 text-foreground hover:bg-white/5 lg:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <Link to="/admin" className="text-sm font-medium text-muted hover:text-foreground">
              内容管理
            </Link>
          </div>
          <Link
            to="/"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            查看前台 ↗
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
