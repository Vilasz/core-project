"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { PostedTimeCard } from "@/components/posted-time-card"
import { PostedTimeForm } from "@/components/posted-time-form"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PostedTime {
  id: string
  teacherId: string
  date: string
  startTime: string
  endTime: string
  modality: string
  price: number
  description?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  isAvailable: boolean
  user?: {
    name: string | null
    image: string | null
    phone?: string | null
    email?: string | null
    teacherProfile?: {
      specialties: string[]
      rating: number
    }
  }
}

export default function PostedTimesPage() {
  const { data: session } = useSession()
  const [postedTimes, setPostedTimes] = useState<PostedTime[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchPostedTimes()
  }, [])

  const fetchPostedTimes = async () => {
    try {
      const response = await fetch("/api/posted-times?onlyAvailable=true")
      if (response.ok) {
        const data = await response.json()
        setPostedTimes(data)
      }
    } catch (error) {
      console.error("Erro ao buscar horários:", error)
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

  const isTeacher = session?.user?.role === "TEACHER"
  const isStudent = session?.user?.role === "STUDENT"
  const myPostedTimes = isTeacher ? postedTimes.filter(pt => pt.teacherId === session?.user?.id) : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Horários Disponíveis
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Professores postando seus horários livres
            </p>
          </div>
          
          {isTeacher && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Postar Horário
            </Button>
          )}
        </div>

        {showForm && isTeacher && session?.user?.id && (
          <div className="mb-8">
            <PostedTimeForm
              teacherId={session.user.id}
              onSuccess={() => {
                setShowForm(false)
                fetchPostedTimes()
              }}
            />
          </div>
        )}

        {/* Minhas Postagens (para professores) */}
        {isTeacher && myPostedTimes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Meus Horários
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPostedTimes.map((postedTime) => (
                <PostedTimeCard
                  key={postedTime.id}
                  postedTime={postedTime}
                  isOwner={true}
                  onDelete={fetchPostedTimes}
                />
              ))}
            </div>
          </div>
        )}

        {/* Todos os Horários Disponíveis */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {isTeacher ? "Outros Horários" : "Horários Disponíveis"}
          </h2>
          
          {postedTimes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum horário disponível no momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postedTimes
                .filter(pt => !isTeacher || pt.teacherId !== session?.user?.id)
                .map((postedTime) => (
                <PostedTimeCard
                  key={postedTime.id}
                  postedTime={postedTime}
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

