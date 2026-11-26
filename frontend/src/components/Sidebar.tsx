import React from 'react'
import {
  Home,
  FileText,
  Sparkles,
  Link2,
  ChevronDown,
} from 'lucide-react'

export type NavRoute = 'dashboard' | 'extrato' | 'assistente' | 'conexoes'

interface SidebarProps {
  currentRoute: NavRoute
  onNavigate: (route: NavRoute) => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as NavRoute, label: 'Dashboard', icon: Home },
    { id: 'extrato' as NavRoute, label: 'Extrato', icon: FileText },
    { id: 'assistente' as NavRoute, label: 'Assistente', icon: Sparkles },
    { id: 'conexoes' as NavRoute, label: 'Conexões', icon: Link2 },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#111317] text-slate-200 flex flex-col justify-between border-r border-[#1C1F26] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Subtle background ambient waves */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <svg className="absolute -bottom-10 -left-10 w-80 h-80 text-orange-500/10" viewBox="0 0 200 200" fill="none">
            <path d="M0,100 C40,160 160,40 200,100 L200,200 L0,200 Z" fill="currentColor" />
          </svg>
          <svg className="absolute -bottom-20 -left-20 w-96 h-96 text-orange-400/5" viewBox="0 0 200 200" fill="none">
            <path d="M0,80 C60,180 140,20 200,80 L200,200 L0,200 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Top Section */}
        <div className="p-6 relative z-10">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 mb-9">
            <div className="w-9 h-9 rounded-xl bg-[#EE5D26] flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <path d="M8 7h4a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H8V7z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              DIO Bank
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentRoute === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id)
                    onCloseMobile?.()
                  }}
                  className={`w-full flex items-center space-x-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#38221B] text-white border border-[#5A3123] shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#EE5D26]' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-5 border-t border-[#1C1F26] relative z-10">
          {/* User Profile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-900 font-bold text-xs flex items-center justify-center shrink-0">
                GH
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">Guilherme Henrique</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-1 rounded transition">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
