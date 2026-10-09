// 吸顶导航：毛玻璃 + 移动端汉堡菜单
import { Link } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'
import { useContent } from '@/hooks/useContent'
import { Icon } from '@/components/ui/Icon'

const navItems = [
  { label: '首页', to: '/' },
  { label: '关于', to: '/#about' },
  { label: '技能', to: '/#skills' },
  { label: '项目', to: '/#projects' },
  { label: '博客', to: '/blog' },
  { label: '联系', to: '/#contact' },
]

export function Navbar() {
  const { navOpen, setNavOpen } = useApp()
  const { profile } = useContent()

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => setNavOpen(false)}
          className="text-lg font-bold text-foreground"
        >
          {profile.name}
        </Link>

        {/* 桌面导航 */}
        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 移动端汉堡按钮 */}
        <button
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-expanded={navOpen}
          aria-label={navOpen ? '关闭菜单' : '打开菜单'}
          className="rounded-chip p-2 text-foreground hover:bg-white/5 md:hidden"
        >
          <Icon name={navOpen ? 'close' : 'menu'} className="h-6 w-6" />
        </button>
      </nav>

      {/* 移动端菜单 */}
      {navOpen && (
        <div className="border-t border-white/5 bg-background/95 md:hidden">
          <ul className="space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={() => setNavOpen(false)}
                  className="block rounded-chip px-3 py-2 text-foreground hover:bg-white/5"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
