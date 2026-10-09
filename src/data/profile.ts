// 个人信息静态数据（禁止在组件中硬编码，统一从此读取）

export interface Profile {
  name: string
  /** 职位 / 头衔 */
  title: string
  /** 一句话介绍 */
  tagline: string
  avatar: string
  email: string
  location: string
  /** 简历文件路径（public 下） */
  resume: string
  bio: string
  /** 经历时间线 */
  timeline: TimelineItem[]
  /** 教育背景 */
  education: EducationItem[]
}

export interface TimelineItem {
  period: string
  role: string
  org: string
  description: string
}

export interface EducationItem {
  period: string
  school: string
  degree: string
  description?: string
}

export const profile: Profile = {
  name: '张三',
  title: '全栈开发工程师',
  tagline: '用代码构建优雅、高性能的 Web 体验。',
  avatar: '/avatar.svg',
  email: 'hello@example.com',
  location: '中国 · 上海',
  resume: '/resume.pdf',
  bio: '热爱开源与前端工程化，专注于 React / TypeScript 技术栈，拥有从 0 到 1 搭建产品的经验。关注性能优化、无障碍与良好的代码设计。',
  timeline: [
    {
      period: '2023 - 至今',
      role: '高级前端工程师',
      org: '某某科技',
      description: '负责核心产品前端架构与性能优化，推动组件库与工程化建设。',
    },
    {
      period: '2021 - 2023',
      role: '前端工程师',
      org: '某互联网公司',
      description: '参与多个中后台系统开发，主导微前端方案落地。',
    },
    {
      period: '2019 - 2021',
      role: '初级开发工程师',
      org: '某创业公司',
      description: '独立负责官网与活动页开发，积累全栈实践经验。',
    },
  ],
  education: [
    {
      period: '2015 - 2019',
      school: '某大学',
      degree: '计算机科学与技术 · 本科',
      description: '主修数据结构、操作系统、计算机网络等课程。',
    },
  ],
}
