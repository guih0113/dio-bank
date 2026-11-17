import React, { useState } from 'react'
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
} from 'lucide-react'
import { Transaction } from '../types/openFinance'

interface TransactionsFeedProps {
  transactions: Transaction[]
  isLoading: boolean
}

export const TransactionsFeed: React.FC<TransactionsFeedProps> = ({
  transactions,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const formatBRL = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Categories list
  const categories = Array.from(new Set(transactions.map((t) => t.category)))

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      searchTerm === '' ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.bankName && tx.bankName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory =
      selectedCategory === null || tx.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Extrato Aberto & Transações</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {filteredTransactions.length} registros
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Transações sincronizadas de todas as suas contas conectadas
          </p>
        </div>

        {/* Search input */}
        <div className="relative min-w-65">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por descrição, estabelecimento..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-4 text-xs">
        <div className="flex items-center space-x-1 text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtro:</span>
        </div>
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
            selectedCategory === null
              ? 'bg-purple-600 text-white font-semibold'
              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white font-semibold'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transactions list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-950/60 animate-pulse" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Nenhuma transação encontrada com os filtros selecionados.
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {filteredTransactions.map((tx) => {
            const isCredit = tx.type === 'CREDIT' || tx.amount > 0

            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition"
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCredit
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {isCredit ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-100">
                      {tx.description}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[10px] font-medium">
                        {tx.category}
                      </span>
                      {tx.bankName && (
                        <>
                          <span>•</span>
                          <span
                            className="font-medium text-[11px]"
                            style={{ color: tx.bankColor || '#94a3b8' }}
                          >
                            {tx.bankName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-sm font-bold tracking-tight text-right ${
                    isCredit ? 'text-emerald-400' : 'text-slate-100'
                  }`}
                >
                  {isCredit ? '+' : '-'} {formatBRL(Math.abs(tx.amount))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
