import { useState, useEffect, useCallback } from 'react'
import { Navbar } from './components/Navbar'
import { SummaryCards } from './components/SummaryCards'
import { ConnectedBanks } from './components/ConnectedBanks'
import { AccountsList } from './components/AccountsList'
import { TransactionsFeed } from './components/TransactionsFeed'
import { ConnectModal } from './components/ConnectModal'
import { AIChatDrawer } from './components/AIChatDrawer'
import {
  Account,
  Connector,
  FinancialSummary,
  Item,
  SystemMode,
  Transaction,
} from './types/openFinance'
import { api } from './services/api'
import { Sparkles } from 'lucide-react'

export function App() {
  const [systemMode, setSystemMode] = useState<SystemMode | null>(null)
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [connectors, setConnectors] = useState<Connector[]>([])

  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
  const [isAiChatOpen, setIsAiChatOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)

  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    try {
      const [modeRes, sumRes, accRes, txRes, itRes, connRes] = await Promise.all([
        api.getSystemMode(),
        api.getFinancialSummary(),
        api.getAccounts(),
        api.getTransactions(),
        api.getItems(),
        api.getConnectors(),
      ])

      setSystemMode(modeRes)
      setSummary(sumRes)
      setAccounts(accRes)
      setTransactions(txRes)
      setItems(itRes)
      setConnectors(connRes)
    } catch (err) {
      console.error('Erro ao carregar dados do DIO Bank:', err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDisconnect = async (itemId: string, bankName: string) => {
    if (confirm(`Tem certeza que deseja desconectar o ${bankName} do DIO Bank?`)) {
      setIsDeletingId(itemId)
      try {
        await api.deleteItem(itemId)
        await loadData()
      } catch (err) {
        console.error('Falha ao desconectar instituição:', err)
      } finally {
        setIsDeletingId(null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        systemMode={systemMode}
        onOpenConnect={() => setIsConnectModalOpen(true)}
        onToggleAi={() => setIsAiChatOpen((prev) => !prev)}
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner info */}
        <div className="mb-6 p-4 rounded-2xl bg-linear-to-r from-purple-900/20 via-indigo-900/10 to-transparent border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Painel Financeiro Unificado
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Suas contas bancárias, cartões de crédito e investimentos conectados com inteligência via Open Finance MCP.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/30 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>MCP Protocol v2.3 Ativo</span>
          </div>
        </div>

        {/* 1. Summary Cards */}
        <SummaryCards summary={summary} isLoading={isLoading} />

        {/* 2. Connected Banks */}
        <ConnectedBanks
          items={items}
          onOpenConnect={() => setIsConnectModalOpen(true)}
          onDisconnect={handleDisconnect}
          isDeletingId={isDeletingId}
        />

        {/* 3. Accounts & Credit Cards */}
        <AccountsList
          accounts={accounts}
          selectedBank={selectedBank}
          onSelectBank={setSelectedBank}
        />

        {/* 4. Transactions Feed */}
        <TransactionsFeed transactions={transactions} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          DIO Bank © {new Date().getFullYear()} — Powered by <strong>Pluggy Open Finance</strong> &{' '}
          <strong>Model Context Protocol (MCP)</strong>
        </p>
      </footer>

      {/* Floating AI Button (Bottom-Right) */}
      <button
        onClick={() => setIsAiChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 px-4 py-3 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-2xl shadow-purple-600/40 border border-purple-400/30 transition hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Sparkles className="w-5 h-5 text-purple-200 animate-pulse" />
        <span className="hidden sm:inline">Assistente Financeiro IA</span>
      </button>

      {/* Connect Bank Modal */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        connectors={connectors}
        systemMode={systemMode}
        onSuccessConnect={() => loadData()}
      />

      {/* AI Assistant Chat Drawer */}
      <AIChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onActionComplete={() => loadData()}
      />
    </div>
  )
}
export default App
