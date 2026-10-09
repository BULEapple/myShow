// 技能展示：分类 + 图标 + 名称 + 熟练度
import { useContent } from '@/hooks/useContent'
import { Section } from '@/components/ui/Section'

export function Skills() {
  const { skills } = useContent()
  // 从技能数据推导分类，保持数据单一来源
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <Section id="skills" title="技能" subtitle="我常用的技术栈">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent-soft">
              {cat}
            </h3>
            <ul className="space-y-3">
              {skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <li key={s.name}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-foreground">
                        {s.icon && <span aria-hidden="true">{s.icon}</span>}
                        {s.name}
                      </span>
                      {s.years && (
                        <span className="text-xs text-muted">{s.years} 年</span>
                      )}
                    </div>
                    {/* 熟练度进度条：宽度为动态值 */}
                    <div
                      className="mt-1.5 h-1.5 rounded-full bg-white/5"
                      role="progressbar"
                      aria-valuenow={s.level}
                      aria-valuemin={1}
                      aria-valuemax={5}
                      aria-label={`${s.name} 熟练度`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft"
                        style={{ width: `${(s.level / 5) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
