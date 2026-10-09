// 通用标签：可渲染为 span 或跳转到标签页的链接
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  href?: string
  className?: string
}

export function Tag({ children, href, className = '' }: TagProps) {
  const cls = `inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-soft transition-colors hover:bg-accent/20 ${className}`

  if (href) {
    return (
      <Link to={href} className={cls}>
        {children}
      </Link>
    )
  }

  return <span className={cls}>{children}</span>
}
