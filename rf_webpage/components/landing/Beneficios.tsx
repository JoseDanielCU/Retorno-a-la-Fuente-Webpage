export default function Beneficios() {
  const items = [
    "Atención personalizada",
    "Profesionales certificados",
    "Ambiente relajante",
    "Seguimiento de resultados",
  ]

  return (
    <section className="py-20 px-6 bg-secondary/20 text-center">
      <h2 className="text-3xl font-bold text-primary mb-10">
        ¿Por qué elegirnos?
      </h2>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow">
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}