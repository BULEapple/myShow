// 通用 Markdown / 文本工具函数

/** 计算阅读时间（分钟），按 200 字/分钟估算 */
export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** 将 ISO 日期格式化为 `YYYY年MM月DD日` */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

/** 由标题生成 URL 安全的 slug（保留中文字符） */
export function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || `item-${Date.now().toString(36)}`
}

/** 将「以逗号分隔」的标签字符串解析为数组（支持中英文逗号） */
export function parseTagString(input: string): string[] {
  return input
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean)
}
