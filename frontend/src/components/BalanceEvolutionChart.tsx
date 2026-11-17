import React, { useState, useRef, useEffect } from 'react'
import { TrendingUp, ChevronDown, Check } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface RangeData {
  badge: string
  domain: [number, number]
  ticks: number[]
  data: Array<{ month: string; balance: number }>
}

const RANGES_DATA: Record<string, RangeData> = {
  '30 dias': {
    badge: 'R$ 8.750,32',
    domain: [0, 10000],
    ticks: [0, 2500, 5000, 7500, 10000],
    data: [
      { month: '01 Nov', balance: 6850 },
      { month: '08 Nov', balance: 7200 },
      { month: '15 Nov', balance: 7650 },
      { month: '22 Nov', balance: 8100 },
      { month: 'Hoje', balance: 8750.32 },
    ],
  },
  '6 meses': {
    badge: 'R$ 8.750,32',
    domain: [0, 12000],
    ticks: [0, 3000, 6000, 9000, 12000],
    data: [
      { month: 'Mai', balance: 4500 },
      { month: 'Jun', balance: 5800 },
      { month: 'Jul', balance: 7100 },
      { month: 'Ago', balance: 6700 },
      { month: 'Set', balance: 7800 },
      { month: 'Out', balance: 8750.32 },
    ],
  },
  '1 ano': {
    badge: 'R$ 8.750,32',
    domain: [0, 12000],
    ticks: [0, 3000, 6000, 9000, 12000],
    data: [
      { month: 'Nov/25', balance: 3400 },
      { month: 'Jan', balance: 4200 },
      { month: 'Mar', balance: 5100 },
      { month: 'Mai', balance: 4500 },
      { month: 'Jul', balance: 7100 },
      { month: 'Set', balance: 7800 },
      { month: 'Out', balance: 8750.32 },
    ],
  },
}

export const BalanceEvolutionChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<keyof typeof RANGES_DATA>('6 meses')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentRange = RANGES_DATA[timeRange] || RANGES_DATA['6 meses']

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatYAxis = (tick: number) => {
    if (tick === 0) return 'R$ 0'
    return `R$ ${tick / 1000}k`
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-800">Evolução do Saldo</h3>
        </div>

        {/* Dropdown menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-600 bg-slate-50 border border-slate-200/90 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
          >
            <span>{timeRange}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl border border-slate-200/90 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              {Object.keys(RANGES_DATA).map((r) => {
                const isSelected = r === timeRange
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setTimeRange(r as keyof typeof RANGES_DATA)
                      setIsOpen(false)
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/70 text-[#EE5D26] font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{r}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#EE5D26]" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="relative w-full h-48 pt-2">
        {/* Floating current value badge on last point */}
        <div className="absolute top-2 right-4 z-10 px-2.5 py-1 rounded-md bg-white border border-slate-200/90 shadow-sm text-xs font-bold text-slate-800 pointer-events-none">
          {currentRange.badge}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentRange.data} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
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
              domain={currentRange.domain}
              ticks={currentRange.ticks}
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
              dot={{ r: 3, fill: '#EA580C', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#EA580C' }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
