// 首页 Hero：头像、姓名职位、一句话介绍、CTA
import { useContent } from '@/hooks/useContent'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export function Hero() {
  const { profile } = useContent()
  return (
    <section className="relative flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-content px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={profile.avatar}
            alt={`${profile.name} 的头像`}
            className="h-28 w-28 rounded-full border border-white/10 object-cover"
            loading="lazy"
          />
          <h1 className="mt-6 text-4xl font-bold text-foreground sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-xl text-accent-soft">{profile.title}</p>
          <p className="mt-4 max-w-xl text-muted">{profile.tagline}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="#projects">看项目</Button>
            <Button href={profile.resume} external variant="outline">
              下载简历
            </Button>
            <Button href="#contact" variant="ghost">
              联系我
            </Button>
          </div>
        </div>
      </div>

      <a
        href="#about"
        aria-label="向下滚动"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted transition-colors hover:text-foreground"
      >
        <Icon name="arrow-down" className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  )
}
