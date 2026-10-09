// 监听滚动位置，返回当前处于顶部的锚点 id（用于导航高亮）
import { useEffect, useState } from 'react'

/** 返回当前激活的锚点 id */
export function useScrollSpy(ids: string[], offset = 80): string {
  const [active, setActive] = useState<string>(ids[0] ?? '')
  // 用字符串 key 保证依赖稳定，避免数组身份变化导致重复订阅
  const key = ids.join(',')

  useEffect(() => {
    const onScroll = () => {
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= offset) current = id
      }
      if (current) setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [key, offset]) // eslint-disable-line react-hooks/exhaustive-deps

  return active
}
