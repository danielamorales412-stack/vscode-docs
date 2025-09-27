'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { createClientComponentClient } from '@/lib/supabase'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [router, supabase])

  const handleSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Crear nueva cuenta
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:text-primary/80"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
        <AuthForm mode="signup" onSuccess={handleSuccess} />
      </div>
    </div>
  )
}