import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { BookingForm } from "@/components/booking-form"

interface BookingPageProps {
  params: {
    professorId: string
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "STUDENT") {
    redirect("/auth/signin")
  }

  const professor = await prisma.user.findUnique({
    where: {
      id: params.professorId,
      role: "TEACHER",
    },
    include: {
      teacherProfile: true,
    },
  })

  if (!professor || !professor.teacherProfile) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Agendar Aula
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Agende uma aula com {professor.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Agendamento */}
          <div className="lg:col-span-2">
            <BookingForm 
              professor={professor}
              studentId={session.user.id}
            />
          </div>

          {/* Informações do Professor */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center space-x-4 mb-4">
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
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {professor.name}
                  </h3>
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    R$ {professor.teacherProfile.hourlyRate}/hora
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Especialidades</h4>
                  <div className="flex flex-wrap gap-1">
                    {professor.teacherProfile.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {professor.teacherProfile.bio && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Sobre</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {professor.teacherProfile.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
