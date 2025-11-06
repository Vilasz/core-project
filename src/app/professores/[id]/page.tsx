import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ReviewList } from "@/components/review-list"
import { Star, Clock, MapPin, Users, Calendar } from "lucide-react"
import { prisma } from "@/lib/prisma"
export const runtime = 'nodejs';


export const dynamic = 'force-dynamic'

interface ProfessorPageProps {
  params: {
    id: string
  }
}

export default async function ProfessorPage({ params }: ProfessorPageProps) {
  const professor = await prisma.user.findUnique({
    where: {
      id: params.id,
      role: "TEACHER",
    },
    include: {
      teacherProfile: true,
    },
  })

  if (!professor || !professor.teacherProfile) {
    notFound()
  }

  const { teacherProfile } = professor

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header do Professor */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto lg:mx-0">
                  {professor.image ? (
                    <img
                      src={professor.image}
                      alt={professor.name || "Professor"}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-3xl sm:text-4xl font-semibold">
                      {professor.name?.charAt(0) || "P"}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {professor.name}
                </h1>

                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="flex items-center flex-wrap justify-center lg:justify-start gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {teacherProfile.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      ({teacherProfile.totalReviews} avaliações)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 justify-center lg:justify-start">
                  {teacherProfile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs sm:text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-green-600 dark:text-green-400 text-base sm:text-lg font-semibold mb-4 justify-center lg:justify-start">
                  <Clock className="h-5 w-5 mr-2" />
                  R$ {teacherProfile.hourlyRate}/hora
                </div>

                <div className="flex justify-center lg:justify-start">
                  <Link href={`/agendar/${professor.id}`}>
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 w-full sm:w-auto">
                      Agendar Aula
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Informações principais */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Sobre */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Sobre</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {teacherProfile.bio || 
                  "Professor de wellness experiente e dedicado a ajudar alunos em sua jornada de bem-estar. Comprometido em oferecer aulas de alta qualidade adaptadas às necessidades individuais de cada aluno."
                }
              </p>
            </div>

            {/* Avaliações */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Avaliações</h2>
              <ReviewList teacherId={params.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Disponibilidade */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <Calendar className="h-5 w-5 mr-2" />
                Próximas Aulas
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                Selecione &quot;Agendar Aula&quot; para ver a disponibilidade completa e escolher um horário.
              </p>
            </div>

            {/* Informações de Contato */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Informações</h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Users className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                  <span>{teacherProfile.totalReviews} alunos atendidos</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Star className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                  <span>Avaliação média: {teacherProfile.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                  <span>R$ {teacherProfile.hourlyRate}/hora</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
