// 响应式数据仓库：前台与后台共用的数据源（localStorage 实现）
// 首次访问时用静态数据（Markdown + data/*）做种子，之后由后台读写维护。
import type { Post } from '@/types/post'
import type { Project } from '@/types/project'
import type { Skill } from '@/types/skill'
import type { Profile } from '@/data/profile'
import type { SocialLink } from '@/data/social'
import type { SiteSettings } from './types'
import { DEFAULT_SETTINGS } from './types'
import { KEYS, readLS, writeLS } from './storage'
import { posts as seedPosts, projects as seedProjects } from '@/lib/content'
import { skills as seedSkills } from '@/data/skills'
import { profile as seedProfile } from '@/data/profile'
import { socials as seedSocials } from '@/data/social'

/** 站点全部可编辑内容 */
export interface ContentState {
  posts: Post[]
  projects: Project[]
  skills: Skill[]
  profile: Profile
  socials: SocialLink[]
  settings: SiteSettings
}

/** 静态数据种子 */
function seed(): ContentState {
  return {
    posts: seedPosts,
    projects: seedProjects,
    skills: seedSkills,
    profile: seedProfile,
    socials: seedSocials,
    settings: DEFAULT_SETTINGS,
  }
}

/** 首次加载：优先读本地，否则写入种子数据 */
function load(): ContentState {
  const saved = readLS<ContentState>(KEYS.content)
  if (saved) return saved
  const initial = seed()
  writeLS(KEYS.content, initial)
  return initial
}

let state: ContentState = load()
const listeners = new Set<() => void>()

/** 获取当前内容快照（引用稳定，便于 useSyncExternalStore 使用） */
export function getContent(): ContentState {
  return state
}

/** 订阅内容变更 */
export function subscribeContent(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** 通过更新函数修改内容并持久化 */
export function updateContent(updater: (prev: ContentState) => ContentState): void {
  state = updater(state)
  writeLS(KEYS.content, state)
  listeners.forEach((listener) => listener())
}

/** 清空本地修改，恢复为初始静态数据 */
export function resetContent(): void {
  state = seed()
  writeLS(KEYS.content, state)
  listeners.forEach((listener) => listener())
}
