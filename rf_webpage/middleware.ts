import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            req.cookies.set(name, value)
          )
          res = NextResponse.next()
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 🔥 CAMBIO IMPORTANTE AQUÍ
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const user = session?.user

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard")

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth", req.url))
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
}