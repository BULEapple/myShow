---
title: React 性能优化实践
date: 2026-09-18
tags: [react, 性能优化]
excerpt: 从渲染次数、记忆化、代码分割三个角度，梳理 React 应用的常见性能优化手段。
---

性能优化是前端工作中绕不开的话题。本文从三个角度梳理 React 应用的常见优化手段。

## 1. 减少不必要的渲染

- 使用 `React.memo` 包裹纯展示组件
- 稳定 props 的引用（配合 `useCallback` / `useMemo`）
- 避免在渲染中创建新的对象或数组

```tsx
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: string[] }) {
  return <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
})
```

## 2. 记忆化

`useMemo` 适合缓存昂贵的计算结果，`useCallback` 适合稳定回调引用。但要注意**不要过度记忆化**，简单计算反而会带来额外开销。

## 3. 代码分割

页面级代码分割可以显著降低首屏加载体积：

```tsx
import { lazy, Suspense } from 'react'

const Detail = lazy(() => import('./Detail'))

export function App() {
  return (
    <Suspense fallback={<div>加载中…</div>}>
      <Detail />
    </Suspense>
  )
}
```

## 小结

优化的前提是**测量**。先用 React DevTools Profiler 定位瓶颈，再针对性地优化，避免过早优化。
