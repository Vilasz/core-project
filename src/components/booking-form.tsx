"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock } from "lucide-react"

interface Professor {
  id: string
  name: string | null
  teacherProfile: {
    hourlyRate: number
  } | null
}

interface BookingFormProps {
  professor: Professor
  studentId: string
}

export function BookingForm({ professor, studentId }: BookingFormProps) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: 60,
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const hourlyRate = professor.teacherProfile?.hourlyRate || 0
  const totalPrice = (hourlyRate * formData.duration) / 60

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: professor.id,
          studentId,
          date: new Date(`${formData.date}T${formData.time}`),
          duration: formData.duration,
          price: totalPrice,
          notes: formData.notes,
        }),
      })

      if (response.ok) {
        const { checkoutUrl } = await response.json()
        setSuccess("Redirecionando para pagamento...")
        setTimeout(() => {
          window.location.href = checkoutUrl
        }, 1000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Erro ao criar agendamento")
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
      [name]: name === "duration" ? parseInt(value) : value,
    }))
  }

  // Verificar se a data/hora são válidos
  const isFormValid = formData.date && formData.time && formData.duration > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Dados do Agendamento</h2>

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
        {/* Data e Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Horário
            </label>
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Duração */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duração da aula
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

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Observações (opcional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Alguma informação específica sobre a aula..."
          />
        </div>

        {/* Resumo do preço */}
        {isFormValid && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Resumo</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Duração:</span>
                <span>{formData.duration} minutos</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa por hora:</span>
                <span>R$ {hourlyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Botão de submit */}
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm dark:bg-green-500 dark:hover:bg-green-600"
          size="lg"
        >
          {isSubmitting ? "Processando..." : "Avançar para Pagamento"}
        </Button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Você será redirecionado para completar o pagamento com segurança
        </p>
      </form>
    </div>
  )
}
