---
title: TypeScript 实用技巧
date: 2026-08-25
tags: [typescript]
excerpt: 分享几个能提升日常开发效率的 TypeScript 类型技巧，包括工具类型与类型收窄。
---

TypeScript 的类型系统非常强大，掌握一些实用技巧能显著提升开发体验。

## 常用工具类型

| 类型 | 作用 |
|---|---|
| `Partial<T>` | 所有属性变为可选 |
| `Pick<T, K>` | 挑选部分属性 |
| `Omit<T, K>` | 排除部分属性 |
| `ReturnType<T>` | 获取函数返回类型 |

## 类型收窄

通过 `typeof` 或 `in` 关键字可以安全地收窄联合类型：

```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle':
      return Math.PI * s.radius ** 2
    case 'square':
      return s.side ** 2
  }
}
```

## 小结

善用类型系统可以让代码在编译期就规避大量潜在错误。保持类型定义集中在 `types/` 目录，也能让项目结构更清晰。
