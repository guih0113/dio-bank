import React, { useState, useEffect } from 'react'
import {
  X,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { Connector, SystemMode } from '../types/openFinance'
import { api } from '../services/api'
import { BankLogo } from './BankLogos'

declare global {
  interface Window {
    PluggyConnect?: any
  }
}

interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
  connectors: Connector[]
  systemMode: SystemMode | null
  onSuccessConnect: () => void
}

// Fallback list of major Brazilian Open Finance banks with official logos
const DEFAULT_BANKS = [
  { id: 201, name: 'Nubank', primaryColor: '#820AD1' },
  { id: 2, name: 'Itaú Unibanco', primaryColor: '#EC7000' },
  { id: 1, name: 'Banco Bradesco', primaryColor: '#CC092F' },
  { id: 5, name: 'Santander', primaryColor: '#EC0000' },
  { id: 3, name: 'Banco do Brasil', primaryColor: '#FFF100' },
  { id: 10, name: 'Caixa Econômica', primaryColor: '#0066B3' },
  { id: 200, name: 'Banco Inter', primaryColor: '#FF7A00' },
]

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  connectors,
  systemMode,
  onSuccessConnect,
}) => {
  const [selectedConnector, setSelectedConnector] = useState<{ id: number; name: string; primaryColor?: string } | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const isMock = systemMode?.isMock !== false

  // In Live mode: auto-launch the Pluggy Connect Widget when modal opens
  useEffect(() => {
    if (!isOpen || isMock) return
    launchPluggyWidget()
  }, [isOpen, isMock])

  if (!isOpen) return null

  // ─── LIVE MODE ─────────────────────────────────────────────────────────────
  const launchPluggyWidget = async () => {
    setErrorMsg(null)
    setIsConnecting(true)
    try {
      const tokenRes = await api.createConnectToken()
      if (!window.PluggyConnect) {
        setErrorMsg(
          'O script do Pluggy Connect ainda não foi carregado. Verifique sua conexão com a internet e recarregue a página.'
        )
        setIsConnecting(false)
        return
      }

      const pluggyConnect = new window.PluggyConnect({
        connectToken: tokenRes.accessToken,
        includeSandbox: true,
        onSuccess: (_itemData: any) => {
          setSuccessMsg('Banco conectado com sucesso via Open Finance!')
          setTimeout(() => {
            setIsConnecting(false)
            onSuccessConnect()
            onClose()
            setSuccessMsg(null)
          }, 1200)
        },
        onError: (error: any) => {
          setErrorMsg('Erro na conexão com a Pluggy: ' + (error?.message || JSON.stringify(error)))
          setIsConnecting(false)
        },
        onClose: () => {
          setIsConnecting(false)
          onClose()
        },
      })
      pluggyConnect.init()
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao gerar token de conexão da Pluggy.')
      setIsConnecting(false)
    }
  }

  // ─── MOCK MODE ─────────────────────────────────────────────────────────────
  const handleSelectBank = (connector: { id: number; name: string; primaryColor?: string }) => {
    setErrorMsg(null)
    setSelectedConnector(connector)
  }

  const handleAuthorizeMock = async () => {
    if (!selectedConnector) return
    setIsConnecting(true)
    setErrorMsg(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await api.connectMock(selectedConnector.id)
      setSuccessMsg(`Conexão com ${selectedConnector.name} estabelecida com sucesso!`)
      setTimeout(() => {
        setIsConnecting(false)
        onSuccessConnect()
        onClose()
        setSelectedConnector(null)
        setSuccessMsg(null)
      }, 1000)
    } catch (err: any) {
      setIsConnecting(false)
      setErrorMsg(err.message || 'Falha ao conectar instituição')
    }
  }

  // Banks list to display
  const displayBanks = connectors.length > 0 ? connectors : DEFAULT_BANKS

  // ─── LIVE MODE: Shell ───────────────────────────────────────────────────────
  if (!isMock) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
        <div className="relative w-full max-w-sm rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {errorMsg ? (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-rose-500 border border-rose-200/80 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm text-rose-600 font-medium">{errorMsg}</p>
              <div className="text-xs text-slate-600 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-1">
                <p className="font-semibold text-slate-800 mb-1">Checklist de depuração:</p>
                <p>• Backend rodando em <code className="text-orange-600 font-mono">localhost:8000</code></p>
                <p>• Credenciais em <code className="text-orange-600 font-mono">backend/.env</code></p>
                <p>• Conectores habilitados no <a href="https://dashboard.pluggy.ai" target="_blank" rel="noreferrer" className="text-orange-600 underline font-medium inline-flex items-center space-x-0.5">dashboard.pluggy.ai <ExternalLink className="w-3 h-3 ml-0.5" /></a></p>
              </div>
              <button
                onClick={launchPluggyWidget}
                className="w-full py-2.5 rounded-xl bg-[#EE5D26] hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 text-[#EE5D26] border border-orange-200 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#EE5D26]" />
              </div>
              <p className="text-sm text-slate-800 font-bold">
                Iniciando Pluggy Connect...
              </p>
              <p className="text-xs text-slate-500">
                O widget seguro de Open Finance está sendo carregado na tela.
              </p>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── MOCK MODE: Clean Minimalist Modal ───────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF4ED] border border-[#FFE7D9] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#EE5D26]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {selectedConnector ? 'Autorização Open Finance' : 'Conectar Instituição Bancária'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedConnector
                  ? 'Compartilhamento seguro de dados bancários'
                  : 'Selecione seu banco para agregar suas contas no DIO Bank'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setSelectedConnector(null); onClose() }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {!selectedConnector ? (
            /* Bank Selection Grid */
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Principais Bancos Suportados
                </span>
                <span className="text-[11px] text-[#EE5D26] font-semibold bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                  Open Finance Brasil
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {displayBanks.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectBank(c)}
                    className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-orange-500/60 hover:bg-orange-50/20 hover:shadow-xs transition-all flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <BankLogo bank={c.name} className="w-9 h-9" />
                      <div className="min-w-0 flex-1 truncate">
                        <div className="font-bold text-xs text-slate-800 group-hover:text-slate-900 truncate">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          Conexão Instantânea
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#EE5D26] transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Open Finance Consent Step */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-center space-x-3.5">
                <BankLogo bank={selectedConnector.name} className="w-12 h-12" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedConnector.name}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">Consentimento de Leitura via Open Finance</div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 bg-orange-50/40 p-4 rounded-2xl border border-orange-100">
                <div className="font-bold text-slate-900 mb-1.5 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#EE5D26]" />
                  <span>Dados autorizados para compartilhamento:</span>
                </div>
                {[
                  'Saldos consolidados de contas correntes e poupança',
                  'Extratos e histórico recente de transações bancárias',
                  'Faturas, limites e despesas de cartões de crédito',
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center space-x-1 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Seus dados são criptografados de ponta a ponta pelo Banco Central do Brasil.</span>
              </div>

              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => setSelectedConnector(null)}
                  disabled={isConnecting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={handleAuthorizeMock}
                  disabled={isConnecting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#EE5D26] to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-semibold shadow-md shadow-orange-500/25 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Conectando...</span>
                    </>
                  ) : (
                    <>
                      <span>Autorizar Compartilhamento</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
