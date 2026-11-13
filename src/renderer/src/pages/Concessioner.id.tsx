import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { useLoaderData, useNavigate } from 'react-router-dom'
import pb from '@lib/db'
import { Button } from '@/components/ui/button'
import { SaveIcon } from 'lucide-react'
import { PageBreadcrumb } from '@/components/breadcrumb'

export const loader = async ({ params }) => {
  const db = pb.getInstance()
  const id = params.id

  if (id === 'new') {
    return {
      data: undefined,
      registration: true
    }
  }

  try {
    const result = await db.collection('consessioners').getOne(id, {
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

export default function ConcessionerItem() {
  const { data } = useLoaderData<typeof loader>()
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
                  { title: 'Concessioners', url: '/concessioners' },
                  { title: data?.id.toUpperCase() || 'Register', active: true }
                ]}
              />

              <div className="flex-1"></div>
              <Button variant={'default'} className="rounded-lg">
                <SaveIcon />
                <span>Save</span>
              </Button>
              <Button variant={'outline'} className="rounded-lg" onClick={() => navigate(-1)}>
                <SaveIcon />
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
