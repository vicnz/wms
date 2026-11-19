import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { Link, useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'
import pb from '@lib/db'
import { PageBreadcrumb } from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, SaveIcon, SearchIcon } from 'lucide-react'
import z from 'zod'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldTitle } from '@/components/ui/field'
import { useDeferredValue, useEffect, useState, useTransition } from 'react'
import { CollectionRecords } from '@lib/db.types'
import db from '@lib/db'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { SkeletonShimmer } from '@/components/skeleton-content'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { convertToCurrency } from '@lib/formatters'
import { useAlertDialog } from '@/hooks/use-alert-dialog'
import { customAlphabet } from 'nanoid'
import { format } from 'date-fns'

const generate_account_id = customAlphabet(`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`, 20)

export const loader = async ({ params }) => {
  const db = pb.getInstance()
  const id = params.id

  if (id === 'new') {
    return {
      data: undefined,
      registration: true
    }
  }

  try {
    const result = await db.collection('accounts').getOne(id, {
      expand: 'user,meter'
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
  user: z.string(),
  owner: z.string().optional(),
  service_address: z.object({
    district: z.string().optional(),
    brgy: z.string().optional(),
    street: z.string().optional(),
    landmark: z.string().optional()
  }),
  billing_address: z
    .object({
      same_as_service: z.boolean().optional(),
      district: z.string().optional(),
      brgy: z.string().optional(),
      street: z.string().optional(),
      landmark: z.string().optional()
    })
    .optional(),
  meter: z.object({
    serial: z.string(),
    type: z.string()
  }),
  type: z.string()
})
type IFormSchema = z.infer<typeof formSchema>

export default function AccountsItem() {
  const revalidator = useRevalidator()
  const [pending] = useTransition()
  const { data } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { AlertDialogComponent, confirm } = useAlertDialog()

  const form = useForm<IFormSchema>({
    resolver: zodResolver(formSchema),
    disabled: pending,
    defaultValues: {
      user: data?.user,
      billing_address: data?.billing_address,
      service_address: data?.service_address,
      type: data?.type,
      //@ts-ignore
      owner: data?.expand?.user?.name,
      meter: {
        //@ts-ignore
        id: data?.expand?.meter?.id,
        //@ts-ignore
        serial: data?.expand?.meter?.serialno,
        //@ts-ignore
        type: data?.expand?.meter?.type
      }
    }
  })

  async function onSubmit(save: IFormSchema) {
    const client = db.getInstance()
    if (data?.id) {
      const confirmed = await confirm({
        title: 'Update Account',
        description:
          save.user !== data.user
            ? 'Your about to change the owner of this account, are you sure?'
            : 'Proceed to update the details of this account'
      })

      if (confirmed !== true) {
        return
      }
      try {
        await client.collection('accounts').update(data.id, {
          user: save.user,
          service_address: save.service_address,
          billing_address:
            save.billing_address?.same_as_service === true
              ? save.service_address
              : save.service_address,
          type: save.type
        })
        revalidator.revalidate()
      } catch (error) {
        console.log(error)
        console.error('server error')
        return
      }
    } else {
      const confirmed = await confirm({
        title: 'Create New Account',
        description: 'This will automatically create a meter record for this account.'
      })
      if (confirmed !== true) {
        return
      }
      if (!save.meter || !save?.meter?.serial) {
        return
      }

      try {
        const result = await client.collection('meters').create({
          //   id: save.meter?.id, //autogenerator
          serialno: save.meter?.serial,
          type: save.meter?.type,
          status: 'active',
          installation: new Date(Date.now()).toISOString()
        })

        const account_id = generate_account_id()
        await client.collection('accounts').create({
          account_no: account_id,
          user: save.user,
          meter: result.id,
          service_address: save.service_address,
          billing_address:
            save.billing_address?.same_as_service === true
              ? save.service_address
              : save.service_address,
          type: save.type
        })
        revalidator.revalidate()
        return
      } catch (error) {
        console.log(error)
        console.error('Server Error')
        return
      }
    }
  }

  const w_owner = form.watch('owner')
  const w_user = form.watch('user')
  const w_same_address = form.watch('billing_address.same_as_service')

  useEffect(() => {
    console.log(form.formState.errors)
  }, [form.formState.errors])

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
                    { title: 'Accounts', url: '/accounts' },
                    { title: data?.id.toUpperCase() || 'New Account', active: true }
                  ]}
                />
                <div className="flex-1"></div>
                <Button
                  disabled={!form.formState?.isDirty || pending}
                  onClick={() => form.handleSubmit(onSubmit as any)()}
                >
                  <SaveIcon />
                  <span>Save</span>
                </Button>
                <Button variant={'outline'} onClick={() => navigate(-1)} disabled={pending}>
                  <span>Cancel</span>
                </Button>
              </>
            }
          >
            <div className="px-6 py-4 space-y-2">
              <div className="flex gap-2">
                <div className="flex flex-col gap-2 min-w-[400px]">
                  <Card>
                    <CardHeader>
                      <CardDescription>Customer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {/* @ts-ignore */}
                        {data?.expand?.user?.name || 'Select A Customer First'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {/* @ts-ignore */}
                        {data?.expand?.user?.id?.toUpperCase() || 'N/A'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardDescription>Meter No.</CardDescription>
                      <CardAction>
                        <div className="text-sm text-blue-600 capitalize">
                          {/* @ts-ignore */}
                          {data?.expand?.meter?.status}
                        </div>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl uppercase font-bold">
                        {/* @ts-ignore */}
                        {data?.expand?.meter?.serialno || 'No Meter'}
                        <Button variant={'link'} className=" inline-block" size="sm">
                          <Link
                            // @ts-ignore
                            to={`/readings?meter=${encodeURIComponent(data?.expand.meter?.id)}`}
                          >
                            Readings
                          </Link>
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {/* @ts-ignore */}
                        {data?.expand?.meter?.type || 'No meter yet created for this account'}
                      </div>
                    </CardContent>
                  </Card>
                  {data?.id && (
                    <>
                      <RenderBalanceForAccount id={data.id} />
                      <RenderLatestBills id={data.id} />
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <Card>
                    <CardContent>
                      <div className="space-y-2">
                        <Field>
                          <FieldLabel>Account Owner</FieldLabel>
                          <Sheet>
                            <SheetTrigger>
                              <Item className="border border-muted-foreground border-dashed">
                                <ItemContent className="text-left">
                                  <ItemTitle>{w_owner || 'Select Customer'}</ItemTitle>
                                  <ItemDescription className="uppercase">
                                    {w_user || 'N/A'}
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
                              <SelectConcessioner form={form as any} />
                            </SheetContent>
                          </Sheet>
                        </Field>
                        <Separator />
                        {!data && (
                          <FieldGroup className="gap-1">
                            <FieldTitle className="text-lg font-semibold">
                              Meter Information
                            </FieldTitle>

                            <Controller
                              control={form.control}
                              name="meter.serial"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel>Serial Number.</FieldLabel>
                                  <Input {...field} placeholder="" />
                                </Field>
                              )}
                            />
                            <Controller
                              control={form.control}
                              name="meter.type"
                              render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                  <FieldLabel>Meter Number</FieldLabel>
                                  <Select
                                    {...field}
                                    value={field.value}
                                    onValueChange={(val) => field.onChange(val)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Meter Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={'analog'}>Analog</SelectItem>
                                      <SelectItem value={'digital'}>Digital</SelectItem>
                                      <SelectItem value={'hybrid'}>Hybrid</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </Field>
                              )}
                            />
                          </FieldGroup>
                        )}
                        <Controller
                          control={form.control}
                          name="type"
                          render={({ field, fieldState }) => (
                            <>
                              <FieldTitle className="text-lg font-semibold">
                                Account Type
                              </FieldTitle>
                              <Field data-invalid={fieldState.invalid}>
                                <Select
                                  {...field}
                                  value={field.value}
                                  onValueChange={(val) => field.onChange(val)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Account Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={'residential'}>Residential</SelectItem>
                                    <SelectItem value={'commercial'}>Commercial</SelectItem>
                                    <SelectItem value={'institutional'}>Institutional</SelectItem>
                                  </SelectContent>
                                </Select>
                              </Field>
                            </>
                          )}
                        />
                        <FieldGroup className="gap-1">
                          <FieldTitle className="text-lg font-semibold">
                            Address / Location
                          </FieldTitle>
                          <Controller
                            control={form.control}
                            name="service_address.district"
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>District</FieldLabel>
                                <Input {...field} />
                              </Field>
                            )}
                          />
                          <Controller
                            control={form.control}
                            name="service_address.brgy"
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Suburb/Barangay</FieldLabel>
                                <Input {...field} />
                              </Field>
                            )}
                          />
                          <Controller
                            control={form.control}
                            name="service_address.street"
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Street</FieldLabel>
                                <Input {...field} />
                              </Field>
                            )}
                          />
                          <Controller
                            control={form.control}
                            name="service_address.landmark"
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Landmark</FieldLabel>
                                <Input {...field} />
                              </Field>
                            )}
                          />
                        </FieldGroup>
                        <FieldGroup>
                          <FieldTitle className="text-lg font-semibold">Billing Address</FieldTitle>
                          <Controller
                            control={form.control}
                            name="billing_address.same_as_service"
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid} orientation={'horizontal'}>
                                <Checkbox
                                  id="same_as_address"
                                  checked={field.value ?? false}
                                  onCheckedChange={(val) => field.onChange(val)}
                                />
                                <FieldLabel htmlFor="same_as_address">
                                  Same as Account Address
                                </FieldLabel>
                              </Field>
                            )}
                          />
                          {!w_same_address && w_same_address == false && (
                            <>
                              <Controller
                                control={form.control}
                                name="billing_address.district"
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>District</FieldLabel>
                                    <Input {...field} />
                                  </Field>
                                )}
                              />
                              <Controller
                                control={form.control}
                                name="billing_address.brgy"
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Suburb/Barangay</FieldLabel>
                                    <Input {...field} />
                                  </Field>
                                )}
                              />
                              <Controller
                                control={form.control}
                                name="billing_address.street"
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Street</FieldLabel>
                                    <Input {...field} />
                                  </Field>
                                )}
                              />
                              <Controller
                                control={form.control}
                                name="billing_address.landmark"
                                render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Landmark</FieldLabel>
                                    <Input {...field} />
                                  </Field>
                                )}
                              />
                            </>
                          )}
                        </FieldGroup>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </div>
      </ProtectedRoute>
      {AlertDialogComponent}
    </>
  )
}

function SelectConcessioner(props: { form: UseFormReturn<IFormSchema> }) {
  const { form } = props
  const [query, setQuery] = useState<string>('')
  const find = useDeferredValue(query)
  const [pending, startTransition] = useTransition()
  const [list, setList] = useState<Array<CollectionRecords['consessioners']>>()

  const preload = () => {
    startTransition(async () => {
      const client = db.getInstance()
      try {
        const result = await client.collection('consessioners').getList(1, 10, {
          filter: `name ~ '%${find}%'`,
          expand: 'accounts_via_user',
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
                form.setValue('user', item.id)
                form.setValue('owner', item.name)
              }}
            >
              <ItemContent>
                <ItemTitle>{item.name}</ItemTitle>
                <ItemDescription className="uppercase">{item.id}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      )}
    </>
  )
}

function RenderBalanceForAccount(props: { id: string }) {
  const { id } = props
  const [pending, startTransition] = useTransition()
  const [data, setData] = useState<CollectionRecords['account_balances'] | null>()

  const preload = () => {
    startTransition(async () => {
      const client = db.getInstance()
      try {
        const result = await client.collection('account_balances').getOne(id, {
          requestKey: null
        })
        setData(result)
      } catch (error) {
        setData(null)
        console.log('error')
        console.error(error)
      }
    })
  }

  useEffect(() => {
    preload()
  }, [])

  if (pending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonShimmer type="paragraph" />
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-destructive">
          {convertToCurrency(
            Math.abs(data?.remaining_balance ?? (0 as any)).toString(),
            'en',
            'PHP'
          )}
        </div>
        <div className="text-muted-foreground text-xs">Remaining Balance</div>
        <Separator className="my-1" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xl">
              {convertToCurrency(data?.total_billed ?? ('0' as any), 'en', 'PHP')}
            </div>
            <div className="text-muted-foreground text-xs">Total Billed</div>
          </div>
          <div>
            <div className="text-xl">
              {convertToCurrency(data?.total_paid ?? ('0' as any), 'en', 'PHP')}
            </div>
            <div className="text-muted-foreground text-xs">Total Payed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RenderLatestBills(props: { id: string }) {
  const { id } = props
  const [pending, startTransition] = useTransition()
  const [data, setData] = useState<Array<CollectionRecords['bills_balance']> | null>()

  const preload = () => {
    startTransition(async () => {
      const client = db.getInstance()
      try {
        const result = await client.collection('bills_balance').getList(1, 5, {
          filter: `account_id = '${id}'`,
          sort: '-billing_date',
          requestKey: null
        })
        setData(result.items as any)
      } catch (error) {
        setData(null)
        console.log('error')
        console.error(error)
      }
    })
  }

  useEffect(() => {
    preload()
  }, [])

  if (pending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonShimmer type="paragraph" />
        </CardContent>
      </Card>
    )
  }
  if (!data || data.length < 1) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Bills</CardTitle>
        <CardAction>
          <Button asChild variant="link" size="xs">
            <Link to={`/billings?id=${id}`}>
              View All <ArrowUpRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {data?.map((item, idx) => (
          <Item className="p-0.5" key={idx}>
            <ItemContent>
              <ItemTitle className="uppercase font-semibold">{item.bill_id}</ItemTitle>
              <ItemDescription className="text-xs">
                <div className="flex flex-wrap gap-2">
                  <span className="" title="Remaining Balance">
                    {convertToCurrency((item?.remaining_bill_balance as any) ?? '0', 'en', 'PHP')}
                  </span>
                  <span>{format(new Date(item.billing_date!), 'MM/dd/yyyy')}</span>
                </div>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              {item.original_amount == item.total_paid_to_date ? (
                <span className="text-green-600">PAID</span>
              ) : (
                <span className="text-gray-600">PENDING</span>
              )}
            </ItemActions>
          </Item>
        ))}
      </CardContent>
    </Card>
  )
}
