---
title: 个人作品集网站
summary: 使用 React + TypeScript + Vite 构建的个人作品集网站，含星空背景与 Markdown 驱动的内容。
cover: /covers/portfolio.svg
tags: [react, typescript, tailwind]
links:
  demo: https://example.com
  github: https://github.com/yourname/portfolio
featured: true
date: 2026-10-01
---

这是一个个人作品集网站，集成了个人介绍、技能展示、项目展示与博客四大模块。

## 功能亮点

- **星空背景**：Canvas 2D 自实现，支持 `prefers-reduced-motion`
- **Markdown 驱动**：项目与博客内容全部来自 `.md` 文件，新增内容无需改代码
- **响应式**：移动端单列、平板两列、桌面三列自适应
- **无障碍**：键盘可导航、对比度达 AA

## 技术栈

React 18、TypeScript、Vite、Tailwind CSS、React Router、react-markdown。

## 实现细节

内容加载使用 `import.meta.glob` 在构建时索引 Markdown 文件，配合 `gray-matter` 解析 front-matter，按日期倒序排序后由页面组件直接消费。
