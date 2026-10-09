// 社交链接静态数据（禁止硬编码到组件）

export interface SocialLink {
  label: string
  url: string
  icon: string
}

export const socials: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/yourname', icon: 'github' },
  { label: '掘金', url: 'https://juejin.cn/user/xxx', icon: 'blog' },
  { label: '邮箱', url: 'mailto:hello@example.com', icon: 'mail' },
]
