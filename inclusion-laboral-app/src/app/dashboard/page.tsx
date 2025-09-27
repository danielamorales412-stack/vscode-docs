'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Users,
  Briefcase,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalAppointments: number
  upcomingAppointments: number
  completedAssessments: number
  jobMatches: number
  resourcesViewed: number
  progressScore: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [userProfile, setUserProfile] = useState<{ role: string; full_name: string } | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/signin')
        return
      }

      setUser(user)

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      setUserProfile(profile)

      // Get dashboard stats
      const [
        { count: totalAppointments },
        { count: upcomingAppointments },
        { count: completedAssessments },
        { count: jobMatches },
      ] = await Promise.all([
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('client_id', user.id),
        supabase.from('appointments').select('*', { count: 'exact', head: true })
          .eq('client_id', user.id)
          .eq('status', 'scheduled')
          .gte('scheduled_at', new Date().toISOString()),
        supabase.from('assessments').select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('completed_at', 'is', null),
        supabase.from('job_matches').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ])

      setStats({
        totalAppointments: totalAppointments || 0,
        upcomingAppointments: upcomingAppointments || 0,
        completedAssessments: completedAssessments || 0,
        jobMatches: jobMatches || 0,
        resourcesViewed: 12, // Placeholder
        progressScore: 75, // Placeholder
      })

      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isClient = userProfile?.role === 'client'
  const isCounselor = userProfile?.role === 'counselor'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenido, {userProfile?.full_name}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isClient && 'Aquí tienes un resumen de tu progreso profesional'}
            {isCounselor && 'Panel de control para gestionar tus clientes'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isClient ? 'Citas Totales' : 'Clientes Activos'}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde la semana pasada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isClient ? 'Próximas Citas' : 'Citas Pendientes'}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.upcomingAppointments || 0}</div>
              <p className="text-xs text-muted-foreground">
                Esta semana
              </p>
            </CardContent>
          </Card>

          {isClient && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Empleos Compatibles</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.jobMatches || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Nuevas oportunidades
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Evaluaciones</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.completedAssessments || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Completadas
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {isCounselor && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recursos Creados</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    Este mes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">
                    Colocaciones exitosas
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Accede rápidamente a las funciones más utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isClient && (
                <>
                  <Link href="/appointments/new">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Agendar Cita
                    </Button>
                  </Link>
                  <Link href="/assessments">
                    <Button className="w-full justify-start" variant="outline">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Realizar Evaluación
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button className="w-full justify-start" variant="outline">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Buscar Empleos
                    </Button>
                  </Link>
                  <Link href="/resources">
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Recursos de Aprendizaje
                    </Button>
                  </Link>
                </>
              )}

              {isCounselor && (
                <>
                  <Link href="/clients">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Gestionar Clientes
                    </Button>
                  </Link>
                  <Link href="/appointments">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ver Agenda
                    </Button>
                  </Link>
                  <Link href="/resources/create">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Recurso
                    </Button>
                  </Link>
                  <Link href="/analytics">
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Ver Analíticas
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Tus últimas interacciones en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cita completada con María González</p>
                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nueva evaluación de habilidades disponible</p>
                    <p className="text-xs text-muted-foreground">Hace 1 día</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">3 nuevas oportunidades de empleo</p>
                    <p className="text-xs text-muted-foreground">Hace 2 días</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Recurso de capacitación completado</p>
                    <p className="text-xs text-muted-foreground">Hace 3 días</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section for Clients */}
        {isClient && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Tu Progreso</CardTitle>
              <CardDescription>
                Seguimiento de tu desarrollo profesional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Perfil Profesional</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Evaluaciones</span>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Capacitación</span>
                    <span className="text-sm text-muted-foreground">40%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}