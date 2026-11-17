import React, { useState } from 'react'
import {
  Home,
  Download,
  Search,
  Calendar,
  Landmark,
  ArrowUpDown,
  Tag,
  RotateCcw,
  SlidersHorizontal,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { BankLogo } from '../components/BankLogos'
import { CategoryBadge } from '../components/CategoryBadge'

interface ExtratoTransaction {
  id: string
  date: string
  description: string
  category: string
  bank: string
  amount: number
  type: 'Despesa' | 'Receita'
}

interface ExtratoViewProps {
  onBackToDashboard?: () => void
}

export const ExtratoView: React.FC<ExtratoViewProps> = ({ onBackToDashboard }) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('Últimos 30 dias')
  const [selectedBank, setSelectedBank] = useState('Todos os bancos')
  const [selectedType, setSelectedType] = useState('Todos os tipos')
  const [selectedCategory, setSelectedCategory] = useState('Todas as categorias')
  const [currentPage, setCurrentPage] = useState(1)

  // Full dataset matching the design
  const transactions: ExtratoTransaction[] = [
    {
      id: 'tx-1',
      date: '19/11/2026',
      description: 'Pagamento Mercado Livre',
      category: 'Compras',
      bank: 'Nubank',
      amount: -249.9,
      type: 'Despesa',
    },
    {
      id: 'tx-2',
      date: '18/11/2026',
      description: 'Salário',
      category: 'Renda',
      bank: 'Santander',
      amount: 5230.0,
      type: 'Receita',
    },
    {
      id: 'tx-3',
      date: '17/11/2026',
      description: 'Uber',
      category: 'Transporte',
      bank: 'Nubank',
      amount: -42.9,
      type: 'Despesa',
    },
    {
      id: 'tx-4',
      date: '16/11/2026',
      description: 'Conta de Luz',
      category: 'Moradia',
      bank: 'Bradesco',
      amount: -129.9,
      type: 'Despesa',
    },
    {
      id: 'tx-5',
      date: '15/11/2026',
      description: 'Netflix',
      category: 'Entretenimento',
      bank: 'Nubank',
      amount: -39.9,
      type: 'Despesa',
    },
    {
      id: 'tx-6',
      date: '14/11/2026',
      description: 'Supermercado Extra',
      category: 'Alimentação',
      bank: 'Itaú',
      amount: -287.45,
      type: 'Despesa',
    },
    {
      id: 'tx-7',
      date: '13/11/2026',
      description: 'Transferência PIX',
      category: 'Transferência',
      bank: 'Banco do Brasil',
      amount: 1200.0,
      type: 'Receita',
    },
    {
      id: 'tx-8',
      date: '12/11/2026',
      description: 'Academia',
      category: 'Saúde',
      bank: 'Santander',
      amount: -89.9,
      type: 'Despesa',
    },
  ]

  const formatAmount = (val: number, isIncome: boolean) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(val))

    return `${isIncome ? '+ ' : '- '}${formatted}`
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedPeriod('Últimos 30 dias')
    setSelectedBank('Todos os bancos')
    setSelectedType('Todos os tipos')
    setSelectedCategory('Todas as categorias')
  }

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      searchTerm === '' ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.bank.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBank =
      selectedBank === 'Todos os bancos' || tx.bank.toLowerCase() === selectedBank.toLowerCase()

    const matchesType =
      selectedType === 'Todos os tipos' || tx.type.toLowerCase() === selectedType.toLowerCase()

    const matchesCategory =
      selectedCategory === 'Todas as categorias' ||
      tx.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesBank && matchesType && matchesCategory
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Title Area */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Extrato</span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Extrato
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Confira todas as suas transações em um só lugar.
          </p>
        </div>

        {/* Export Button */}
        <button
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition self-start cursor-pointer active:scale-95"
          title="Exportar Relatório Financeiro"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por descrição..."
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          />
        </div>

        {/* Period Selector */}
        <div className="relative">
          <button className="flex items-center space-x-2 px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium">{selectedPeriod}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </button>
        </div>

        {/* Bank Filter */}
        <div className="relative">
          <button className="flex items-center space-x-2 px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
            <Landmark className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium">{selectedBank}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </button>
        </div>

        {/* Type Filter */}
        <div className="relative">
          <button className="flex items-center space-x-2 px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium">{selectedType}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button className="flex items-center space-x-2 px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium">{selectedCategory}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
          </button>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={handleClearFilters}
          className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-[#EE5D26] text-[#EE5D26] hover:bg-orange-50/60 text-xs font-semibold transition cursor-pointer active:scale-95 ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar filtros</span>
        </button>
      </div>

      {/* Main Transactions Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-600 bg-white">
                <th className="py-4 px-6 font-semibold">Data</th>
                <th className="py-4 px-4 font-semibold">Descrição</th>
                <th className="py-4 px-4 font-semibold">Categoria</th>
                <th className="py-4 px-4 font-semibold">Banco</th>
                <th className="py-4 px-4 font-semibold">Valor</th>
                <th className="py-4 px-4 font-semibold">Tipo</th>
                <th className="py-4 px-6 text-right font-semibold">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 inline-block" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'Receita'

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Data */}
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{tx.date}</td>

                    {/* Descrição */}
                    <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {tx.description}
                    </td>

                    {/* Categoria Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <CategoryBadge category={tx.category} />
                    </td>

                    {/* Banco */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2.5">
                        <BankLogo bank={tx.bank} className="w-5 h-5" />
                        <span className="text-slate-800 font-medium">{tx.bank}</span>
                      </div>
                    </td>

                    {/* Valor */}
                    <td
                      className={`py-4 px-4 font-bold whitespace-nowrap ${
                        isIncome ? 'text-emerald-600' : 'text-[#F43F5E]'
                      }`}
                    >
                      {formatAmount(tx.amount, isIncome)}
                    </td>

                    {/* Tipo Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                          isIncome
                            ? 'bg-[#ECFDF5] text-[#10B981]'
                            : 'bg-[#FFF1F2] text-[#F43F5E]'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>

                    {/* Action Menu (3 dots) */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="Mais opções"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            Mostrando 1–{filteredTransactions.length} de 124 transações
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-1.5">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page 1 (Active) */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                currentPage === 1
                  ? 'bg-[#EE5D26] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition flex items-center justify-center cursor-pointer ${
                currentPage === 2
                  ? 'bg-[#EE5D26] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              2
            </button>

            {/* Page 3 */}
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition flex items-center justify-center cursor-pointer ${
                currentPage === 3
                  ? 'bg-[#EE5D26] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              3
            </button>

            {/* Ellipsis */}
            <span className="px-1 text-slate-400">...</span>

            {/* Page 16 */}
            <button
              onClick={() => setCurrentPage(16)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition flex items-center justify-center cursor-pointer ${
                currentPage === 16
                  ? 'bg-[#EE5D26] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              16
            </button>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(16, p + 1))}
              disabled={currentPage === 16}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
