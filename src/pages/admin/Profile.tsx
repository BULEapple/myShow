// 个人信息管理：基本信息 + 经历时间线 + 教育背景（支持增删改）
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useContent } from '@/hooks/useContent'
import { updateProfile } from '@/api/profile'
import { useApp } from '@/contexts/AppContext'
import { useSEO } from '@/lib/seo'
import { Field, inputCls, textareaCls, PageHeader } from '@/components/admin/FormControls'
import { Button } from '@/components/ui/Button'
import { ImageUpload } from '@/components/admin/ImageUpload'
import type { Profile } from '@/data/profile'

const timelineSchema = z.object({
  period: z.string().min(1, '请输入时间段'),
  role: z.string().min(1, '请输入职位'),
  org: z.string().min(1, '请输入公司 / 组织'),
  description: z.string(),
})

const educationSchema = z.object({
  period: z.string().min(1, '请输入时间段'),
  school: z.string().min(1, '请输入学校'),
  degree: z.string().min(1, '请输入专业 / 学位'),
  description: z.string().optional(),
})

const schema = z.object({
  name: z.string().min(1, '请输入姓名'),
  title: z.string().min(1, '请输入职位 / 头衔'),
  tagline: z.string(),
  avatar: z.string(),
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
  location: z.string(),
  resume: z.string(),
  bio: z.string(),
  timeline: z.array(timelineSchema),
  education: z.array(educationSchema),
})

type FormValues = z.infer<typeof schema>

export default function Profile() {
  useSEO('个人信息')
  const { profile } = useContent()
  const { showToast } = useApp()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: profile,
  })

  const timeline = useFieldArray({ control, name: 'timeline' })
  const education = useFieldArray({ control, name: 'education' })

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProfile(values as Profile)
      showToast('个人信息已保存')
    } catch {
      showToast('保存失败', 'error')
    }
  }

  return (
    <div>
      <PageHeader title="个人信息" description="管理个人资料、经历与教育背景" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {/* 基本信息 */}
        <div className="rounded-card border border-white/5 bg-surface/40 p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">基本信息</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="姓名" required error={errors.name?.message}>
              <input className={inputCls} {...register('name')} />
            </Field>
            <Field label="职位 / 头衔" required error={errors.title?.message}>
              <input className={inputCls} {...register('title')} />
            </Field>
            <Field label="一句话介绍" error={errors.tagline?.message}>
              <input className={inputCls} {...register('tagline')} />
            </Field>
            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <Field label="头像" error={errors.avatar?.message}>
                  <ImageUpload value={field.value} onChange={field.onChange} alt="头像" />
                </Field>
              )}
            />
            <Field label="邮箱" required error={errors.email?.message}>
              <input className={inputCls} type="email" {...register('email')} />
            </Field>
            <Field label="所在地区" error={errors.location?.message}>
              <input className={inputCls} {...register('location')} />
            </Field>
            <Field label="简历文件路径" error={errors.resume?.message}>
              <input className={inputCls} {...register('resume')} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="个人简介" error={errors.bio?.message}>
              <textarea className={textareaCls} rows={3} {...register('bio')} />
            </Field>
          </div>
        </div>

        {/* 工作经历 */}
        <div className="rounded-card border border-white/5 bg-surface/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">工作经历</h2>
            <Button type="button" variant="outline" onClick={() => timeline.append({ period: '', role: '', org: '', description: '' })}>
              添加经历
            </Button>
          </div>
          <div className="space-y-4">
            {timeline.fields.map((field, index) => (
              <div key={field.id} className="rounded-chip border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted">经历 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => timeline.remove(index)}
                    className="text-sm text-red-400 transition-colors hover:text-red-300"
                  >
                    删除
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="时间段" required error={errors.timeline?.[index]?.period?.message}>
                    <input className={inputCls} {...register(`timeline.${index}.period`)} />
                  </Field>
                  <Field label="职位" required error={errors.timeline?.[index]?.role?.message}>
                    <input className={inputCls} {...register(`timeline.${index}.role`)} />
                  </Field>
                  <Field label="公司 / 组织" required error={errors.timeline?.[index]?.org?.message}>
                    <input className={inputCls} {...register(`timeline.${index}.org`)} />
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="描述">
                    <textarea className={textareaCls} rows={2} {...register(`timeline.${index}.description`)} />
                  </Field>
                </div>
              </div>
            ))}
            {timeline.fields.length === 0 && (
              <p className="text-sm text-muted">暂无工作经历。</p>
            )}
          </div>
        </div>

        {/* 教育背景 */}
        <div className="rounded-card border border-white/5 bg-surface/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">教育背景</h2>
            <Button type="button" variant="outline" onClick={() => education.append({ period: '', school: '', degree: '' })}>
              添加教育
            </Button>
          </div>
          <div className="space-y-4">
            {education.fields.map((field, index) => (
              <div key={field.id} className="rounded-chip border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-muted">教育 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => education.remove(index)}
                    className="text-sm text-red-400 transition-colors hover:text-red-300"
                  >
                    删除
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="时间段" required error={errors.education?.[index]?.period?.message}>
                    <input className={inputCls} {...register(`education.${index}.period`)} />
                  </Field>
                  <Field label="学校" required error={errors.education?.[index]?.school?.message}>
                    <input className={inputCls} {...register(`education.${index}.school`)} />
                  </Field>
                  <Field label="专业 / 学位" required error={errors.education?.[index]?.degree?.message}>
                    <input className={inputCls} {...register(`education.${index}.degree`)} />
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="描述（可选）">
                    <textarea className={textareaCls} rows={2} {...register(`education.${index}.description`)} />
                  </Field>
                </div>
              </div>
            ))}
            {education.fields.length === 0 && (
              <p className="text-sm text-muted">暂无教育背景。</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中…' : '保存修改'}
          </Button>
        </div>
      </form>
    </div>
  )
}
