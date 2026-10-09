---
title: 你好，世界
date: 2026-10-09
tags: [随笔]
excerpt: 这是本站的第一篇文章，介绍我为什么开始写博客以及本站的技术选型。
---

欢迎来到我的博客！

## 为什么写博客

写博客是为了记录学习与思考的过程。把零散的知识整理成文字，既能加深理解，也能帮助到有同样问题的人。

## 本站技术选型

本站使用 **React + TypeScript + Vite + Tailwind CSS** 构建，内容全部由 Markdown 驱动，新增文章只需在 `src/content/posts/` 下添加一个 `.md` 文件即可自动出现在列表里。

### 代码示例

```ts
function greet(name: string): string {
  return `你好，${name}`
}

console.log(greet('世界'))
```

## 后续计划

我会持续分享前端工程化、性能优化与 TypeScript 相关的实践，欢迎关注。
