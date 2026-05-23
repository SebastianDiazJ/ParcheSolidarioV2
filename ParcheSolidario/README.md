# Parche Solidario

Plataforma web que conecta ciudadanos, organizaciones y fundaciones para impulsar causas sociales en Medellín. Centraliza eventos comunitarios, colectas, refugios y protestas en un mapa interactivo.

---

## Tecnologías reales del proyecto

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 + React 19 + TypeScript |
| UI | TailwindCSS 4 + shadcn/ui |
| Mapa | Leaflet / react-leaflet |
| Base de datos | Firebase Firestore (NoSQL) |
| Autenticación | Firebase Auth (Google OAuth) |
| Almacenamiento | Firebase Cloud Storage |
| Validación | Zod + React Hook Form |
| Formularios | React Hook Form 7 |

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior (o pnpm)
- Cuenta de Firebase configurada (ya incluida en el código)

---

## Correr el proyecto localmente

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd ParcheSolidario

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

Otros comandos disponibles:

```bash
npm run build    # Compilar para producción
npm run start    # Iniciar servidor de producción (requiere build previo)
npm run lint     # Revisar errores de código
```

---

## Arquitectura del proyecto

El proyecto usa **Clean Architecture** con 4 capas bien definidas. Las dependencias siempre apuntan hacia adentro: Presentación → Aplicación → Dominio ← Infraestructura.

```
ParcheSolidario/
│
├── app/                        # Páginas de Next.js (App Router)
│   ├── layout.tsx              # Layout raíz (fuentes, analytics, toasts)
│   └── page.tsx                # Punto de entrada → renderiza AuthView
│
├── src/                        # Clean Architecture
│   ├── domain/                 # Núcleo: reglas de negocio puras
│   │   ├── entities/           # Activity.ts, User.ts
│   │   ├── repositories/       # Interfaces (contratos de datos)
│   │   └── use-cases/          # Lógica de negocio por feature
│   │       ├── activities/     # CreateActivity, GetActivities, Update, Delete
│   │       └── users/          # CreateProfile, GetUserProfile, VerifyProfile
│   │
│   ├── application/            # Orquestación entre capas
│   │   ├── services/           # ActivityService.ts, UserService.ts
│   │   └── dto/                # Objetos de transferencia (ActivityDto, UserDto)
│   │
│   ├── infrastructure/         # Implementaciones concretas
│   │   ├── repositories/       # FirebaseActivityRepository, FirebaseProfileRepository
│   │   ├── external/           # FirebaseStorageService, EmailService
│   │   └── di/Container.ts     # Inyección de dependencias
│   │
│   └── presentation/
│       └── hooks/              # useActivities, useUserProfile, useAdminVerification
│
├── components/                 # Componentes React de UI
│   ├── auth-view.tsx           # Controlador: login vs dashboard
│   ├── login-form.tsx          # Formulario Google OAuth
│   ├── session-panel.tsx       # Dashboard principal del usuario
│   ├── heatmap-view.tsx        # Mapa con marcadores por categoría
│   ├── add-activity-form.tsx   # Formulario crear actividad
│   ├── profile-verification.tsx # Perfil + subida de documentos
│   ├── admin-verification-panel.tsx # Panel admin para aprobar perfiles
│   ├── recent-activities.tsx   # Lista de actividades
│   └── ui/                     # shadcn/ui: 45+ componentes base
│
├── contexts/
│   └── ActivitiesContext.tsx   # Estado global de actividades (React Context)
│
├── hooks/                      # Hooks custom de la app
│   ├── useAuth.ts              # Listener de sesión Firebase
│   ├── useActivities.ts        # Carga y cache de actividades
│   └── useGeolocation.ts       # Geolocalización del navegador
│
├── modules/                    # Servicios alternativos (legado/directo Firebase)
│   ├── domain/profile/ProfileService.ts
│   └── infraestructura/firebase/
│       ├── ActivitiesService.ts
│       ├── AuthRepositoryFirebase.ts
│       └── StorageService.ts
│
└── firebase/                   # Configuración Firebase
    ├── config.ts               # Credenciales del proyecto
    └── clientApp.ts            # Inicialización del SDK
```

---

## Clases y archivos principales

### Entidades del dominio

**`src/domain/entities/Activity.ts`**
Representa una actividad solidaria. Tiene `id`, `title`, `description`, `category` (eventos/colectas/refugios/protestas), `latitude`, `longitude`, `participants`, `capacity`, `date`, `status` (active/completed/upcoming).

**`src/domain/entities/User.ts`**
Representa un usuario y su perfil. Incluye `fullName`, `isVerified`, `verificationStatus` (pending/approved/rejected), links de redes sociales y URLs de documentos subidos.

### Contratos de datos (Repositorios)

**`src/domain/repositories/ActivityRepository.ts`**
Define las operaciones que debe soportar cualquier fuente de datos de actividades: `findAll()`, `findByCategory()`, `findByLocationBounds()`, `create()`, `update()`, `delete()`, `getStats()`.

**`src/domain/repositories/UserRepository.ts`**
Contrato equivalente para perfiles de usuario.

### Casos de uso

| Archivo | Qué hace |
|---|---|
| `CreateActivityUseCase.ts` | Valida y persiste una nueva actividad |
| `GetActivitiesUseCase.ts` | Obtiene actividades con filtros opcionales |
| `UpdateActivityUseCase.ts` | Modifica una actividad existente |
| `DeleteActivityUseCase.ts` | Elimina una actividad |
| `CreateProfileUseCase.ts` | Crea el perfil de un usuario |
| `GetUserProfileUseCase.ts` | Recupera datos del perfil |
| `VerifyProfileUseCase.ts` | Cambia el estado de verificación |

### Servicios de aplicación

**`src/application/services/ActivityService.ts`**
Orquesta los casos de uso de actividades. Convierte entre DTOs y entidades del dominio.

**`src/application/services/UserService.ts`**
Orquesta los casos de uso de usuarios.

### Infraestructura (Firebase)

**`src/infrastructure/repositories/FirebaseActivityRepository.ts`**
Implementa `ActivityRepository` usando Firestore. Traduce documentos Firestore a entidades de dominio.

**`src/infrastructure/di/Container.ts`**
Configura la inyección de dependencias: conecta interfaces con implementaciones concretas.

**`modules/infraestructura/firebase/ActivitiesService.ts`**
Acceso directo a Firestore (usado por componentes más antiguos). Incluye `getAllActivities()`, `createActivity()`, `getActivitiesByCategory()`.

### Componentes clave de UI

**`components/auth-view.tsx`**
Punto de entrada visual. Lee el estado de Firebase Auth y decide si mostrar el login o el dashboard.

**`components/session-panel.tsx`**
Dashboard principal. Gestiona qué sección está activa (mapa, actividades, perfil, etc.).

**`components/heatmap-view.tsx`**
Mapa Leaflet con marcadores de colores según la categoría de la actividad. Detecta la ubicación del usuario y centra el mapa en Medellín como fallback.

**`components/add-activity-form.tsx`**
Modal con formulario validado por Zod para crear actividades. Captura ubicación (lat/lng), categoría y detalles.

**`components/profile-verification.tsx`**
Formulario de perfil con subida de 2 documentos a Firebase Storage. Muestra el estado de verificación actual.

**`components/admin-verification-panel.tsx`**
Panel exclusivo para admins. Lista perfiles pendientes y permite aprobar o rechazar con un click.

---

## Flujo de datos (de punta a punta)

```
Usuario hace clic
       ↓
Componente React (components/)
       ↓
Hook custom (hooks/ o src/presentation/hooks/)
       ↓
Servicio de aplicación (src/application/services/)
       ↓
Caso de uso (src/domain/use-cases/)
       ↓
Repositorio interface (src/domain/repositories/)
       ↓
Implementación Firebase (src/infrastructure/repositories/)
       ↓
Firestore / Cloud Storage
```

---

## Base de datos (Firestore)

### Colección `activities`

```
{
  title: string,
  description: string,
  category: "eventos" | "colectas" | "refugios" | "protestas",
  latitude: number,
  longitude: number,
  participants: number,
  capacity: number,
  date: string,
  time: string,
  location: string,
  status: "active" | "completed" | "upcoming",
  createdBy: string,       // UID del usuario
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Colección `profiles`

```
{
  userId: string,          // UID de Firebase Auth
  fullName: string,
  description: string,
  location: string,
  phone: string,
  email: string,
  isVerified: boolean,
  verificationStatus: "pending" | "approved" | "rejected",
  socialMedia: { facebook, instagram, twitter, linkedin },
  documents: {
    cameraDocumentUrl: string,
    commerceDocumentUrl: string
  },
  createdAt: timestamp
}
```

---

## Características implementadas

- Autenticación con Google via Firebase Auth
- Mapa interactivo con actividades geolocalizadas (Leaflet)
- Filtrado de actividades por categoría
- Creación de actividades con ubicación
- Perfiles de usuario con documentos de verificación
- Panel de administración para verificar perfiles
- Diseño responsive (mobile-first con TailwindCSS)
- Notificaciones toast (Sonner)

---

## Notas para el equipo

- Las reglas de seguridad de Firestore están en `firestore.rules`
- El `EmailService` está como stub listo para conectar con SendGrid o Firebase Functions
- Los errores de TypeScript/ESLint están ignorados en el build (`next.config.mjs`) — esto es temporal
- Las credenciales de Firebase están en el código (válido para desarrollo universitario, no para producción)
