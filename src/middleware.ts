import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const searchParams = req.nextUrl.search
  console.log('Middleware ejecutándose para:', pathname, 'con params:', searchParams);
  
  // No verificar autenticación en estas rutas
  const publicRoutes = [
    '/iniciar-sesion',
    '/registrarse', 
    '/olvido-contrasena',
    '/restablecer-contrasena',
    '/',
    '/sobre-nosotros',
    '/contacto',
    '/ayuda'
  ]

  // Si es una ruta pública, pasar sin verificar
  if (publicRoutes.includes(pathname)) {
    console.log('Ruta pública - no requiere autenticación');
    return NextResponse.next()
  }

  // Solo proteger rutas que empiecen con /dashboard
  if (!pathname.startsWith('/dashboard')) {
    console.log('Ruta no protegida - permitiendo acceso');
    return NextResponse.next()
  }

  // Crear cliente de Supabase para verificar sesión
  let supabaseResponse = NextResponse.next({
    request: req,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    // Verificar la sesión del usuario
    const { data: { session }, error } = await supabase.auth.getSession()
    
    console.log('Middleware - Verificando sesión para dashboard:', { 
      hasSession: !!session, 
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      error: !!error,
      cookiesCount: req.cookies.getAll().length
    });

    // Si no hay sesión activa, redirigir al login
    if (error || !session?.user) {
      console.log('Middleware - Sin sesión válida, redirigiendo a login');
      const redirectUrl = new URL('/iniciar-sesion', req.url)
      return NextResponse.redirect(redirectUrl)
    }
    
    console.log('Middleware - Usuario autenticado, acceso permitido al dashboard');
    return supabaseResponse

  } catch (error) {
    console.error('Middleware - Error inesperado:', error);
    const redirectUrl = new URL('/iniciar-sesion', req.url)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de solicitud excepto las que comienzan con:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imagen)
     * - favicon.ico (favicon file)
     * - archivos públicos (imágenes, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
