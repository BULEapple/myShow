// 全局 UI 状态：导航开合 + Toast（仅用 Context，不引入状态库）
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

export type ToastType = 'success' | 'error'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface AppState {
  navOpen: boolean
  setNavOpen: (v: boolean) => void
  toast: Toast | null
  showToast: (message: string, type?: ToastType) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const timerRef = useRef<number | undefined>(undefined)

  // 清理未触发的定时器
  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      window.clearTimeout(timerRef.current)
      setToast({ id: `${Date.now()}`, message, type })
      timerRef.current = window.setTimeout(() => setToast(null), 4000)
    },
    []
  )

  const value = useMemo(
    () => ({ navOpen, setNavOpen, toast, showToast }),
    [navOpen, toast, showToast]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

/** 读取全局 UI 状态，需在 AppProvider 内使用 */
export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp 必须在 AppProvider 内使用')
  return ctx
}
