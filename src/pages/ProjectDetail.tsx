// 项目详情页：渲染 Markdown 内容
import { Link, useParams } from 'react-router-dom'
import { useContent } from '@/hooks/useContent'
import { useSEO } from '@/lib/seo'
import { formatDate } from '@/lib/markdown'
import { Markdown } from '@/components/ui/Markdown'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { projects } = useContent()
  const project = slug ? projects.find((p) => p.slug === slug) : undefined

  useSEO(project?.title, project?.summary)

  if (!project) return <NotFound />

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <Link to="/#projects" className="text-sm text-muted transition-colors hover:text-accent">
        ← 返回项目
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-foreground sm:text-4xl">
        {project.title}
      </h1>
      <p className="mt-3 text-muted">{project.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">{formatDate(project.date)}</span>
        {project.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.links.demo && (
          <Button href={project.links.demo} external>
            在线演示 <Icon name="external" className="h-4 w-4" />
          </Button>
        )}
        {project.links.github && (
          <Button href={project.links.github} external variant="outline">
            GitHub
          </Button>
        )}
      </div>

      {project.cover && (
        <img
          src={project.cover}
          alt={`${project.title} 封面`}
          className="mt-8 w-full rounded-card object-cover"
          loading="lazy"
        />
      )}

      <div className="mt-8">
        <Markdown content={project.content} />
      </div>
    </article>
  )
}
