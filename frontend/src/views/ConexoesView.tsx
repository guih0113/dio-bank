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
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col md:flex-row items-stretch">
        {/* Left Side: Light Gray Background */}
        <div className="bg-[#F8F9FA] md:w-[38%] p-6 sm:p-7 border-b md:border-b-0 md:border-r border-slate-200/80 flex items-start space-x-3.5">
          {/* Incandescent Lightbulb Illustration */}
          <div className="shrink-0 mt-0.5">
            <svg className="w-7 h-7 select-none" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2V5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 6L8.2 8.2" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <path d="M26 6L23.8 8.2" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 16H5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <path d="M30 16H27" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M10 15C10 11.6863 12.6863 9 16 9C19.3137 9 22 11.6863 22 15C22 17.5 20.5 19.5 18.5 20.8V22.5C18.5 22.7761 18.2761 23 18 23H14C13.7239 23 13.5 22.7761 13.5 22.5V20.8C11.5 19.5 10 17.5 10 15Z"
                fill="#FBBF24"
                stroke="#D97706"
                strokeWidth="1.5"
              />
              <path
                d="M13 12.5C13.8 11.5 14.8 11 16 11"
                stroke="#FEF3C7"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path d="M13.5 23.5H18.5V25.5H13.5V23.5Z" fill="#64748B" stroke="#475569" strokeWidth="0.8" />
              <path d="M14 26H18V27.5C18 28.3284 17.3284 29 16.5 29H15.5C14.6716 29 14 28.3284 14 27.5V26Z" fill="#334155" />
            </svg>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Como funciona?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
              Conecte seus bancos em poucos cliques e tenha suas informações centralizadas.
            </p>
          </div>
        </div>

        {/* Right Side: Pure White Background with 3 Steps */}
        <div className="bg-white flex-1 p-6 sm:p-7 flex items-center justify-between sm:justify-around gap-2">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {/* Number Badge */}
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px] flex items-center justify-center border border-blue-100 shadow-2xs select-none z-10">
                1
              </span>
              {/* Outer Circle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-200/80 bg-white flex items-center justify-center shadow-xs">
                {/* Two-Tone Blue Shield */}
                <svg className="w-5 h-6 select-none" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 2L2.5 5.5V11.5C2.5 16.8 5.7 20.8 10 22V2Z"
                    fill="#3B82F6"
                    stroke="#0F172A"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 2L17.5 5.5V11.5C17.5 16.8 14.3 20.8 10 22V2Z"
                    fill="#1D4ED8"
                    stroke="#0F172A"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700 mt-2.5 whitespace-nowrap">
              Conecte seu banco
            </span>
          </div>

          {/* Thin Right Arrow */}
          <ArrowRight className="w-4 h-4 text-slate-300 stroke-[1.5] shrink-0 mx-1 sm:mx-2" />

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {/* Number Badge */}
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px] flex items-center justify-center border border-blue-100 shadow-2xs select-none z-10">
                2
              </span>
              {/* Outer Circle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-200/80 bg-white flex items-center justify-center shadow-xs">
                <RotateCw className="w-5 h-5 text-slate-800 stroke-[2.2]" />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700 mt-2.5 whitespace-nowrap">
              Aguarde a sincronização
            </span>
          </div>

          {/* Thin Right Arrow */}
          <ArrowRight className="w-4 h-4 text-slate-300 stroke-[1.5] shrink-0 mx-1 sm:mx-2" />

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {/* Number Badge */}
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px] flex items-center justify-center border border-blue-100 shadow-2xs select-none z-10">
                3
              </span>
              {/* Outer Mint/Green Circle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E8F8EE] flex items-center justify-center">
                {/* Green Solid Circle with White Checkmark */}
                <div className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-700 mt-2.5 leading-tight text-center">
              Pronto! Seus dados<br />já estão disponíveis
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
