'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  User,
  Video,
  Plus,
  Edit,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { format, parseISO, isAfter, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'

interface Appointment {
  id: string
  client_id: string
  counselor_id: string
  title: string
  description?: string
  scheduled_at: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  meeting_link?: string
  notes?: string
  created_at: string
  updated_at: string
  client?: { full_name: string; email: string }
  counselor?: { full_name: string; email: string }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [userProfile, setUserProfile] = useState<{ role: string; full_name?: string } | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        setUserProfile(profile)

        // Get appointments based on user role
        let query = supabase
          .from('appointments')
          .select(`
            *,
            client:users!appointments_client_id_fkey(full_name, email),
            counselor:users!appointments_counselor_id_fkey(full_name, email)
          `)

        if (profile?.role === 'client') {
          query = query.eq('client_id', user.id)
        } else if (profile?.role === 'counselor') {
          query = query.eq('counselor_id', user.id)
        }

        const { data } = await query.order('scheduled_at', { ascending: true })

        if (data) {
          setAppointments(data)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const getFilteredAppointments = () => {
    const now = new Date()
    
    switch (filter) {
      case 'upcoming':
        return appointments.filter(apt => 
          isAfter(parseISO(apt.scheduled_at), now) && apt.status === 'scheduled'
        )
      case 'past':
        return appointments.filter(apt => 
          isBefore(parseISO(apt.scheduled_at), now) || apt.status === 'completed'
        )
      case 'cancelled':
        return appointments.filter(apt => 
          apt.status === 'cancelled' || apt.status === 'no-show'
        )
      default:
        return appointments
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'no-show':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
      case 'no-show':
        return <X className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)

    if (!error) {
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: newStatus as Appointment['status'] }
              : apt
          )
        )
    }
  }

  const filteredAppointments = getFilteredAppointments()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Acceso no autorizado</h2>
          <p className="text-muted-foreground">Debes iniciar sesión para ver tus citas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mis Citas
            </h1>
            <p className="text-muted-foreground">
              Gestiona tus citas de asesoramiento laboral
            </p>
          </div>
          {userProfile?.role === 'client' && (
            <Link href="/appointments/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Button>
            </Link>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 p-1 bg-muted rounded-lg w-fit">
          {[
            { key: 'upcoming', label: 'Próximas' },
            { key: 'past', label: 'Pasadas' },
            { key: 'cancelled', label: 'Canceladas' },
            { key: 'all', label: 'Todas' },
          ].map((tab) => (
            <button
              key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const appointmentDate = parseISO(appointment.scheduled_at)
            const isUpcoming = isAfter(appointmentDate, new Date())
            const otherUser = userProfile?.role === 'client' 
              ? appointment.counselor 
              : appointment.client

            return (
              <Card key={appointment.id} className="group hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">
                            {appointment.status === 'no-show' ? 'No asistió' : appointment.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {appointment.title}
                        </h3>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(appointmentDate, "EEEE, d 'de' MMMM", { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(appointmentDate, 'HH:mm')} ({appointment.duration} min)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>
                            {userProfile?.role === 'client' ? 'Consejero: ' : 'Cliente: '}
                            {otherUser?.full_name}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {appointment.description && (
                        <p className="text-sm text-muted-foreground">
                          {appointment.description}
                        </p>
                      )}

                      {/* Meeting Link */}
                      {appointment.meeting_link && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Video className="h-4 w-4 text-primary" />
                          <a
                            href={appointment.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Unirse a la reunión virtual
                          </a>
                        </div>
                      )}

                      {/* Notes */}
                      {appointment.notes && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm">
                            <span className="font-medium">Notas: </span>
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {isUpcoming && appointment.status === 'scheduled' && (
                        <>
                          {userProfile?.role === 'counselor' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Completar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'no-show')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                No asistió
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Ver Notas
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No hay citas {filter === 'all' ? '' : filter === 'upcoming' ? 'próximas' : filter}
            </h3>
            <p className="text-muted-foreground mb-4">
              {userProfile?.role === 'client' 
                ? 'Agenda tu primera cita con un consejero laboral'
                : 'No tienes citas programadas en este momento'
              }
            </p>
            {userProfile?.role === 'client' && (
              <Link href="/appointments/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agendar Cita
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Quick Stats */}
        {appointments.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Resumen de Citas</CardTitle>
              <CardDescription>
                Estadísticas de tus citas de asesoramiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {appointments.filter(a => a.status === 'scheduled').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Programadas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {appointments.filter(a => a.status === 'completed').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Completadas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {appointments.filter(a => a.status === 'cancelled').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Canceladas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {appointments.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}