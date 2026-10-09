// 后台登录页：账号密码登录，成功后跳转回原目标路由
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSEO } from '@/lib/seo'
import { Field, inputCls } from '@/components/admin/FormControls'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  username: z.string().min(1, '请输入账号'),
  password: z.string().min(6, '密码至少 6 位'),
})

type FormValues = z.infer<typeof schema>

export default function Login() {
  useSEO('登录')
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    '/admin'

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  // 已登录则直接进入后台
  if (user) {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.username, values.password)
      navigate(from, { replace: true })
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : '登录失败',
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-card border border-white/10 bg-surface/60 p-8 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-foreground">管理后台</h1>
        <p className="mt-1 text-sm text-muted">登录以管理站点内容</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <Field label="账号" required error={errors.username?.message}>
            <input
              type="text"
              autoComplete="username"
              className={inputCls}
              placeholder="admin"
              {...register('username')}
            />
          </Field>

          <Field label="密码" required error={errors.password?.message}>
            <input
              type="password"
              autoComplete="current-password"
              className={inputCls}
              placeholder="••••••••"
              {...register('password')}
            />
          </Field>

          {errors.root && (
            <p className="rounded-chip bg-red-600/10 px-3 py-2 text-xs text-red-400">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? '登录中…' : '登录'}
          </Button>
          <p className="text-center text-xs text-muted">演示账号：admin / admin123</p>
        </form>
      </div>
    </div>
  )
}
