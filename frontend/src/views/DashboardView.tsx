import React from 'react'
import { MetricKPIs } from '../components/MetricKPIs'
import { CategoryExpensesChart } from '../components/CategoryExpensesChart'
import { BalanceEvolutionChart } from '../components/BalanceEvolutionChart'
import { RecentTransactionsTable } from '../components/RecentTransactionsTable'
import { AIAssistantWidget } from '../components/AIAssistantWidget'
import { ConnectBankCard } from '../components/ConnectBankCard'

interface DashboardViewProps {
  onNavigateToExtrato: () => void
  onOpenConnectModal: () => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToExtrato,
  onOpenConnectModal,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
          <span>Olá, Guilherme!</span>
          <span>👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Aqui está um resumo das suas finanças de forma simples e inteligente.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <MetricKPIs />

      {/* Main Grid: Center content (Charts & Table) + Right Column (AI & Connect Card) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Center / Main Column (spans 8 cols on xl screens) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Middle Row: Two Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CategoryExpensesChart />
            <BalanceEvolutionChart />
          </div>

          {/* Bottom Row: Recent Transactions Table */}
          <RecentTransactionsTable onViewAll={onNavigateToExtrato} />
        </div>

        {/* Right Sidebar Column (spans 4 cols on xl screens) */}
        <div className="xl:col-span-4 space-y-6">
          {/* AI Financial Assistant Widget */}
          <AIAssistantWidget />

          {/* Connect New Bank Card */}
          <ConnectBankCard onConnect={onOpenConnectModal} />
        </div>
      </div>
    </div>
  )
}
