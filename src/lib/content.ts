// 内容加载：通过 import.meta.glob 在构建时索引 Markdown 文件
import matter from 'gray-matter'
import type { Post } from '@/types/post'
import type { Project } from '@/types/project'
import { readingTime } from '@/lib/markdown'

/** 文章 Markdown 原始文本映射 */
const postModules = import.meta.glob('/src/content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/** 项目 Markdown 原始文本映射 */
const projectModules = import.meta.glob('/src/content/projects/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/** 从文件路径推导 slug（文件名即 slug） */
function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

// ---------------------------------------------------------------------------
// 博客文章
// ---------------------------------------------------------------------------

interface PostFrontmatter {
  title: string
  excerpt: string
  date: string
  tags?: string[]
  cover?: string
}

function parsePost(raw: string, path: string): Post {
  const { data, content } = matter(raw)
  const fm = data as PostFrontmatter
  return {
    slug: slugFromPath(path),
    title: fm.title,
    excerpt: fm.excerpt ?? '',
    date: fm.date,
    tags: fm.tags ?? [],
    cover: fm.cover,
    readingTime: readingTime(content),
    content,
  }
}

export const posts: Post[] = Object.entries(postModules)
  .map(([path, raw]) => parsePost(raw, path))
  .sort((a, b) => +new Date(b.date) - +new Date(a.date))

export const getPost = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug)

// ---------------------------------------------------------------------------
// 项目
// ---------------------------------------------------------------------------

interface ProjectFrontmatter {
  title: string
  summary: string
  cover: string
  tags?: string[]
  links?: { demo?: string; github?: string }
  featured?: boolean
  date: string
}

function parseProject(raw: string, path: string): Project {
  const { data, content } = matter(raw)
  const fm = data as ProjectFrontmatter
  return {
    slug: slugFromPath(path),
    title: fm.title,
    summary: fm.summary ?? '',
    cover: fm.cover ?? '',
    tags: fm.tags ?? [],
    links: fm.links ?? {},
    featured: fm.featured ?? false,
    date: fm.date,
    content,
  }
}

export const projects: Project[] = Object.entries(projectModules)
  .map(([path, raw]) => parseProject(raw, path))
  .sort((a, b) => +new Date(b.date) - +new Date(a.date))

export const featuredProjects: Project[] = projects.filter((p) => p.featured)

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug)

// ---------------------------------------------------------------------------
// 标签聚合
// ---------------------------------------------------------------------------

/** 所有博客标签（去重、排序） */
export const allTags: string[] = Array.from(
  new Set(posts.flatMap((p) => p.tags))
).sort()
