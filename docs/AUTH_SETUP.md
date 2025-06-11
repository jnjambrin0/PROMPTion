# Configuración de Autenticación - Promption

## Variables de Entorno Requeridas

Crea un archivo `.env.local` en la raíz de tu proyecto con las siguientes variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_proyecto_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_supabase

# Database Configuration (for Prisma)
DATABASE_URL=tu_url_de_base_de_datos_supabase
```

## Configuración de Google OAuth en Supabase

1. Ve a tu dashboard de Supabase
2. Navega a **Authentication > Providers**
3. Habilita el proveedor de **Google**
4. Agrega tu **Google OAuth Client ID** y **Client Secret** desde Google Console
5. Configura la URL de redirección: `https://tu-proyecto-ref.supabase.co/auth/v1/callback`

## Configuración en Google Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API**
4. Ve a **Credenciales** y crea un **OAuth 2.0 Client ID**
5. Agrega las siguientes URLs de redirección:
   - Para desarrollo: `https://tu-proyecto-ref.supabase.co/auth/v1/callback`
   - Para producción: `https://tu-proyecto-ref.supabase.co/auth/v1/callback`

## Estructura de Archivos Creados

```
app/
├── (auth)/
│   ├── layout.tsx                 # Layout para páginas de auth
│   │   └── page.tsx              # Página de sign-in
│   ├── sign-in/
│   │   └── page.tsx              # Página de sign-up
│   ├── sign-up/
│   │   └── page.tsx              # Página de recuperación
│   ├── forgot-password/
│   │   └── page.tsx              # Página de reset
│   └── auth/
│       ├── callback/
│       │   └── route.ts          # Callback OAuth
│       └── auth-code-error/
│           └── page.tsx          # Página de error
├── (root)/
│   └── dashboard/
│       └── page.tsx              # Dashboard protegido
└── page.tsx                      # Landing page

components/
└── auth-form.tsx                 # Componente reutilizable

lib/
├── supabase.ts                   # Cliente Supabase (browser)
├── supabase/
│   └── server.ts                 # Cliente Supabase (server)
└── types/
    └── database.ts               # Tipos de base de datos

middleware.ts                     # Middleware de autenticación
```

## Funcionalidades Implementadas

### ✅ Autenticación Completa

- Sign-in con email/password
- Sign-up con email/password
- Google OAuth
- Recuperación de contraseña
- Reset de contraseña
- Logout

### ✅ Protección de Rutas

- Middleware que protege rutas privadas
- Redirecciones automáticas
- Manejo de sesiones

### ✅ UX/UI Optimizada

- Diseño inspirado en Notion y Easlo
- Componentes reutilizables
- Estados de carga y error
- Validación de formularios
- Responsive design

### ✅ Seguridad

- Server-side rendering con SSR
- Cookies seguras
- Validación de sesiones
- Manejo de errores

## Páginas Disponibles

- `/` - Landing page con enlaces de auth
- `/sign-in` - Página de inicio de sesión
- `/sign-up` - Página de registro
- `/forgot-password` - Recuperación de contraseña
- `/reset-password` - Reset de contraseña
- `/dashboard` - Dashboard protegido
- `/auth/callback` - Callback OAuth
- `/auth/auth-code-error` - Página de error

## Comandos para Ejecutar

```bash
# Instalar dependencias (ya están instaladas)
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

## Configuración de Prisma (Opcional)

Si quieres usar Prisma con Supabase:

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push
```

## Notas Importantes

1. **Variables de entorno**: Asegúrate de que todas las variables estén configuradas correctamente
2. **URLs de callback**: Deben coincidir exactamente entre Supabase y Google Console
3. **HTTPS**: Google OAuth requiere HTTPS en producción
4. **Middleware**: El middleware maneja automáticamente las redirecciones de auth
5. **Tipos**: Los tipos de TypeScript están configurados para mejor experiencia de desarrollo

## Estilo Visual

El diseño sigue las mejores prácticas de UI/UX:

- Paleta de colores similar a Notion
- Gradientes sutiles como Easlo
- Tipografía limpia y legible
- Espaciado consistente
- Micro-interacciones fluidas
- Estados de carga elegantes
