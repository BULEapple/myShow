// 仪表盘：内容统计概览与快捷入口
import { Link } from 'react-router-dom'
import { useContent } from '@/hooks/useContent'
import { useSEO } from '@/lib/seo'
import { formatDate } from '@/lib/markdown'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/admin/FormControls'

export default function Dashboard() {
  useSEO('仪表盘')
  const { posts, projects, skills } = useContent()
  const tagCount = new Set(posts.flatMap((p) => p.tags)).size

  const stats = [
    { label: '文章', value: posts.length, to: '/admin/posts' },
    { label: '项目', value: projects.length, to: '/admin/projects' },
    { label: '技能', value: skills.length, to: '/admin/skills' },
    { label: '标签', value: tagCount, to: '/admin/posts' },
  ]

  return (
    <div>
      <PageHeader
        title="仪表盘"
        description="站点内容概览"
        actions={
          <>
            <Button to="/admin/posts/new">新建文章</Button>
            <Button to="/admin/projects/new" variant="outline">
              新建项目
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="block">
            <Card className="h-full transition-colors hover:border-accent/50">
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-foreground">最近文章</h2>
          <ul className="space-y-3">
            {posts.slice(0, 5).map((p) => (
              <li key={p.slug} className="flex items-center justify-between gap-4">
                <span className="truncate text-sm text-foreground">{p.title}</span>
                <span className="shrink-0 text-xs text-muted">
                  {formatDate(p.date)}
                </span>
              </li>
            ))}
            {posts.length === 0 && (
              <li className="text-sm text-muted">暂无文章</li>
            )}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-foreground">最近项目</h2>
          <ul className="space-y-3">
            {projects.slice(0, 5).map((p) => (
              <li key={p.slug} className="flex items-center justify-between gap-4">
                <span className="truncate text-sm text-foreground">{p.title}</span>
                <span className="shrink-0 text-xs text-muted">
                  {formatDate(p.date)}
                </span>
              </li>
            ))}
            {projects.length === 0 && (
              <li className="text-sm text-muted">暂无项目</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  )
}
