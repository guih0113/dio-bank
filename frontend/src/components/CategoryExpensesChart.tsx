import React, { useState } from 'react'
import { PieChart as PieIcon, ChevronDown } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface CategoryItem {
  name: string
  value: number
  percentage: string
  color: string
}

export const CategoryExpensesChart: React.FC = () => {
  const [period, setPeriod] = useState('Este Mês')

  const data: CategoryItem[] = [
    { name: 'Alimentação', value: 1339.05, percentage: '32,5%', color: '#EA580C' },
    { name: 'Moradia', value: 1182.49, percentage: '28,7%', color: '#3B82F6' },
    { name: 'Transporte', value: 778.71, percentage: '18,9%', color: '#8B5CF6' },
    { name: 'Entretenimento', value: 498.54, percentage: '12,1%', color: '#10B981' },
    { name: 'Outros', value: 321.37, percentage: '7,8%', color: '#94A3B8' },
  ]

  const totalAmount = 'R$ 4.120,17'

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <PieIcon className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-800">Despesas por Categoria</h3>
        </div>

        {/* Period dropdown */}
        <div className="relative">
          <button className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-600 bg-slate-50 border border-slate-200/90 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <span>{period}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Content: Donut + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        {/* Donut Chart with center label */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: any, name: any) => [`R$ ${Number(value).toFixed(2)}`, name]}
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
