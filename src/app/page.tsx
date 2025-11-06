import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Heart, Users, Star, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 sm:py-16 lg:py-20 dark:from-green-700 dark:to-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">
              Conecte-se com os melhores 
              <span className="block text-green-200 dark:text-green-300">professores de wellness</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-green-100 dark:text-green-200 max-w-3xl mx-auto px-4">
              Encontre aulas de yoga, meditação, pilates e muito mais. 
              Professores credenciados, horários flexíveis e pagamento seguro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/professores">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 shadow-sm dark:bg-gray-100 dark:text-green-700 dark:hover:bg-gray-200">
                  Encontrar Professores
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 shadow-sm dark:border-gray-300 dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-green-700">
                Como Funciona
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 px-2">
              Por que escolher nosso marketplace?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Oferecemos a melhor experiência tanto para alunos quanto para professores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">Profissionais Qualificados</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Todos os professores são verificados e têm experiência comprovada
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">Agendamento Fácil</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sistema intuitivo de agendamento com calendário integrado
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">Avaliações Reais</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sistema de avaliações para garantir a qualidade do serviço
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">Comunidade Ativa</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Junte-se a uma comunidade vibrante de bem-estar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white dark:bg-gray-800 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 px-2">
            Pronto para começar sua jornada de wellness?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4">
            Explore nossos professores e encontre a aula perfeita para você
          </p>
          <Link href="/professores">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-sm dark:bg-green-500 dark:hover:bg-green-600">
              Buscar Professores
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-poppins font-black mb-3 sm:mb-4">Core</h3>
            <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 mb-6 sm:mb-8">
              Conectando pessoas através do bem-estar
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <a href="#" className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300">Sobre</a>
              <a href="#" className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300">Contato</a>
              <a href="#" className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300">Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300">Termos</a>
            </div>
            <p className="text-gray-500 dark:text-gray-600 text-sm mt-8">
              © 2024 Core. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
