// 博客预览：最近几篇文章
import { Link } from 'react-router-dom'
import { useContent } from '@/hooks/useContent'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/markdown'

export function BlogPreview() {
  const { posts } = useContent()
  const latest = posts.slice(0, 3)

  return (
    <Section id="blog" title="博客" subtitle="最近的几篇文章">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {latest.map((p) => (
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

      <div className="mt-8 text-center">
        <Button to="/blog" variant="outline">
          查看全部文章
        </Button>
      </div>
    </Section>
  )
}
