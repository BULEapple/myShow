# 个人作品集网站（my-show）

一个基于 **React + TypeScript + Vite + Tailwind CSS** 的个人作品集网站，包含**前台展示**与**后台管理**两部分。

- 前台：个人介绍、技能展示、项目展示、博客（Markdown 驱动）
- 后台：登录后管理个人信息、技能、项目、博客与站点设置
- 数据层：统一 `src/api/` 接口层，当前用 localStorage 模拟，便于后续切换真实后端

---

## ✨ 功能特性

### 前台

- 深色主题 + 星空背景（Canvas 2D 自实现，支持 `prefers-reduced-motion`）
- 响应式布局：移动端单列 / 平板两列 / 桌面三列
- Markdown 内容渲染（GFM + 代码高亮）
- 博客标签聚合与筛选、阅读时长计算
- 平滑滚动动画、外链 `rel="noopener noreferrer"`、键盘可操作、图片 `alt`

### 后台（`/admin`）

| 路由 | 说明 |
| --- | --- |
| `/admin/login` | 登录页（账号密码，登录态存 localStorage） |
| `/admin` | 仪表盘（内容统计概览） |
| `/admin/profile` | 个人信息管理（基本信息 + 经历时间线 + 教育背景，支持增删改） |
| `/admin/skills` | 技能管理（新增 / 编辑 / 删除） |
| `/admin/projects` | 项目管理（列表 + 新建 / 编辑） |
| `/admin/projects/new`、`/admin/projects/:slug/edit` | 项目新建 / 编辑 |
| `/admin/posts` | 博客管理（列表 + 新建 / 编辑） |
| `/admin/posts/new`、`/admin/posts/:slug/edit` | 文章新建 / 编辑 |
| `/admin/settings` | 站点设置（站点信息 + 社交链接 + 恢复默认数据） |

后台特性：

- 路由守卫：未登录访问 `/admin` 自动跳转登录页
- Markdown 编辑器：支持「编辑 / 分屏 / 预览」三种模式实时预览
- 图片上传：头像、封面支持选择本地图片（转为 base64 存储，带预览）
- 表单校验：`zod` + `react-hook-form`
- 删除操作二次确认

---

## 🛠 技术栈

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- React Router v6
- react-markdown + remark-gfm + rehype-highlight（Markdown 渲染）
- gray-matter（解析 front-matter）
- react-hook-form + zod（表单与校验）

> 未引入 Redux、UI 组件库、GSAP 等重型依赖。

---

## 📁 目录结构

```
myShow2/
├── public/                     # 静态资源（avatar.svg、covers/*、resume.pdf 等）
├── src/
│   ├── api/                    # 统一接口层（localStorage 实现）
│   │   ├── types.ts            # AuthUser / SiteSettings
│   │   ├── storage.ts          # localStorage 读写 + 模拟延迟
│   │   ├── store.ts            # 响应式数据仓库（前台/后台共用）
│   │   ├── auth.ts             # 登录 / 登出 / token
│   │   ├── posts.ts            # 文章 CRUD
│   │   ├── projects.ts         # 项目 CRUD
│   │   ├── skills.ts           # 技能 CRUD
│   │   ├── profile.ts          # 个人信息
│   │   ├── settings.ts         # 站点设置 + 社交链接
│   │   └── index.ts            # 统一出口 + 统计
│   ├── components/
│   │   ├── layout/             # 前台 Navbar / Footer / Layout
│   │   ├── ui/                 # Button / Card / Tag / Markdown / Toast 等
│   │   ├── starfield/          # 星空背景
│   │   └── admin/              # 后台布局与控件
│   │       ├── AdminLayout.tsx # 侧边栏 + 顶栏
│   │       ├── RequireAuth.tsx # 路由守卫
│   │       ├── MarkdownEditor.tsx
│   │       ├── ImageUpload.tsx # 图片上传
│   │       ├── ConfirmDialog.tsx
│   │       └── FormControls.tsx
│   ├── sections/               # Hero / About / Skills / Projects / BlogPreview / Contact
│   ├── pages/                  # 前台页面 + admin/ 后台页面
│   ├── content/                # 项目与博客 Markdown（首次种子数据）
│   ├── data/                   # 个人信息 / 技能 / 社交（首次种子数据）
│   ├── contexts/               # AppContext / AuthContext
│   ├── hooks/                  # 自定义 Hook（含 useContent）
│   ├── lib/                    # markdown / content / seo 工具
│   ├── types/                  # Post / Project / Skill 类型
│   ├── router.tsx              # 前台与后台路由配置
│   └── main.tsx
├── .env.example                # 环境变量示例
├── tailwind.config.ts
└── vite.config.ts
```

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm / pnpm / yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

浏览器打开终端输出的地址（默认 `http://localhost:5173/`，端口被占用时会自动切换）。

### 构建

```bash
npm run build
```

### 本地预览构建产物

```bash
npm run preview
```

---

## 🔐 后台使用步骤

1. 访问 `/admin/login`（或直接访问 `/admin` 会被守卫重定向到登录页）。
2. 使用演示账号登录：

   ```
   账号：admin
   密码：admin123
   ```

3. 登录后进入仪表盘，通过侧边栏管理：
   - **个人信息**：修改姓名、头像（可上传图片）、简介，并增删工作经历 / 教育背景。
   - **技能管理**：新增 / 编辑 / 删除技能（分类、熟练度 1-5、图标、年限）。
   - **项目管理**：新建 / 编辑项目，字段含标题、摘要、标签、封面（可上传图片）、日期、演示/GitHub 链接、精选标记，正文用 Markdown 编辑器。
   - **博客管理**：新建 / 编辑文章，字段含标题、摘要、标签、封面（可上传图片）、日期，正文用 Markdown 编辑器。
   - **站点设置**：修改站点名称、描述、社交链接，或「恢复默认数据」。

4. 所有修改会实时反映到前台页面（数据存于浏览器 localStorage）。

---

## 🖼 图片上传说明

- 后台的头像与封面字段支持**上传本地图片**，选择后自动预览，并转为 base64 数据存储。
- 支持的格式：`jpg / png / svg / webp` 等，单张不超过 **2MB**。
- 因为当前数据层是 localStorage 模拟（容量约 5MB），建议控制上传图片体积；接入真实后端后，可改为上传到对象存储（如 OSS / S3）并保存 URL。

---

## 🗄 数据层说明

所有读写统一走 `src/api/`，函数签名均为异步，便于后续无缝替换为真实后端：

```
src/api/
├── store.ts     # 响应式数据仓库（内存 + localStorage 持久化）
├── posts.ts     # createPost / updatePost / deletePost / listPosts / getPost
├── projects.ts  # createProject / updateProject / deleteProject / listProjects
├── skills.ts    # createSkill / updateSkill / deleteSkill / listSkills
├── profile.ts   # getProfile / updateProfile
├── settings.ts  # getSettings / updateSettings / getSocials / updateSocials
└── auth.ts      # login / logout / getToken / isAuthenticated
```

- 首次访问时，用 `src/content/**/*.md` 与 `src/data/*.ts` 作为种子数据写入 localStorage，之后由后台增删改维护。
- 登录态只存 **token**（`crypto.getRandomValues` 生成），不存密码。
- 替换后端：仅需将各 `api/*.ts` 内的实现改为 `fetch` 调用，保持函数签名不变，页面代码无需改动。

---

## 🌐 部署

构建产物为纯静态文件，可部署到任意静态托管平台。

```bash
npm run build   # 产物输出到 dist/
```

### Vercel / Netlify（推荐）

- 构建命令：`npm run build`
- 输出目录：`dist`
- 平台会自动处理 SPA 路由回退（history 模式）。

### GitHub Pages / 子路径部署

1. 在 `vite.config.ts` 中设置 `base`：

   ```ts
   export default defineConfig({
     base: '/你的仓库名/',
     // ...
   })
   ```

2. 构建并部署 `dist/`。由于路由使用 history 模式，需配置 404 回退到 `index.html`；如无法配置，可改为 `HashRouter`。

---

## 🔧 环境变量

复制 `.env.example` 为 `.env` 并按需修改：

| 变量 | 说明 |
| --- | --- |
| `VITE_SITE_URL` | 站点 URL（用于 SEO / sitemap） |
| `VITE_CONTACT_ENDPOINT` | 联系表单提交端点（如 Formspree） |

未配置 `VITE_CONTACT_ENDPOINT` 时，前台联系表单会提示「未配置提交端点」。

---

## ❓ 常见问题

- **修改后台数据后前台没变化？** 前台与后台共用同一份 localStorage 数据，刷新页面或重新访问即可看到；清空浏览器缓存 / localStorage 会恢复为初始静态数据。
- **端口被占用？** Vite 会自动尝试下一个端口，以终端输出为准。
- **图片太大无法保存？** localStorage 容量有限，请使用 2MB 以内图片，或接入真实后端存储。

---

## 📄 许可

MIT
