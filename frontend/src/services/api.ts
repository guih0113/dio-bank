import {
  Account,
  Connector,
  FinancialSummary,
  Item,
  SystemMode,
  Transaction,
  AIChatResponse,
} from '../types/openFinance'

const BASE_URL = '/api'

export const api = {
  async getSystemMode(): Promise<SystemMode> {
    const res = await fetch(`${BASE_URL}/mode`)
    if (!res.ok) throw new Error('Falha ao obter modo do sistema')
    return res.json()
  },

  async getFinancialSummary(): Promise<FinancialSummary> {
    const res = await fetch(`${BASE_URL}/summary`)
    if (!res.ok) throw new Error('Falha ao obter resumo financeiro')
    return res.json()
  },

  async getAccounts(itemId?: string): Promise<Account[]> {
    const url = itemId ? `${BASE_URL}/accounts?itemId=${itemId}` : `${BASE_URL}/accounts`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Falha ao carregar contas')
    return res.json()
  },

  async getTransactions(params?: {
    accountId?: string
    category?: string
    search?: string
  }): Promise<Transaction[]> {
    const query = new URLSearchParams()
    if (params?.accountId) query.set('accountId', params.accountId)
    if (params?.category) query.set('category', params.category)
    if (params?.search) query.set('search', params.search)

    const res = await fetch(`${BASE_URL}/transactions?${query.toString()}`)
    if (!res.ok) throw new Error('Falha ao carregar transações')
    return res.json()
  },

  async getItems(): Promise<Item[]> {
    const res = await fetch(`${BASE_URL}/items`)
    if (!res.ok) throw new Error('Falha ao carregar instituições conectadas')
    return res.json()
  },

  async deleteItem(itemId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/items/${itemId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Falha ao desconectar instituição')
    return res.json()
  },

  async getConnectors(): Promise<Connector[]> {
    const res = await fetch(`${BASE_URL}/connectors`)
    if (!res.ok) throw new Error('Falha ao obter conectores')
    return res.json()
  },

  async createConnectToken(): Promise<{ accessToken: string; isMock: boolean }> {
    const res = await fetch(`${BASE_URL}/connect/token`, { method: 'POST' })
    if (!res.ok) throw new Error('Falha ao gerar token de conexão')
    return res.json()
  },

  async connectMock(connectorId: number): Promise<Item> {
    const res = await fetch(`${BASE_URL}/connect/mock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectorId }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Falha ao conectar instituição')
    }
    return res.json()
  },

  async sendAIChat(
    message: string,
    history?: { role: string; content: string }[]
  ): Promise<AIChatResponse> {
    const res = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: history || [] }),
    })
    if (!res.ok) throw new Error('Falha ao comunicar com o assistente de IA')
    return res.json()
  },

  async getMcpTools(): Promise<{ tools: { name: string; description: string }[] }> {
    const res = await fetch(`${BASE_URL}/mcp/tools`)
    if (!res.ok) throw new Error('Falha ao obter lista de ferramentas MCP')
    return res.json()
  },
}
