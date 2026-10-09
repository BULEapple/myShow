// 个人信息 API
import { delay } from './storage'
import { getContent, updateContent } from './store'
import type { Profile } from '@/data/profile'

/** 获取个人信息 */
export async function getProfile(): Promise<Profile> {
  await delay()
  return getContent().profile
}

/** 更新个人信息 */
export async function updateProfile(input: Profile): Promise<Profile> {
  await delay()
  updateContent((prev) => ({ ...prev, profile: input }))
  return input
}
