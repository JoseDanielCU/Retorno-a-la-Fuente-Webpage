"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html>
      <body className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-500">
            Algo salió mal 😢
          </h2>

          <p className="text-gray-600">
            {error.message || "Error inesperado"}
          </p>

          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  )
}