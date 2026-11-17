import React, { useState } from 'react'
import { TrendingUp, ChevronDown } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export const BalanceEvolutionChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6 meses')

  const data = [
    { month: 'Mai', balance: 4500 },
    { month: 'Jun', balance: 5800 },
    { month: 'Jul', balance: 7100 },
    { month: 'Ago', balance: 6700 },
    { month: 'Set', balance: 7800 },
    { month: 'Out', balance: 8750.32 },
  ]

  const formatYAxis = (tick: number) => {
    if (tick === 0) return 'R$ 0'
    return `R$ ${tick / 1000}k`
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-800">Evolução do Saldo</h3>
        </div>

        <button className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-600 bg-slate-50 border border-slate-200/90 rounded-lg hover:bg-slate-100 transition cursor-pointer">
          <span>{timeRange}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Recharts Area Chart */}
      <div className="relative w-full h-48 pt-2">
        {/* Floating current value badge on last point */}
        <div className="absolute top-2 right-4 z-10 px-2.5 py-1 rounded-md bg-white border border-slate-200/90 shadow-sm text-xs font-bold text-slate-800 pointer-events-none">
          R$ 8.750,32
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EA580C" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              dy={8}
            />

            <YAxis
              domain={[0, 12000]}
              ticks={[0, 3000, 6000, 9000, 12000]}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxis}
              tick={{ fill: '#64748B', fontSize: 11 }}
              dx={-4}
            />

            <Tooltip
              formatter={(value: any) => [
                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value)),
                'Saldo',
              ]}
              contentStyle={{
                backgroundColor: '#0F172A',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
                fontSize: '11px',
              }}
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#EA580C"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#balanceGradient)"
              activeDot={{ r: 5, fill: '#EA580C', stroke: '#fff', strokeWidth: 2 }}
              dot={{ r: 3.5, fill: '#EA580C', stroke: '#fff', strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
