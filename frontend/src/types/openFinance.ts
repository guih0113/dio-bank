export interface Connector {
  id: number
  name: string
  primaryColor: string
  institutionUrl?: string
  imageUrl?: string
  type: string
  country: string
}

export interface Item {
  id: string
  connectorId: number
  connectorName: string
  connectorColor: string
  connectorLogo?: string
  status: string
  createdAt: string
  updatedAt: string
  error?: string
}

export interface Account {
  id: string
  itemId: string
  type: 'BANK' | 'CREDIT' | 'INVESTMENT' | string
  subtype: 'CHECKING_ACCOUNT' | 'SAVINGS_ACCOUNT' | 'CREDIT_CARD' | 'INVESTMENT' | string
  name: string
  balance: number
  currencyCode: string
  number?: string
  creditLimit?: number
  availableCreditLimit?: number
  bankName: string
  bankColor: string
  bankLogo?: string
}

export interface Transaction {
  id: string
  accountId: string
  description: string
  amount: number
  date: string
  category: string
  type: 'DEBIT' | 'CREDIT'
  status: string
  bankName?: string
  bankColor?: string
}

export interface FinancialSummary {
  total_balance: number
  total_credit_debt: number
  total_investments: number
  net_worth: number
  monthly_income: number
  monthly_expenses: number
  accounts_count: number
  banks_connected: number
}

export interface SystemMode {
  isMock: boolean
  pluggyConfigured: boolean
  baseUrl: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  tools_used?: string[]
  timestamp: string
}

export interface AIChatResponse {
  reply: string
  tools_used: string[]
  data?: any
}
