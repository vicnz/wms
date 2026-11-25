'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type DatePickerProps = {
    selectedDate: Date | undefined
    onSelectedDate: (value: Date) => void
    disabled?: boolean
  }

export function DatePicker(props: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(props.selectedDate)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
          disabled={props.disabled}
        >
          <CalendarIcon />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          selected={date}
          onSelect={(val) => {
            if (props.onSelectedDate) props.onSelectedDate(val as any)
            setDate(val)
          }}
          mode="single"
          {...(props as any)}
        />
      </PopoverContent>
    </Popover>
  )
}
