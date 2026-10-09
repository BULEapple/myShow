// 应用根组件：提供全局 Context 与路由
import { RouterProvider } from 'react-router-dom'
import { AppProvider } from '@/contexts/AppContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { router } from '@/router'

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProvider>
  )
}
