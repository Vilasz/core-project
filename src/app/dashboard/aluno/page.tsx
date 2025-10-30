import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { Calendar, Clock, Star, User } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AlunoDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "STUDENT") {
    redirect("/auth/signin")
  }

  // Buscar aulas do aluno
  const bookings = await prisma.booking.findMany({
    where: {
      studentId: session.user.id,
    },
    include: {
      teacher: {
        select: {
          name: true,
          image: true,
          teacherProfile: {
            select: {
              specialties: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 10,
  })

  const upcomingBookings = bookings.filter(
    (booking) => booking.date > new Date() && booking.status === "CONFIRMED"
  )

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Meu Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Bem-vindo, {session.user.name}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Próximas Aulas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{upcomingBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Aulas Concluídas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total de Aulas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bookings.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximas Aulas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Próximas Aulas</h2>
            
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {booking.teacher.image ? (
                            <img
                              src={booking.teacher.image}
                              alt={booking.teacher.name || "Professor"}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-gray-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {booking.teacher.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.date).toLocaleDateString("pt-BR")} às{" "}
                          {new Date(booking.date).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.duration} minutos - R$ {booking.price.toFixed(2)}
                        </p>
                        {booking.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            Notas: {booking.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Nenhuma aula agendada ainda</p>
                <Link
                  href="/professores"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Encontrar professores
                </Link>
              </div>
            )}
          </div>

          {/* Histórico */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Histórico de Aulas</h2>
            
            {completedBookings.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {completedBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {booking.teacher.image ? (
                              <img
                                src={booking.teacher.image}
                                alt={booking.teacher.name || "Professor"}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {booking.teacher.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.date).toLocaleDateString("pt-BR")}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.duration} min - R$ {booking.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Histórico de aulas aparecerá aqui</p>
              </div>
            )}
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Ações Rápidas</h2>
            
            <div className="space-y-4">
              <Link
                href="/professores"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Star className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Encontrar Professores</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Buscar novos professores</p>
                </div>
              </Link>

              <Link
                href="/horarios-disponiveis"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Horários Disponíveis</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Ver horários postados</p>
                </div>
              </Link>

              <Link
                href="/solicitacoes"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Minhas Solicitações</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Gerenciar solicitações</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
