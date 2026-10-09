// 页脚：社交链接 + 版权
import { useContent } from '@/hooks/useContent'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/Icon'

export function Footer() {
  const year = new Date().getFullYear()
  const { profile, socials } = useContent()

  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-content flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-muted transition-colors hover:text-accent"
            >
              <Icon name={s.icon as IconName} className="h-5 w-5" />
            </a>
          ))}
        </div>
        <p className="text-sm text-muted">
          © {year} {profile.name} · 由 React + Vite 构建
        </p>
      </div>
    </footer>
  )
}
