// 登录 / 登出 / 鉴权：登录态存 localStorage（仅存 token，不存密码）
import { delay, readLS, writeLS } from './storage'
import type { AuthUser } from './types'

const TOKEN_KEY = 'myshow.auth.token'
const USER_KEY = 'myshow.auth.user'

// 演示账号：真实后端应在服务端校验并签发 token
const DEMO = { username: 'admin', password: 'admin123', name: '管理员' }

/** 生成随机 token（crypto 安全随机数） */
function generateToken(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** 账号密码登录，成功后写入 token 与用户信息 */
export async function login(username: string, password: string): Promise<AuthUser> {
  await delay(400)
  if (username !== DEMO.username || password !== DEMO.password) {
    throw new Error('账号或密码错误')
  }
  const user: AuthUser = { username: DEMO.username, name: DEMO.name }
  writeLS(TOKEN_KEY, generateToken())
  writeLS(USER_KEY, user)
  return user
}

/** 退出登录，清除本地登录态 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/** 读取 token */
export function getToken(): string | null {
  return readLS<string>(TOKEN_KEY)
}

/** 读取当前登录用户 */
export function getUser(): AuthUser | null {
  return readLS<AuthUser>(USER_KEY)
}

/** 是否已登录 */
export function isAuthenticated(): boolean {
  return Boolean(getToken())
}
