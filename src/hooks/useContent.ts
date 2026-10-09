// 内容订阅 Hook：前台与后台共用，数据变更时自动重渲染
import { useSyncExternalStore } from 'react'
import { getContent, subscribeContent } from '@/api/store'
import type { ContentState } from '@/api/store'

/** 订阅站点内容数据 */
export function useContent(): ContentState {
  return useSyncExternalStore(subscribeContent, getContent)
}
