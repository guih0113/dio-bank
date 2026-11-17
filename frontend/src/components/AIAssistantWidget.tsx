import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Zap, Paperclip, Send, Loader2 } from 'lucide-react'
import { api } from '../services/api'

export const AIAssistantWidget: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; tools?: string[] }>>([
    {
      role: 'assistant',
      text: 'Olá! 👋\nSou seu assistente financeiro com Open Finance. Como posso ajudar hoje?',
    },
  ])
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    'Analise meus gastos deste mês',
    'Quanto gastei com comida?',
    'Me mostre meu fluxo de caixa',
  ]

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, loading])

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || inputVal).trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { role: 'user', text }])
    if (!customPrompt) setInputVal('')
    setLoading(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.text }))
      const res = await api.sendAIChat(text, history)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: res.reply, tools: res.tools_used },
      ])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Desculpe, tive uma instabilidade ao consultar os dados Open Finance. Tente novamente!',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[420px]">
      {/* Header */}
      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 fill-indigo-100" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">Assistente DIO Bank</h3>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.tools && msg.tools.length > 0 && (
              <div className="mb-1 flex flex-wrap gap-1">
                {msg.tools.map((t, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-200"
                  >
                    mcp:{t}
                  </span>
                ))}
              </div>
            )}
            <div
              className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line max-w-[92%] ${
                msg.role === 'user'
                  ? 'bg-[#EE5D26] text-white rounded-br-none shadow-sm'
                  : 'bg-slate-50 text-slate-700 rounded-bl-none border border-slate-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs p-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
            <span>Consultando Open Finance...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Chips */}
      <div className="py-2 flex flex-col space-y-1.5">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50/60 hover:text-orange-700 border border-slate-200/80 text-[11px] text-slate-600 transition text-left cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
            <span className="truncate">{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
        <button
          className="p-2 text-slate-400 hover:text-slate-600 transition rounded-lg hover:bg-slate-100 cursor-pointer"
          title="Anexar arquivo"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua pergunta..."
          disabled={loading}
          className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !inputVal.trim()}
          className="w-8 h-8 rounded-xl bg-[#EE5D26] hover:bg-orange-600 disabled:opacity-40 text-white flex items-center justify-center transition shadow-sm cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
