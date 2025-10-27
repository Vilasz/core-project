"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { ClassRequestCard } from "@/components/class-request-card"
import { ClassRequestForm } from "@/components/class-request-form"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ClassRequest {
  id: string
  studentId: string
  modality: string
  preferredDate?: string | null
  preferredTime?: string | null
  duration: number
  maxPrice?: number | null
  description?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  isActive: boolean
  user?: {
    name: string | null
    image: string | null
    phone?: string | null
    email?: string | null
  }
}

export default function ClassRequestsPage() {
  const { data: session } = useSession()
  const [classRequests, setClassRequests] = useState<ClassRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchClassRequests()
  }, [])

  const fetchClassRequests = async () => {
    try {
      const response = await fetch("/api/class-requests?onlyActive=true")
      if (response.ok) {
        const data = await response.json()
        setClassRequests(data)
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  const isStudent = session?.user?.role === "STUDENT"
  const myRequests = isStudent ? classRequests.filter(cr => cr.studentId === session?.user?.id) : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Solicitações de Aula
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Alunos procurando por aulas
            </p>
          </div>
          
          {isStudent && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Solicitação
            </Button>
          )}
        </div>

        {showForm && isStudent && session?.user?.id && (
          <div className="mb-8">
            <ClassRequestForm
              studentId={session.user.id}
              onSuccess={() => {
                setShowForm(false)
                fetchClassRequests()
              }}
            />
          </div>
        )}

        {/* Minhas Solicitações (para alunos) */}
        {isStudent && myRequests.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Minhas Solicitações
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRequests.map((request) => (
                <ClassRequestCard
                  key={request.id}
                  classRequest={request}
                  isOwner={true}
                  onDelete={fetchClassRequests}
                />
              ))}
            </div>
          </div>
        )}

        {/* Todas as Solicitações Ativas */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {isStudent ? "Outras Solicitações" : "Solicitações Ativas"}
          </h2>
          
          {classRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma solicitação ativa no momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classRequests
                .filter(cr => !isStudent || cr.studentId !== session?.user?.id)
                .map((request) => (
                <ClassRequestCard
                  key={request.id}
                  classRequest={request}
                  isOwner={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

