// 项目管理：列表 + 删除（编辑跳转到独立编辑页）
import { useState } from 'react'
import { useContent } from '@/hooks/useContent'
import { deleteProject } from '@/api/projects'
import { useApp } from '@/contexts/AppContext'
import { useSEO } from '@/lib/seo'
import { formatDate } from '@/lib/markdown'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/admin/FormControls'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

export default function Projects() {
  useSEO('项目管理')
  const { projects } = useContent()
  const { showToast } = useApp()

  const [target, setTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const confirmDelete = async () => {
    if (!target) return
    setDeleting(true)
    try {
      await deleteProject(target)
      showToast('项目已删除')
      setTarget(null)
    } catch {
      showToast('删除失败', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="项目管理"
        description="管理项目内容"
        actions={<Button to="/admin/projects/new">新建项目</Button>}
      />

      <div className="space-y-4">
        {projects.map((p) => (
          <Card key={p.slug} className="flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold text-foreground">
                  {p.title}
                </h3>
                {p.featured && (
                  <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-soft">
                    精选
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-sm text-muted">{p.summary}</p>
              <p className="mt-1 text-xs text-muted">{formatDate(p.date)}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button to={`/admin/projects/${p.slug}/edit`} variant="outline">
                编辑
              </Button>
              <button
                type="button"
                onClick={() => setTarget(p.slug)}
                className="inline-flex items-center justify-center rounded-chip border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
              >
                删除
              </button>
            </div>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="text-muted">暂无项目，点击右上角「新建项目」。</p>
        )}
      </div>

      <ConfirmDialog
        open={target !== null}
        title="删除项目"
        message={`确定要删除「${projects.find((p) => p.slug === target)?.title ?? ''}」吗？此操作不可撤销。`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  )
}
