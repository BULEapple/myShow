// 404 页面
import { useSEO } from '@/lib/seo'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  useSEO('页面不存在')

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-content flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">页面不存在</h1>
      <p className="mt-2 text-muted">你访问的页面可能已被移动或删除。</p>
      <div className="mt-6">
        <Button to="/">返回首页</Button>
      </div>
    </div>
  )
}
