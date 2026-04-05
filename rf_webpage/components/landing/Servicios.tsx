export default function Servicios() {
  const servicios = [
    {
      title: "Masajes relajantes",
      desc: "Reduce estrés y tensión muscular",
    },
    {
      title: "Tratamientos corporales",
      desc: "Mejora tu bienestar físico",
    },
    {
      title: "Reducción de medidas",
      desc: "Resultados progresivos y controlados",
    },
    {
      title: "Terapias integrales",
      desc: "Equilibrio completo cuerpo-mente",
    },
  ]

  return (
    <section id="servicios" className="py-20 px-6 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">
        Nuestros Servicios
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {servicios.map((s, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 shadow-lg rounded-2xl p-6 hover:scale-105 transition"
          >
            <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
            <p className="text-gray-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}