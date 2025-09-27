'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  role: z.enum(['client', 'counselor']).optional(),
})

type AuthFormData = z.infer<typeof authSchema>

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSuccess?: () => void
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, signUp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      role: 'client',
    },
  })

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const { error } = await signUp(
          data.email,
          data.password,
          data.fullName!,
          data.role!
        )
        if (error) throw error
      } else {
        const { error } = await signIn(data.email, data.password)
        if (error) throw error
      }
      onSuccess?.()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin'
            ? 'Ingresa a tu cuenta para continuar'
            : 'Crea una nueva cuenta para comenzar'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Nombre Completo
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Tu nombre completo"
                  {...register('fullName')}
                  disabled={isLoading}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Tipo de Usuario
                </label>
                <select
                  id="role"
                  {...register('role')}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="client">Cliente (Busco trabajo)</option>
                  <option value="counselor">Consejero Laboral</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role.message}</p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                {...register('password')}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}