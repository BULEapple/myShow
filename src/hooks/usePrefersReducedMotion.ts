// 检测用户是否偏好减少动效（prefers-reduced-motion）
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** 返回是否应减少动效，首次渲染时基于当前媒体查询 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(QUERY).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return reduced
}
