"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface ReviewFormProps {
  bookingId: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ bookingId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert("Por favor, selecione uma avaliação")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          rating,
          comment: comment.trim() || undefined,
        }),
      })

      if (response.ok) {
        setRating(0)
        setComment("")
        onReviewSubmitted?.()
      } else {
        const { error } = await response.json()
        alert(error || "Erro ao enviar avaliação")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao enviar avaliação")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avaliação
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 ${
                  value <= rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                } hover:text-yellow-400 transition-colors`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {rating === 1 && "Péssimo"}
            {rating === 2 && "Ruim"}
            {rating === 3 && "Regular"}
            {rating === 4 && "Bom"}
            {rating === 5 && "Excelente"}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comentário (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Conte sobre sua experiência na aula..."
        />
      </div>

      <Button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="bg-green-600 hover:bg-green-700"
      >
        {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </form>
  )
}
