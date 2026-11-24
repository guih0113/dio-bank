import { useState, useEffect, useCallback } from 'react'
import { Sidebar, NavRoute } from './components/Sidebar'
import { Header } from './components/Header'
import { DashboardView } from './views/DashboardView'
import { ExtratoView } from './views/ExtratoView'
import { AssistenteView } from './views/AssistenteView'
import { ConexoesView } from './views/ConexoesView'
import { ConfiguracoesView } from './views/OtherViews'
import { ConnectModal } from './components/ConnectModal'
import {
  Account,
  Connector,
  FinancialSummary,
  Item,
  SystemMode,
  Transaction,
} from './types/openFinance'
import { api } from './services/api'

export function App() {
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [incomingAssistantPrompt, setIncomingAssistantPrompt] = useState<string | null>(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

  const [systemMode, setSystemMode] = useState<SystemMode | null>({
    isMock: true,
    pluggyConfigured: false,
    baseUrl: 'https://api.pluggy.ai',
  })
  const [isMockMode, setIsMockMode] = useState(true)

  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [connectors, setConnectors] = useState<Connector[]>([])

  const loadData = useCallback(async () => {
    try {
      const [modeRes, sumRes, accRes, txRes, itRes, connRes] = await Promise.allSettled([
        api.getSystemMode(),
        api.getFinancialSummary(),
        api.getAccounts(),
        api.getTransactions(),
        api.getItems(),
        api.getConnectors(),
      ])

      if (modeRes.status === 'fulfilled') {
        setSystemMode(modeRes.value)
        setIsMockMode(modeRes.value.isMock)
      }
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value)
      if (accRes.status === 'fulfilled') setAccounts(accRes.value)
      if (txRes.status === 'fulfilled') setTransactions(txRes.value)
      if (itRes.status === 'fulfilled') setItems(itRes.value)
      if (connRes.status === 'fulfilled') setConnectors(connRes.value)
    } catch (err) {
      console.error('Erro ao conectar ao backend:', err)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const toggleMockMode = () => {
    setIsMockMode((prev) => !prev)
  }

  const handleSendToAssistant = (prompt: string) => {
    if (!prompt.trim()) return
    setIncomingAssistantPrompt(prompt.trim())
    setCurrentRoute('assistente')
  }

  return (
    <div className="min-h-screen bg-[#F4F5F9] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        isMockMode={isMockMode}
        onToggleMockMode={toggleMockMode}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main App Canvas */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Sticky Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSendToAssistant={handleSendToAssistant}
          onToggleMobileMenu={() => setIsMobileOpen((prev) => !prev)}
        />

        {/* View Container */}
        <main className="flex-1 p-5 sm:p-7 max-w-7xl w-full mx-auto">
          {currentRoute === 'dashboard' && (
            <DashboardView
              onNavigateToExtrato={() => setCurrentRoute('extrato')}
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
            />
          )}

          {currentRoute === 'extrato' && (
            <ExtratoView onBackToDashboard={() => setCurrentRoute('dashboard')} />
          )}

          {currentRoute === 'assistente' && (
            <AssistenteView
              onBackToDashboard={() => setCurrentRoute('dashboard')}
              incomingPrompt={incomingAssistantPrompt}
              onClearIncomingPrompt={() => setIncomingAssistantPrompt(null)}
            />
          )}

          {currentRoute === 'conexoes' && (
            <ConexoesView
              onBackToDashboard={() => setCurrentRoute('dashboard')}
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
            />
          )}

          {currentRoute === 'configuracoes' && (
            <ConfiguracoesView onBackToDashboard={() => setCurrentRoute('dashboard')} />
          )}
        </main>
      </div>

      {/* Connect Bank Modal (Mock and Pluggy Live supported) */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        connectors={connectors}
        systemMode={systemMode}
        onSuccessConnect={loadData}
      />
    </div>
  )
}

export default App
