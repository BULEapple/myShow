// 标签页：按标签过滤文章
import { Link, useParams } from 'react-router-dom'
import { useContent } from '@/hooks/useContent'
import { useSEO } from '@/lib/seo'
import { formatDate } from '@/lib/markdown'
import { Card } from '@/components/ui/Card'

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>()
  useSEO(tag ? `标签：${tag}` : '标签')
  const { posts } = useContent()

  const filtered = tag ? posts.filter((p) => p.tags.includes(tag)) : []

  return (
    <div className="mx-auto max-w-content px-4 py-24 sm:px-6 lg:px-8">
      <Link to="/blog" className="text-sm text-muted transition-colors hover:text-accent">
        ← 返回博客
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-foreground">标签：{tag}</h1>
      <p className="mt-2 text-muted">共 {filtered.length} 篇文章</p>

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.slug}>
              <p className="text-xs text-muted">
                {formatDate(p.date)} · {p.readingTime} 分钟
              </p>
              <Link
                to={`/blog/${p.slug}`}
                className="mt-2 block text-lg font-semibold text-foreground transition-colors hover:text-accent"
              >
                {p.title}
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{p.excerpt}</p>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-muted">该标签下暂无文章。</p>
      )}
    </div>
  )
}
