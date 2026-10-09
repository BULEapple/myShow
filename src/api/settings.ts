// 站点设置与社交链接 API
import { delay } from './storage'
import { getContent, updateContent } from './store'
import type { SiteSettings } from './types'
import type { SocialLink } from '@/data/social'

/** 获取站点设置 */
export async function getSettings(): Promise<SiteSettings> {
  await delay()
  return getContent().settings
}

/** 更新站点设置 */
export async function updateSettings(input: SiteSettings): Promise<SiteSettings> {
  await delay()
  updateContent((prev) => ({ ...prev, settings: input }))
  return input
}

/** 获取社交链接 */
export async function getSocials(): Promise<SocialLink[]> {
  await delay()
  return [...getContent().socials]
}

/** 更新社交链接 */
export async function updateSocials(input: SocialLink[]): Promise<SocialLink[]> {
  await delay()
  updateContent((prev) => ({ ...prev, socials: input }))
  return input
}
