"use client"

import { useState, useEffect } from "react"
import { Star, User } from "lucide-react"

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  student: {
    name: string | null
    image: string | null
  }
}

interface ReviewListProps {
  teacherId: string
}

export function ReviewList({ teacherId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [teacherId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?teacherId=${teacherId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Erro ao buscar reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Ainda não há avaliações para este professor.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {review.student.image ? (
                  <img
                    src={review.student.image}
                    alt={review.student.name || "Aluno"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-gray-900">
                  {review.student.name || "Aluno"}
                </h4>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {review.comment && (
                <p className="text-gray-600 text-sm mb-2">
                  {review.comment}
                </p>
              )}
              
              <p className="text-gray-400 text-xs">
                {new Date(review.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
