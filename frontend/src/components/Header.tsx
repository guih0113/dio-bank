import React from 'react'
import { Sparkles, ArrowRight, Bell, Sun, Menu } from 'lucide-react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  onSendToAssistant?: (prompt: string) => void
  onToggleMobileMenu?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSendToAssistant,
  onToggleMobileMenu,
}) => {
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    if (onSendToAssistant) {
      onSendToAssistant(trimmed)
      onSearchChange('')
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F4F5F9]/85 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-200/60">
      <div className="flex items-center space-x-3 w-full max-w-2xl">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* AI Assistant Quick Prompt Bar */}
        <form onSubmit={handleSubmit} className="relative w-full">
          {/* AI Sparkles Visual Indicator */}
          <Sparkles className="w-4 h-4 text-[#EE5D26] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit()
              }
            }}
            placeholder="Pergunte ao assistente DIO Bank..."
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          />

          {/* Send to Assistant Button */}
          <button
            type="submit"
            disabled={!searchQuery.trim()}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              searchQuery.trim()
                ? 'bg-[#EE5D26] hover:bg-orange-600 text-white shadow-xs opacity-100 scale-100'
                : 'text-slate-300 pointer-events-none opacity-0 scale-90'
            }`}
            title="Enviar pergunta ao Assistente"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center space-x-3 ml-4">
        {/* Notification Bell */}
        <button
          className="relative p-2.5 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
          title="Notificações"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Theme Toggle */}
        <button
          className="p-2.5 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
          title="Modo Claro"
        >
          <Sun className="w-4 h-4 text-amber-500" />
        </button>
      </div>
    </header>
  )
}
