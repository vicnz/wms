import { PageBreadcrumb } from '@/components/breadcrumb'
import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { Button } from '@/components/ui/button'
import { SaveIcon } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import pb from '@lib/db'

export const loader = async ({ params }) => {
  const db = pb.getInstance()
  const id = params.id

  if (id === 'new') {
    return {
      data: undefined
    }
  }

  try {
    const result = await db.collection('readings').getOne(id, {
      expand: 'accounts_via_user'
    })
    // return result.items
    return {
      data: result
    }
  } catch (error) {
    console.log(error)
    //@ts-ignore
    return { data: undefined }
  }
}

export default function BillingSingle() {
  const navigate = useNavigate()
  const [search, setSearch] = useSearchParams();
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
                  { title: 'Billings', url: '/billings' },
                  { title: 'Billing', active: true }
                ]}
              />
              <div className="flex-1"></div>
              <Button variant="outline" disabled>
                <SaveIcon />
                <span>Save</span>
              </Button>
              <Button variant={'outline'} onClick={() => navigate(-1)}>
                <span>Cancel</span>
              </Button>
            </>
          }
        >
          <div className="px-6 py-4 space-y-2"></div>
        </Layout>
      </div>
    </ProtectedRoute>
  )
}
