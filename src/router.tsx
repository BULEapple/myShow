// 路由配置：前台与后台（/admin）相互隔离，页面级代码分割
import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Layout } from '@/components/layout/Layout'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { RequireAuth } from '@/components/admin/RequireAuth'

// 前台页面
const Home = lazy(() => import('@/pages/Home'))
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'))
const BlogList = lazy(() => import('@/pages/BlogList'))
const BlogDetail = lazy(() => import('@/pages/BlogDetail'))
const TagPage = lazy(() => import('@/pages/TagPage'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// 后台页面
const AdminLogin = lazy(() => import('@/pages/admin/Login'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminProfile = lazy(() => import('@/pages/admin/Profile'))
const AdminSkills = lazy(() => import('@/pages/admin/Skills'))
const AdminProjects = lazy(() => import('@/pages/admin/Projects'))
const AdminProjectEdit = lazy(() => import('@/pages/admin/ProjectEdit'))
const AdminPosts = lazy(() => import('@/pages/admin/Posts'))
const AdminPostEdit = lazy(() => import('@/pages/admin/PostEdit'))
const AdminSettings = lazy(() => import('@/pages/admin/Settings'))

function withSuspense(node: ReactNode) {
  return (
    <Suspense
      fallback={<div className="py-24 text-center text-muted">加载中…</div>}
    >
      {node}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  // 前台（带 Navbar / Footer / 星空背景）
  {
    element: <Layout />,
    children: [
      { path: '/', element: withSuspense(<Home />) },
      { path: '/projects/:slug', element: withSuspense(<ProjectDetail />) },
      { path: '/blog', element: withSuspense(<BlogList />) },
      { path: '/blog/:slug', element: withSuspense(<BlogDetail />) },
      { path: '/blog/tag/:tag', element: withSuspense(<TagPage />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
  // 后台登录页（独立，无需守卫）
  { path: '/admin/login', element: withSuspense(<AdminLogin />) },
  // 后台（独立布局 + 路由守卫）
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: withSuspense(<AdminDashboard />) },
      { path: 'profile', element: withSuspense(<AdminProfile />) },
      { path: 'skills', element: withSuspense(<AdminSkills />) },
      { path: 'projects', element: withSuspense(<AdminProjects />) },
      { path: 'projects/new', element: withSuspense(<AdminProjectEdit />) },
      { path: 'projects/:slug/edit', element: withSuspense(<AdminProjectEdit />) },
      { path: 'posts', element: withSuspense(<AdminPosts />) },
      { path: 'posts/new', element: withSuspense(<AdminPostEdit />) },
      { path: 'posts/:slug/edit', element: withSuspense(<AdminPostEdit />) },
      { path: 'settings', element: withSuspense(<AdminSettings />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
])
