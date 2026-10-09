// 通用按钮：支持作为按钮、外链（a）或内链（Link）
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  /** 内链（React Router 跳转） */
  to?: string
  /** 普通链接 / 外链 */
  href?: string
  /** 是否外链（新窗口打开） */
  external?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
  ariaLabel?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-chip px-5 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-soft',
  outline:
    'border border-white/15 text-foreground hover:border-accent hover:text-accent',
  ghost: 'text-foreground hover:bg-white/5',
}

export function Button({
  children,
  variant = 'primary',
  to,
  href,
  external = false,
  onClick,
  type = 'button',
  className = '',
  disabled,
  ariaLabel,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  if (href) {
    const externalProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {}
    return (
      <a href={href} className={cls} aria-label={ariaLabel} {...externalProps}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
