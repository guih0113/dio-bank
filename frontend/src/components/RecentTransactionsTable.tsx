import React from 'react'
import { Clock } from 'lucide-react'
import { BankLogo } from './BankLogos'
import { CategoryBadge } from './CategoryBadge'

interface TransactionItem {
  id: string
  date: string
  description: string
  category: string
  bank: string
  amount: number
}

interface RecentTransactionsTableProps {
  onViewAll?: () => void
  customTransactions?: TransactionItem[]
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({
  onViewAll,
  customTransactions,
}) => {
  const defaultTransactions: TransactionItem[] = [
    {
      id: 'tx-1',
      date: '19/11/2026',
      description: 'Uber',
      category: 'Transporte',
      bank: 'Nubank',
      amount: -42.9,
    },
    {
      id: 'tx-2',
      date: '18/11/2026',
      description: 'Salário',
      category: 'Receita',
      bank: 'Santander',
      amount: 5230.0,
    },
    {
      id: 'tx-3',
      date: '17/11/2026',
      description: 'Supermercado Extra',
      category: 'Alimentação',
      bank: 'Itaú',
      amount: -287.45,
    },
    {
      id: 'tx-4',
      date: '16/11/2026',
      description: 'Conta de Luz',
      category: 'Moradia',
      bank: 'Bradesco',
      amount: -129.9,
    },
    {
      id: 'tx-5',
      date: '15/11/2026',
      description: 'Netflix',
      category: 'Entretenimento',
      bank: 'Nubank',
      amount: -39.9,
    },
  ]

  const transactions = customTransactions || defaultTransactions

  const formatAmount = (val: number) => {
    const isIncome = val > 0
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(val))

    return `${isIncome ? '+ ' : '- '}${formatted}`
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-800">Transações Recentes</h3>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition flex items-center space-x-1 cursor-pointer"
          >
            <span>Ver todas</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
              <th className="pb-3 font-medium">Data</th>
              <th className="pb-3 font-medium">Descrição</th>
              <th className="pb-3 font-medium">Categoria</th>
              <th className="pb-3 font-medium">Banco</th>
              <th className="pb-3 font-medium text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 text-xs">
            {transactions.map((tx) => {
              const isIncome = tx.amount > 0

              return (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 text-slate-500 whitespace-nowrap">{tx.date}</td>
                  <td className="py-3 font-semibold text-slate-800 whitespace-nowrap">
                    {tx.description}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <CategoryBadge category={tx.category} />
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <BankLogo bank={tx.bank} className="w-4 h-4" />
                      <span className="text-slate-700 font-medium">{tx.bank}</span>
                    </div>
                  </td>
                  <td
                    className={`py-3 text-right font-bold whitespace-nowrap ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {formatAmount(tx.amount)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
