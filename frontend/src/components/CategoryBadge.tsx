import React from 'react'
import {
  Car,
  ShoppingBag,
  ShoppingCart,
  Home,
  Play,
  Banknote,
  ArrowLeftRight,
  Activity,
  Tag,
} from 'lucide-react'

interface CategoryBadgeProps {
  category: string
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const norm = category.toLowerCase()

  if (norm.includes('compras') || norm.includes('mercado livre')) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#EBF5FF] text-[#2563EB]">
        <ShoppingCart className="w-3.5 h-3.5" />
        <span>Compras</span>
      </span>
    )
  }

  if (norm.includes('renda') || norm.includes('salário') || norm.includes('salario') || norm.includes('receita')) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
        <Banknote className="w-3.5 h-3.5" />
        <span>{category.includes('Renda') ? 'Renda' : 'Receita'}</span>
      </span>
    )
  }

  if (norm.includes('transporte') || norm.includes('uber')) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FAF5FF] text-[#8B5CF6]">
        <Car className="w-3.5 h-3.5" />
        <span>Transporte</span>
      </span>
    )
  }

  if (norm.includes('moradia') || norm.includes('luz') || norm.includes('aluguel')) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FFF7ED] text-[#EA580C]">
        <Home className="w-3.5 h-3.5" />
        <span>Moradia</span>
      </span>
    )
  }

  if (norm.includes('entretenimento') || norm.includes('lazer') || norm.includes('streaming') || norm.includes('netflix')) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
        <Play className="w-3 h-3 fill-current" />
        <span>Entretenimento</span>
      </span>
    )
  }

  if (norm.includes('alimenta') || norm.includes('mercado') || norm.includes('extra') || norm.includes('comida')) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#FFF7ED] text-[#EA580C]">
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>Alimentação</span>
      </span>
    )
  }

  if (norm.includes('transfer') || norm.includes('pix')) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#F0F9FF] text-[#0284C7]">
        <ArrowLeftRight className="w-3.5 h-3.5" />
        <span>Transferência</span>
      </span>
    )
  }

  if (norm.includes('saúde') || norm.includes('saude') || norm.includes('academia') || norm.includes('fitness')) {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#ECFEFF] text-[#0891B2]">
        <Activity className="w-3.5 h-3.5" />
        <span>Saúde</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
      <Tag className="w-3 h-3" />
      <span>{category}</span>
    </span>
  )
}
