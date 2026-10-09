// 博客管理：列表 + 删除（编辑跳转到独立编辑页）
import { useState } from 'react'
import { useContent } from '@/hooks/useContent'
import { deletePost } from '@/api/posts'
import { useApp } from '@/contexts/AppContext'
import { useSEO } from '@/lib/seo'
import { formatDate } from '@/lib/markdown'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/admin/FormControls'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

export default function Posts() {
  useSEO('博客管理')
  const { posts } = useContent()
  const { showToast } = useApp()

  const [target, setTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const confirmDelete = async () => {
    if (!target) return
    setDeleting(true)
    try {
      await deletePost(target)
      showToast('文章已删除')
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
        title="博客管理"
        description="管理博客文章"
        actions={<Button to="/admin/posts/new">新建文章</Button>}
      />

      <div className="space-y-4">
        {posts.map((p) => (
          <Card key={p.slug} className="flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="mt-1 truncate text-sm text-muted">{p.excerpt}</p>
              <p className="mt-1 text-xs text-muted">
                {formatDate(p.date)} · {p.readingTime} 分钟
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button to={`/admin/posts/${p.slug}/edit`} variant="outline">
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
        {posts.length === 0 && (
          <p className="text-muted">暂无文章，点击右上角「新建文章」。</p>
        )}
      </div>

      <ConfirmDialog
        open={target !== null}
        title="删除文章"
        message={`确定要删除「${posts.find((p) => p.slug === target)?.title ?? ''}」吗？此操作不可撤销。`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  )
}
