'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClientComponentClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Settings,
  Save,
  Star,
  Award,
  TrendingUp,
} from 'lucide-react'

const profileSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z.string().optional(),
  experience_level: z.enum(['entry', 'mid', 'senior']).optional(),
  preferred_industries: z.string().optional(),
  availability: z.enum(['full-time', 'part-time', 'flexible']).optional(),
  disabilities: z.string().optional(),
  accommodations_needed: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [userProfile, setUserProfile] = useState<{ role: string; full_name: string; phone?: string } | null>(null)
  const [profile, setProfile] = useState<{
    bio?: string;
    location?: string;
    skills?: string[];
    experience_level?: string;
    preferred_industries?: string[];
    availability?: string;
    disabilities?: string[];
    accommodations_needed?: string[];
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClientComponentClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Get user basic info
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        setUserProfile(userProfile)

        // Get detailed profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        setProfile(profile)

        // Reset form with current data
        if (userProfile || profile) {
          reset({
            full_name: userProfile?.full_name || '',
            phone: userProfile?.phone || '',
            bio: profile?.bio || '',
            location: profile?.location || '',
            skills: profile?.skills?.join(', ') || '',
            experience_level: (profile?.experience_level as 'entry' | 'mid' | 'senior') || 'entry',
            preferred_industries: profile?.preferred_industries?.join(', ') || '',
            availability: (profile?.availability as 'full-time' | 'part-time' | 'flexible') || 'full-time',
            disabilities: profile?.disabilities?.join(', ') || '',
            accommodations_needed: profile?.accommodations_needed?.join(', ') || '',
          })
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [supabase, reset])

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return
    
    setSaving(true)
    setMessage(null)

    try {
      // Update users table
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (userError) throw userError

      // Update or create profile
      const profileData = {
        user_id: user.id,
        bio: data.bio,
        location: data.location,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        experience_level: data.experience_level,
        preferred_industries: data.preferred_industries ? data.preferred_industries.split(',').map(s => s.trim()).filter(Boolean) : [],
        availability: data.availability,
        disabilities: data.disabilities ? data.disabilities.split(',').map(s => s.trim()).filter(Boolean) : [],
        accommodations_needed: data.accommodations_needed ? data.accommodations_needed.split(',').map(s => s.trim()).filter(Boolean) : [],
        updated_at: new Date().toISOString(),
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData)

      if (profileError) throw profileError

      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' })
      
      // Refresh data
      const { data: updatedUserProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      setUserProfile(updatedUserProfile)

      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setProfile(updatedProfile)

    } catch (error: unknown) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error al actualizar el perfil' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mi Perfil
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y preferencias profesionales
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>{userProfile?.full_name}</CardTitle>
                <CardDescription className="capitalize">
                  {userProfile?.role} • {profile?.experience_level || 'Sin especificar'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email || 'No especificado'}</span>
                  </div>
                  {userProfile?.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center space-x-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.availability && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{profile.availability.replace('-', ' ')}</span>
                    </div>
                  )}
                </div>

                {profile?.bio && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Acerca de mí</h4>
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  </div>
                )}

                {/* Profile Completeness */}
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Completitud del Perfil</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Información básica</span>
                      <span className="text-primary">85%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Evaluaciones</span>
                    </div>
                    <span className="text-sm font-medium">3/3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Progreso</span>
                    </div>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Citas completadas</span>
                    </div>
                    <span className="text-sm font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Nombre Completo *
                      </label>
                      <Input
                        {...register('full_name')}
                        placeholder="Tu nombre completo"
                      />
                      {errors.full_name && (
                        <p className="text-sm text-destructive mt-1">{errors.full_name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Teléfono
                      </label>
                      <Input
                        {...register('phone')}
                        placeholder="Tu número de teléfono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Ubicación
                    </label>
                    <Input
                      {...register('location')}
                      placeholder="Ciudad, País"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Biografía
                    </label>
                    <textarea
                      {...register('bio')}
                      placeholder="Cuéntanos sobre ti, tus objetivos y experiencia..."
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              {userProfile?.role === 'client' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información Profesional</CardTitle>
                    <CardDescription>
                      Ayúdanos a encontrar las mejores oportunidades para ti
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Nivel de Experiencia
                        </label>
                        <select
                          {...register('experience_level')}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="entry">Principiante</option>
                          <option value="mid">Intermedio</option>
                          <option value="senior">Avanzado</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Disponibilidad
                        </label>
                        <select
                          {...register('availability')}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="full-time">Tiempo Completo</option>
                          <option value="part-time">Medio Tiempo</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Habilidades
                      </label>
                      <Input
                        {...register('skills')}
                        placeholder="Ej: Comunicación, Excel, Trabajo en equipo (separadas por comas)"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separa las habilidades con comas
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Industrias de Interés
                      </label>
                      <Input
                        {...register('preferred_industries')}
                        placeholder="Ej: Tecnología, Salud, Educación (separadas por comas)"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Separa las industrias con comas
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Accessibility Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Accesibilidad</CardTitle>
                  <CardDescription>
                    Esta información nos ayuda a encontrar empleadores inclusivos (opcional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Discapacidades o Condiciones
                    </label>
                    <Input
                      {...register('disabilities')}
                      placeholder="Ej: Visual, Auditiva, Motriz (opcional, separadas por comas)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Esta información es confidencial y solo se usa para mejorar las recomendaciones
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Acomodaciones Necesarias
                    </label>
                    <textarea
                      {...register('accommodations_needed')}
                      placeholder="Describe cualquier acomodación que necesites en el lugar de trabajo..."
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}