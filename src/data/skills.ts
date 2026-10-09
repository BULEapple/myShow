// 技能静态数据（禁止硬编码到组件）

import type { Skill } from '@/types/skill'

export const skills: Skill[] = [
  // 前端
  { category: '前端', name: 'React', level: 5, icon: '⚛️', years: 5 },
  { category: '前端', name: 'TypeScript', level: 5, icon: '🟦', years: 5 },
  { category: '前端', name: 'Vue', level: 4, icon: '🟩', years: 4 },
  { category: '前端', name: 'Tailwind CSS', level: 5, icon: '🌊', years: 4 },
  // 后端
  { category: '后端', name: 'Node.js', level: 4, icon: '🟢', years: 4 },
  { category: '后端', name: 'Python', level: 3, icon: '🐍', years: 3 },
  { category: '后端', name: 'Go', level: 2, icon: '🐹', years: 1 },
  // 工程化 / 工具
  { category: '工程化', name: 'Vite', level: 5, icon: '⚡', years: 4 },
  { category: '工程化', name: 'Webpack', level: 4, icon: '📦', years: 4 },
  { category: '工程化', name: 'Docker', level: 3, icon: '🐳', years: 2 },
  { category: '工程化', name: 'Git', level: 5, icon: '🔀', years: 6 },
  // 数据库
  { category: '数据库', name: 'PostgreSQL', level: 3, icon: '🐘', years: 3 },
  { category: '数据库', name: 'Redis', level: 3, icon: '🗄️', years: 2 },
]
