import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Droplets } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const credentials = z.object({
  email: z.email(),
  password: z.string().min(5)
})

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof credentials>>({
    resolver: zodResolver(credentials),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(save: z.infer<typeof credentials>) {
    try {
      await signIn(save.email, save.password)
      navigate('/')
    } catch {
      toast('Error Logging In, please try again', {
        position: 'top-center',
        type: 'error'
      })
    }
  }


  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Droplets className="size-4" />
          </div>
          Hydro Manager
        </a>
        <div className={'flex flex-col gap-6'}>
          <Card className='shadow-none border-0 bg-transparent'>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-black">Welcome back</CardTitle>
              <CardDescription>Login with your registered email and password</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        {...field}
                        placeholder="johndoe@example.com"
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      {/* <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a href="/" className="ml-auto text-sm underline-offset-4 hover:underline">
                        Forgot your password?
                      </a>
                    </div> */}
                      <FieldLabel>Password</FieldLabel>
                      <Input {...field} type="password" />
                    </Field>
                  )}
                />
                <Field>
                  <Button onClick={() => form.handleSubmit(onSubmit)()}>Login</Button>
                </Field>

                {/* <Field>
                    <Button type="submit">Login</Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <a href="#">Sign up</a>
                    </FieldDescription>
                  </Field> */}
              </FieldGroup>
            </CardContent>
          </Card>
          {/* <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>.
          </FieldDescription> */}
        </div>
      </div>
    </div>
  )
}
