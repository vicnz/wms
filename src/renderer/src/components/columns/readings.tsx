import { createColumnHelper } from '@tanstack/react-table'
import { type DataTableFeatures } from '@/components/datatable-features'
import { CollectionRecords } from '@lib/db.types'
import { Button } from '../ui/button'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

type ReadingsCols = CollectionRecords['readings'] & {
  expand: {
    meter: CollectionRecords['meters']
    bills_via_reading: CollectionRecords['bills']
  }
}

const columnHelper = createColumnHelper<DataTableFeatures, ReadingsCols>()

export const ReadingColumns = columnHelper.columns([
  columnHelper.accessor('expand.meter.serialno', {
    header: 'Meter No.'
  }),
  columnHelper.accessor('previous', {
    header: 'Previous Value',
    cell: ({ row }) => <span>{row.original.previous}&#x33A5;</span>
  }),
  columnHelper.accessor('value', {
    header: 'Reading Value',
    cell: ({ row }) => <span>{row.original.value}&#x33A5;</span>
  }),
  columnHelper.accessor('date', {
    header: 'Date Issued',
    cell: ({ row }) => format(new Date(row.original.date!), 'MM/dd/yyyy')
  }),
  columnHelper.accessor('from', {
    header: 'Billing Start',
    cell: ({ row }) => format(new Date(row.original.from!), 'MM/dd/yyyy')
  }),
  columnHelper.accessor('to', {
    header: 'Billing End',
    cell: ({ row }) => format(new Date(row.original.to!), 'MM/dd/yyyy')
  }),
  columnHelper.display({
    id: 'is_billed',
    header: "Issued?",
    cell: ({ row }) => {
      const bill = row.original.expand.bills_via_reading
      if (!bill) {
        return <span>NOT BILLED YET</span>
      }
      return <span className='text-blue-600'>BILL ISSUED</span>
    }
  }),
  columnHelper.display({
    id: 'sub_action',
    cell: ({ row }) => {
      return (
        <Button asChild variant={'link'}>
          <Link to={`/reading/${row.original.id}`}>
            Details
            <ArrowUpRight />
          </Link>
        </Button>
      )
    }
  })
])
