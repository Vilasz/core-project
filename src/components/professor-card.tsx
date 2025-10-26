import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock } from "lucide-react"

interface Professor {
  id: string
  name: string | null
  image: string | null
  teacherProfile: {
    bio: string | null
    specialties: string[]
    hourlyRate: number
    rating: number
    totalReviews: number
  } | null
}

interface ProfessorCardProps {
  professor: Professor
}

export function ProfessorCard({ professor }: ProfessorCardProps) {
  const { teacherProfile } = professor

  if (!teacherProfile) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              {professor.image ? (
                <img
                  src={professor.image}
                  alt={professor.name || "Professor"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-lg font-semibold">
                  {professor.name?.charAt(0) || "P"}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {professor.name}
            </h3>

            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                  {teacherProfile.rating.toFixed(1)}
                </span>
                <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                  ({teacherProfile.totalReviews})
                </span>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {teacherProfile.specialties.slice(0, 3).map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
                {teacherProfile.specialties.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{teacherProfile.specialties.length - 3} mais
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">
              {teacherProfile.bio || "Professor de wellness experiente."}
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center text-green-600 dark:text-green-400 font-semibold">
                <Clock className="h-4 w-4 mr-1" />
                R$ {teacherProfile.hourlyRate}/hora
              </div>
              
              <div className="flex space-x-2">
                <Link href={`/professores/${professor.id}`}>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    Ver Perfil
                  </Button>
                </Link>
                <Link href={`/agendar/${professor.id}`}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-sm dark:bg-green-500 dark:hover:bg-green-600">
                    Agendar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
