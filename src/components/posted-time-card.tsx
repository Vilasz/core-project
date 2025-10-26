"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, MapPin, DollarSign, Calendar, Clock, Trash2 } from "lucide-react"

interface PostedTime {
  id: string
  teacherId: string
  date: Date
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

interface PostedTimeCardProps {
  postedTime: PostedTime
  isOwner?: boolean
  onDelete?: (id: string) => void
}

const modalityLabels: Record<string, string> = {
  YOGA: "Yoga",
  MEDITATION: "Meditação",
  PILATES: "Pilates",
  FITNESS: "Fitness",
  DANCE: "Dança",
  OTHER: "Outro",
}

export function PostedTimeCard({ postedTime, isOwner = false, onDelete }: PostedTimeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja remover este horário?")) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posted-times?id=${postedTime.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        if (onDelete) onDelete(postedTime.id)
      }
    } catch (error) {
      console.error("Erro ao deletar:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleWhatsApp = async () => {
    const phoneNumber = postedTime.contactPhone || postedTime.user?.phone
    if (!phoneNumber) {
      alert("Telefone não disponível")
      return
    }

    const message = `Olá ${postedTime.user?.name || "Professor"}! Vi seu horário disponível para ${modalityLabels[postedTime.modality]} em ${new Date(postedTime.date).toLocaleDateString("pt-BR")} das ${postedTime.startTime} às ${postedTime.endTime}. Tenho interesse em agendar!`
    
    const response = await fetch("/api/whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
        message,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      window.open(data.whatsappUrl, "_blank")
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <span className="text-green-600 dark:text-green-400 font-bold">
              {postedTime.user?.name?.charAt(0).toUpperCase() || "?"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {postedTime.user?.name || "Professor"}
            </h3>
            {postedTime.user?.teacherProfile && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ⭐ {postedTime.user.teacherProfile.rating.toFixed(1)}
              </p>
            )}
          </div>
        </div>
        
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(postedTime.date).toLocaleDateString("pt-BR")}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2" />
          {postedTime.startTime} às {postedTime.endTime}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-2" />
          {modalityLabels[postedTime.modality]}
        </div>
        <div className="flex items-center text-sm text-gray-900 dark:text-gray-100 font-semibold">
          <DollarSign className="h-4 w-4 mr-2" />
          R$ {postedTime.price.toFixed(2)}
        </div>
      </div>

      {postedTime.description && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {postedTime.description}
        </p>
      )}

      {!isOwner && postedTime.isAvailable && (
        <Button
          onClick={handleWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
          size="lg"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Contatar via WhatsApp
        </Button>
      )}

      {!postedTime.isAvailable && (
        <div className="text-center py-2 text-sm text-gray-500">
          Horário indisponível
        </div>
      )}
    </div>
  )
}

