// 联系：邮箱复制 + 社交链接 + 表单（React Hook Form + Zod 校验）
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useContent } from '@/hooks/useContent'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { useApp } from '@/contexts/AppContext'
import type { IconName } from '@/components/ui/Icon'

// 表单校验规则
const schema = z.object({
  name: z.string().min(1, '请输入姓名'),
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
  message: z.string().min(10, '消息至少 10 个字符'),
})

type FormValues = z.infer<typeof schema>

const inputCls =
  'w-full rounded-chip border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'

export function Contact() {
  const { showToast } = useApp()
  const { profile, socials } = useContent()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      showToast('邮箱已复制到剪贴板')
    } catch {
      showToast('复制失败，请手动复制', 'error')
    }
  }

  const onSubmit = async (data: FormValues) => {
    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT
    if (!endpoint) {
      showToast('未配置表单提交端点（VITE_CONTACT_ENDPOINT）', 'error')
      return
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        reset()
        showToast('消息已发送，感谢联系！')
      } else {
        showToast('发送失败，请稍后再试', 'error')
      }
    } catch {
      showToast('网络错误，请稍后再试', 'error')
    }
  }

  return (
    <Section id="contact" title="联系我" subtitle="有合作意向或想聊一聊？">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="leading-relaxed text-muted">
            欢迎通过邮箱或社交平台与我联系，我会尽快回复。
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-chip bg-white/5 px-4 py-2 text-sm text-foreground">
              {profile.email}
            </span>
            <Button variant="outline" onClick={copyEmail}>
              复制邮箱
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-4">
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
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="contact-name" className="mb-1 block text-sm text-muted">
              姓名
            </label>
            <input
              id="contact-name"
              type="text"
              className={inputCls}
              placeholder="你的姓名"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className="mb-1 block text-sm text-muted">
              邮箱
            </label>
            <input
              id="contact-email"
              type="email"
              className={inputCls}
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1 block text-sm text-muted">
              消息
            </label>
            <textarea
              id="contact-message"
              rows={4}
              className={inputCls}
              placeholder="想说的话…"
              {...register('message')}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '发送中…' : '发送消息'}
          </Button>
        </form>
      </div>
    </Section>
  )
}
