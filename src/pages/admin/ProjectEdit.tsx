// 项目编辑页：新建 / 编辑（含 Markdown 编辑器与实时预览）
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useContent } from '@/hooks/useContent'
import { createProject, updateProject } from '@/api/projects'
import { useApp } from '@/contexts/AppContext'
import { useSEO } from '@/lib/seo'
import { parseTagString } from '@/lib/markdown'
import { Field, inputCls, textareaCls, PageHeader, Toggle } from '@/components/admin/FormControls'
import { Button } from '@/components/ui/Button'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'
import { ImageUpload } from '@/components/admin/ImageUpload'

const schema = z.object({
  title: z.string().min(1, '请输入标题'),
  summary: z.string().min(1, '请输入摘要'),
  date: z.string().min(1, '请选择日期'),
  cover: z.string(),
  tags: z.string(),
  demo: z.string(),
  github: z.string(),
  featured: z.boolean(),
  content: z.string().min(1, '请输入内容'),
})

type FormValues = z.infer<typeof schema>

export default function ProjectEdit() {
  useSEO('编辑项目')
  const { slug } = useParams<{ slug: string }>()
  const { projects } = useContent()
  const navigate = useNavigate()
  const { showToast } = useApp()

  const editing = slug ? projects.find((p) => p.slug === slug) : undefined
  const isEdit = Boolean(editing)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: editing?.title ?? '',
      summary: editing?.summary ?? '',
      date: editing?.date ?? new Date().toISOString().slice(0, 10),
      cover: editing?.cover ?? '',
      tags: editing?.tags.join(', ') ?? '',
      demo: editing?.links.demo ?? '',
      github: editing?.links.github ?? '',
      featured: editing?.featured ?? false,
      content: editing?.content ?? '',
    },
  })

  const featured = watch('featured')

  // 编辑不存在的 slug 时回退到列表
  useEffect(() => {
    if (slug && !editing) navigate('/admin/projects', { replace: true })
  }, [slug, editing, navigate])

  const onSubmit = async (values: FormValues) => {
    const input = {
      title: values.title,
      summary: values.summary,
      date: values.date,
      cover: values.cover || undefined,
      tags: parseTagString(values.tags),
      links: {
        demo: values.demo || undefined,
        github: values.github || undefined,
      },
      featured: values.featured,
      content: values.content,
    }
    try {
      if (isEdit && slug) {
        await updateProject(slug, input)
        showToast('项目已更新')
      } else {
        await createProject(input)
        showToast('项目已创建')
      }
      navigate('/admin/projects')
    } catch {
      showToast('保存失败', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? '编辑项目' : '新建项目'}
        description="字段说明：标题、摘要、标签、封面、日期，内容使用 Markdown"
        actions={
          <Button variant="ghost" onClick={() => navigate('/admin/projects')}>
            返回列表
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="rounded-card border border-white/5 bg-surface/40 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="标题" required error={errors.title?.message}>
              <input className={inputCls} {...register('title')} />
            </Field>
            <Field label="日期" required error={errors.date?.message}>
              <input className={inputCls} type="date" {...register('date')} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="摘要" required error={errors.summary?.message}>
                <textarea className={textareaCls} rows={2} {...register('summary')} />
              </Field>
            </div>
            <Controller
              name="cover"
              control={control}
              render={({ field }) => (
                <Field label="封面图" hint="上传图片，或保留为空" error={errors.cover?.message}>
                  <ImageUpload value={field.value} onChange={field.onChange} alt="封面" />
                </Field>
              )}
            />
            <Field label="标签" hint="以逗号分隔，如：react, typescript" error={errors.tags?.message}>
              <input className={inputCls} {...register('tags')} />
            </Field>
            <Field label="演示链接" error={errors.demo?.message}>
              <input className={inputCls} placeholder="https://" {...register('demo')} />
            </Field>
            <Field label="GitHub 链接" error={errors.github?.message}>
              <input className={inputCls} placeholder="https://github.com/" {...register('github')} />
            </Field>
          </div>
          <div className="mt-4">
            <Toggle
              label="设为精选项目"
              hint="精选项目可在首页优先展示"
              checked={featured}
              onChange={(v) => setValue('featured', v)}
            />
          </div>
        </div>

        <div className="rounded-card border border-white/5 bg-surface/40 p-6">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <MarkdownEditor
                value={field.value}
                onChange={field.onChange}
                error={errors.content?.message}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/projects')}>
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中…' : '保存'}
          </Button>
        </div>
      </form>
    </div>
  )
}
