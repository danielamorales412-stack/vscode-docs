'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Target,
  Brain,
  Heart,
  CheckCircle,
  Clock,
  Play,
  BarChart3,
  Award,
} from 'lucide-react'
import Link from 'next/link'

interface Assessment {
  id: string
  type: 'skills' | 'personality' | 'career-interest'
  questions: Record<string, unknown>[]
  answers: Record<string, unknown>[]
  results: Record<string, unknown> | null
  completed_at?: string
  created_at: string
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (data) {
          setAssessments(data)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const assessmentTypes = [
    {
      type: 'skills' as const,
      title: 'Evaluación de Habilidades',
      description: 'Identifica tus fortalezas técnicas y profesionales',
      icon: Target,
      color: 'bg-blue-100 text-blue-800',
      estimatedTime: 15,
      questions: 25,
    },
    {
      type: 'personality' as const,
      title: 'Evaluación de Personalidad',
      description: 'Descubre tu perfil de personalidad laboral',
      icon: Brain,
      color: 'bg-purple-100 text-purple-800',
      estimatedTime: 20,
      questions: 30,
    },
    {
      type: 'career-interest' as const,
      title: 'Intereses Profesionales',
      description: 'Explora carreras que se alineen con tus intereses',
      icon: Heart,
      color: 'bg-pink-100 text-pink-800',
      estimatedTime: 12,
      questions: 20,
    },
  ]

  const getCompletedAssessment = (type: string) => {
    return assessments.find(a => a.type === type && a.completed_at)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Acceso no autorizado</h2>
          <p className="text-muted-foreground">Debes iniciar sesión para acceder a las evaluaciones</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Evaluaciones Profesionales
          </h1>
          <p className="text-muted-foreground text-lg">
            Descubre tus fortalezas y encuentra el camino profesional ideal para ti
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Tu Progreso en Evaluaciones
            </CardTitle>
            <CardDescription>
              Completa todas las evaluaciones para obtener recomendaciones personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assessmentTypes.map((assessment) => {
                const completed = getCompletedAssessment(assessment.type)
                const Icon = assessment.icon
                
                return (
                  <div key={assessment.type} className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <div className={`p-2 rounded-lg ${assessment.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{assessment.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {completed ? 'Completada' : 'Pendiente'}
                      </p>
                    </div>
                    {completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>
                )
              })}
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progreso General</span>
                <span className="text-sm text-muted-foreground">
                  {assessments.filter(a => a.completed_at).length} / {assessmentTypes.length}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${(assessments.filter(a => a.completed_at).length / assessmentTypes.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {assessmentTypes.map((assessment) => {
            const completed = getCompletedAssessment(assessment.type)
            const Icon = assessment.icon
            
            return (
              <Card key={assessment.type} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${assessment.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{assessment.title}</CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {assessment.estimatedTime} min
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {assessment.questions} preguntas
                      </div>
                    </div>
                    
                    {completed ? (
                      <div className="space-y-3">
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Completada</span>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/assessments/${assessment.type}/results`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Ver Resultados
                            </Button>
                          </Link>
                          <Link href={`/assessments/${assessment.type}`}>
                            <Button variant="outline" size="icon">
                              <Play className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/assessments/${assessment.type}`}>
                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Comenzar Evaluación
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Results Summary */}
        {assessments.filter(a => a.completed_at).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Resumen de Resultados
              </CardTitle>
              <CardDescription>
                Insights clave de tus evaluaciones completadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills Summary */}
                {getCompletedAssessment('skills') && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center">
                      <Target className="h-4 w-4 mr-2 text-blue-500" />
                      Habilidades Destacadas
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Comunicación</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Trabajo en Equipo</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Resolución de Problemas</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground">78%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Career Interests */}
                {getCompletedAssessment('career-interest') && (
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-pink-500" />
                      Áreas de Interés
                    </h4>
                    <div className="space-y-2">
                      <div className="px-3 py-2 bg-pink-50 rounded-lg">
                        <span className="text-sm font-medium">Tecnología</span>
                        <p className="text-xs text-muted-foreground">Alto interés en desarrollo y innovación</p>
                      </div>
                      <div className="px-3 py-2 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Servicio al Cliente</span>
                        <p className="text-xs text-muted-foreground">Fuerte orientación hacia ayudar a otros</p>
                      </div>
                      <div className="px-3 py-2 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Análisis de Datos</span>
                        <p className="text-xs text-muted-foreground">Interés en patrones y análisis</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {assessments.filter(a => a.completed_at).length === assessmentTypes.length && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Award className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-medium text-primary">¡Perfil Completo!</h4>
                      <p className="text-sm text-muted-foreground">
                        Has completado todas las evaluaciones. Ahora puedes acceder a recomendaciones personalizadas de empleos.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href="/jobs">
                      <Button>
                        Ver Empleos Recomendados
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}