import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Search, Calendar, CreditCard, Star, Users, Clock, Shield, CheckCircle } from "lucide-react"

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 sm:py-16 lg:py-20 dark:from-green-700 dark:to-green-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Como Funciona
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-green-100 dark:text-green-200 max-w-2xl mx-auto">
            Conectamos alunos e professores de wellness de forma simples e segura
          </p>
        </div>
      </section>

      {/* Para Alunos */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Para Alunos
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Encontre o professor ideal e agende suas aulas em poucos passos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">1. Busque Professores</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Explore nossa plataforma e encontre professores qualificados nas áreas que você procura
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">2. Agende sua Aula</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Escolha o horário que melhor se encaixa na sua rotina e confirme o agendamento
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">3. Pague com Segurança</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Realize o pagamento de forma segura através da nossa plataforma integrada
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">4. Avalie e Compartilhe</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Após a aula, deixe sua avaliação e ajude outros alunos a encontrarem ótimos professores
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para Professores */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Para Professores
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Expanda seu negócio e conecte-se com alunos interessados em suas especialidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-6 text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">1. Crie seu Perfil</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Cadastre-se como professor, adicione suas especialidades e defina seus valores
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-6 text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">2. Defina sua Disponibilidade</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Publique seus horários disponíveis ou aceite solicitações de alunos
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-6 text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">3. Receba Agendamentos</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Alunos podem agendar aulas diretamente com você através da plataforma
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md p-6 text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">4. Receba Pagamentos</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Receba seus pagamentos de forma segura e organizada através da plataforma
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Por que escolher a Core?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Oferecemos segurança, praticidade e uma comunidade engajada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Segurança</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    Todos os pagamentos são processados de forma segura e protegida
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Professores Verificados</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    Todos os professores passam por um processo de verificação
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <Star className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Sistema de Avaliações</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    Avaliações reais de alunos ajudam você a escolher o melhor professor
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Flexibilidade</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    Agende aulas no horário que melhor se encaixa na sua rotina
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Comunidade Ativa</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    Faça parte de uma comunidade vibrante de bem-estar e wellness
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Pagamento Simplificado</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    Processo de pagamento rápido e sem complicações
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 sm:py-16 lg:py-20 dark:from-green-700 dark:to-green-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Pronto para começar?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-green-100 dark:text-green-200 mb-6 sm:mb-8">
            Junte-se à nossa comunidade e transforme sua jornada de wellness
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 shadow-sm dark:bg-gray-100 dark:text-green-700 dark:hover:bg-gray-200 w-full sm:w-auto">
                Criar Conta
              </Button>
            </Link>
            <Link href="/professores">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 shadow-sm dark:border-gray-300 dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-green-700 w-full sm:w-auto">
                Ver Professores
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

