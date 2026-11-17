import React from 'react'
import { Link2, Settings, ArrowLeft } from 'lucide-react'

interface ViewProps {
  onBackToDashboard: () => void
}

export const ConexoesView: React.FC<ViewProps & { onOpenConnectModal: () => void }> = ({
  onBackToDashboard,
  onOpenConnectModal,
}) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
            <Link2 className="w-6 h-6 text-[#EE5D26]" />
            <span>Conexões Bancárias</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerencie as instituições financeiras integradas via Open Finance Brasil.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 text-[#EE5D26] flex items-center justify-center">
          <Link2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Conecte novos bancos e contas</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Integre contas correntes, cartões de crédito e investimentos com segurança pelo protocolo Pluggy.
        </p>
        <button
          onClick={onOpenConnectModal}
          className="px-5 py-2.5 rounded-xl bg-[#EE5D26] hover:bg-orange-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 transition cursor-pointer"
        >
          Conectar Novo Banco
        </button>
      </div>
    </div>
  )
}

export const ConfiguracoesView: React.FC<ViewProps> = ({ onBackToDashboard }) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
            <Settings className="w-6 h-6 text-slate-700" />
            <span>Configurações</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Preferências da conta, segurança e parâmetros da aplicação.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Perfil do Usuário</h3>
          <p className="text-xs text-slate-500 mt-0.5">Guilherme Henrique (gui.henriquess13@gmail.com)</p>
        </div>
        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-sm font-bold text-slate-900">Protocolo Open Finance</h3>
          <p className="text-xs text-slate-500 mt-0.5">Pluggy.ai API & Model Context Protocol (MCP v2.3)</p>
        </div>
      </div>
    </div>
  )
}
