import React from 'react'
import { Link2, ArrowRight } from 'lucide-react'

interface ConnectBankCardProps {
  onConnect: () => void
}

export const ConnectBankCard: React.FC<ConnectBankCardProps> = ({ onConnect }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF6EF] via-[#FFFAF6] to-white rounded-2xl p-5 border border-[#FFE7D6] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="w-8 h-8 rounded-lg bg-[#FFEFE5] text-[#EE5D26] flex items-center justify-center mb-3">
          <Link2 className="w-4 h-4" />
        </div>

        <h3 className="text-base font-bold text-slate-900 tracking-tight">Conecte seus bancos</h3>
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed pr-12">
          Integre suas contas com o Pluggy e tenha uma visão ainda mais completa das suas finanças.
        </p>
      </div>

      {/* Action Button & Bank Illustration */}
      <div className="mt-5 flex items-end justify-between">
        <button
          onClick={onConnect}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EE5D26] to-[#F97316] hover:from-orange-600 hover:to-orange-500 text-white font-semibold text-xs shadow-md shadow-orange-600/20 transition-all hover:shadow-lg active:scale-95 cursor-pointer z-10"
        >
          <span>Conectar Novo Banco</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Bank Building + Green Checkmark Badge Illustration */}
        <div className="relative -mb-1 -mr-1 w-20 h-16 shrink-0 pointer-events-none select-none opacity-90">
          <svg viewBox="0 0 100 80" className="w-full h-full text-slate-400">
            {/* Triangular Pediment / Roof */}
            <path
              d="M10 30 L50 6 L90 30 Z"
              fill="#E2E8F0"
              stroke="#64748B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Architrave */}
            <rect x="12" y="30" width="76" height="5" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
            {/* Columns */}
            <rect x="20" y="35" width="8" height="32" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" rx="1" />
            <rect x="36" y="35" width="8" height="32" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" rx="1" />
            <rect x="56" y="35" width="8" height="32" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" rx="1" />
            <rect x="72" y="35" width="8" height="32" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" rx="1" />
            {/* Base */}
            <rect x="8" y="67" width="84" height="6" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" rx="1" />
          </svg>

          {/* Green Checkmark Circle Badge */}
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-2 ring-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
