'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Heart,
  ExternalLink,
  Star,
  Users,
  Accessibility,
} from 'lucide-react'

interface JobMatch {
  id: string
  job_title: string
  company_name: string
  description: string
  requirements: string[]
  match_score: number
  location: string
  salary_range?: string
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship'
  accessibility_features?: string[]
  created_at: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [minMatchScore, setMinMatchScore] = useState(0)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('job_matches')
          .select('*')
          .eq('user_id', user.id)
          .order('match_score', { ascending: false })

        if (data && !error) {
          setJobs(data)
          setFilteredJobs(data)
        }
      }
      setLoading(false)
    }

    fetchJobs()
  }, [supabase])

  useEffect(() => {
    let filtered = jobs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by job type
    if (selectedType !== 'all') {
      filtered = filtered.filter(job => job.job_type === selectedType)
    }

    // Filter by match score
    filtered = filtered.filter(job => job.match_score >= minMatchScore / 100)

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, selectedType, minMatchScore])

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-green-100 text-green-800'
      case 'part-time':
        return 'bg-blue-100 text-blue-800'
      case 'contract':
        return 'bg-purple-100 text-purple-800'
      case 'internship':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Oportunidades de Empleo
          </h1>
          <p className="text-muted-foreground text-lg">
            Empleos personalizados basados en tu perfil y evaluaciones
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar empleos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Job Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Todos los tipos</option>
                <option value="full-time">Tiempo Completo</option>
                <option value="part-time">Medio Tiempo</option>
                <option value="contract">Contrato</option>
                <option value="internship">Pasantía</option>
              </select>

              {/* Match Score Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Compatibilidad mín: {minMatchScore}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {filteredJobs.length} empleos encontrados
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getJobTypeColor(job.job_type)}`}>
                        {job.job_type.replace('-', ' ')}
                      </span>
                      <div className={`flex items-center text-sm font-medium ${getMatchScoreColor(job.match_score)}`}>
                        <Star className="h-4 w-4 mr-1" />
                        {Math.round(job.match_score * 100)}% compatible
                      </div>
                    </div>
                    <CardTitle className="text-lg">{job.job_title}</CardTitle>
                    <CardDescription className="font-medium text-foreground">
                      {job.company_name}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Job Details */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary_range}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Publicado hace 2 días
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.description}
                  </p>

                  {/* Requirements */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Requisitos principales:</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.slice(0, 4).map((req, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 4 && (
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                          +{job.requirements.length - 4} más
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Accessibility Features */}
                  {job.accessibility_features && job.accessibility_features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <Accessibility className="h-4 w-4 mr-1" />
                        Características de Accesibilidad:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {job.accessibility_features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Aplicar
                    </Button>
                    <Button variant="outline">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No se encontraron empleos
            </h3>
            <p className="text-muted-foreground mb-4">
              {jobs.length === 0 
                ? 'Completa tus evaluaciones para obtener recomendaciones personalizadas'
                : 'Intenta ajustar tus filtros de búsqueda'
              }
            </p>
            {jobs.length === 0 && (
              <Button asChild>
                <a href="/assessments">Completar Evaluaciones</a>
              </Button>
            )}
          </div>
        )}

        {/* Job Search Tips */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Consejos para la Búsqueda de Empleo</CardTitle>
            <CardDescription>
              Maximiza tus oportunidades con estos consejos personalizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Optimiza tu Perfil</h4>
                  <p className="text-sm text-muted-foreground">
                    Completa todas las evaluaciones para mejorar la precisión de las recomendaciones.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Enfócate en la Compatibilidad</h4>
                  <p className="text-sm text-muted-foreground">
                    Prioriza empleos con alta compatibilidad para mejores resultados.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Accessibility className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Aprovecha la Accesibilidad</h4>
                  <p className="text-sm text-muted-foreground">
                    Busca empleos que ofrezcan características de accesibilidad específicas.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}