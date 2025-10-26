"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-green-600 dark:text-green-400">
              Wellness Marketplace
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/professores">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                <Search className="h-4 w-4" />
                Encontrar Professores
              </Button>
            </Link>

            {session && (
              <>
                <Link href="/horarios-disponiveis">
                  <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                    Horários
                  </Button>
                </Link>
                <Link href="/solicitacoes">
                  <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                    Solicitações
                  </Button>
                </Link>
              </>
            )}

            <ThemeToggle />

            {status === "loading" ? (
              <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
            ) : session ? (
              <div className="flex items-center gap-4">
                <Link 
                  href={session.user.role === "TEACHER" ? "/dashboard/professor" : "/dashboard/aluno"}
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Olá, {session.user.name}!
                </span>
                <Button variant="outline" onClick={() => signOut()} className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => signIn()} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                  Entrar
                </Button>
                <Link href="/auth/signup">
                  <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm dark:bg-green-500 dark:hover:bg-green-600">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
