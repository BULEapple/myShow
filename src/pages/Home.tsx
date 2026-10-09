// 首页：组合各区块
import { useSEO } from '@/lib/seo'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Skills } from '@/sections/Skills'
import { Projects } from '@/sections/Projects'
import { BlogPreview } from '@/sections/BlogPreview'
import { Contact } from '@/sections/Contact'

export default function Home() {
  useSEO(undefined, '个人作品集网站 —— 个人介绍、技能展示、项目展示与博客')

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <BlogPreview />
      <Contact />
    </>
  )
}
