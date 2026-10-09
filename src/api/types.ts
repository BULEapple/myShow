// API 层类型定义

/** 登录用户（仅含展示信息，不含密码） */
export interface AuthUser {
  username: string
  name: string
}

/** 站点设置 */
export interface SiteSettings {
  siteName: string
  siteDescription: string
}

/** 默认站点设置 */
export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: '个人作品集',
  siteDescription: '个人介绍、技能展示、项目展示与博客',
}
