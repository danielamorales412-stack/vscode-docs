import Link from 'next/link'
import { Briefcase, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Inclusión Laboral</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Conectando talento diverso con oportunidades laborales inclusivas.
              Construyendo un futuro más equitativo para todos.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail size={16} />
                <span>contacto@inclusion-laboral.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/counseling" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Asesoramiento Laboral
                </Link>
              </li>
              <li>
                <Link href="/services/skills-assessment" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Evaluación de Habilidades
                </Link>
              </li>
              <li>
                <Link href="/services/job-matching" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Búsqueda de Empleo
                </Link>
              </li>
              <li>
                <Link href="/services/training" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Capacitación
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Centro de Recursos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Guías
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Acerca de Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Términos de Servicio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Inclusión Laboral. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/accessibility" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Accesibilidad
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
              <Link href="/sitemap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Mapa del Sitio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}