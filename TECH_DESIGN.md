# TECH_DESIGN.md

> 本文档用于 AI 编程辅助（Cursor），描述个人展示网站的技术实现方案。开发时请严格遵循本文档的技术选型、目录结构与数据规范。

---

## 1. 项目概述

个人展示网站，包含个人介绍、技能展示、项目展示、博客四大模块。

- **视觉**：深色主题 + Canvas 星空背景
- **设计**：简洁现代，响应式适配多端
- **性质**：纯静态站点，无后端、无登录、无数据库

---

## 2. 技术栈

| 层面 | 选型 | 版本 |
|---|---|---|
| 框架 | React + TypeScript | React 18 / TS 5.5 |
| 构建 | Vite | 5.x |
| 路由 | React Router | 6.x |
| 样式 | Tailwind CSS | 3.x |
| 星空 | Canvas 2D（自实现，不引第三方） | — |
| 内容 | Markdown + front-matter | — |
| MD 渲染 | react-markdown + remark-gfm + rehype-highlight | — |
| 表单 | React Hook Form + Zod | — |
| 部署 | Vercel / Netlify | — |

**禁止引入**：Redux、MobX、UI 组件库（如 Antd/MUI）、jQuery、重型动画库（如 GSAP）。

---

## 3. 项目结构

```
personal-site/
├── public/
│   ├── avatar.jpg
│   ├── resume.pdf
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar.tsx, Footer.tsx, Layout.tsx
│   │   ├── ui/              # Button.tsx, Card.tsx, Tag.tsx, Section.tsx, Toast.tsx
│   │   └── starfield/       # Starfield.tsx
│   ├── sections/            # Hero.tsx, About.tsx, Skills.tsx, Projects.tsx, BlogPreview.tsx, Contact.tsx
│   ├── pages/               # Home.tsx, ProjectDetail.tsx, BlogList.tsx, BlogDetail.tsx, TagPage.tsx, NotFound.tsx
│   ├── content/
│   │   ├── projects/        # *.md
│   │   └── posts/           # *.md
│   ├── data/                # profile.ts, skills.ts, social.ts
│   ├── hooks/               # useScrollSpy.ts, usePrefersReducedMotion.ts
│   ├── lib/                 # markdown.ts, content.ts, seo.ts
│   ├── types/               # project.ts, post.ts, skill.ts
│   ├── styles/              # index.css
│   ├── App.tsx
│   ├── router.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
└── package.json
```

**路径别名**：`@/` → `src/`（在 `vite.config.ts` 与 `tsconfig.json` 中同步配置）。

---

## 4. 路由

```tsx
// router.tsx
createBrowserRouter([
  { path: '/',                element: <Home /> },
  { path: '/projects/:slug',  element: <ProjectDetail /> },
  { path: '/blog',            element: <BlogList /> },
  { path: '/blog/:slug',      element: <BlogDetail /> },
  { path: '/blog/tag/:tag',   element: <TagPage /> },
  { path: '*',                element: <NotFound /> },
])
```

页面级组件使用 `React.lazy` + `Suspense` 做代码分割。

---

## 5. 数据管理

### 5.1 数据分类

| 类型 | 来源 | 管理 |
|---|---|---|
| 个人信息 | `src/data/profile.ts` | 静态 TS 对象 |
| 技能 | `src/data/skills.ts` | 静态 TS 数组 |
| 社交链接 | `src/data/social.ts` | 静态 TS 数组 |
| 项目 | `src/content/projects/*.md` | Markdown + front-matter |
| 博客 | `src/content/posts/*.md` | Markdown + front-matter |

### 5.2 类型定义

```ts
// types/project.ts
export interface Project {
  slug: string
  title: string
  summary: string
  cover: string
  tags: string[]
  links: { demo?: string; github?: string }
  featured: boolean
  date: string
  content: string
}

// types/post.ts
export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  readingTime: number
  content: string
}

// types/skill.ts
export interface Skill {
  category: string
  name: string
  level: 1 | 2 | 3 | 4 | 5
  icon?: string
  years?: number
}
```

### 5.3 Markdown Front-matter 规范

```md
---
title: 文章标题
date: 2026-10-09
tags: [react, typescript]
excerpt: 摘要
cover: /covers/xxx.jpg
---

正文内容...
```

`slug` 由文件名自动推导，不在 front-matter 中重复。

### 5.4 内容加载

```ts
// lib/content.ts
import matter from 'gray-matter'
import type { Post } from '@/types/post'

const modules = import.meta.glob('/src/content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function parse(raw: string, path: string): Post {
  const { data, content } = matter(raw)
  const slug = path.split('/').pop()!.replace('.md', '')
  return {
    ...(data as Omit<Post, 'slug' | 'content' | 'readingTime'>),
    slug,
    content,
    readingTime: Math.ceil(content.split(/\s+/).length / 200),
  }
}

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => parse(raw, path))
  .sort((a, b) => +new Date(b.date) - +new Date(a.date))

export const getPost = (slug: string) => posts.find(p => p.slug === slug)
```

项目内容同理，路径改为 `/src/content/projects/*.md`。

### 5.5 状态管理

**原则**：不做全局状态库。仅用 Context 管理以下 UI 状态：

```ts
// contexts/AppContext.tsx
interface AppState {
  navOpen: boolean
  setNavOpen: (v: boolean) => void
  toast: { id: string; message: string; type: 'success' | 'error' } | null
  showToast: (message: string, type?: 'success' | 'error') => void
}
```

其余数据均为**只读静态数据**，直接在组件内 import，禁止放入 Context。

### 5.6 数据流

```
Markdown / TS 静态数据
      ↓ 构建时
import.meta.glob 索引
      ↓
lib/content.ts 解析 + 排序
      ↓
页面组件直接消费
      ↓
渲染 Markdown / 卡片 / 时间线
```

---

## 6. 关键实现要点

### 6.1 星空背景（Starfield.tsx）

- Canvas 2D，`requestAnimationFrame` 驱动
- 粒子数动态：`min(120, Math.floor(width / 12))`
- 适配 `devicePixelRatio`，避免高分屏模糊
- 监听 `window.resize`，重建粒子分布
- 读取 `prefers-reduced-motion`，为 `reduce` 时渲染静态星点
- 组件卸载时 `cancelAnimationFrame` + 移除监听
- 星空固定定位 `fixed inset-0 -z-10`，不遮挡内容

### 6.2 响应式断点

| 断点 | 宽度 | 布局 |
|---|---|---|
| Mobile | < 640px | 单列，导航折叠 |
| Tablet | 640–1024px | 两列 |
| Desktop | > 1024px | 三列，内容宽 1200px |

### 6.3 样式规范

- 背景 `#0B0F1A`，主文字 `#E6EAF2`，次要文字 `#9AA4B2`
- 强调色通过 Tailwind 主题变量配置（默认 `#6C8CFF`）
- 圆角 12–16px，动效缓动 `cubic-bezier(0.4,0,0.2,1)`
- 对比度达 WCAG AA

### 6.4 SEO

- 每页用 `useEffect` 动态设置 `document.title` 与 meta description
- 构建时生成 `sitemap.xml`（可用 `vite-plugin-sitemap`）

### 6.5 表单

- 联系表单使用 React Hook Form + Zod
- 提交至环境变量 `VITE_CONTACT_ENDPOINT`（如 Formspree）
- 提交结果通过 Toast 反馈

---

## 7. 环境变量

```bash
# .env.example
VITE_SITE_URL=https://example.com
VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxx
```

---

## 8. 构建与部署

```bash
npm run dev       # 本地开发
npm run build     # 产物 → dist/
npm run preview   # 预览产物
```

部署至 Vercel / Netlify，构建命令 `npm run build`，输出目录 `dist`。

---

## 9. 开发约束（AI 编程必读）

1. **严格使用本文档的技术栈**，禁止替换或新增框架。
2. **组件文件使用 PascalCase**，工具函数使用 camelCase。
3. **所有类型定义放入 `src/types/`**，不在组件内重复声明。
4. **新增博客/项目**：只需在 `src/content/` 下添加 `.md` 文件，不改动任何组件代码。
5. **禁止硬编码个人信息**（姓名、邮箱、社交链接）到组件中，统一从 `src/data/` 读取。
6. **所有交互组件需支持键盘操作**，图片必须有 `alt`。
7. **不引入全局状态库**，状态管理遵循第 5.5 节。
8. **样式统一用 Tailwind**，禁止 CSS-in-JS 与内联 style（除动态值）。
9. **动画必须尊重 `prefers-reduced-motion`**。
10. **提交前运行 `npm run build` 确认无 TS 报错**。

---

## 10. 验收标准

- [ ] `npm run build` 无 TS 报错
- [ ] 新增 `src/content/posts/*.md` 后自动出现在博客列表
- [ ] 移动端星空帧率 ≥ 50fps
- [ ] 路由切换无整页刷新
- [ ] 375px 宽度无横向滚动
- [ ] Lighthouse 移动端性能 ≥ 90
- [ ] 所有交互组件可键盘访问
- [ ] 深色主题下文字对比度达 AA
