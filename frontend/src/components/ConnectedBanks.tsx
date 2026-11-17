import React from 'react'
import { CheckCircle2, Trash2, Plus, Building2 } from 'lucide-react'
import { Item } from '../types/openFinance'

interface ConnectedBanksProps {
  items: Item[]
  onOpenConnect: () => void
  onDisconnect: (itemId: string, bankName: string) => void
  isDeletingId: string | null
}

export const ConnectedBanks: React.FC<ConnectedBanksProps> = ({
  items,
  onOpenConnect,
  onDisconnect,
  isDeletingId,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Bancos Conectados</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {items.length} ativos
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Instituições autorizadas via Open Finance Brasil
          </p>
        </div>

        <button
          onClick={onOpenConnect}
          className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Conectar Novo Banco</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 p-4 transition flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-slate-700/60 p-1.5"
                style={{ backgroundColor: `${item.connectorColor}20` }}
              >
                {item.connectorLogo ? (
                  <img
                    src={item.connectorLogo}
                    alt={item.connectorName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback if SVG fails to load
                      (e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <Building2 className="w-5 h-5" style={{ color: item.connectorColor }} />
                )}
              </div>

              <div>
                <div className="font-semibold text-sm text-white flex items-center space-x-1.5">
                  <span>{item.connectorName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Sincronizado via Open Finance</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onDisconnect(item.id, item.connectorName)}
              disabled={isDeletingId === item.id}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition"
              title="Desconectar banco"
            >
              <Trash2 className={`w-4 h-4 ${isDeletingId === item.id ? 'animate-spin' : ''}`} />
            </button>
          </div>
        ))}

        {/* Add Connection Card */}
        <button
          onClick={onOpenConnect}
          className="rounded-xl border border-dashed border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/10 p-4 transition flex items-center justify-center space-x-2 text-slate-400 hover:text-purple-300 text-xs font-semibold group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800/80 group-hover:bg-purple-500/20 text-slate-400 group-hover:text-purple-400 flex items-center justify-center transition">
            <Plus className="w-4 h-4" />
          </div>
          <span>Adicionar Instituição</span>
        </button>
      </div>
    </div>
  )
}
