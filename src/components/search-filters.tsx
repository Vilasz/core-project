"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, X } from "lucide-react"

const specialties = [
  "Yoga",
  "Pilates",
  "Meditação",
  "Acupuntura",
  "Fisioterapia",
  "Psicologia",
  "Nutrição",
  "Personal Trainer",
  "Terapia Holística",
  "Massagem",
  "Reiki",
  "Tai Chi"
]

interface SearchFiltersProps {
  onFiltersChange?: (filters: {
    searchTerm: string
    selectedSpecialties: string[]
    minPrice: string
    maxPrice: string
    minRating: string
  }) => void
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minRating, setMinRating] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    )
  }

  const clearFilters = () => {
    setSelectedSpecialties([])
    setMinPrice("")
    setMaxPrice("")
    setMinRating("")
    setSearchTerm("")
    if (onFiltersChange) {
      onFiltersChange({
        searchTerm: "",
        selectedSpecialties: [],
        minPrice: "",
        maxPrice: "",
        minRating: ""
      })
    }
  }

  const applyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        searchTerm,
        selectedSpecialties,
        minPrice,
        maxPrice,
        minRating
      })
    }
  }

  const hasActiveFilters = selectedSpecialties.length > 0 || minPrice || maxPrice || minRating || searchTerm

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
          <Filter className="h-5 w-5 mr-2" />
          Filtros
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Busca por texto */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Buscar
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Nome ou especialidade..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Especialidades */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Especialidades
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {specialties.map((specialty) => (
            <label key={specialty} className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded transition-colors">
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(specialty)}
                onChange={() => toggleSpecialty(specialty)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Faixa de preço */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Faixa de preço (R$)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Mínimo"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
          <Input
            type="number"
            placeholder="Máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />
        </div>
      </div>

      {/* Rating mínimo */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Avaliação mínima
        </label>
        <Input
          type="number"
          min="1"
          max="5"
          step="0.1"
          placeholder="Ex: 4.0"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
      </div>

      {/* Botões */}
      <div className="space-y-2">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm dark:bg-green-500 dark:hover:bg-green-600"
          onClick={applyFilters}
        >
          Aplicar Filtros
        </Button>
        <Button 
          variant="outline" 
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700" 
          onClick={clearFilters}
        >
          Limpar Filtros
        </Button>
      </div>

      {/* Indicador de filtros ativos */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            Filtros ativos: {selectedSpecialties.length} especialidade(s), 
            {minPrice && ` preço mínimo R$ ${minPrice}`}
            {maxPrice && ` preço máximo R$ ${maxPrice}`}
            {minRating && ` avaliação mínima ${minRating}`}
            {searchTerm && ` busca por "${searchTerm}"`}
          </p>
        </div>
      )}
    </div>
  )
}
