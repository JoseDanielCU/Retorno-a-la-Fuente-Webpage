"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Clientes() {
  const [clients, setClients] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })

    setClients(data || [])
  }

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 mt-16">

      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar cliente..."
        className="border p-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tabla */}
      <div className="grid gap-4">
        {filtered.map((client) => (
          <Link
            key={client.id}
            href={`/dashboard/clientes/${client.id}`}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <p className="font-semibold">{client.name}</p>
            <p className="text-sm text-gray-500">{client.phone}</p>
          </Link>
        ))}
      </div>

    </div>
  )
}