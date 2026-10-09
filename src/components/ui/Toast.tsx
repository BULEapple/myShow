// Toast 提示：读取全局 Context 状态
import { useApp } from '@/contexts/AppContext'

export function Toast() {
  const { toast } = useApp()
  if (!toast) return null

  const tone =
    toast.type === 'success'
      ? 'bg-emerald-600/90 text-white'
      : 'bg-red-600/90 text-white'

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div
        className={`rounded-chip px-4 py-3 text-sm shadow-lg ${tone}`}
      >
        {toast.message}
      </div>
    </div>
  )
}
