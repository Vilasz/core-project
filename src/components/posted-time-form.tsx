"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, DollarSign, MessageSquare } from "lucide-react"

interface PostedTimeFormProps {
  teacherId: string
  onSuccess?: () => void
}

export function PostedTimeForm({ teacherId, onSuccess }: PostedTimeFormProps) {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    modality: "YOGA",
    price: 50,
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
      const response = await fetch("/api/posted-times", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId,
          ...formData,
        }),
      })

      if (response.ok) {
        setSuccess("Horário postado com sucesso!")
        setTimeout(() => {
          setSuccess("")
          if (onSuccess) onSuccess()
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Erro ao postar horário")
      }
    } catch {
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
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }))
  }

  const isFormValid = formData.date && formData.startTime && formData.endTime && formData.price > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Postar Horário Disponível
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
        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Data
          </label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {/* Horário */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Início
            </label>
            <Input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fim
            </label>
            <Input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

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

        {/* Preço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Preço (R$)
          </label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
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
            placeholder="Detalhes sobre a aula..."
          />
        </div>

        {/* Botão de submit */}
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm dark:bg-green-500 dark:hover:bg-green-600"
          size="lg"
        >
          {isSubmitting ? "Postando..." : "Postar Horário"}
        </Button>
      </form>
    </div>
  )
}

