// 技能数据类型定义

/** 熟练度：1 最低，5 最高 */
export type SkillLevel = 1 | 2 | 3 | 4 | 5

/** 单项技能 */
export interface Skill {
  category: string
  name: string
  level: SkillLevel
  icon?: string
  years?: number
}
