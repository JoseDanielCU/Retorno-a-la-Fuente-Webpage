import "./globals.css"

export const metadata = {
  title: "Retorno a la Fuente",
  description: "Centro de bienestar y masajes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}