// 布局：星空背景 + 导航 + 内容 + 页脚 + Toast，并处理路由切换与锚点滚动
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Starfield } from '@/components/starfield/Starfield'
import { Toast } from '@/components/ui/Toast'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function Layout() {
  const location = useLocation()
  const reduced = usePrefersReducedMotion()

  // 路由切换后：有 hash 则滚动到对应锚点，否则回到顶部
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [location.pathname, location.hash, reduced])

  return (
    <div className="flex min-h-screen flex-col">
      <Starfield />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  )
}
