import React from 'react'
import { Wallet, ArrowDown, ArrowUp, BarChart2 } from 'lucide-react'

interface MetricKPIsProps {
  totalBalance?: number
  monthlyIncome?: number
  monthlyExpenses?: number
  cashFlow?: number
}

export const MetricKPIs: React.FC<MetricKPIsProps> = ({
  totalBalance = 8750.32,
  monthlyIncome = 6230.0,
  monthlyExpenses = 4120.17,
  cashFlow = 2109.83,
}) => {
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val)
  }

  const kpis = [
    {
      title: 'Saldo Total',
      value: formatBRL(totalBalance),
      trend: '+12,5% vs. mês anterior',
      trendPositive: true,
      icon: Wallet,
      iconBg: 'bg-[#FFF5ED] text-[#EA580C]',
      lineColor: '#EA580C',
      sparklineD: 'M0,18 Q15,10 30,14 T60,4',
    },
    {
      title: 'Receitas do Mês',
      value: formatBRL(monthlyIncome),
      trend: '+8,2% vs. mês anterior',
      trendPositive: true,
      icon: ArrowDown,
      iconBg: 'bg-[#ECFDF5] text-[#10B981]',
      lineColor: '#10B981',
      sparklineD: 'M0,20 Q15,16 30,12 T60,2',
    },
    {
      title: 'Despesas do Mês',
      value: formatBRL(monthlyExpenses),
      trend: '+3,1% vs. mês anterior',
      trendPositive: false, // In the screenshot it's red +3,1%
      icon: ArrowUp,
      iconBg: 'bg-[#FFF1F2] text-[#F43F5E]',
      lineColor: '#F43F5E',
      sparklineD: 'M0,16 Q15,8 30,12 T60,5',
    },
    {
      title: 'Fluxo de Caixa',
      value: formatBRL(cashFlow),
      trend: '+20,7% vs. mês anterior',
      trendPositive: true,
      icon: BarChart2,
      iconBg: 'bg-[#EFF6FF] text-[#3B82F6]',
      lineColor: '#3B82F6',
      sparklineD: 'M0,19 Q15,15 30,8 T60,3',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon

        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            {/* Top row: Icon + Title + Sparkline */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${kpi.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-500">{kpi.title}</span>
              </div>

              {/* Mini Sparkline Curve */}
              <div className="w-16 h-7 shrink-0">
                <svg viewBox="0 0 60 24" className="w-full h-full overflow-visible">
                  <path
                    d={kpi.sparklineD}
                    fill="none"
                    stroke={kpi.lineColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom: Big Value + Trend */}
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {kpi.value}
              </div>
              <div
                className={`text-[11px] font-medium mt-1 flex items-center space-x-1 ${
                  kpi.trendPositive ? 'text-emerald-600' : 'text-rose-500'
                }`}
              >
                <span>↑</span>
                <span>{kpi.trend}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
