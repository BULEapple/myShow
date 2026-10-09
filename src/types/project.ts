// 项目数据类型定义

/** 项目外链 */
export interface ProjectLinks {
  demo?: string
  github?: string
}

/** 项目（对应 src/content/projects/*.md 的 front-matter） */
export interface Project {
  slug: string
  title: string
  summary: string
  cover: string
  tags: string[]
  links: ProjectLinks
  featured: boolean
  date: string
  content: string
}
