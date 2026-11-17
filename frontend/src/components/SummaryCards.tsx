import React from 'react'
import {
  Wallet,
  CreditCard,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { FinancialSummary } from '../types/openFinance'

interface SummaryCardsProps {
  summary: FinancialSummary | null
  isLoading: boolean
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, isLoading }) => {
  const formatBRL = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Top metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Patrimônio Consolidado */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-950/40 via-slate-900 to-slate-900/90 border border-purple-500/30 p-5 shadow-xl shadow-purple-950/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
              Patrimônio Líquido
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {formatBRL(summary.net_worth)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center space-x-1">
            <span className="text-purple-400 font-medium">Consolidado Open Finance</span>
            <span>({summary.banks_connected} bancos)</span>
          </div>
        </div>

        {/* Card 2: Saldo em Conta */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Saldo em Conta Corrente
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {formatBRL(summary.total_balance)}
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center space-x-1">
            <span>Disponível para movimentação</span>
          </div>
        </div>

        {/* Card 3: Investimentos */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Investimentos Totais
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {formatBRL(summary.total_investments)}
          </div>
          <div className="mt-2 text-xs text-cyan-400 flex items-center space-x-1">
            <span>Renda Fixa, Ações e Fundos</span>
          </div>
        </div>

        {/* Card 4: Fatura de Cartões */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Fatura Cartões (Aberto)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-400 tracking-tight">
            {formatBRL(summary.total_credit_debt)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center space-x-1">
            <span>Total utilizado em faturas</span>
          </div>
        </div>
      </div>

      {/* Cashflow bar */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="text-sm font-semibold text-slate-200">Fluxo Mensal Consolidado</div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Entradas vs Saídas registradas via Open Finance
          </span>
        </div>
        <div className="flex items-center space-x-6 w-full md:w-auto justify-end text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Receitas</span>
              <span className="font-bold text-emerald-400">{formatBRL(summary.monthly_income)}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Despesas</span>
              <span className="font-bold text-rose-400">{formatBRL(summary.monthly_expenses)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
