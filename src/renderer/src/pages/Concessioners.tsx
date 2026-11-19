import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { Link, useLoaderData, useSearchParams } from 'react-router-dom'
import pb from '@lib/db'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, PlusCircle, SheetIcon } from 'lucide-react'
import { DataTable } from '@/components/datatable'
import { ConcessionColumns } from '@/components/columns/concessioners'
import { LocalSearch } from '@/components/search'
import { PageBreadcrumb } from '@/components/breadcrumb'

export const loader = async ({ request }) => {
  const db = pb.getInstance()
  const url = new URL(request.url)
  const query = url.searchParams.get('q')
  const id = url.searchParams.get('id')
  //pagination
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const perPage = parseInt(url.searchParams.get('perPage') || '10', 10) // 10 rows by default

  const filter: string[] = []
  if (query && query.length > 2) {
    filter.push(`name ~ '%${query}%'`)
  }

  if (id) {
    filter.push(`id = ${id}`)
  }

  try {
    const result = await db.collection('consessioners').getList(page, perPage, {
      filter: filter?.join(' && '),
      expand: 'accounts_via_user',
      requestKey: null
    })
    // return result.items
    return {
      items: result.items,
      page: result.page,
      perPage: result.perPage,
      totalItems: result.totalItems,
      totalPages: result.totalPages
    }
  } catch (error) {
    //@ts-ignore
    if (error?.isAbort) return { items: [], page: 1, perPage: 10, totalItems: 0, totalPages: 0 }
    console.error('Database Connectivity Error:', error)
    return { items: [], page: 1, perPage: 10, totalItems: 0, totalPages: 0 }
  }
}

export default function Concessioners() {
  const { items, page,  totalPages } = useLoaderData<typeof loader>()

  const [_, setSearchParams] = useSearchParams()

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', newPage.toString())
      return prev
    })
  }

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
                  { title: 'Concessioners', active: true }
                ]}
              />
              <div className="flex-1"></div>
              <Button variant="outline" disabled>
                <SheetIcon/>
                <span>Import</span>
              </Button>
              <Button asChild >
                <Link to="/concessioner/new">
                  <PlusCircle /> Register
                </Link>
              </Button>
            </>
          }
        >
          <div className="px-6 py-4 space-y-2">
            <LocalSearch placeholder="Search by name" />
            <DataTable columns={ConcessionColumns} data={items as any} />
            <div className="flex items-center justify-end space-x-2 py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft />
              </Button>
              <span className="text-sm font-medium">
                {page} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </Layout>
      </div>
    </ProtectedRoute>
  )
}
