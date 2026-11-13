import { createColumnHelper } from '@tanstack/react-table'
import { type DataTableFeatures } from '@/components/datatable-features'
import { CollectionRecords } from '@lib/db.types'

type ConcessionerCols = CollectionRecords['consessioners'] & {
  expand: {
    accounts_via_user: Array<CollectionRecords['accounts']>
  }
}

const columnHelper = createColumnHelper<DataTableFeatures, ConcessionerCols>()

export const ConcessionColumns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'Customer No.',
    cell: ({ row }) => row.original.id.toUpperCase()
  }),
  columnHelper.accessor('name', {
    header: 'Customer'
  }),
  columnHelper.accessor('expand.accounts_via_user', {
    header: 'Accounts',
    cell: ({ row }) => {
      return <>{row.original.expand.accounts_via_user?.length}</>
    }
  }),
  columnHelper.accessor('verified', {
    header: 'Verified'
  }),
  columnHelper.accessor('created', {
    header: 'Created'
  }),
  // columnHelper.display({
  //   id: 'action',
  //   cell: ({ row }) => {
  //     return (
  //       <Button asChild variant={'link'}>
  //         <Link to={`/concessioner/${row.original.id}`}>
  //           Details
  //           <ArrowUpRight />
  //         </Link>
  //       </Button>
  //     )
  //   }
  // })
])
