"use client"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"
export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

const handleSubmit = async (e: any) => {
  e.preventDefault()

  const email = e.target.email.value
  const password = e.target.password.value

  if (isLogin) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  } else {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Revisa tu correo para confirmar tu cuenta")
    }
  }
}
  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl">

      {/* Título */}
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        {isLogin ? "Iniciar sesión" : "Crear cuenta"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {!isLogin && (
          <input
            name="name"
            type="text"
            placeholder="Nombre"
            className="border p-3 rounded-lg"
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Correo"
          className="border p-3 rounded-lg"
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="border p-3 rounded-lg"
        />

        <button type="submit" className="bg-primary text-white py-3 rounded-lg">
          {isLogin ? "Ingresar" : "Registrarse"}
        </button>

      </form>

      {/* Cambiar modo */}
      <p className="text-center text-sm mt-6">
        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary font-semibold"
        >
          {isLogin ? "Regístrate" : "Inicia sesión"}
        </button>
      </p>
    </div>
  )
}