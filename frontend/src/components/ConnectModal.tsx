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
} from 'lucide-react'
import { Connector, SystemMode } from '../types/openFinance'
import { api } from '../services/api'

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

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  connectors,
  systemMode,
  onSuccessConnect,
}) => {
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const isMock = systemMode?.isMock !== false   // default to mock if null

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
        includeSandbox: true,          // shows Sandbox connectors for testing
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
      // Widget opened — dismiss our modal shell immediately
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao gerar token de conexão da Pluggy.')
      setIsConnecting(false)
    }
  }

  // ─── MOCK MODE: Connector Selection ─────────────────────────────────────────
  const handleSelectBank = (connector: Connector) => {
    setErrorMsg(null)
    setSelectedConnector(connector)
  }

  const handleAuthorizeMock = async () => {
    if (!selectedConnector) return
    setIsConnecting(true)
    setErrorMsg(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
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

  // ─── LIVE MODE: Loading / Error shell ───────────────────────────────────────
  if (!isMock) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {errorMsg ? (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm text-rose-300 font-medium">{errorMsg}</p>
              <div className="text-xs text-slate-400 p-3 bg-slate-950 rounded-xl border border-slate-800 text-left space-y-1">
                <p className="font-semibold text-slate-300 mb-1">Checklist:</p>
                <p>• Backend rodando em <code className="text-purple-300">localhost:8000</code></p>
                <p>• Credenciais em <code className="text-purple-300">backend/.env</code></p>
                <p>• Conectores habilitados no <a href="https://dashboard.pluggy.ai" target="_blank" rel="noreferrer" className="text-purple-400 underline inline-flex items-center space-x-0.5">dashboard.pluggy.ai <ExternalLink className="w-3 h-3" /></a></p>
              </div>
              <button
                onClick={launchPluggyWidget}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition cursor-pointer"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <p className="text-sm text-slate-200 font-medium">
                Abrindo Pluggy Connect...
              </p>
              <p className="text-xs text-slate-400">
                O widget oficial de Open Finance está sendo carregado.
              </p>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── MOCK MODE: Full UI ──────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {selectedConnector ? 'Autorização Open Finance' : 'Conectar Instituição Bancária'}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedConnector
                  ? 'Compartilhamento seguro de dados bancários'
                  : 'Selecione seu banco para agregar suas contas no DIO Bank'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setSelectedConnector(null); onClose() }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {!selectedConnector ? (
            /* Connector List */
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Principais Bancos Suportados
              </div>
              {connectors.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
                  <p>Nenhum conector disponível.</p>
                  <p>Verifique se o backend está rodando em modo <strong className="text-amber-400">Mock</strong>.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {connectors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectBank(c)}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/60 hover:bg-slate-800/40 transition flex items-center space-x-3 text-left group cursor-pointer"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center p-1.5 border border-slate-700/60 shrink-0"
                        style={{ backgroundColor: `${c.primaryColor}15` }}
                      >
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.name} className="w-full h-full object-contain"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
                        ) : (
                          <Building2 className="w-5 h-5" style={{ color: c.primaryColor }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm text-slate-200 group-hover:text-white truncate">{c.name}</div>
                        <div className="text-[11px] text-slate-500">Open Finance Brasil</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Mock Consent Screen */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center p-2 border border-slate-700"
                  style={{ backgroundColor: `${selectedConnector.primaryColor}20` }}
                >
                  {selectedConnector.imageUrl ? (
                    <img src={selectedConnector.imageUrl} alt={selectedConnector.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-6 h-6" style={{ color: selectedConnector.primaryColor }} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedConnector.name}</h4>
                  <div className="text-xs text-slate-400">Consentimento de Leitura via Open Finance</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800/70">
                <div className="font-semibold text-slate-200 mb-1 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Dados que serão compartilhados:</span>
                </div>
                {['Saldos de contas correntes e poupança', 'Extratos e histórico recente de transações', 'Faturas e limites de cartões de crédito'].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 text-center">
                Seus dados são criptografados e protegidos pelas diretrizes do Banco Central do Brasil.
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setSelectedConnector(null)}
                  disabled={isConnecting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={handleAuthorizeMock}
                  disabled={isConnecting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isConnecting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Conectando...</span></>
                  ) : (
                    <><span>Autorizar Compartilhamento</span><ArrowRight className="w-3.5 h-3.5" /></>
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
