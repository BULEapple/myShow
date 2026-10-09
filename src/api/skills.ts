// 技能 API：增删改查（按数组下标定位）
import { delay } from './storage'
import { getContent, updateContent } from './store'
import type { Skill } from '@/types/skill'

/** 获取技能列表 */
export async function listSkills(): Promise<Skill[]> {
  await delay()
  return [...getContent().skills]
}

/** 新增技能 */
export async function createSkill(input: Skill): Promise<void> {
  await delay()
  updateContent((prev) => ({ ...prev, skills: [...prev.skills, input] }))
}

/** 更新指定下标的技能 */
export async function updateSkill(index: number, input: Skill): Promise<void> {
  await delay()
  updateContent((prev) => ({
    ...prev,
    skills: prev.skills.map((s, i) => (i === index ? input : s)),
  }))
}

/** 删除指定下标的技能 */
export async function deleteSkill(index: number): Promise<void> {
  await delay()
  updateContent((prev) => ({
    ...prev,
    skills: prev.skills.filter((_, i) => i !== index),
  }))
}
