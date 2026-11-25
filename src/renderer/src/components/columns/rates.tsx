import { createColumnHelper } from '@tanstack/react-table'
import { type DataTableFeatures } from '@/components/datatable-features'
import { CollectionRecords } from '@lib/db.types'
import { Button } from '../ui/button'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

type RatesCols = CollectionRecords['rates']

const columnHelper = createColumnHelper<DataTableFeatures, RatesCols>()

export const RatesColumns = columnHelper.columns([
  columnHelper.accessor('type', {
    header: 'Type'
  }),
  columnHelper.accessor('category', {
    header: 'Category'
  }),
  columnHelper.accessor('group', {
    header: 'Group'
  }),
  columnHelper.accessor('updated', {
    header: 'Last Updated',
    cell: ({ row }) => {
      return format(new Date(row.original.updated), 'MMM dd, yyyy')
    }
  }),

  columnHelper.display({
    id: 'action',
    cell: ({ row }) => {
      return (
        <Button asChild variant={'link'}>
          <Link to={`/rate/${row.original.id}`}>
            Details
            <ArrowUpRight />
          </Link>
        </Button>
      )
    }
  })
])
