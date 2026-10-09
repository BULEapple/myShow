// 站点设置：站点信息 + 社交链接 + 恢复默认数据
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useContent } from '@/hooks/useContent'
import { updateSettings, updateSocials, resetContent, getContent } from '@/api'
import { useApp } from '@/contexts/AppContext'
import { useSEO } from '@/lib/seo'
import { Field, inputCls, selectCls, PageHeader } from '@/components/admin/FormControls'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

const socialSchema = z.object({
  label: z.string().min(1, '请输入名称'),
  url: z.string().min(1, '请输入链接'),
  icon: z.string().min(1, '请选择图标'),
})

const schema = z.object({
  siteName: z.string().min(1, '请输入站点名称'),
  siteDescription: z.string().min(1, '请输入站点描述'),
  socials: z.array(socialSchema),
})

type FormValues = z.infer<typeof schema>

const iconOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'blog', label: '博客' },
  { value: 'mail', label: '邮箱' },
]

export default function Settings() {
  useSEO('站点设置')
  const { settings, socials } = useContent()
  const { showToast } = useApp()

  const [confirmOpen, setConfirmOpen] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      socials,
    },
  })

  const socialFields = useFieldArray({ control, name: 'socials' })

  const onSubmit = async (values: FormValues) => {
    try {
      await updateSettings({
        siteName: values.siteName,
        siteDescription: values.siteDescription,
      })
      await updateSocials(values.socials)
      showToast('设置已保存')
    } catch {
      showToast('保存失败', 'error')
    }
  }

  const handleReset = () => {
    resetContent()
    const fresh = getContent()
    reset({
      siteName: fresh.settings.siteName,
      siteDescription: fresh.settings.siteDescription,
      socials: fresh.socials,
    })
    setConfirmOpen(false)
    showToast('已恢复默认数据')
  }

  return (
    <div>
      <PageHeader
        title="站点设置"
        description="站点信息与社交链接"
        actions={
          <Button type="button" variant="outline" onClick={() => setConfirmOpen(true)}>
            恢复默认数据
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* 站点信息 */}
        <div className="rounded-card border border-white/5 bg-surface/40 p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">站点信息</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="站点名称" required error={errors.siteName?.message}>
              <input className={inputCls} {...register('siteName')} />
            </Field>
            <Field label="站点描述" required error={errors.siteDescription?.message}>
              <input className={inputCls} {...register('siteDescription')} />
            </Field>
          </div>
        </div>

        {/* 社交链接 */}
        <div className="rounded-card border border-white/5 bg-surface/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">社交链接</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => socialFields.append({ label: '', url: '', icon: 'github' })}
            >
              添加链接
            </Button>
          </div>

          <div className="space-y-4">
            {socialFields.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-chip border border-white/10 p-4 sm:grid-cols-[1fr_2fr_auto_auto] sm:items-end"
              >
                <Field label="名称" required error={errors.socials?.[index]?.label?.message}>
                  <input className={inputCls} {...register(`socials.${index}.label`)} />
                </Field>
                <Field label="链接" required error={errors.socials?.[index]?.url?.message}>
                  <input className={inputCls} {...register(`socials.${index}.url`)} />
                </Field>
                <Field label="图标" required error={errors.socials?.[index]?.icon?.message}>
                  <select className={selectCls} {...register(`socials.${index}.icon`)}>
                    {iconOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <button
                  type="button"
                  onClick={() => socialFields.remove(index)}
                  className="rounded-chip px-3 py-2 text-sm text-red-400 transition-colors hover:bg-white/5"
                >
                  删除
                </button>
              </div>
            ))}
            {socialFields.fields.length === 0 && (
              <p className="text-sm text-muted">暂无社交链接。</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中…' : '保存设置'}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title="恢复默认数据"
        message="将清空所有后台修改，恢复为初始静态数据。此操作不可撤销。"
        confirmText="恢复"
        onConfirm={handleReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
