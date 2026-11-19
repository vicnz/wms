import { PageBreadcrumb } from '@/components/breadcrumb'
import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { Button } from '@/components/ui/button'
import { PlusIcon, SheetIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export async function loader() {
  // const client = db.getInstance()
  return null
}

export default function PaymentPage() {
  return (
    <>
      <ProtectedRoute>
        <div className="h-screen w-screen grid place-items-center">
          <Layout
            Sidebar={<AppSidebar />}
            Header={
              <>
                <PageBreadcrumb
                  breadcrumb={[
                    { title: 'Dashboard', url: '/' },
                    { title: 'Payments', active: true }
                  ]}
                />
                <div className="flex-1"></div>
                <Button variant="outline" disabled>
                  <SheetIcon />
                  <span>Import</span>
                </Button>
                <Button asChild variant={'outline'}>
                  <Link to="/">
                    <PlusIcon /> New Payment
                  </Link>
                </Button>
              </>
            }
          >
            <div className="px-6 py-4 space-y-2"></div>
          </Layout>
        </div>
      </ProtectedRoute>
    </>
  )
}
