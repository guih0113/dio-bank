import React from 'react'
import { Building2, Sparkles, PlusCircle, ShieldCheck, RefreshCw } from 'lucide-react'
import { SystemMode } from '../types/openFinance'

interface NavbarProps {
  systemMode: SystemMode | null
  onOpenConnect: () => void
  onToggleAi: () => void
  onRefresh: () => void
  isRefreshing: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  systemMode,
  onOpenConnect,
  onToggleAi,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                DIO Bank
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Open Finance MCP
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Agregação bancária inteligente com Pluggy & MCP
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mode Pill */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">
              Modo:{' '}
              <strong className={systemMode?.isMock ? 'text-amber-400' : 'text-emerald-400'}>
                {systemMode?.isMock ? 'Mock Finance (Sandbox)' : 'Pluggy Live'}
              </strong>
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition disabled:opacity-50"
            title="Atualizar dados bancários"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          </button>

          {/* Connect Button */}
          <button
            onClick={onOpenConnect}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/25 transition active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Conectar Banco</span>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={onToggleAi}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-purple-500/40 hover:border-purple-500 text-purple-300 hover:text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="hidden sm:inline">Assistente IA</span>
          </button>
        </div>
      </div>
    </header>
  )
}
