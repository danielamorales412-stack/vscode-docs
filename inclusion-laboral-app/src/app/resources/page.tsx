'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  BookOpen,
  Video,
  FileText,
  Wrench,
  Download,
  Clock,
  Search,
  Star,
  ExternalLink,
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'course' | 'tool' | 'template'
  content_url?: string
  tags: string[]
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_time?: number
  created_at: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (data && !error) {
        setResources(data)
        setFilteredResources(data)
      }
      setLoading(false)
    }

    fetchResources()
  }, [supabase])

  useEffect(() => {
    let filtered = resources

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(resource => resource.difficulty_level === selectedDifficulty)
    }

    setFilteredResources(filtered)
  }, [resources, searchTerm, selectedType, selectedDifficulty])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      case 'course':
        return <BookOpen className="h-5 w-5" />
      case 'tool':
        return <Wrench className="h-5 w-5" />
      case 'template':
        return <Download className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-800'
      case 'video':
        return 'bg-red-100 text-red-800'
      case 'course':
        return 'bg-green-100 text-green-800'
      case 'tool':
        return 'bg-purple-100 text-purple-800'
      case 'template':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Centro de Recursos
          </h1>
          <p className="text-muted-foreground text-lg">
            Descubre herramientas, guías y materiales para potenciar tu desarrollo profesional
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Todos los tipos</option>
                <option value="article">Artículos</option>
                <option value="video">Videos</option>
                <option value="course">Cursos</option>
                <option value="tool">Herramientas</option>
                <option value="template">Plantillas</option>
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Todos los niveles</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Mostrando {filteredResources.length} de {resources.length} recursos
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                      {getTypeIcon(resource.type)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(resource.difficulty_level)}`}>
                      {resource.difficulty_level}
                    </span>
                  </div>
                  {resource.estimated_time && (
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {resource.estimated_time}min
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                        +{resource.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex space-x-2">
                    {resource.content_url ? (
                      <Button asChild className="flex-1">
                        <a
                          href={resource.content_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Acceder
                        </a>
                      </Button>
                    ) : (
                      <Button className="flex-1" disabled>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Ver Contenido
                      </Button>
                    )}
                    <Button variant="outline" size="icon">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No se encontraron recursos
            </h3>
            <p className="text-muted-foreground">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
          </div>
        )}

        {/* Featured Resources */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Recursos Destacados</CardTitle>
            <CardDescription>
              Contenido recomendado para acelerar tu desarrollo profesional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 p-4 bg-primary/5 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Guía de Entrevistas</h4>
                  <p className="text-sm text-muted-foreground">Tips para destacar</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-primary/5 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Curso de Habilidades</h4>
                  <p className="text-sm text-muted-foreground">Desarrollo integral</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-primary/5 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Plantilla de CV</h4>
                  <p className="text-sm text-muted-foreground">Formato inclusivo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}