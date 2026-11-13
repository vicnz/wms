import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  return (
    <ProtectedRoute>
      <div className="h-screen w-screen grid place-items-center">
        <Layout Sidebar={<AppSidebar />}>
          <div className="p-2">
            <p>Hello World</p>
            <Button
              onClick={() => {
                signOut()
                navigate('/auth/login')
              }}
            >
              Sign Out
            </Button>
          </div>
        </Layout>
      </div>
    </ProtectedRoute>
  )
}
