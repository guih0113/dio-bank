import React, { useState, useRef, useEffect, useMemo } from 'react'
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
  Check,
  Inbox,
} from 'lucide-react'
import { BankLogo } from '../components/BankLogos'
import { CategoryBadge } from '../components/CategoryBadge'

export interface ExtratoTransaction {
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

const ITEMS_PER_PAGE = 8

// Reference date matching the mockup dataset (19/11/2026)
const REFERENCE_DATE = new Date(2026, 10, 19)

const PERIOD_OPTIONS = [
  'Últimos 30 dias',
  'Últimos 7 dias',
  'Este mês',
  'Mês anterior',
  'Últimos 90 dias',
  'Este ano',
  'Todas as datas',
]

const BANK_OPTIONS = [
  'Todos os bancos',
  'Nubank',
  'Santander',
  'Itaú',
  'Bradesco',
  'Banco do Brasil',
  'Caixa',
  'Banco Inter',
  'BTG Pactual',
]

const TYPE_OPTIONS = ['Todos os tipos', 'Despesa', 'Receita']

const CATEGORY_OPTIONS = [
  'Todas as categorias',
  'Compras',
  'Renda',
  'Transporte',
  'Moradia',
  'Entretenimento',
  'Alimentação',
  'Transferência',
  'Saúde',
  'Educação',
  'Investimentos',
  'Outros',
]

// Extended realistic transactions list (56 items for multi-page demonstration)
const TRANSACTIONS_DATA: ExtratoTransaction[] = [
  // Page 1 (matches exact design from user screenshot)
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
  // Page 2
  {
    id: 'tx-9',
    date: '11/11/2026',
    description: 'Restaurante Madero',
    category: 'Alimentação',
    bank: 'Nubank',
    amount: -142.5,
    type: 'Despesa',
  },
  {
    id: 'tx-10',
    date: '10/11/2026',
    description: 'Rendimento CDB',
    category: 'Investimentos',
    bank: 'BTG Pactual',
    amount: 450.0,
    type: 'Receita',
  },
  {
    id: 'tx-11',
    date: '09/11/2026',
    description: 'Posto Shell Combustível',
    category: 'Transporte',
    bank: 'Itaú',
    amount: -220.0,
    type: 'Despesa',
  },
  {
    id: 'tx-12',
    date: '08/11/2026',
    description: 'Farmácia Raia',
    category: 'Saúde',
    bank: 'Caixa',
    amount: -74.3,
    type: 'Despesa',
  },
  {
    id: 'tx-13',
    date: '07/11/2026',
    description: 'Condomínio Residencial',
    category: 'Moradia',
    bank: 'Banco do Brasil',
    amount: -650.0,
    type: 'Despesa',
  },
  {
    id: 'tx-14',
    date: '06/11/2026',
    description: 'Venda de Eletrônico OLX',
    category: 'Renda',
    bank: 'Banco Inter',
    amount: 850.0,
    type: 'Receita',
  },
  {
    id: 'tx-15',
    date: '05/11/2026',
    description: 'Amazon Prime & Livros',
    category: 'Compras',
    bank: 'Nubank',
    amount: -119.8,
    type: 'Despesa',
  },
  {
    id: 'tx-16',
    date: '04/11/2026',
    description: 'Internet Fibra Óptica',
    category: 'Moradia',
    bank: 'Bradesco',
    amount: -149.9,
    type: 'Despesa',
  },
  // Page 3
  {
    id: 'tx-17',
    date: '03/11/2026',
    description: 'Padaria Pão & Cia',
    category: 'Alimentação',
    bank: 'Santander',
    amount: -32.5,
    type: 'Despesa',
  },
  {
    id: 'tx-18',
    date: '02/11/2026',
    description: 'Spotify Premium',
    category: 'Entretenimento',
    bank: 'Nubank',
    amount: -34.9,
    type: 'Despesa',
  },
  {
    id: 'tx-19',
    date: '01/11/2026',
    description: 'Dividendos Ações',
    category: 'Investimentos',
    bank: 'BTG Pactual',
    amount: 320.15,
    type: 'Receita',
  },
  {
    id: 'tx-20',
    date: '30/10/2026',
    description: 'Zara Roupas & Calçados',
    category: 'Compras',
    bank: 'Itaú',
    amount: -389.0,
    type: 'Despesa',
  },
  {
    id: 'tx-21',
    date: '28/10/2026',
    description: 'Consulta Médica Dermatologia',
    category: 'Saúde',
    bank: 'Bradesco',
    amount: -300.0,
    type: 'Despesa',
  },
  {
    id: 'tx-22',
    date: '26/10/2026',
    description: 'Curso Online de IA',
    category: 'Educação',
    bank: 'Banco Inter',
    amount: -197.0,
    type: 'Despesa',
  },
  {
    id: 'tx-23',
    date: '24/10/2026',
    description: 'Depósito Poupança',
    category: 'Transferência',
    bank: 'Caixa',
    amount: 500.0,
    type: 'Receita',
  },
  {
    id: 'tx-24',
    date: '22/10/2026',
    description: 'Pet Shop Rações & Banho',
    category: 'Outros',
    bank: 'Nubank',
    amount: -145.0,
    type: 'Despesa',
  },
  // Page 4
  {
    id: 'tx-25',
    date: '20/10/2026',
    description: 'Carrefour Hipermercado',
    category: 'Alimentação',
    bank: 'Itaú',
    amount: -412.3,
    type: 'Despesa',
  },
  {
    id: 'tx-26',
    date: '18/10/2026',
    description: 'Adiantamento Quinzenal',
    category: 'Renda',
    bank: 'Santander',
    amount: 2100.0,
    type: 'Receita',
  },
  {
    id: 'tx-27',
    date: '16/10/2026',
    description: 'Sem Parar Pedágio',
    category: 'Transporte',
    bank: 'Banco do Brasil',
    amount: -86.4,
    type: 'Despesa',
  },
  {
    id: 'tx-28',
    date: '14/10/2026',
    description: 'Cinema UCI IMAX',
    category: 'Entretenimento',
    bank: 'Nubank',
    amount: -92.0,
    type: 'Despesa',
  },
  {
    id: 'tx-29',
    date: '12/10/2026',
    description: 'Manutenção Veicular',
    category: 'Transporte',
    bank: 'Bradesco',
    amount: -540.0,
    type: 'Despesa',
  },
  {
    id: 'tx-30',
    date: '10/10/2026',
    description: 'Restituição IR',
    category: 'Renda',
    bank: 'Banco do Brasil',
    amount: 1450.0,
    type: 'Receita',
  },
  {
    id: 'tx-31',
    date: '08/10/2026',
    description: 'Apple Store Assinatura iCloud',
    category: 'Entretenimento',
    bank: 'Nubank',
    amount: -14.9,
    type: 'Despesa',
  },
  {
    id: 'tx-32',
    date: '05/10/2026',
    description: 'Material de Escritório Kalunga',
    category: 'Compras',
    bank: 'Banco Inter',
    amount: -168.4,
    type: 'Despesa',
  },
  // Page 5
  {
    id: 'tx-33',
    date: '01/10/2026',
    description: 'Aluguel do Imóvel',
    category: 'Moradia',
    bank: 'Santander',
    amount: -2100.0,
    type: 'Despesa',
  },
  {
    id: 'tx-34',
    date: '28/09/2026',
    description: 'iFood Entrega Jantar',
    category: 'Alimentação',
    bank: 'Nubank',
    amount: -68.9,
    type: 'Despesa',
  },
  {
    id: 'tx-35',
    date: '25/09/2026',
    description: 'Trabalho Freelance Design',
    category: 'Renda',
    bank: 'Banco Inter',
    amount: 1800.0,
    type: 'Receita',
  },
  {
    id: 'tx-36',
    date: '20/09/2026',
    description: 'Decathlon Artigos Esportivos',
    category: 'Compras',
    bank: 'Itaú',
    amount: -299.9,
    type: 'Despesa',
  },
  {
    id: 'tx-37',
    date: '15/09/2026',
    description: 'Plano de Saúde Unimed',
    category: 'Saúde',
    bank: 'Bradesco',
    amount: -480.0,
    type: 'Despesa',
  },
  {
    id: 'tx-38',
    date: '10/09/2026',
    description: 'Resgate Fundo de Renda Fixa',
    category: 'Investimentos',
    bank: 'BTG Pactual',
    amount: 3000.0,
    type: 'Receita',
  },
  {
    id: 'tx-39',
    date: '05/09/2026',
    description: 'Livros Didáticos e Papelaria',
    category: 'Educação',
    bank: 'Caixa',
    amount: -125.0,
    type: 'Despesa',
  },
  {
    id: 'tx-40',
    date: '01/09/2026',
    description: 'Seguro Automóvel Porto',
    category: 'Transporte',
    bank: 'Itaú',
    amount: -215.5,
    type: 'Despesa',
  },
]

export const ExtratoView: React.FC<ExtratoViewProps> = ({ onBackToDashboard }) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('Últimos 30 dias')
  const [selectedBank, setSelectedBank] = useState('Todos os bancos')
  const [selectedType, setSelectedType] = useState('Todos os tipos')
  const [selectedCategory, setSelectedCategory] = useState('Todas as categorias')
  const [currentPage, setCurrentPage] = useState(1)

  // Active Dropdown Tracker
  const [activeDropdown, setActiveDropdown] = useState<'period' | 'bank' | 'type' | 'category' | null>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedPeriod, selectedBank, selectedType, selectedCategory])

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
    setCurrentPage(1)
    setActiveDropdown(null)
  }

  // Parse DD/MM/YYYY to Date object
  const parseDate = (dStr: string) => {
    const [day, month, year] = dStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  // Check period condition
  const checkPeriodMatch = (txDateStr: string, period: string) => {
    if (period === 'Todas as datas') return true
    const txDate = parseDate(txDateStr)

    const diffDays = Math.floor((REFERENCE_DATE.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24))

    switch (period) {
      case 'Últimos 7 dias':
        return diffDays >= 0 && diffDays <= 7
      case 'Últimos 30 dias':
        return diffDays >= 0 && diffDays <= 30
      case 'Últimos 90 dias':
        return diffDays >= 0 && diffDays <= 90
      case 'Este mês':
        return (
          txDate.getMonth() === REFERENCE_DATE.getMonth() &&
          txDate.getFullYear() === REFERENCE_DATE.getFullYear()
        )
      case 'Mês anterior': {
        const prevMonth = REFERENCE_DATE.getMonth() === 0 ? 11 : REFERENCE_DATE.getMonth() - 1
        const prevYear =
          REFERENCE_DATE.getMonth() === 0 ? REFERENCE_DATE.getFullYear() - 1 : REFERENCE_DATE.getFullYear()
        return txDate.getMonth() === prevMonth && txDate.getFullYear() === prevYear
      }
      case 'Este ano':
        return txDate.getFullYear() === REFERENCE_DATE.getFullYear()
      default:
        return true
    }
  }

  // Filtered dataset
  const filteredTransactions = useMemo(() => {
    return TRANSACTIONS_DATA.filter((tx) => {
      // Search term
      const matchesSearch =
        searchTerm === '' ||
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.bank.toLowerCase().includes(searchTerm.toLowerCase())

      // Period filter
      const matchesPeriod = checkPeriodMatch(tx.date, selectedPeriod)

      // Bank filter
      const matchesBank =
        selectedBank === 'Todos os bancos' ||
        tx.bank.toLowerCase().includes(selectedBank.toLowerCase()) ||
        selectedBank.toLowerCase().includes(tx.bank.toLowerCase())

      // Type filter
      const matchesType =
        selectedType === 'Todos os tipos' || tx.type.toLowerCase() === selectedType.toLowerCase()

      // Category filter
      const matchesCategory =
        selectedCategory === 'Todas as categorias' ||
        tx.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesPeriod && matchesBank && matchesType && matchesCategory
    })
  }, [searchTerm, selectedPeriod, selectedBank, selectedType, selectedCategory])

  // Pagination calculations
  const totalItems = filteredTransactions.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1
  const validCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Generate page numbers array
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (validCurrentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages)
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', validCurrentPage, '...', totalPages)
      }
    }
    return pages
  }, [totalPages, validCurrentPage])

  const toggleDropdown = (key: 'period' | 'bank' | 'type' | 'category') => {
    setActiveDropdown((prev) => (prev === key ? null : key))
  }

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
          onClick={() => {
            alert('Exportando relatório consolidado de transações em CSV...')
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition self-start cursor-pointer active:scale-95"
          title="Exportar Relatório Financeiro"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* Filter Bar with Functional Dropdowns */}
      <div ref={filterBarRef} className="flex flex-wrap items-center gap-2.5 relative z-30">
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

        {/* Period Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('period')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 bg-white border rounded-xl text-xs transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer ${
              selectedPeriod !== 'Últimos 30 dias'
                ? 'border-orange-500/50 bg-orange-50/20 text-[#EE5D26] font-semibold'
                : 'border-slate-200/90 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${selectedPeriod !== 'Últimos 30 dias' ? 'text-[#EE5D26]' : 'text-slate-500'}`} />
            <span>{selectedPeriod}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 ml-1 transition-transform ${activeDropdown === 'period' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'period' && (
            <div className="absolute left-0 top-full mt-1.5 min-w-[170px] bg-white rounded-2xl border border-slate-200/90 shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              {PERIOD_OPTIONS.map((opt) => {
                const isSelected = opt === selectedPeriod
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedPeriod(opt)
                      setActiveDropdown(null)
                    }}
                    className={`w-full px-3.5 py-2 text-xs text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/70 text-[#EE5D26] font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#EE5D26]" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Bank Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('bank')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 bg-white border rounded-xl text-xs transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer ${
              selectedBank !== 'Todos os bancos'
                ? 'border-orange-500/50 bg-orange-50/20 text-[#EE5D26] font-semibold'
                : 'border-slate-200/90 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Landmark className={`w-3.5 h-3.5 ${selectedBank !== 'Todos os bancos' ? 'text-[#EE5D26]' : 'text-slate-500'}`} />
            <span>{selectedBank}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 ml-1 transition-transform ${activeDropdown === 'bank' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'bank' && (
            <div className="absolute left-0 top-full mt-1.5 min-w-[190px] bg-white rounded-2xl border border-slate-200/90 shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto">
              {BANK_OPTIONS.map((b) => {
                const isSelected = b === selectedBank
                return (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBank(b)
                      setActiveDropdown(null)
                    }}
                    className={`w-full px-3.5 py-2 text-xs text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/70 text-[#EE5D26] font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {b !== 'Todos os bancos' && <BankLogo bank={b} className="w-4 h-4 shrink-0" />}
                      <span className="truncate">{b}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#EE5D26] shrink-0 ml-2" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Type Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('type')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 bg-white border rounded-xl text-xs transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer ${
              selectedType !== 'Todos os tipos'
                ? 'border-orange-500/50 bg-orange-50/20 text-[#EE5D26] font-semibold'
                : 'border-slate-200/90 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowUpDown className={`w-3.5 h-3.5 ${selectedType !== 'Todos os tipos' ? 'text-[#EE5D26]' : 'text-slate-500'}`} />
            <span>{selectedType}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 ml-1 transition-transform ${activeDropdown === 'type' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'type' && (
            <div className="absolute left-0 top-full mt-1.5 min-w-[150px] bg-white rounded-2xl border border-slate-200/90 shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              {TYPE_OPTIONS.map((t) => {
                const isSelected = t === selectedType
                return (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedType(t)
                      setActiveDropdown(null)
                    }}
                    className={`w-full px-3.5 py-2 text-xs text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/70 text-[#EE5D26] font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{t}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#EE5D26]" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Category Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('category')}
            className={`flex items-center space-x-2 px-3.5 py-2.5 bg-white border rounded-xl text-xs transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer ${
              selectedCategory !== 'Todas as categorias'
                ? 'border-orange-500/50 bg-orange-50/20 text-[#EE5D26] font-semibold'
                : 'border-slate-200/90 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Tag className={`w-3.5 h-3.5 ${selectedCategory !== 'Todas as categorias' ? 'text-[#EE5D26]' : 'text-slate-500'}`} />
            <span>{selectedCategory}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 ml-1 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === 'category' && (
            <div className="absolute left-0 top-full mt-1.5 min-w-[190px] bg-white rounded-2xl border border-slate-200/90 shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = cat === selectedCategory
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat)
                      setActiveDropdown(null)
                    }}
                    className={`w-full px-3.5 py-2 text-xs text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/70 text-[#EE5D26] font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#EE5D26]" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {(searchTerm ||
          selectedPeriod !== 'Últimos 30 dias' ||
          selectedBank !== 'Todos os bancos' ||
          selectedType !== 'Todos os tipos' ||
          selectedCategory !== 'Todas as categorias') && (
          <button
            onClick={handleClearFilters}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-[#EE5D26] text-[#EE5D26] hover:bg-orange-50/60 text-xs font-semibold transition cursor-pointer active:scale-95 ml-auto animate-in fade-in"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar filtros</span>
          </button>
        )}
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
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => {
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
                          onClick={() => {
                            alert(`Transação: ${tx.description}\nValor: ${tx.amount}\nBanco: ${tx.bank}\nData: ${tx.date}`)
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                          title="Mais opções"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                        <Inbox className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-slate-700 text-sm">Nenhuma transação encontrada</p>
                      <p className="text-xs text-slate-400">Tente ajustar ou limpar os filtros selecionados.</p>
                      <button
                        onClick={handleClearFilters}
                        className="mt-2 text-xs font-semibold text-[#EE5D26] hover:underline"
                      >
                        Limpar todos os filtros
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            {totalItems > 0
              ? `Mostrando ${startIndex + 1}–${endIndex} de ${totalItems} transações`
              : 'Mostrando 0 de 0 transações'}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-1.5">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dynamic Page Buttons */}
              {pageNumbers.map((page, idx) => {
                if (typeof page === 'string') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 select-none">
                      ...
                    </span>
                  )
                }

                const isActive = page === validCurrentPage
                return (
                  <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs transition flex items-center justify-center cursor-pointer ${
                      isActive
                        ? 'bg-[#EE5D26] text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="Próxima página"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
