import { createColumnHelper } from '@tanstack/react-table'
import { type DataTableFeatures } from '@/components/datatable-features'
import { CollectionRecords } from '@lib/db.types'
import { Button } from '../ui/button'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format, isPast } from 'date-fns'
import { convertToCurrency } from '@lib/formatters'
import { cn } from 'cn'

type BillsCols = CollectionRecords['bills'] & {
  expand: {
    account: CollectionRecords['accounts']
    reading: CollectionRecords['readings']
    payments_via_bill: Array<CollectionRecords['payments']>
  }
}

const columnHelper = createColumnHelper<DataTableFeatures, BillsCols>()

export const BillsColumns = columnHelper.columns([
  columnHelper.accessor('expand.account.account_no', {
    header: 'Account No.'
  }),
  columnHelper.accessor('expand.reading.id', {
    header: 'Reading'
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: ({ row }) => format(new Date(row.original.date!), 'MM/dd/yyyy')
  }),
  columnHelper.accessor('due', {
    header: 'Due Date',
    cell: ({ row }) => {
      const due = new Date(row.original.due!)
      const isDue = isPast(due)
      const payments = row.original.expand?.payments_via_bill

      if (payments && payments?.length > 0) {
        return <span>{format(new Date(row.original.due!), 'MM/dd/yyyy')}</span>
      }
      if (isDue) {
        return (
          <span className="text-destructive" title="Bill is overdue already">
            {format(new Date(row.original.due!), 'MM/dd/yyyy')}
          </span>
        )
      }
      return (
        <span className={cn(isDue ? 'text-destructive' : '')}>
          {format(new Date(row.original.due!), 'MM/dd/yyyy')}
        </span>
      )
    }
  }),
  columnHelper.accessor('base_charge', {
    header: 'Base Charge',
    cell: ({ row }) => convertToCurrency(row.original.base_charge ?? '0', 'en', 'PHP')
  }),
  columnHelper.accessor('consumption_charge', {
    header: 'Consumption Charge',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <span>{convertToCurrency(row.original.consumption_charge ?? '0', 'en', 'PHP')}</span>
          <span className="text-xs text-blue-600">
            (
            {Math.abs(
              (row.original.expand.reading.previous ?? 0) - (row.original.expand.reading.value ?? 0)
            )}
            &#x33A5;)
          </span>
        </div>
      )
    }
  }),
  columnHelper.accessor('tax', {
    header: 'Tax',
    cell: ({ row }) => convertToCurrency(row.original.tax ?? '0', 'en', 'PHP')
  }),
  columnHelper.display({
    id: 'payed',
    header: 'Payed',
    cell: ({row}) => {
       const payments = row.original.expand?.payments_via_bill;
       if(payments && payments?.length > 0 ) {
        return <span className='text-green-600'>SETTLED</span>
      }
      return <span className='text-gray-600'>UNSETTLED</span>
    }
  }),
  columnHelper.display({
    id: 'sub_action',
    cell: ({ row }) => {
      return (
        <Button asChild variant={'link'}>
          <Link to={`/billing/${row.original.id}`}>
            Details
            <ArrowUpRight />
          </Link>
        </Button>
      )
    }
  })
])
