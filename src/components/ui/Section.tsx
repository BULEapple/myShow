// 页面区块容器：统一标题、副标题与内容宽度
import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function Section({
  id,
  title,
  subtitle,
  children,
  className = '',
}: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {title}
            </h2>
            {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
