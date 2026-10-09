// 通用卡片容器
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-card border border-white/5 bg-surface/60 p-6 backdrop-blur-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
