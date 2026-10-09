// 技能管理：新增 / 编辑 / 删除技能
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useContent } from '@/hooks/useContent'
import { createSkill, updateSkill, deleteSkill } from '@/api/skills'
import { useApp } from '@/contexts/AppContext'
import { useSEO } from '@/lib/seo'
import { Field, inputCls, selectCls, PageHeader } from '@/components/admin/FormControls'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { Skill, SkillLevel } from '@/types/skill'

const schema = z.object({
  category: z.string().min(1, '请输入分类'),
  name: z.string().min(1, '请输入技能名'),
  level: z.coerce.number().int().min(1, '熟练度 1-5').max(5, '熟练度 1-5'),
  icon: z.string(),
  years: z.coerce.number().int().min(0).max(50).optional(),
})

type FormValues = z.infer<typeof schema>

const emptyForm: FormValues = { category: '', name: '', level: 3, icon: '', years: undefined }

export default function Skills() {
  useSEO('技能管理')
  const { skills } = useContent()
  const { showToast } = useApp()

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyForm,
  })

  const categories = useMemo(
    () => Array.from(new Set(skills.map((s) => s.category))),
    [skills]
  )

  const onSubmit = async (values: FormValues) => {
    const skill: Skill = {
      category: values.category.trim(),
      name: values.name.trim(),
      level: values.level as SkillLevel,
      icon: values.icon.trim() || undefined,
      years: values.years || undefined,
    }
    try {
      if (editingIndex === null) {
        await createSkill(skill)
        showToast('技能已添加')
      } else {
        await updateSkill(editingIndex, skill)
        showToast('技能已更新')
      }
      setEditingIndex(null)
      reset(emptyForm)
    } catch {
      showToast('操作失败', 'error')
    }
  }

  const startEdit = (index: number) => {
    const s = skills[index]
    setEditingIndex(index)
    reset({
      category: s.category,
      name: s.name,
      level: s.level,
      icon: s.icon ?? '',
      years: s.years,
    })
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    reset(emptyForm)
  }

  const confirmDelete = async () => {
    if (deleteIndex === null) return
    setDeleting(true)
    try {
      await deleteSkill(deleteIndex)
      showToast('技能已删除')
      setDeleteIndex(null)
      if (editingIndex === deleteIndex) {
        setEditingIndex(null)
        reset(emptyForm)
      }
    } catch {
      showToast('删除失败', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader title="技能管理" description="管理技能分类与熟练度" />

      {/* 新增 / 编辑表单 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-8 rounded-card border border-white/5 bg-surface/40 p-6"
        noValidate
      >
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          {editingIndex === null ? '新增技能' : '编辑技能'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="分类" required error={errors.category?.message}>
            <input className={inputCls} placeholder="如：前端" {...register('category')} />
          </Field>
          <Field label="技能名" required error={errors.name?.message}>
            <input className={inputCls} placeholder="如：React" {...register('name')} />
          </Field>
          <Field label="熟练度 (1-5)" required error={errors.level?.message}>
            <select className={selectCls} {...register('level')}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
          <Field label="图标（可选）" hint="单个 emoji 或图标名" error={errors.icon?.message}>
            <input className={inputCls} placeholder="如：⚛️" {...register('icon')} />
          </Field>
          <Field label="年限（可选）" error={errors.years?.message}>
            <input className={inputCls} type="number" min={0} max={50} {...register('years')} />
          </Field>
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {editingIndex === null ? '添加' : '保存'}
          </Button>
          {editingIndex !== null && (
            <Button type="button" variant="ghost" onClick={cancelEdit}>
              取消编辑
            </Button>
          )}
        </div>
      </form>

      {/* 技能列表（按分类分组） */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-soft">
              {cat}
            </h3>
            <div className="overflow-hidden rounded-card border border-white/5">
              {skills.map((s, index) =>
                s.category === cat ? (
                  <div
                    key={`${s.name}-${index}`}
                    className="flex flex-wrap items-center gap-3 border-b border-white/5 px-4 py-3 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {s.icon && <span aria-hidden="true">{s.icon}</span>}
                        <span className="font-medium text-foreground">{s.name}</span>
                        {s.years && (
                          <span className="text-xs text-muted">{s.years} 年</span>
                        )}
                      </div>
                      <div className="mt-1.5 h-1.5 max-w-xs rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft"
                          style={{ width: `${(s.level / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(index)}
                        className="rounded-chip px-3 py-1.5 text-sm text-accent-soft transition-colors hover:bg-white/5"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteIndex(index)}
                        className="rounded-chip px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-white/5"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        ))}
        {skills.length === 0 && <p className="text-sm text-muted">暂无技能，请在上方添加。</p>}
      </div>

      <ConfirmDialog
        open={deleteIndex !== null}
        title="删除技能"
        message="确定要删除这个技能吗？此操作不可撤销。"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  )
}
