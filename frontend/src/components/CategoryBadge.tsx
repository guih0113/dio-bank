import React from 'react'
import { Car, ShoppingBag, Home, Play, Banknote, Tag } from 'lucide-react'

interface CategoryBadgeProps {
  category: string
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const norm = category.toLowerCase()

  if (norm.includes('transporte')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#EBF5FF] text-[#2563EB]">
        <Car className="w-3.5 h-3.5" />
        <span>Transporte</span>
      </span>
    )
  }

  if (norm.includes('receita') || norm.includes('salário') || norm.includes('salario')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#ECFDF5] text-[#059669]">
        <Banknote className="w-3.5 h-3.5" />
        <span>Receita</span>
      </span>
    )
  }

  if (norm.includes('alimenta') || norm.includes('mercado') || norm.includes('comida')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FFF7ED] text-[#EA580C]">
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>Alimentação</span>
      </span>
    )
  }

  if (norm.includes('moradia') || norm.includes('luz') || norm.includes('aluguel')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAF5FF] text-[#9333EA]">
        <Home className="w-3.5 h-3.5" />
        <span>Moradia</span>
      </span>
    )
  }

  if (norm.includes('entretenimento') || norm.includes('lazer') || norm.includes('streaming')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
        <Play className="w-3 h-3 fill-current" />
        <span>Entretenimento</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
      <Tag className="w-3 h-3" />
      <span>{category}</span>
    </span>
  )
}
