import { Navbar } from "@/components/navbar"
import { ProfessorCard } from "@/components/professor-card"
import { SearchFilters } from "@/components/search-filters"
import { prisma } from "@/lib/prisma"
export const runtime = 'nodejs';


export const dynamic = 'force-dynamic'

export default async function ProfessoresPage() {
  // Buscar professores com seus perfis
  const professores = await prisma.user.findMany({
    where: {
      role: "TEACHER",
    },
    include: {
      teacherProfile: true,
    },
  })

  const professoresComPerfil = professores.filter(
    (professor) => professor.teacherProfile
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Encontre seu professor ideal
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Conecte-se com profissionais qualificados de wellness
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <div className="lg:w-1/4">
            <SearchFilters />
          </div>

          {/* Lista de professores */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <p className="text-gray-600">
                {professoresComPerfil.length} professores encontrados
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {professoresComPerfil.map((professor) => (
                <ProfessorCard 
                  key={professor.id} 
                  professor={professor} 
                />
              ))}
            </div>

            {professoresComPerfil.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhum professor encontrado. Tente ajustar os filtros.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
