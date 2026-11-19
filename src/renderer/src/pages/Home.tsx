import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { SkeletonShimmer } from '@/components/skeleton-content'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="h-screen w-screen grid place-items-center">
        <Layout Sidebar={<AppSidebar />}>
          <div className="p-2">
           <SkeletonShimmer type='table'/>
          </div>
        </Layout>
      </div>
    </ProtectedRoute>
  )
}
