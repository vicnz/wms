import { PageBreadcrumb } from '@/components/breadcrumb'
import { RatesColumns } from '@/components/columns/rates'
import { DataTable } from '@/components/datatable'
import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { LocalSearch } from '@/components/search'
import { AppSidebar } from '@/components/sidebars/default'
import { Button } from '@/components/ui/button'
import pb from '@lib/db'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLoaderData, useSearchParams } from 'react-router-dom'

export async function loader({ request }) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const perPage = parseInt(url.searchParams.get('perPage') || '10', 10) // 10 rows by default

  const db = pb.getInstance()
  try {
    const filter: string[] = []
    if (query && query.length > 2) {
      filter.push(`type ~ '%${query}%'`)
      filter.push(`category ~ '%${query}%'`)
      filter.push(`group ~ '%${query}%'`)
    }

    const result = await db.collection('rates').getList(page, perPage, {
      sort: '-updated',
      requestKey: null,
      filter: filter.join(' || ')
    })

    return {
      data: result.items,
      page: result.page,
      perPage: result.perPage,
      totalItems: result.totalItems,
      totalPages: result.totalPages
    }
  } catch (error) {
    console.log(error)
    //@ts-ignore
    if (error?.isAbort) return { data: [], page: 1, perPage: 10, totalItems: 0, totalPages: 0 }
    console.error('Database Connectivity Error:', error)
    return { data: [], page: 1, perPage: 10, totalItems: 0, totalPages: 0 }
  }
}
//
export default function RatesPage() {
  const { data, page, totalPages } = useLoaderData<typeof loader>()

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
                  { title: 'Rates', url: '#', active: true }
                ]}
              />
              <div className="flex-1"></div>

              <Button variant={'outline'}>
                <span>Add New Rate</span>
              </Button>
            </>
          }
        >
          <div className="px-6 py-4 space-y-2">
            <LocalSearch placeholder="Search" />
            <DataTable columns={RatesColumns} data={data as any} />
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
