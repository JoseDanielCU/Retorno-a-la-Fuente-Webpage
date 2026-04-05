import Navbar from "@/components/layout/Navbar";

export default function Dashboard() {
  return (
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/20 to-black/40 px-6">
     <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">
            Bienvenido al dashboard 🎉
          </h1>
        </div>
    </main>

  )
}