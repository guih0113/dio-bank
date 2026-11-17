import React from 'react'
import { FileText, ArrowRight } from 'lucide-react'
import { RecentTransactionsTable } from '../components/RecentTransactionsTable'

interface ExtratoViewProps {
  onBackToDashboard: () => void
}

export const ExtratoView: React.FC<ExtratoViewProps> = ({ onBackToDashboard }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-[#EE5D26]" />
            <span>Extrato Financeiro</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Histórico completo de transações e movimentações Open Finance.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition flex items-center space-x-1.5 self-start cursor-pointer"
        >
          <span>Voltar ao Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <RecentTransactionsTable />
    </div>
  )
}
