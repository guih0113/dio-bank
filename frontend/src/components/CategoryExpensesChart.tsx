import React, { useState, useRef, useEffect } from 'react'
import { PieChart as PieIcon, ChevronDown, Check } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface CategoryItem {
  name: string
  value: number
  percentage: string
  color: string
}

const PERIOD_DATA: Record<string, { total: string; items: CategoryItem[] }> = {
  'Este Mês': {
    total: 'R$ 4.120,17',
    items: [
      { name: 'Alimentação', value: 1339.05, percentage: '32,5%', color: '#EA580C' },
      { name: 'Moradia', value: 1182.49, percentage: '28,7%', color: '#3B82F6' },
      { name: 'Transporte', value: 778.71, percentage: '18,9%', color: '#8B5CF6' },
      { name: 'Entretenimento', value: 498.54, percentage: '12,1%', color: '#10B981' },
      { name: 'Outros', value: 321.37, percentage: '7,8%', color: '#94A3B8' },
    ],
  },
  'Mês Anterior': {
    total: 'R$ 3.840,50',
    items: [
      { name: 'Alimentação', value: 1220.0, percentage: '31,8%', color: '#EA580C' },
      { name: 'Moradia', value: 1182.49, percentage: '30,8%', color: '#3B82F6' },
      { name: 'Transporte', value: 650.0, percentage: '16,9%', color: '#8B5CF6' },
      { name: 'Entretenimento', value: 480.0, percentage: '12,5%', color: '#10B981' },
      { name: 'Outros', value: 308.01, percentage: '8,0%', color: '#94A3B8' },
    ],
  },
  'Últimos 3 meses': {
    total: 'R$ 12.450,80',
    items: [
      { name: 'Alimentação', value: 4010.0, percentage: '32,2%', color: '#EA580C' },
      { name: 'Moradia', value: 3547.47, percentage: '28,5%', color: '#3B82F6' },
      { name: 'Transporte', value: 2350.0, percentage: '18,9%', color: '#8B5CF6' },
      { name: 'Entretenimento', value: 1560.0, percentage: '12,5%', color: '#10B981' },
      { name: 'Outros', value: 983.33, percentage: '7,9%', color: '#94A3B8' },
    ],
  },
  'Este Ano': {
    total: 'R$ 43.120,00',
    items: [
      { name: 'Moradia', value: 13007.0, percentage: '30,2%', color: '#3B82F6' },
      { name: 'Alimentação', value: 12950.0, percentage: '30,0%', color: '#EA580C' },
      { name: 'Transporte', value: 8250.0, percentage: '19,1%', color: '#8B5CF6' },
      { name: 'Entretenimento', value: 5540.0, percentage: '12,8%', color: '#10B981' },
      { name: 'Outros', value: 3373.0, percentage: '7,8%', color: '#94A3B8' },
    ],
  },
}

export const CategoryExpensesChart: React.FC = () => {
  const [period, setPeriod] = useState<keyof typeof PERIOD_DATA>('Este Mês')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentPeriodData = PERIOD_DATA[period] || PERIOD_DATA['Este Mês']
  const data = currentPeriodData.items
  const totalAmount = currentPeriodData.total

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <PieIcon className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-800">Despesas por Categoria</h3>
        </div>

        {/* Period dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-600 bg-slate-50 border border-slate-200/90 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
          >
            <span>{period}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl border border-slate-200/90 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              {Object.keys(PERIOD_DATA).map((p) => {
                const isSelected = p === period
                return (
                  <button
                    key={p}
                    onClick={() => {
                      setPeriod(p as keyof typeof PERIOD_DATA)
                      setIsOpen(false)
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/70 text-[#EE5D26] font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{p}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#EE5D26]" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content: Donut + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        {/* Donut Chart with center label */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: any, name: any) => [
                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value)),
                  name,
                ]}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  color: '#fff',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '11px',
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={2}
                stroke="#ffffff"
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-slate-900 tracking-tight">{totalAmount}</span>
            <span className="text-[10px] text-slate-400 font-medium">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {data.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-700 font-medium">{cat.name}</span>
              </div>
              <span className="text-slate-900 font-semibold">{cat.percentage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
