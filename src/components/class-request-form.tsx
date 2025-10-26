"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, DollarSign, MessageSquare } from "lucide-react"

interface ClassRequest {
  id: string
  studentId: string
  modality: string
  preferredDate?: Date | null
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
  }
}

interface ClassRequestFormProps {
  studentId: string
  onSuccess?: () => void
}

export function ClassRequestForm({ studentId, onSuccess }: ClassRequestFormProps) {
  const [formData, setFormData] = useState({
    modality: "YOGA",
    preferredDate: "",
    preferredTime: "",
    duration: 60,
    maxPrice: "",
    description: "",
    contactPhone: "",
    contactEmail: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/class-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          modality: formData.modality,
          preferredDate: formData.preferredDate || undefined,
          preferredTime: formData.preferredTime || undefined,
          duration: formData.duration,
          maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : undefined,
          description: formData.description || undefined,
          contactPhone: formData.contactPhone || undefined,
          contactEmail: formData.contactEmail || undefined,
        }),
      })

      if (response.ok) {
        setSuccess("Solicitação criada com sucesso!")
        setTimeout(() => {
          setSuccess("")
          if (onSuccess) onSuccess()
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Erro ao criar solicitação")
      }
    } catch (error) {
      setError("Erro de conexão. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) || 0 : value,
    }))
  }

  const isFormValid = formData.duration > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Criar Solicitação de Aula
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Modalidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modalidade
          </label>
          <select
            name="modality"
            value={formData.modality}
            onChange={handleInputChange}
            className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          >
            <option value="YOGA">Yoga</option>
            <option value="MEDITATION">Meditação</option>
            <option value="PILATES">Pilates</option>
            <option value="FITNESS">Fitness</option>
            <option value="DANCE">Dança</option>
            <option value="OTHER">Outro</option>
          </select>
        </div>

        {/* Data e Horário Preferenciais */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Data Preferencial (opcional)
            </label>
            <Input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Horário Preferencial (opcional)
            </label>
            <Input
              type="time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Duração */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duração da Aula
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          >
            <option value={30}>30 minutos</option>
            <option value={45}>45 minutos</option>
            <option value={60}>1 hora</option>
            <option value={90}>1h30min</option>
            <option value={120}>2 horas</option>
          </select>
        </div>

        {/* Preço Máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Preço Máximo (opcional)
          </label>
          <Input
            type="number"
            name="maxPrice"
            value={formData.maxPrice}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            placeholder="Ex: 50.00"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Descrição (opcional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Descreva o tipo de aula que você está procurando..."
          />
        </div>

        {/* Botão de submit */}
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm dark:bg-green-500 dark:hover:bg-green-600"
          size="lg"
        >
          {isSubmitting ? "Criando..." : "Criar Solicitação"}
        </Button>
      </form>
    </div>
  )
}

