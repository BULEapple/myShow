# AGENTS.md

## 项目概述
使用 React + TypeScript + Vite + Tailwind CSS 开发的个人作品集网站，包含个人介绍、技能展示、项目展示、博客。

## 技术栈
- React 18 + TypeScript
- Vite 5
- React Router v6
- Tailwind CSS 3
- Markdown + react-markdown（渲染博客/项目内容）
- 禁止引入 Redux、UI 组件库（Antd/MUI）、GSAP

## 开发规范
- 使用函数式组件 + Hooks
- 使用 Tailwind CSS 编写样式
- 组件要可复用，通用组件放 `components/ui/`
- 代码要有注释
- 组件文件 PascalCase，工具函数 camelCase

## 项目结构
```
src/
├── components/   # layout/、ui/、starfield/
├── sections/     # Hero、About、Skills、Projects、BlogPreview、Contact
├── pages/        # Home、ProjectDetail、BlogList、BlogDetail、TagPage、NotFound
├── content/      # projects/、posts/（Markdown 文件）
├── data/         # profile.ts、skills.ts、social.ts
├── hooks/        # 自定义 Hooks
├── lib/          # markdown.ts、content.ts
├── types/        # 类型定义
├── App.tsx
├── router.tsx
└── main.tsx
```

## 数据管理
- 个人信息、技能、社交链接：`src/data/*.ts` 静态对象
- 项目、博客：`src/content/**/*.md`，用 `import.meta.glob` 加载
- 禁止使用全局状态库，仅用 Context 管理导航开合与 Toast
- 新增文章只需添加 `.md` 文件，不改组件代码

## 设计要求
- 深色主题（背景 #0a0a0a，文字 #ffffff）
- 使用渐变色作为强调色
- 星空背景：Canvas 2D 自实现，固定定位 `fixed inset-0 -z-10`
- 添加平滑的滚动动画，尊重 `prefers-reduced-motion`
- 圆角 12–16px，动效缓动 `cubic-bezier(0.4,0,0.2,1)`
- 确保移动端适配（<640 单列 / 640–1024 两列 / >1024 三列）

## 注意事项
- 保持设计简洁，不要过度设计
- 性能优化：图片使用懒加载，页面级代码分割
- 确保所有链接可点击，外链加 `target="_blank" rel="noopener noreferrer"`
- 禁止硬编码个人信息，统一从 `src/data/` 读取
- 所有交互组件支持键盘操作，图片必须有 `alt`

## 验收标准
- `npm run build` 无 TS 报错
- 新增 `.md` 后自动出现在博客列表
- 移动端星空帧率 ≥ 50fps
- 375px 宽度无横向滚动
- 深色主题下对比度达 AA