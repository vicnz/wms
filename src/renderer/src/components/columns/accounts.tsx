import { createColumnHelper } from '@tanstack/react-table'
import { type DataTableFeatures } from '@/components/datatable-features'
import { CollectionRecords } from '@lib/db.types'
import { Button } from '../ui/button'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type AccountsCols = CollectionRecords['accounts'] & {
  expand: {
    user: CollectionRecords['consessioners']
    meter: CollectionRecords['meters']
  }
}

const columnHelper = createColumnHelper<DataTableFeatures, AccountsCols>()

export const AccountColumns = columnHelper.columns([
  columnHelper.accessor('account_no', {
    header: 'Account No.'
  }),
  columnHelper.accessor('expand.user.name', {
    header: 'Owner'
  }),
  columnHelper.accessor('service_address', {
    header: 'Address',
    cell: ({ row }) => {
      return Object.values(row.original.service_address as any).join(', ')
    }
  }),
  columnHelper.accessor('expand.meter.serialno', {
    header: 'Meter No.',
    cell: ({ row }) => row.original.expand?.meter.serialno?.toUpperCase()
  }),
  columnHelper.accessor('expand.meter.status', {
    header: 'Status'
  }),
  columnHelper.display({
    id: 'sub_action',
    cell: ({ row }) => {
      return (
        <Button asChild variant={'link'}>
          <Link to={`/account/${row.original.id}`}>
            Details
            <ArrowUpRight />
          </Link>
        </Button>
      )
    }
  })
])
