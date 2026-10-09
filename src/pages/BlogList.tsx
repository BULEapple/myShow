// 博客列表页：文章卡片 + 标签筛选入口
import { Link } from 'react-router-dom'
import { useContent } from '@/hooks/useContent'
import { useSEO } from '@/lib/seo'
import { formatDate } from '@/lib/markdown'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'

export default function BlogList() {
  useSEO('博客', '我的技术文章与思考')
  const { posts } = useContent()
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()

  return (
    <div className="mx-auto max-w-content px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">博客</h1>
      <p className="mt-2 text-muted">共 {posts.length} 篇文章</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Tag href="/blog">全部</Tag>
        {allTags.map((t) => (
          <Tag key={t} href={`/blog/tag/${t}`}>
            {t}
          </Tag>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Card key={p.slug} className="h-full">
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
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <Tag key={t} href={`/blog/tag/${t}`}>
                  {t}
                </Tag>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
