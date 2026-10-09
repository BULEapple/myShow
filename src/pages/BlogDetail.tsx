// 博客详情页：渲染 Markdown 内容
import { Link, useParams } from 'react-router-dom'
import { useContent } from '@/hooks/useContent'
import { useSEO } from '@/lib/seo'
import { formatDate } from '@/lib/markdown'
import { Markdown } from '@/components/ui/Markdown'
import { Tag } from '@/components/ui/Tag'
import NotFound from './NotFound'

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { posts } = useContent()
  const post = slug ? posts.find((p) => p.slug === slug) : undefined

  useSEO(post?.title, post?.excerpt)

  if (!post) return <NotFound />

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Link to="/blog" className="text-sm text-muted transition-colors hover:text-accent">
        ← 返回博客
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-muted">
        {formatDate(post.date)} · 阅读约 {post.readingTime} 分钟
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <Tag key={t} href={`/blog/tag/${t}`}>
            {t}
          </Tag>
        ))}
      </div>

      {post.cover && (
        <img
          src={post.cover}
          alt={`${post.title} 封面`}
          className="mt-8 w-full rounded-card object-cover"
          loading="lazy"
        />
      )}

      <div className="mt-8">
        <Markdown content={post.content} />
      </div>
    </article>
  )
}
