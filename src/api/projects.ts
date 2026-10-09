// 项目 API：增删改查
import { delay } from './storage'
import { getContent, updateContent } from './store'
import { slugify } from '@/lib/markdown'
import type { Project, ProjectLinks } from '@/types/project'

/** 项目表单输入（不含自动计算的 slug） */
export interface ProjectInput {
  title: string
  summary: string
  date: string
  cover?: string
  tags: string[]
  links: ProjectLinks
  featured: boolean
  content: string
}

/** 由标题生成 slug，冲突时追加随机后缀 */
function buildProject(input: ProjectInput, existingSlugs: string[]): Project {
  const base = slugify(input.title)
  const slug = existingSlugs.includes(base) ? `${base}-${Date.now().toString(36)}` : base
  return { slug, ...input, cover: input.cover ?? '' }
}

/** 获取项目列表（按最新在前） */
export async function listProjects(): Promise<Project[]> {
  await delay()
  return [...getContent().projects]
}

/** 按 slug 获取项目 */
export async function getProject(slug: string): Promise<Project | undefined> {
  await delay()
  return getContent().projects.find((p) => p.slug === slug)
}

/** 新建项目 */
export async function createProject(input: ProjectInput): Promise<Project> {
  await delay()
  const project = buildProject(input, getContent().projects.map((p) => p.slug))
  updateContent((prev) => ({ ...prev, projects: [project, ...prev.projects] }))
  return project
}

/** 更新项目 */
export async function updateProject(slug: string, input: ProjectInput): Promise<Project> {
  await delay()
  const existing = getContent().projects.find((p) => p.slug === slug)
  if (!existing) throw new Error('项目不存在')
  const updated: Project = { ...existing, ...input, cover: input.cover ?? '' }
  updateContent((prev) => ({
    ...prev,
    projects: prev.projects.map((p) => (p.slug === slug ? updated : p)),
  }))
  return updated
}

/** 删除项目 */
export async function deleteProject(slug: string): Promise<void> {
  await delay()
  updateContent((prev) => ({
    ...prev,
    projects: prev.projects.filter((p) => p.slug !== slug),
  }))
}
