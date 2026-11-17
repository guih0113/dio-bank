import React, { useState } from 'react'
import {
  Link2,
  Plus,
  ArrowRight,
  RotateCw,
  Clock,
  MoreVertical,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Check,
  AlertTriangle,
  Loader2,
  Plug,
} from 'lucide-react'
import { BankLogo } from '../components/BankLogos'

interface BankConnection {
  id: string
  name: string
  status: 'Ativo' | 'Atualizando' | 'Erro'
  lastSync: string
}

interface ConexoesViewProps {
  onOpenConnectModal: () => void
  onBackToDashboard?: () => void
}

export const ConexoesView: React.FC<ConexoesViewProps> = ({
  onOpenConnectModal,
}) => {
  const [connections, setConnections] = useState<BankConnection[]>([
    {
      id: 'conn-itau',
      name: 'Itaú',
      status: 'Ativo',
      lastSync: 'hoje, 14:32',
    },
    {
      id: 'conn-nubank',
      name: 'Nubank',
      status: 'Ativo',
      lastSync: 'hoje, 14:28',
    },
    {
      id: 'conn-santander',
      name: 'Santander',
      status: 'Ativo',
      lastSync: 'hoje, 14:20',
    },
    {
      id: 'conn-bb',
      name: 'Banco do Brasil',
      status: 'Atualizando',
      lastSync: 'em andamento...',
    },
    {
      id: 'conn-caixa',
      name: 'Caixa',
      status: 'Erro',
      lastSync: '18/11/2026 às 10:17',
    },
  ])

  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [isRefreshingAll, setIsRefreshingAll] = useState(false)

  const handleSync = (id: string) => {
    setSyncingId(id)
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((conn) =>
          conn.id === id
            ? { ...conn, status: 'Ativo', lastSync: 'hoje, agora' }
            : conn
        )
      )
      setSyncingId(null)
    }, 1500)
  }

  const handleRefreshAll = () => {
    setIsRefreshingAll(true)
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((c) => ({
          ...c,
          status: c.status === 'Erro' ? 'Erro' : 'Ativo',
          lastSync: 'hoje, agora',
        }))
      )
      setIsRefreshingAll(false)
    }, 1800)
  }

  const handleDisconnect = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja desconectar o ${name}?`)) {
      setConnections((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5">
            <Link2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Conexões</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Conexões
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerencie suas contas e mantenha seus dados sempre atualizados.
          </p>
        </div>

        {/* CTA Button: + Conectar Novo Banco -> */}
        <button
          onClick={onOpenConnectModal}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#EE5D26] hover:bg-orange-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 transition active:scale-95 cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Conectar Novo Banco</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Pluggy Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#FFF5EE] via-[#FFF9F5] to-white rounded-2xl p-5 border border-[#FFE7D6] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-[#FFEFE5] text-[#EE5D26] flex items-center justify-center shrink-0 shadow-sm">
            <Plug className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Conecte seus bancos com a Pluggy
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Integre suas contas de forma segura e tenha todas as suas informações financeiras em um só lugar.
            </p>
          </div>
        </div>

        {/* Pluggy Brand Logo */}
        <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto pr-2">
          {/* Infinity / Loops Emblem */}
          <div className="w-6 h-6 rounded-full bg-[#EE5D26] flex items-center justify-center p-1 text-white shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
              <path d="M7 17a5 5 0 0 1 0-10c3 0 4 3 5 5 1 2 2 5 5 5a5 5 0 0 0 0-10c-3 0-4 3-5 5-1-2-2-5-5-5" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">pluggy</span>
        </div>
      </div>

      {/* Section: Seus bancos conectados */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900">Seus bancos conectados</h2>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Última atualização: 19/11/2026 às 14:32</span>
            </div>

            <button
              onClick={handleRefreshAll}
              disabled={isRefreshingAll}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 font-semibold text-xs shadow-xs hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshingAll ? 'animate-spin text-[#EE5D26]' : ''}`} />
              <span>Atualizar tudo</span>
            </button>
          </div>
        </div>

        {/* Bank Connection Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((conn) => {
            const isUpdating = conn.status === 'Atualizando' || syncingId === conn.id
            const isError = conn.status === 'Erro'
            const isActive = conn.status === 'Ativo' && !isUpdating

            return (
              <div
                key={conn.id}
                className={`bg-white rounded-2xl p-5 border shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-200 ${
                  isError
                    ? 'border-rose-300 ring-1 ring-rose-300/40'
                    : isUpdating
                    ? 'border-amber-200'
                    : 'border-slate-200/80 hover:shadow-md'
                }`}
              >
                {/* Top: Logo + Name + Status + Menu */}
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <BankLogo bank={conn.name} className="w-10 h-10" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900">{conn.name}</span>

                          {/* Status Badge */}
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#10B981]">
                              Ativo
                            </span>
                          )}
                          {isUpdating && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF7ED] text-[#EA580C] flex items-center space-x-1">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              <span>Atualizando</span>
                            </span>
                          )}
                          {isError && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF1F2] text-[#F43F5E] flex items-center space-x-1">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              <span>! Erro</span>
                            </span>
                          )}
                        </div>

                        {/* Last sync text */}
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            {isUpdating
                              ? 'Última sincronização: em andamento...'
                              : `Última sincronização: ${conn.lastSync}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"
                      title="Opções"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Row: 2 Action Buttons */}
                <div className="flex items-center space-x-2 mt-5 pt-3 border-t border-slate-100">
                  {/* Sync / Retry button */}
                  {isError ? (
                    <button
                      onClick={() => handleSync(conn.id)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Tentar novamente</span>
                    </button>
                  ) : isUpdating ? (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-400 cursor-not-allowed"
                    >
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EE5D26]" />
                      <span>Sincronizando...</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSync(conn.id)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sincronizar agora</span>
                    </button>
                  )}

                  {/* Disconnect button */}
                  <button
                    onClick={() => handleDisconnect(conn.id, conn.name)}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200/90 hover:bg-rose-50/50 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
                  >
                    <LogOut className="w-3.5 h-3.5 text-slate-500" />
                    <span>Desconectar</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Step-by-Step Card: "Como funciona?" */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Info */}
        <div className="flex items-start space-x-3.5 max-w-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <span className="text-base">💡</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Como funciona?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Conecte seus bancos em poucos cliques e tenha suas informações centralizadas.
            </p>
          </div>
        </div>

        {/* Right: 3 Steps */}
        <div className="flex-1 w-full flex items-center justify-between sm:justify-around gap-2 max-w-2xl">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="relative">
              <span className="absolute -top-1.5 -right-1 text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">1</span>
              <div className="w-10 h-10 rounded-full border border-blue-200 bg-blue-50/40 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700 max-w-[100px] leading-tight">
              Conecte seu banco
            </span>
          </div>

          {/* Arrow */}
          <span className="text-slate-300 font-bold text-sm">→</span>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="relative">
              <span className="absolute -top-1.5 -right-1 text-[9px] font-bold text-blue-600 bg-blue-50 px-1 rounded">2</span>
              <div className="w-10 h-10 rounded-full border border-blue-200 bg-blue-50/40 text-blue-600 flex items-center justify-center">
                <RotateCw className="w-4 h-4" />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700 max-w-[120px] leading-tight">
              Aguarde a sincronização
            </span>
          </div>

          {/* Arrow */}
          <span className="text-slate-300 font-bold text-sm">→</span>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="relative">
              <span className="absolute -top-1.5 -right-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">3</span>
              <div className="w-10 h-10 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700 max-w-[140px] leading-tight">
              Pronto! Seus dados já estão disponíveis
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
