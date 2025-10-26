import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { Calendar, DollarSign, Users, Star } from "lucide-react"

export default async function ProfessorDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "TEACHER") {
    redirect("/auth/signin")
  }

  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  })

  if (!teacherProfile) {
    redirect("/dashboard/professor/configuracoes")
  }

  // Buscar estatísticas
  const totalBookings = await prisma.booking.count({
    where: {
      teacherId: session.user.id,
      status: {
        in: ["CONFIRMED", "COMPLETED"],
      },
    },
  })

  const recentBookings = await prisma.booking.findMany({
    where: {
      teacherId: session.user.id,
    },
    include: {
      student: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 5,
  })

  const monthlyEarnings = await prisma.payment.aggregate({
    where: {
      booking: {
        teacherId: session.user.id,
      },
      status: "COMPLETED",
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
    _sum: {
      amount: true,
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard do Professor
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Bem-vindo de volta, {session.user.name}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total de Aulas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Ganhos do Mês</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  R$ {monthlyEarnings._sum.amount?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avaliações</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{teacherProfile.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Rating Médio</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{teacherProfile.rating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximas Aulas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Próximas Aulas</h2>
            
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {booking.student.name}
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
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "CONFIRMED" 
                          ? "bg-green-100 text-green-800"
                          : booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {booking.status === "CONFIRMED" ? "Confirmada" :
                         booking.status === "PENDING" ? "Pendente" :
                         booking.status === "COMPLETED" ? "Concluída" : "Cancelada"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma aula agendada ainda</p>
              </div>
            )}
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Ações Rápidas</h2>
            
            <div className="space-y-4">
              <a
                href="/dashboard/professor/agenda"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Gerenciar Agenda</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Ver e editar disponibilidade</p>
                </div>
              </a>

              <a
                href="/dashboard/professor/configuracoes"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Configurações</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Editar perfil e preços</p>
                </div>
              </a>

              <a
                href="/horarios-disponiveis"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Postar Horários</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Publicar horários disponíveis</p>
                </div>
              </a>

              <a
                href="/solicitacoes"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Ver Solicitações</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Solicitações de alunos</p>
                </div>
              </a>

              <a
                href="/dashboard/professor/financeiro"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Relatórios Financeiros</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Ver ganhos e pagamentos</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
