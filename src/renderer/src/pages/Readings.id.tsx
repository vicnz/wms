import { PageBreadcrumb } from '@/components/breadcrumb'
import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, SaveIcon, SearchIcon } from 'lucide-react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import pb from '@lib/db'
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { CollectionRecords } from '@lib/db.types'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { SkeletonShimmer } from '@/components/skeleton-content'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useAlertDialog } from '@/hooks/use-alert-dialog'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from 'cn'
import { toast } from 'react-toastify'

export const loader = async ({ params }) => {
  const db = pb.getInstance()
  const id = params.id

  if (id === 'new') {
    return {
      data: undefined
    }
  }

  try {
    const result = await db.collection('readings').getOne(id, {
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

const formSchema = z.object({
  meter: z.string(),
  date: z.date(),
  previous: z.coerce.number().int(),
  value: z.coerce.number().int(),
  type: z.string(),
  from: z.date(),
  to: z.date(),
  owner: z.string().optional()
})

type IFormSchema = z.infer<typeof formSchema>

export default function ReadingsData() {
  const { data } = useLoaderData<typeof loader>()
  const form = useForm<IFormSchema>({
    //@ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: data?.date ? new Date(data?.date) : undefined,
      from: data?.from ? new Date(data?.from) : undefined,
      to: data?.to ? new Date(data?.to) : undefined,
      meter: data?.meter,
      previous: data?.previous || 0,
      type: data?.type ?? 'manual',
      value: data?.value
    }
  })

  const isDisabled = useMemo(() => {
    return data && data.id ? true : false
  }, [])

  const navigate = useNavigate()
  const { AlertDialogComponent, confirm } = useAlertDialog()
  const w_account = form.watch('meter')
  const w_owner = form.watch('owner')

  async function onSave(values: IFormSchema) {
    const confirmed = await confirm({
      title: 'Save Reading',
      description: 'Save reading values, for this meter'
    })

    if (confirmed === true) {
      const client = pb.getInstance()
      try {
        if (data && data.id) {
          await client.collection('readings').update(data.id, {
            value: values.value
          })
        } else {
          await client.collection('readings').create({
            to: values?.to?.toISOString(),
            from: values?.from?.toISOString(),
            date: values?.date?.toISOString(),
            meter: values?.meter,
            previous: values?.previous,
            value: values?.value,
            type: values?.type
          })
        }
        navigate('/readings')
      } catch (error) {
        console.log(error)
        toast.error('An Error Occurred', {
          position: 'top-center'
        })
        return
      }
    }
    return
  }

  async function onDelete(id: string) {
    const confirmed = await confirm({
      title: 'Delete Item',
      description: 'Deleting a reading will not affect the billing item',
      isDestructive: true
    })

    if (confirmed === true) {
      try {
        const client = pb.getInstance()
        await client.collection('readings').delete(id)
        navigate('/readings')
      } catch (error) {
        console.log(error)
        toast.error('Failed to Delete', {
          position: 'top-center'
        })
      }
    }
  }

  useEffect(() => {
    console.log(form.formState.errors)
  }, [form.formState.errors])
  return (
    <ProtectedRoute>
      {AlertDialogComponent}
      <div className="h-screen w-screen grid place-items-center">
        <Layout
          Sidebar={<AppSidebar />}
          Header={
            <>
              <PageBreadcrumb
                breadcrumb={[
                  { title: 'Dashboard', url: '/' },
                  { title: 'Readings', url: '/readings' },
                  { title: 'Readings', active: true }
                ]}
              />
              <div className="flex-1"></div>
              <Button variant="outline" onClick={() => form.handleSubmit(onSave as any)()}>
                <SaveIcon />
                <span>Save</span>
              </Button>
              <Button variant={'outline'} onClick={() => navigate(-1)}>
                <span>Cancel</span>
              </Button>
            </>
          }
        >
          <div className="px-6 py-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Meter/Account</CardTitle>
                    <CardDescription>Specify the account/meter number</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Controller
                      control={form.control}
                      name="meter"
                      render={({ field, fieldState }) => (
                        <Sheet>
                          <SheetTrigger className="w-full" disabled={isDisabled}>
                            <Item
                              className={cn(
                                'border border-muted-foreground border-dashed w-full',
                                data && data.id ? 'bg-muted text-muted-foreground' : '',
                                fieldState.invalid ? 'border border-destructive text-destructive' : ''
                              )}
                            >
                              <ItemContent className="text-left">
                                <ItemTitle>{w_owner || 'Select Account'}</ItemTitle>
                                <ItemDescription className="uppercase">
                                  {w_account || 'N/A'}
                                </ItemDescription>
                              </ItemContent>
                              <ItemActions>
                                <ArrowUpRight />
                              </ItemActions>
                            </Item>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Select Customer</SheetTitle>
                            </SheetHeader>
                            <SelectMeter form={form as any} />
                          </SheetContent>
                        </Sheet>
                      )}
                    />
                  </CardContent>
                </Card>
                {w_account && !data && (
                  <FetchRecentReading form={form as any} meter_no={w_account} />
                )}
                {
                  data && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Generate New Billing</CardTitle>
                        <CardDescription>Generate a billing for {' '}
                          <span className="font-bold uppercase">{data.meter}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className='w-full' variant={'outline'}>Generate Invoice</Button>
                      </CardContent>
                    </Card>
                  )
                }
              </div>
              <div className="flex flex-col gap-2">
                <Card>
                  <CardContent className="space-y-2">
                    <Controller
                      control={form.control}
                      name="date"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Date</FieldLabel>
                          {/* @ts-ignore */}
                          {/* <Input {...field} type="date" /> */}
                          <DatePicker
                            selectedDate={field.value || undefined}
                            onSelectedDate={(val) => field.onChange(val)}
                            disabled={isDisabled || field.disabled}
                          />
                        </Field>
                      )}
                    />
                    <Controller
                      control={form.control}
                      name="type"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Type</FieldLabel>
                          <Select
                            {...field}
                            defaultValue="manual"
                            value={field.value}
                            onValueChange={(val) => field.onChange(val)}
                            disabled={field.disabled || isDisabled}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type of Reading " />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="automated">Automated</SelectItem>
                              <SelectItem value="estimated">Estimated</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2">
                      <Controller
                        control={form.control}
                        name="from"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Start of Billing Date</FieldLabel>
                            {/* @ts-ignore */}
                            <DatePicker
                              selectedDate={field.value || undefined}
                              onSelectedDate={(val) => field.onChange(val)}
                              disabled={field.disabled || isDisabled}
                            />
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name="to"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>End of Billing Date</FieldLabel>
                            {/* @ts-ignore */}
                            <DatePicker
                              selectedDate={field.value || undefined}
                              onSelectedDate={(val) => field.onChange(val)}
                              disabled={field.disabled || isDisabled}
                            />
                          </Field>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2">
                      <Controller
                        control={form.control}
                        name="previous"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Previous Reading</FieldLabel>
                            {/* @ts-ignore */}
                            <Input
                              {...field}
                              value={field.value ?? 0}
                              type="number"
                              disabled={field.disabled || isDisabled}
                            />
                          </Field>
                        )}
                      />
                      {data && data.id ? (
                        <Controller
                          control={form.control}
                          name="value"
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>Current Reading</FieldLabel>
                              {/* @ts-ignore */}
                              <Input
                                {...field}
                                disabled={false}
                                type="number"
                                className={cn(data ? 'border-2 border-blue-600' : '')}
                              />
                            </Field>
                          )}
                        />
                      ) : (
                        <Controller
                          control={form.control}
                          name="value"
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>Current Reading</FieldLabel>
                              {/* @ts-ignore */}
                              <Input {...field} type="number" />
                            </Field>
                          )}
                        />
                      )}
                    </div>
                  </CardContent>
                  {data && (
                    <CardFooter>
                      <Button
                        variant={'destructive'}
                        className="w-full"
                        onClick={() => onDelete(data.id)}
                      >
                        Delete Item
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </ProtectedRoute>
  )
}

function SelectMeter(props: { form: UseFormReturn<IFormSchema> }) {
  const { form } = props
  const [query, setQuery] = useState<string>('')
  const find = useDeferredValue(query)
  const [pending, startTransition] = useTransition()
  const [list, setList] = useState<
    Array<
      CollectionRecords['accounts'] & {
        expand: { user: CollectionRecords['consessioners']; meter: CollectionRecords['meters'] }
      }
    >
  >()

  const preload = () => {
    startTransition(async () => {
      const client = pb.getInstance()
      try {
        const result = await client.collection('accounts').getList(1, 10, {
          filter: `user.name ~ '%${find}%' || meter.serialno ~ '%${find}%'`,
          expand: 'user,meter',
          requestKey: null
        })
        setList(result.items as any)
      } catch (error) {
        setList([])
        console.log('error')
        console.error(error)
      }
    })
  }

  useEffect(() => {
    preload()
  }, [find])

  return (
    <>
      <div className="p-2">
        <InputGroup>
          <InputGroupAddon align={'inline-start'}>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Name"
          />
        </InputGroup>
      </div>
      <Separator />
      {pending && !list ? (
        <SkeletonShimmer type="paragraph" />
      ) : (
        <div className=" p-2">
          {list?.map((item, idx) => (
            <Item
              key={idx}
              className="p-2 hover:bg-accent rounded-md hover:cursor-pointer"
              aria-label="button"
              onClick={() => {
                form.setValue('meter', item.expand?.meter.id)
                form.setValue('owner', item.expand?.user?.name)
              }}
            >
              <ItemContent>
                <ItemTitle>
                  <span className="font-bold">{item.expand.user.name}</span>
                  <span className="capitalize">{item.type}</span>
                </ItemTitle>
                <ItemDescription className="uppercase">
                  #{item.expand?.meter?.serialno} | {item.account_no}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      )}
    </>
  )
}

function FetchRecentReading(props: { form: UseFormReturn<IFormSchema>; meter_no: string }) {
  const { form, meter_no } = props
  const [reading, setReading] = useState<
    Array<
      CollectionRecords['readings'] & {
        expand: {
          bills_via_reading: CollectionRecords['bills']
        }
      }
    >
  >()
  const [_, startTransition] = useTransition()

  const preload = () => {
    startTransition(async () => {
      const client = pb.getInstance()
      try {
        const result = await client.collection('readings').getList(1, 1, {
          filter: `meter = '${meter_no}'`,
          requestKey: null,
          sort: '-updated',
          expand: 'bills_via_reading'
        })

        setReading(result.items as any)
        const item = result?.items[0] || undefined
        if (item) {
          form.setValue('previous', item.value)
        } else {
          form.setValue('previous', 0)
        }
        //active reading
      } catch (error) {
        setReading(undefined)
        console.log('error')
        console.error(error)
      }
    })
  }

  useEffect(() => {
    preload()
  }, [props.meter_no])

  if (!reading) return null
  if (reading.length < 1) return null

  return (
    <>
      <Item className="" variant={'outline'}>
        <ItemContent>
          <ItemTitle>Latest Reading</ItemTitle>
          <ItemDescription>{reading[0].value}</ItemDescription>
        </ItemContent>
        <ItemActions>
          {reading[0].expand?.bills_via_reading && <span>Has Bill Record</span>}
        </ItemActions>
      </Item>
    </>
  )
}
