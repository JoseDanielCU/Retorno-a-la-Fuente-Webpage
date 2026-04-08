"use client"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-6 h-16 flex items-center fixed w-full top-0 z-50">

      <div className="flex justify-between items-center w-full">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          Retorno a la Fuente
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#servicios">Servicios</Link>
          <Link href="/#contacto">Contacto</Link>
          <Link href="/#beneficios">Beneficios</Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-8"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-5 py-2 rounded-xl"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="bg-primary text-white px-5 py-2 rounded-xl"
            >
              Ingresar
            </Link>
          )}
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-2xl relative z-[60]"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col gap-4 p-6 md:hidden z-[60]">
          <Link href="/#servicios" onClick={() => setOpen(false)}>
            Servicios
          </Link>

          <Link href="/#contacto" onClick={() => setOpen(false)}>
            Contacto
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>

              <button onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link href="/auth" onClick={() => setOpen(false)}>
              Ingresar
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}