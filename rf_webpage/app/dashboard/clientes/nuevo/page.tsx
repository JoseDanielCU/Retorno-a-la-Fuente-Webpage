"use client"

import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NuevoCliente() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    occupation: "",
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from("clients").insert({
      ...form,
      created_by: user?.id,
    })

    router.push("/dashboard/clientes")
  }

  return (
    <div className="p-6 mt-16">

      <h1 className="text-2xl font-bold mb-4">
        Nuevo Cliente
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          placeholder="Nombre"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Teléfono"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Ocupación"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, occupation: e.target.value })
          }
        />

        <button className="bg-primary text-white p-3 rounded">
          Guardar
        </button>
      </form>

    </div>
  )
}