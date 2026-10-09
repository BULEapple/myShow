// 个人介绍：简介、教育背景、经历时间线
import { useContent } from '@/hooks/useContent'
import { Section } from '@/components/ui/Section'

export function About() {
  const { profile } = useContent()
  return (
    <Section id="about" title="关于我" subtitle="简单介绍一下自己">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="leading-relaxed text-foreground">{profile.bio}</p>

          <h3 className="mt-8 text-lg font-semibold text-foreground">教育背景</h3>
          <ul className="mt-4 space-y-4">
            {profile.education.map((e) => (
              <li key={`${e.school}-${e.period}`} className="border-l-2 border-accent pl-4">
                <p className="text-sm text-muted">{e.period}</p>
                <p className="font-medium text-foreground">{e.degree}</p>
                <p className="text-muted">{e.school}</p>
                {e.description && (
                  <p className="mt-1 text-sm text-muted">{e.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground">工作经历</h3>
          <ol className="mt-4 space-y-6">
            {profile.timeline.map((t) => (
              <li
                key={`${t.period}-${t.org}`}
                className="relative border-l-2 border-white/10 pl-6"
              >
                <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                <p className="text-sm text-muted">{t.period}</p>
                <p className="font-medium text-foreground">
                  {t.role} · {t.org}
                </p>
                <p className="mt-1 text-sm text-muted">{t.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
