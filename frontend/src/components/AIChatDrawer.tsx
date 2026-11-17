import React, { useState, useRef, useEffect } from 'react'
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Wrench,
  Bot,
  User,
} from 'lucide-react'
import { ChatMessage } from '../types/openFinance'
import { api } from '../services/api'

interface AIChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  onActionComplete?: () => void
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  onActionComplete,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Olá! Eu sou o **Assistente Inteligente do DIO Bank**, conectado diretamente ao seu ecossistema via **Open Finance MCP**.\n\nVocê pode me perguntar sobre seus gastos, faturas, saldos agregados ou até mesmo me pedir para conectar novas contas!',
      timestamp: 'Agora',
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    'Quanto gastei com mercado?',
    'Qual meu saldo total e faturas?',
    'Mostre meus gastos com Uber',
    'Analise minhas despesas por categoria',
    'Conectar Itaú',
  ]

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  if (!isOpen) return null

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim()
    if (!text || isLoading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputMessage('')
    setIsLoading(true)

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await api.sendAIChat(text, historyPayload)

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        tools_used: response.tools_used,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, assistantMsg])

      // If a bank was connected through the chat, notify parent to refresh data!
      if (response.tools_used?.includes('simulate_connect_bank') && onActionComplete) {
        onActionComplete()
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Desculpe, ocorreu uma instabilidade ao consultar os dados via Open Finance MCP. Tente novamente em instantes.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  // Format assistant markdown response simple rendering
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      // Bold text formatting
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Bullet point
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li
            key={idx}
            className="ml-4 list-disc text-slate-200 my-1"
            dangerouslySetInnerHTML={{ __html: formattedLine.substring(2) }}
          />
        )
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />
      }
      return (
        <p
          key={idx}
          className="my-1 text-slate-200"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      )
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md sm:max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4 h-4 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white">Assistente DIO Bank</h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  MCP Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Respostas em tempo real com ferramentas Open Finance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex items-center space-x-2 scrollbar-none">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-950/40 hover:border-purple-500/50 border border-slate-700/60 text-slate-300 hover:text-purple-300 text-[11px] whitespace-nowrap transition cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user'

            return (
              <div
                key={msg.id}
                className={`flex space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Tool execution badge */}
                  {!isUser && msg.tools_used && msg.tools_used.length > 0 && (
                    <div className="mb-1.5 flex flex-wrap gap-1">
                      {msg.tools_used.map((tool, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-800/60 font-mono"
                        >
                          <Wrench className="w-2.5 h-2.5" />
                          <span>mcp:{tool}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800/90 text-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {isUser ? msg.content : renderFormattedContent(msg.content)}
                  </div>

                  <span className="text-[10px] text-slate-500 mt-1 block px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            )
          })}

          {isLoading && (
            <div className="flex space-x-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
                <span>Executando ferramentas Open Finance MCP...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Pergunte sobre seus gastos, faturas ou saldos..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition cursor-pointer shadow-md shadow-purple-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
