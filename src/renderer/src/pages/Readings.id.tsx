import { PageBreadcrumb } from '@/components/breadcrumb'
import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { Button } from '@/components/ui/button'
import { SaveIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function loader() {
  // const client = db.getInstance()
  // const url = new URL(request.url)
}

export default function ReadingsData() {
    const navigate = useNavigate();
  return (
    <ProtectedRoute>
      <div className="h-screen w-screen grid place-items-center">
        <Layout
          Sidebar={<AppSidebar />}
          Header={
            <>
              <PageBreadcrumb
                breadcrumb={[
                  { title: 'Dashboard', url: '/' },
                  { title: 'Readings', url: '/readings' },
                  { title: 'Readings', active: true }
                ]}
              />
              <div className="flex-1"></div>
              <Button variant="outline" disabled>
                <SaveIcon />
                <span>Save</span>
              </Button>
              <Button variant={'outline'} onClick={() => navigate(-1) }>
                <span>Cancel</span>
              </Button>
            </>
          }
        >
          <div className="px-6 py-4 space-y-2">
            
          </div>
        </Layout>
      </div>
    </ProtectedRoute>
  )
}
