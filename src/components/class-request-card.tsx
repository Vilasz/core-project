"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Calendar, Clock, DollarSign, MapPin, User, Trash2 } from "lucide-react"

interface ClassRequest {
  id: string
  studentId: string
  modality: string
  preferredDate?: Date | string | null
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

interface ClassRequestCardProps {
  classRequest: ClassRequest
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

export function ClassRequestCard({ classRequest, isOwner = false, onDelete }: ClassRequestCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja remover esta solicitação?")) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/class-requests?id=${classRequest.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        if (onDelete) onDelete(classRequest.id)
      }
    } catch (error) {
      console.error("Erro ao deletar:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleWhatsApp = async () => {
    const phoneNumber = classRequest.contactPhone || classRequest.user?.phone
    if (!phoneNumber) {
      alert("Telefone não disponível")
      return
    }

    const message = `Olá ${classRequest.user?.name || "Aluno"}! Vi sua solicitação de aula de ${modalityLabels[classRequest.modality]} e tenho interesse em ajudá-lo(a)! Posso ajudá-lo(a)?`
    
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
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {classRequest.user?.name || "Aluno"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Busca por aula de {modalityLabels[classRequest.modality]}
            </p>
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
        {classRequest.preferredDate && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(classRequest.preferredDate as string).toLocaleDateString("pt-BR")}
          </div>
        )}
        {classRequest.preferredTime && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            {classRequest.preferredTime}
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2" />
          {classRequest.duration} minutos
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-2" />
          {modalityLabels[classRequest.modality]}
        </div>
        {classRequest.maxPrice && (
          <div className="flex items-center text-sm text-gray-900 dark:text-gray-100 font-semibold">
            <DollarSign className="h-4 w-4 mr-2" />
            Até R$ {classRequest.maxPrice.toFixed(2)}
          </div>
        )}
      </div>

      {classRequest.description && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {classRequest.description}
        </p>
      )}

      {!isOwner && classRequest.isActive && (
        <Button
          onClick={handleWhatsApp}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          size="lg"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Contatar Aluno
        </Button>
      )}

      {!classRequest.isActive && (
        <div className="text-center py-2 text-sm text-gray-500">
          Solicitação inativa
        </div>
      )}
    </div>
  )
}

