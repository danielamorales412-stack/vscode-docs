import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  Target,
  BookOpen,
  Calendar,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Heart,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Conectando{" "}
              <span className="text-primary">Talento Diverso</span>
              <br />
              con Oportunidades
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Plataforma integral de asesoramiento laboral que empodera a personas
              con discapacidades para encontrar empleos significativos y desarrollar
              carreras exitosas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Conocer Más
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Servicios Especializados
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos herramientas y recursos diseñados específicamente para
              facilitar la inclusión laboral efectiva.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Asesoramiento Personalizado</CardTitle>
                <CardDescription>
                  Consejeros especializados en inclusión laboral que brindan
                  orientación adaptada a tus necesidades específicas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Evaluación de Habilidades</CardTitle>
                <CardDescription>
                  Herramientas avanzadas para identificar y potenciar tus
                  fortalezas y habilidades únicas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Búsqueda de Empleo</CardTitle>
                <CardDescription>
                  Algoritmo inteligente que conecta tu perfil con oportunidades
                  laborales inclusivas y compatibles.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Recursos de Capacitación</CardTitle>
                <CardDescription>
                  Biblioteca completa de cursos, guías y materiales para
                  desarrollar habilidades profesionales.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Seguimiento Continuo</CardTitle>
                <CardDescription>
                  Sistema de citas y seguimiento para asegurar tu progreso
                  constante hacia tus objetivos profesionales.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Análisis de Progreso</CardTitle>
                <CardDescription>
                  Dashboard personalizado para monitorear tu desarrollo
                  profesional y celebrar tus logros.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Impacto Real
            </h2>
            <p className="text-xl text-muted-foreground">
              Resultados que demuestran nuestro compromiso con la inclusión
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <p className="text-muted-foreground">Tasa de colocación laboral</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
              <p className="text-muted-foreground">Personas asesoradas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Empresas asociadas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Satisfacción del cliente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Historias de Éxito
            </h2>
            <p className="text-xl text-muted-foreground">
              Conoce las experiencias de quienes han transformado sus carreras
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  &quot;Gracias a esta plataforma encontré un trabajo que se adapta
                  perfectamente a mis necesidades. El asesoramiento fue
                  excepcional y personalizado.&quot;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">María González</p>
                    <p className="text-sm text-muted-foreground">Desarrolladora Web</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  &quot;El proceso de evaluación me ayudó a descubrir habilidades que
                  no sabía que tenía. Ahora trabajo en una empresa inclusiva
                  increíble.&quot;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Carlos Rodríguez</p>
                    <p className="text-sm text-muted-foreground">Analista de Datos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  &quot;Como consejera, esta plataforma me permite brindar un servicio
                  más efectivo y organizado a mis clientes. Es una herramienta
                  invaluable.&quot;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Ana López</p>
                    <p className="text-sm text-muted-foreground">Consejera Laboral</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            ¿Listo para Transformar tu Carrera?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Únete a nuestra comunidad de profesionales exitosos y empresas
            inclusivas. Tu próxima oportunidad te está esperando.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Registrarse Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contactar
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}