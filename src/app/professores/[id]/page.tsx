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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header do Professor */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto lg:mx-0">
                  {professor.image ? (
                    <img
                      src={professor.image}
                      alt={professor.name || "Professor"}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-4xl font-semibold">
                      {professor.name?.charAt(0) || "P"}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {professor.name}
                </h1>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-2 text-lg font-semibold">
                      {teacherProfile.rating.toFixed(1)}
                    </span>
                    <span className="ml-2 text-gray-600">
                      ({teacherProfile.totalReviews} avaliações)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {teacherProfile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-green-600 text-lg font-semibold mb-6">
                  <Clock className="h-5 w-5 mr-2" />
                  R$ {teacherProfile.hourlyRate}/hora
                </div>

                <Link href={`/agendar/${professor.id}`}>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Agendar Aula
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações principais */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sobre */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Sobre</h2>
              <p className="text-gray-600 leading-relaxed">
                {teacherProfile.bio || 
                  "Professor de wellness experiente e dedicado a ajudar alunos em sua jornada de bem-estar. Comprometido em oferecer aulas de alta qualidade adaptadas às necessidades individuais de cada aluno."
                }
              </p>
            </div>

            {/* Avaliações */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Avaliações</h2>
              <ReviewList teacherId={params.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Disponibilidade */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Próximas Aulas
              </h3>
              <p className="text-gray-600 text-sm">
                Selecione &quot;Agendar Aula&quot; para ver a disponibilidade completa e escolher um horário.
              </p>
            </div>

            {/* Informações de Contato */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Informações</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{teacherProfile.totalReviews} alunos atendidos</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Avaliação média: {teacherProfile.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
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
