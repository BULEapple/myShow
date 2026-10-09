// localStorage 底层读写与模拟延迟
// 后续接入真实后端时，可整体替换为 fetch/axios 实现，保持上层调用不变

/** localStorage 键名（统一前缀避免冲突） */
export const KEYS = {
  content: 'myshow.content.v1',
} as const

/** 读取并反序列化 localStorage 数据 */
export function readLS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

/** 序列化并写入 localStorage */
export function writeLS(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('localStorage 写入失败：', error)
  }
}

/** 模拟网络延迟，便于后续无缝切换为真实接口 */
export function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
