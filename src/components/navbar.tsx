"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

export function Navbar() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-poppins font-black tracking-tight text-green-600 dark:text-green-400">
              Core
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/signup">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                <span className="hidden lg:inline">Cadastro Professores</span>
                <span className="lg:hidden">Cadastrar</span>
              </Button>
            </Link>

            <Link href="/como-funciona">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                Como Funciona
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
              <div className="text-gray-600 dark:text-gray-400 text-sm">Carregando...</div>
            ) : session ? (
              <div className="flex items-center gap-2 lg:gap-4">
                <Link 
                  href={session.user.role === "TEACHER" ? "/dashboard/professor" : "/dashboard/aluno"}
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden lg:inline">
                  Olá, {session.user.name}!
                </span>
                <Button variant="outline" onClick={() => signOut()} size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => signIn()} size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                  Entrar
                </Button>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-sm dark:bg-green-500 dark:hover:bg-green-600">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 px-0"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
            <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                Cadastrar Professores
              </Button>
            </Link>

            <Link href="/como-funciona" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                Como Funciona
              </Button>
            </Link>

            <Link href="/professores" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                <Search className="h-4 w-4" />
                Encontrar Professores
              </Button>
            </Link>

            {session && (
              <>
                <Link href="/horarios-disponiveis" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                    Horários
                  </Button>
                </Link>
                <Link href="/solicitacoes" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                    Solicitações
                  </Button>
                </Link>
                <Link 
                  href={session.user.role === "TEACHER" ? "/dashboard/professor" : "/dashboard/aluno"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                    Dashboard
                  </Button>
                </Link>
                <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Olá, {session.user.name}!
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }} 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Sair
                </Button>
              </>
            )}

            {!session && status !== "loading" && (
              <div className="space-y-2 px-3">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    signIn()
                    setMobileMenuOpen(false)
                  }} 
                  className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                >
                  Entrar
                </Button>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm dark:bg-green-500 dark:hover:bg-green-600">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
