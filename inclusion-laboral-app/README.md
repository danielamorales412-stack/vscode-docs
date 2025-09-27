# Inclusión Laboral - Plataforma de Asesoramiento Laboral Inclusivo

Una aplicación web moderna y escalable diseñada para conectar personas con discapacidades con oportunidades de empleo y servicios de asesoramiento laboral especializado.

## 🌟 Características Principales

### Para Clientes (Buscadores de Empleo)
- **Evaluaciones Personalizadas**: Sistema integral de evaluación de habilidades, personalidad e intereses profesionales
- **Búsqueda de Empleo Inteligente**: Algoritmo de matching que conecta perfiles con oportunidades laborales inclusivas
- **Asesoramiento Profesional**: Acceso a consejeros especializados en inclusión laboral
- **Recursos de Capacitación**: Biblioteca completa de cursos, guías y materiales de desarrollo profesional
- **Seguimiento de Progreso**: Dashboard personalizado para monitorear el desarrollo profesional
- **Sistema de Citas**: Programación y gestión de sesiones de asesoramiento

### Para Consejeros Laborales
- **Gestión de Clientes**: Herramientas para administrar y dar seguimiento a múltiples clientes
- **Creación de Recursos**: Sistema para crear y compartir materiales de capacitación
- **Análisis y Reportes**: Métricas de desempeño y progreso de clientes
- **Calendario Integrado**: Gestión de citas y disponibilidad

### Características de Accesibilidad
- **Diseño Inclusivo**: Interfaz accesible que cumple con estándares WCAG
- **Compatibilidad con Tecnologías Asistivas**: Optimizado para lectores de pantalla
- **Navegación por Teclado**: Soporte completo para navegación sin mouse
- **Alto Contraste**: Esquemas de color accesibles
- **Texto Escalable**: Soporte para diferentes tamaños de fuente

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 con TypeScript
- **Styling**: Tailwind CSS v4 con sistema de diseño personalizado
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **UI Components**: Componentes personalizados con Radix UI
- **Formularios**: React Hook Form con validación Zod
- **Iconos**: Lucide React
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd inclusion-laboral-app
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aquí
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aquí
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key_aquí

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar la Base de Datos

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ve al editor SQL en tu dashboard de Supabase
3. Ejecuta el script SQL que se encuentra en `database/schema.sql`

### 5. Ejecutar la Aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

- **users**: Información básica de usuarios (extiende auth.users)
- **profiles**: Perfiles detallados con habilidades y preferencias
- **appointments**: Sistema de citas entre clientes y consejeros
- **assessments**: Evaluaciones de habilidades y personalidad
- **job_matches**: Oportunidades de empleo personalizadas
- **resources**: Recursos de capacitación y materiales educativos
- **progress**: Seguimiento del progreso profesional

### Seguridad (RLS)

Todas las tablas implementan Row Level Security (RLS) con políticas que aseguran:
- Los usuarios solo pueden acceder a sus propios datos
- Los consejeros pueden ver información de sus clientes
- Los recursos son públicos pero solo los consejeros pueden crearlos

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Primario**: Púrpura (#8b5cf6) - Representa inclusión e innovación
- **Secundario**: Gris suave - Para elementos de apoyo
- **Éxito**: Verde - Para confirmaciones y logros
- **Advertencia**: Amarillo - Para alertas
- **Error**: Rojo - Para errores y acciones destructivas

### Tipografía
- **Fuente Principal**: Geist Sans - Moderna y legible
- **Fuente Monoespaciada**: Geist Mono - Para código y datos

### Componentes
- Sistema de componentes reutilizables basado en Radix UI
- Variantes consistentes para botones, inputs y cards
- Animaciones sutiles para mejorar la experiencia

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- **Desktop**: Experiencia completa con todas las funcionalidades
- **Tablet**: Layout adaptado con navegación optimizada
- **Mobile**: Interfaz touch-friendly con menús colapsables

## 🔐 Autenticación y Autorización

### Roles de Usuario
- **Client**: Personas buscando empleo
- **Counselor**: Consejeros laborales
- **Admin**: Administradores del sistema

### Flujo de Autenticación
1. Registro con email y contraseña
2. Verificación de email
3. Creación automática de perfil de usuario
4. Acceso basado en roles

## 📊 Funcionalidades Principales

### Dashboard Personalizado
- Estadísticas relevantes según el rol
- Acciones rápidas
- Actividad reciente
- Progreso visual

### Sistema de Evaluaciones
- **Evaluación de Habilidades**: 25 preguntas, 15 minutos
- **Evaluación de Personalidad**: 30 preguntas, 20 minutos  
- **Intereses Profesionales**: 20 preguntas, 12 minutos

### Matching de Empleos
- Algoritmo que considera habilidades, experiencia y preferencias
- Puntuación de compatibilidad
- Filtros por tipo de empleo, ubicación y características de accesibilidad

### Centro de Recursos
- Artículos, videos, cursos y plantillas
- Sistema de filtrado y búsqueda
- Niveles de dificultad
- Tiempo estimado de completación

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Otras Plataformas
La aplicación puede desplegarse en cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Email: soporte@inclusion-laboral.com
- Issues: [GitHub Issues](link-to-issues)
- Documentación: [Wiki del Proyecto](link-to-wiki)

## 🏗️ Roadmap

### Próximas Funcionalidades
- [ ] Integración con APIs de empleo externas
- [ ] Sistema de notificaciones en tiempo real
- [ ] App móvil nativa
- [ ] Inteligencia artificial para recomendaciones mejoradas
- [ ] Sistema de mentorías peer-to-peer
- [ ] Integración con redes sociales profesionales

### Mejoras de Accesibilidad
- [ ] Soporte para más idiomas de señas
- [ ] Navegación por voz
- [ ] Modo de alto contraste mejorado
- [ ] Compatibilidad con más tecnologías asistivas

---

**Inclusión Laboral** - Construyendo un futuro más equitativo para todos 🌟