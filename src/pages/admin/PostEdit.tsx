// 文章编辑页：新建 / 编辑（含 Markdown 编辑器与实时预览）
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useContent } from '@/hooks/useContent'
import { createPost, updatePost } from '@/api/posts'
import { useApp } from '@/contexts/AppContext'
import { useSEO } from '@/lib/seo'
import { parseTagString } from '@/lib/markdown'
import { Field, inputCls, textareaCls, PageHeader } from '@/components/admin/FormControls'
import { Button } from '@/components/ui/Button'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'
import { ImageUpload } from '@/components/admin/ImageUpload'

const schema = z.object({
  title: z.string().min(1, '请输入标题'),
  excerpt: z.string().min(1, '请输入摘要'),
  date: z.string().min(1, '请选择日期'),
  cover: z.string(),
  tags: z.string(),
  content: z.string().min(1, '请输入内容'),
})

type FormValues = z.infer<typeof schema>

export default function PostEdit() {
  useSEO('编辑文章')
  const { slug } = useParams<{ slug: string }>()
  const { posts } = useContent()
  const navigate = useNavigate()
  const { showToast } = useApp()

  const editing = slug ? posts.find((p) => p.slug === slug) : undefined
  const isEdit = Boolean(editing)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: editing?.title ?? '',
      excerpt: editing?.excerpt ?? '',
      date: editing?.date ?? new Date().toISOString().slice(0, 10),
      cover: editing?.cover ?? '',
      tags: editing?.tags.join(', ') ?? '',
      content: editing?.content ?? '',
    },
  })

  // 编辑不存在的 slug 时回退到列表
  useEffect(() => {
    if (slug && !editing) navigate('/admin/posts', { replace: true })
  }, [slug, editing, navigate])

  const onSubmit = async (values: FormValues) => {
    const input = {
      title: values.title,
      excerpt: values.excerpt,
      date: values.date,
      cover: values.cover || undefined,
      tags: parseTagString(values.tags),
      content: values.content,
    }
    try {
      if (isEdit && slug) {
        await updatePost(slug, input)
        showToast('文章已更新')
      } else {
        await createPost(input)
        showToast('文章已创建')
      }
      navigate('/admin/posts')
    } catch {
      showToast('保存失败', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? '编辑文章' : '新建文章'}
        description="字段说明：标题、摘要、标签、封面、日期，内容使用 Markdown"
        actions={
          <Button variant="ghost" onClick={() => navigate('/admin/posts')}>
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
              <Field label="摘要" required error={errors.excerpt?.message}>
                <textarea className={textareaCls} rows={2} {...register('excerpt')} />
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
            <Field label="标签" hint="以逗号分隔，如：react, 性能优化" error={errors.tags?.message}>
              <input className={inputCls} {...register('tags')} />
            </Field>
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
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/posts')}>
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
