// 博客文章数据类型定义

/** 文章（对应 src/content/posts/*.md 的 front-matter） */
export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  /** 封面图（可选） */
  cover?: string
  readingTime: number
  content: string
}
