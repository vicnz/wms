import Layout from '@/components/layouts/default'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from '@/components/sidebars/default'
import { useLoaderData, useNavigate, Link } from 'react-router-dom'
import pb from '@lib/db'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, SaveIcon } from 'lucide-react'
import { PageBreadcrumb } from '@/components/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { useAlertDialog } from '@/hooks/use-alert-dialog'
import db from '@lib/db'
import { nanoid } from 'nanoid'
import { toast } from 'react-toastify'

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
    const result = await db.collection('consessioners').getOne(id, {
      expand: 'accounts_via_user'
    })
    // return result.items
    return {
      data: result
    }
  } catch (error) {
    console.log(error)
    //@ts-ignore
    return { data: undefined, registration: false }
  }
}

const formSchema = z.object({
  email: z.email().nonempty(),
  name: z.string().nonempty()
})

type IFormSchema = z.infer<typeof formSchema>

export default function ConcessionerItem() {
  const { data, registration } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const { AlertDialogComponent, prompt, confirm } = useAlertDialog()

  const form = useForm<IFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name,
      email: data?.email
    }
  })

  async function onSave(values: IFormSchema) {
    const confirmed = await confirm({
      title: registration ? 'Register' : 'Update',
      description: registration
        ? 'Register this new concessioner'
        : 'Update the new credentials of this concessioner',
      actionText: registration ? 'Register' : 'Update'
    })

    if (confirmed === true) {
      const client = db.getInstance()
      try {
        if (registration && !data) {
          const random_password = nanoid(10)
          await client.collection('consessioners').create({
            email: values.email?.trim(),
            name: values?.name?.trim(),
            emailVisibility: true,
            password: random_password,
            passwordConfirm: random_password,
          })

          confirm({
            title: 'Registered Successfully',
            description: `New concessioner was created, this generated password will be used by the concessioner when he/she login to the bill viewer\n[${random_password}]`
          })
          navigate(-1) //go back to screen
        } else {
          await client.collection('consessioners').update(data?.id!, {
            email: values.email?.trim(),
            name: values?.name?.trim()
          })
          confirm({
            title: 'Updated Successfully',
            description: `Concessioner details was update`
          })
        }
      } catch (error) {
        console.log(error)

        toast('Server Error', {
          type: 'error',
          position: 'top-center'
        })
        return
      }
    }
  }

  async function onDelete() {
    if (data?.id) {
      const confirmed = await confirm({
        title: 'Delete Concessioner',
        description: 'Are your sure you want to delete this concessioner?',
        isDestructive: true
      })

      if (confirmed !== true) {
        return
      }

      try {
        const client = db.getInstance()
        await client.collection('consessioners').delete(data?.id)
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
                    { title: 'Concessioners', url: '/concessioners' },
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
                      <CardTitle>Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Controller
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Email</FieldLabel>
                            <Input {...field} placeholder="User email" />
                          </Field>
                        )}
                      />
                      <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Name</FieldLabel>
                            <Input {...field} placeholder="Concessioners Name" />
                          </Field>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="gap-2">
                      {registration && registration === true ? (
                        <Button className="w-full" onClick={() => form.handleSubmit(onSave)()}>
                          Register New Concessioner
                        </Button>
                      ) : (
                        <>
                          <Button className="flex-1" onClick={() => form.handleSubmit(onSave)()}>
                            Update Concessioner
                          </Button>
                          <Button className="flex-1" disabled title="Still In Development">
                            Reset Password
                          </Button>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                </div>
                <div className="flex flex-col w-[350px] gap-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Linked Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(data?.expand as any)?.accounts_via_user ? (
                        <>
                          {(data?.expand as any)?.accounts_via_user?.map((item, idx) => (
                            <Item key={idx} className="p-2">
                              <ItemContent>
                                <ItemTitle>{item.account_no}</ItemTitle>
                                <ItemDescription className="capitalize">
                                  {item?.type}
                                </ItemDescription>
                              </ItemContent>
                              <ItemActions>
                                <Button asChild variant={'link'}>
                                  <Link to={`/account/${item?.id}`}>
                                    Details
                                    <ArrowUpRight />
                                  </Link>
                                </Button>
                              </ItemActions>
                            </Item>
                          ))}
                        </>
                      ) : (
                        <>
                          <Empty>
                            <EmptyContent>
                              <EmptyTitle>No Registered Account</EmptyTitle>
                              <EmptyDescription>
                                This concessioner is either new or it is yet to be registered with
                                an account
                              </EmptyDescription>
                            </EmptyContent>
                          </Empty>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  {!registration && (
                    <Card className="bg-destructive/20 shadow-none border-destructive">
                      <CardContent>
                        <CardTitle className="text-destructive">Removing Concessioner</CardTitle>
                        <div className="h-2"></div>
                        <CardDescription>
                          {(data?.expand as any)?.accounts_via_user ? (
                            <span>
                              Concessioner has {(data?.expand as any)?.accounts_via_user?.length}{' '}
                              existing account(s)
                            </span>
                          ) : (
                            <span className="max-w-sm wrap-normal">
                              Concessioners without linked accounts are considered dormant and
                              should be remove
                            </span>
                          )}
                        </CardDescription>
                      </CardContent>
                      <CardFooter>
                        <Button
                          disabled={!!(data?.expand as any)?.accounts_via_user}
                          className="flex-1"
                          variant={'destructive'}
                          onClick={() => onDelete()}
                        >
                          REMOVE
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </Layout>
        </div>
      </ProtectedRoute>
    </>
  )
}
