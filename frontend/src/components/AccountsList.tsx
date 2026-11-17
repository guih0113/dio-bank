import React from 'react'
import {
  Wallet,
  CreditCard,
  TrendingUp,
  Landmark,
} from 'lucide-react'
import { Account } from '../types/openFinance'

interface AccountsListProps {
  accounts: Account[]
  selectedBank: string | null
  onSelectBank: (bankName: string | null) => void
}

export const AccountsList: React.FC<AccountsListProps> = ({
  accounts,
  selectedBank,
  onSelectBank,
}) => {
  const formatBRL = (value: number = 0) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Extract unique banks for filtering
  const banks = Array.from(new Set(accounts.map((a) => a.bankName)))

  const filteredAccounts = selectedBank
    ? accounts.filter((a) => a.bankName === selectedBank)
    : accounts

  const getAccountIcon = (type: string, subtype: string) => {
    if (type === 'CREDIT' || subtype === 'CREDIT_CARD') {
      return <CreditCard className="w-4 h-4 text-rose-400" />
    }
    if (type === 'INVESTMENT' || subtype === 'INVESTMENT') {
      return <TrendingUp className="w-4 h-4 text-cyan-400" />
    }
    return <Wallet className="w-4 h-4 text-emerald-400" />
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Contas e Cartões Agregados</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {filteredAccounts.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Saldos, faturas e limites em tempo real
          </p>
        </div>

        {/* Bank filter pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => onSelectBank(null)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              selectedBank === null
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos
          </button>
          {banks.map((b) => (
            <button
              key={b}
              onClick={() => onSelectBank(b)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedBank === b
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredAccounts.map((account) => {
          const isCredit = account.type === 'CREDIT' || account.subtype === 'CREDIT_CARD'
          const isInvest = account.type === 'INVESTMENT'

          // Credit card utilization calculation
          const creditLimit = account.creditLimit || 0
          const usedCredit = Math.abs(account.balance)
          const usagePercent = creditLimit > 0 ? Math.min(100, Math.round((usedCredit / creditLimit) * 100)) : 0

          return (
            <div
              key={account.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 p-5 shadow-sm transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center p-2 border border-slate-700/50"
                    style={{ backgroundColor: `${account.bankColor}15` }}
                  >
                    {account.bankLogo ? (
                      <img
                        src={account.bankLogo}
                        alt={account.bankName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <Landmark className="w-5 h-5" style={{ color: account.bankColor }} />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{account.name}</div>
                    <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                      <span className="font-medium text-slate-300">{account.bankName}</span>
                      {account.number && (
                        <>
                          <span>•</span>
                          <span>{account.number}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  {getAccountIcon(account.type, account.subtype)}
                </div>
              </div>

              {/* Balance / Values */}
              <div className="flex items-end justify-between pt-2 border-t border-slate-800/60">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-0.5">
                    {isCredit ? 'Fatura Atual' : isInvest ? 'Posição Total' : 'Saldo Disponível'}
                  </span>
                  <div
                    className={`text-xl font-extrabold tracking-tight ${
                      isCredit
                        ? 'text-rose-400'
                        : isInvest
                        ? 'text-cyan-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {formatBRL(Math.abs(account.balance))}
                  </div>
                </div>

                {/* Credit card limit or investment info */}
                {isCredit && creditLimit > 0 && (
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block mb-0.5">
                      Limite: {formatBRL(creditLimit)}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {usagePercent}% usado
                    </span>
                  </div>
                )}
              </div>

              {/* Credit card usage progress bar */}
              {isCredit && creditLimit > 0 && (
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        usagePercent > 80 ? 'bg-rose-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
