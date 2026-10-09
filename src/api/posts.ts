// 文章 API：增删改查
import { delay } from './storage'
import { getContent, updateContent } from './store'
import { slugify, readingTime } from '@/lib/markdown'
import type { Post } from '@/types/post'

/** 文章表单输入（不含自动计算的 slug/readingTime） */
export interface PostInput {
  title: string
  excerpt: string
  date: string
  cover?: string
  tags: string[]
  content: string
}

/** 由标题生成 slug，冲突时追加随机后缀 */
function buildPost(input: PostInput, existingSlugs: string[]): Post {
  const base = slugify(input.title)
  const slug = existingSlugs.includes(base) ? `${base}-${Date.now().toString(36)}` : base
  return {
    slug,
    title: input.title,
    excerpt: input.excerpt,
    date: input.date,
    cover: input.cover,
    tags: input.tags,
    readingTime: readingTime(input.content),
    content: input.content,
  }
}

/** 获取文章列表（按最新在前） */
export async function listPosts(): Promise<Post[]> {
  await delay()
  return [...getContent().posts]
}

/** 按 slug 获取文章 */
export async function getPost(slug: string): Promise<Post | undefined> {
  await delay()
  return getContent().posts.find((p) => p.slug === slug)
}

/** 新建文章 */
export async function createPost(input: PostInput): Promise<Post> {
  await delay()
  const post = buildPost(input, getContent().posts.map((p) => p.slug))
  updateContent((prev) => ({ ...prev, posts: [post, ...prev.posts] }))
  return post
}

/** 更新文章 */
export async function updatePost(slug: string, input: PostInput): Promise<Post> {
  await delay()
  const existing = getContent().posts.find((p) => p.slug === slug)
  if (!existing) throw new Error('文章不存在')
  const updated: Post = { ...existing, ...input, readingTime: readingTime(input.content) }
  updateContent((prev) => ({
    ...prev,
    posts: prev.posts.map((p) => (p.slug === slug ? updated : p)),
  }))
  return updated
}

/** 删除文章 */
export async function deletePost(slug: string): Promise<void> {
  await delay()
  updateContent((prev) => ({
    ...prev,
    posts: prev.posts.filter((p) => p.slug !== slug),
  }))
}
