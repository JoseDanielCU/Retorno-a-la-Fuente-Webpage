import AuthForm from "@/components/auth/AuthForm"
import Navbar from "@/components/layout/Navbar";

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-black/40 px-6">
     <Navbar />
        <AuthForm />
    </main>
  )
}