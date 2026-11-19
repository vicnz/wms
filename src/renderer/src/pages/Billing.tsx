import { PageBreadcrumb } from '@/components/breadcrumb'
import { BillsColumns } from '@/components/columns/bills'
import { DataTable } from '@/components/datatable'
import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { Button } from '@/components/ui/button'
import db from '@lib/db'
import { ChevronLeft, ChevronRight, PlusIcon, SheetIcon } from 'lucide-react'
import { Link, useLoaderData, useSearchParams } from 'react-router-dom'

export async function loader({ request }) {
  const client = db.getInstance()
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const readingRef = url.searchParams.get('reading')

  //pagination
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const perPage = parseInt(url.searchParams.get('perPage') || '10', 10) // 10 rows by default

  const filter: string[] = []

  if (id) {
    filter.push(`account = '${id}'`)
  }
  
  if(readingRef){
    filter.push(`reading = '${readingRef}'`)
  }

  try {
    const result = await client.collection('bills').getList(page, perPage, {
      filter: filter.length > 1 ? filter.join(' && ') : filter[0],
      expand: 'account,reading,payments_via_bill',
      requestKey: null
    })

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

export default function BillingPage() {
  const { items, page,  totalPages } = useLoaderData<typeof loader>()

  const [_, setSearchParams] = useSearchParams()

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', newPage.toString())
      return prev
    })
  }
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
                    { title: 'Billing', active: true }
                  ]}
                />
                <div className="flex-1"></div>
                <Button variant="outline" disabled>
                  <SheetIcon />
                  <span>Import</span>
                </Button>
                <Button asChild variant={'outline'}>
                  <Link to="/">
                    <PlusIcon /> New Record
                  </Link>
                </Button>
              </>
            }
          >
            <div className="px-6 py-4 space-y-2">
              <DataTable columns={BillsColumns} data={items as any} />
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
    </>
  )
}
