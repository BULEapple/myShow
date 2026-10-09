// 项目展示：卡片列表（封面、描述、技术标签）
import { Link } from 'react-router-dom'
import { useContent } from '@/hooks/useContent'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'

export function Projects() {
  const { projects } = useContent()
  return (
    <Section id="projects" title="项目" subtitle="我做过的部分项目">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Link key={p.slug} to={`/projects/${p.slug}`} className="group">
            <Card className="h-full transition-transform duration-200 group-hover:-translate-y-1">
              {p.cover && (
                <img
                  src={p.cover}
                  alt={`${p.title} 封面`}
                  className="mb-4 h-40 w-full rounded-chip object-cover"
                  loading="lazy"
                />
              )}
              <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.slice(0, 3).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  )
}
