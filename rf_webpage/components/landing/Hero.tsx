"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function Hero() {
  const images = [
    "/spa-bg1.jpg",
    "/spa-bg2.jpg",
    "/spa-bg3.jpg",
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden">

      {/* Carrusel */}
      <div className="absolute inset-0 z-0">
        {images.map((src, i) => (
          <Image
            key={i}
            src={src}
            alt="spa"
            fill
            priority={i === 0}
            className={`object-cover absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Contenido */}
      <div className="relative z-20 px-6 max-w-3xl flex flex-col items-center">

        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Equilibrio para tu cuerpo y mente
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Tratamientos personalizados para mejorar tu bienestar,
          reducir el estrés y transformar tu energía.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#contacto"
            className="bg-primary px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Agendar cita
          </a>

          <a
            href="#servicios"
            className="border border-white px-8 py-3 rounded-xl hover:bg-white hover:text-black transition"
          >
            Ver servicios
          </a>
        </div>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-6 flex gap-2 z-20">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

    </section>
  )
}