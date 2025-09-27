'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import {
  Menu,
  X,
  User,
  Calendar,
  BookOpen,
  BarChart3,
  LogOut,
  Briefcase,
} from 'lucide-react'
import { User as SupabaseUser } from '@supabase/supabase-js'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<{ full_name: string; role: string } | null>(null)
  const router = useRouter()
  const { signOut } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        setUserProfile(profile)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setUserProfile(profile)
        } else {
          setUser(null)
          setUserProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navigation = user ? [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Perfil', href: '/profile', icon: User },
    { name: 'Citas', href: '/appointments', icon: Calendar },
    { name: 'Recursos', href: '/resources', icon: BookOpen },
    ...(userProfile?.role === 'client' ? [
      { name: 'Empleos', href: '/jobs', icon: Briefcase },
    ] : []),
  ] : []

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">
              Inclusión Laboral
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-border">
                  <div className="text-sm">
                    <p className="font-medium">{userProfile?.full_name}</p>
                    <p className="text-muted-foreground capitalize">{userProfile?.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Registrarse</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-border">
                    <p className="font-medium">{userProfile?.full_name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {userProfile?.role}
                    </p>
                  </div>
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}