import Navbar from "@/components/layout/Navbar"
import Hero from "@/components/landing/Hero"
import Services from "@/components/landing/Servicios"
import Contacto from "@/components/landing/Contacto"
import Beneficios from "@/components/landing/Beneficios"
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      <Services />
      <Beneficios />
      <Contacto />

      <Footer />
    </main>
  )
}