export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">

        {/* Marca */}
        <div>
          <h3 className="text-lg font-semibold">Retorno a la Fuente</h3>
          <p className="text-gray-400 text-sm">
            Bienestar integral para cuerpo y mente
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm">
          <a href="#servicios" className="hover:text-gray-300">
            Servicios
          </a>
          <a href="#contacto" className="hover:text-gray-300">
            Contacto
          </a>
        </div>

        {/* Copyright */}
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Retorno a la Fuente. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}