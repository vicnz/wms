import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { useLoaderData, useNavigate } from 'react-router-dom'
import pb from '@lib/db'
import { Button } from '@/components/ui/button'
import { SaveIcon, TrashIcon } from 'lucide-react'
import { PageBreadcrumb } from '@/components/breadcrumb'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import z from 'zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAlertDialog } from '@/hooks/use-alert-dialog'
import db from '@lib/db'
import { toast } from 'react-toastify'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export const loader = async ({ params }) => {
  const db = pb.getInstance()
  const id = params.id

  if (id === 'new') {
    return {
      data: undefined
    }
  }

  try {
    const result = await db.collection('rates').getOne(id, {})
    // return result.items
    let valuesCleaned: { value: number; cost: number }[] = []
    if (result.values) {
      valuesCleaned = (result.values as any)?.map((item) => ({ value: item[0], cost: [1] }))
    }
    return {
      data: {
        ...result,
        values: valuesCleaned
      }
    }
  } catch (error) {
    console.log(error)
    //@ts-ignore
    return { data: undefined }
  }
}

const formSchema = z.object({
  category: z.string().optional(),
  type: z.string(),
  group: z.string().optional(),
  description: z.string().optional(),
  values: z.array(z.object({ value: z.coerce.number(), cost: z.coerce.number() }))
})

type IFormSchema = z.infer<typeof formSchema>

export default function RatesItem() {
  const { data } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { AlertDialogComponent, confirm } = useAlertDialog()

  const form = useForm<IFormSchema>({
    //@ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: data?.category,
      type: data?.type,
      values: data?.values || [],
      description: data?.description,
      group: data?.group
    }
  })

  const fieldValues = useFieldArray({
    control: form.control,
    name: 'values'
  })

  async function onSave(values: IFormSchema) {
    const confirmed = await confirm({
      title: !data ? 'Add Rate' : 'Update Rate',
      description: !data ? 'Creating a new rate guide' : 'Updating rate values and description',
      actionText: !data ? 'Add' : 'Update'
    })

    if (confirmed === true) {
      const client = db.getInstance()
      //   try {
      //     if (registration && !data) {
      //       const random_password = nanoid(10)
      //       await client.collection('consessioners').create({
      //         email: values.email?.trim(),
      //         name: values?.name?.trim(),
      //         emailVisibility: true,
      //         password: random_password,
      //         passwordConfirm: random_password
      //       })

      //       confirm({
      //         title: 'Registered Successfully',
      //         description: `New concessioner was created, this generated password will be used by the concessioner when he/she login to the bill viewer\n[${random_password}]`
      //       })
      //       navigate(-1) //go back to screen
      //     } else {
      //       await client.collection('consessioners').update(data?.id!, {
      //         email: values.email?.trim(),
      //         name: values?.name?.trim()
      //       })
      //       confirm({
      //         title: 'Updated Successfully',
      //         description: `Concessioner details was update`
      //       })
      //     }
      //   } catch (error) {
      //     console.log(error)

      //     toast('Server Error', {
      //       type: 'error',
      //       position: 'top-center'
      //     })
      //     return
      //   }
    }
  }

  async function onDelete() {
    if (data?.id) {
      const confirmed = await confirm({
        title: 'Delete Rate',
        description: 'Are your sure you want to delete this rate?',
        isDestructive: true
      })

      if (confirmed !== true) {
        return
      }

      try {
        const client = db.getInstance()
        await client.collection('rates').delete(data?.id)
        navigate(-1)
      } catch (error) {
        console.log(error)

        toast('Server Error', {
          type: 'error',
          position: 'top-center'
        })
        return
      }
    }
    return
  }

  return (
    <>
      {AlertDialogComponent}
      <ProtectedRoute>
        <div className="h-screen w-screen grid place-items-center">
          <Layout
            Sidebar={<AppSidebar />}
            Header={
              <>
                <PageBreadcrumb
                  breadcrumb={[
                    { title: 'Dashboard', url: '/' },
                    { title: 'Rates', url: '/rates' },
                    { title: data?.id.toUpperCase() || 'Register', active: true }
                  ]}
                />

                <div className="flex-1"></div>
                <Button variant={'default'} className="rounded-lg">
                  <SaveIcon />
                  <span>Save</span>
                </Button>
                <Button variant={'outline'} className="rounded-lg" onClick={() => navigate(-1)}>
                  <SaveIcon />
                  <span>Cancel</span>
                </Button>
              </>
            }
          >
            <div className="px-6 py-4 space-y-2">
              <div className="flex gap-2 items-start">
                <div className="flex flex-col flex-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Rate Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Controller
                        control={form.control}
                        name="category"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Category</FieldLabel>
                            <Select {...field} onOpenChange={(val) => field.onChange(val)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={'consumption'}>Consumption Rate</SelectItem>
                                <SelectItem value={'tax'}>Tax</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="type"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Type</FieldLabel>
                            <Select {...field} onOpenChange={(val) => field.onChange(val)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={'residential'}>Residential</SelectItem>
                                <SelectItem value={'commercial'}>Commercial</SelectItem>
                                <SelectItem value={'institutional'}>Institutional</SelectItem>
                                <SelectItem value={'others'}>Others</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="group"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Group</FieldLabel>
                            <Select {...field} onOpenChange={(val) => field.onChange(val)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Group" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={'charges'}>Charges</SelectItem>
                                <SelectItem value={'others'}>Others</SelectItem>
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="description"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Description</FieldLabel>
                            <Textarea {...field} />
                          </Field>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col w-[350px] gap-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Rate Values</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                      {fieldValues.fields?.map((item, idx) => (
                        <div className="flex gap-2 items-center">
                          <Controller
                            control={form.control}
                            name={`values.${idx}.value`}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Value</FieldLabel>
                                <Input {...field} type="number" />
                              </Field>
                            )}
                          />
                          <Controller
                            control={form.control}
                            name={`values.${idx}.cost`}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Cost</FieldLabel>
                                <Input {...field} type="number" />
                              </Field>
                            )}
                          />
                          <Button
                            variant={'ghost'}
                            size="icon-sm"
                            onClick={() => fieldValues.remove(idx)}
                          >
                            <TrashIcon />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={'outline'}
                        onClick={() => {
                          fieldValues.append({
                            cost: 0,
                            value: 0
                          })
                        }}
                      >
                        Add Consumption Value
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </Layout>
        </div>
      </ProtectedRoute>
    </>
  )
}
