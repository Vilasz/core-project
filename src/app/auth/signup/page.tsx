"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT" as "STUDENT" | "TEACHER",
    phone: "",
    specialties: [] as string[],
    bio: "",
    hourlyRate: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const specialties = [
    "Yoga",
    "Pilates", 
    "Meditação",
    "Acupuntura",
    "Fisioterapia",
    "Psicologia",
    "Nutrição",
    "Personal Trainer",
    "Terapia Holística",
    "Massagem",
    "Reiki",
    "Tai Chi"
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validações básicas
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (formData.role === "TEACHER" && formData.specialties.length === 0) {
      setError("Professores devem selecionar pelo menos uma especialidade")
      setIsLoading(false)
      return
    }

    if (formData.role === "TEACHER" && (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0)) {
      setError("Professores devem definir um valor por hora válido")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          specialties: formData.specialties,
          bio: formData.bio,
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        }),
      })

      if (response.ok) {
        // Fazer login automaticamente após cadastro
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError("Cadastro realizado, mas erro ao fazer login. Tente fazer login manualmente.")
        } else {
          router.push(formData.role === "TEACHER" ? "/dashboard/professor" : "/dashboard/aluno")
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Erro ao criar conta")
      }
    } catch (error) {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      setError("Erro ao fazer cadastro com Google")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
            Criar sua conta
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de conta
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="STUDENT"
                    checked={formData.role === "STUDENT"}
                    onChange={handleInputChange}
                    className="mr-3 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Aluno</div>
                    <div className="text-sm text-gray-500">Buscar aulas e professores</div>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="TEACHER"
                    checked={formData.role === "TEACHER"}
                    onChange={handleInputChange}
                    className="mr-3 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Professor</div>
                    <div className="text-sm text-gray-500">Oferecer aulas e serviços</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar senha *
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Digite a senha novamente"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
              />
            </div>

            {/* Campos específicos para professores */}
            {formData.role === "TEACHER" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Especialidades *
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {specialties.map((specialty) => (
                      <label key={specialty} className="flex items-center hover:bg-gray-50 p-1 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={() => handleSpecialtyToggle(specialty)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor por hora (R$)
                  </label>
                  <Input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="Ex: 80"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografia
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Conte um pouco sobre você e sua experiência..."
                  />
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
                Faça login aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
