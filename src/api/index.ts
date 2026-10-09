// API 统一出口：所有读写都经由这里，便于后续切换为真实后端
export * from './auth'
export * from './posts'
export * from './projects'
export * from './skills'
export * from './profile'
export * from './settings'

export type { AuthUser, SiteSettings } from './types'
export type { ContentState } from './store'
export { getContent, updateContent, resetContent } from './store'

import { getContent } from './store'

/** 内容统计（用于仪表盘） */
export interface ContentStats {
  posts: number
  projects: number
  skills: number
  tags: number
}

/** 计算内容统计 */
export function getStats(): ContentStats {
  const { posts, projects, skills } = getContent()
  const tags = new Set(posts.flatMap((p) => p.tags))
  return {
    posts: posts.length,
    projects: projects.length,
    skills: skills.length,
    tags: tags.size,
  }
}
