import React, { useState, useRef, useEffect } from 'react'
import {
  Home,
  Sparkles,
  BarChart2,
  Utensils,
  PiggyBank,
  Calendar,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronDown,
  Paperclip,
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  User,
  Check,
  Loader2,
  X,
  FileText,
  Image as ImageIcon,
} from 'lucide-react'
import { api } from '../services/api'

interface AttachedFile {
  name: string
  size: string
  previewUrl?: string
  isImage: boolean
}

interface Message {
  id: string
  role: 'assistant' | 'user'
  text: string
  attachment?: AttachedFile
  showFoodInsight?: boolean
  timestamp?: string
}

interface QuickSummaryData {
  balance: string
  income: string
  expenses: string
  netFlow: string
  flowLabel: string
  progressOffset: number
}

const QUICK_SUMMARY_DATA: Record<string, QuickSummaryData> = {
  'Este mês': {
    balance: 'R$ 4.120,17',
    income: 'R$ 6.230,00',
    expenses: 'R$ 4.109,17',
    netFlow: 'R$ 2.120,83',
    flowLabel: 'Fluxo do mês',
    progressOffset: 75.36,
  },
  'Mês anterior': {
    balance: 'R$ 3.840,50',
    income: 'R$ 5.950,00',
    expenses: 'R$ 3.890,20',
    netFlow: 'R$ 2.059,80',
    flowLabel: 'Fluxo anterior',
    progressOffset: 87.92,
  },
  'Últimos 3 meses': {
    balance: 'R$ 12.450,80',
    income: 'R$ 18.420,00',
    expenses: 'R$ 12.380,50',
    netFlow: 'R$ 6.039,50',
    flowLabel: 'Fluxo do período',
    progressOffset: 82.89,
  },
  'Este ano': {
    balance: 'R$ 43.120,00',
    income: 'R$ 68.500,00',
    expenses: 'R$ 42.980,00',
    netFlow: 'R$ 25.520,00',
    flowLabel: 'Fluxo anual',
    progressOffset: 92.94,
  },
}

interface AssistenteViewProps {
  onBackToDashboard?: () => void
  incomingPrompt?: string | null
  onClearIncomingPrompt?: () => void
}

export const AssistenteView: React.FC<AssistenteViewProps> = ({
  onBackToDashboard,
  incomingPrompt,
  onClearIncomingPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      text: 'Olá, Guilherme! 👋\nComo posso ajudar hoje? Você pode me fazer perguntas sobre seus gastos, receitas, ou qualquer informação financeira.',
    },
    {
      id: 'msg-2',
      role: 'user',
      text: 'Quanto eu gastei com comida este mês?',
    },
    {
      id: 'msg-3',
      role: 'assistant',
      text: 'Você gastou **R$ 842,50** com comida neste mês, o que representa cerca de **20,5%** do seu total de despesas.',
      showFoodInsight: true,
    },
  ])

  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [likedMap, setLikedMap] = useState<Record<string, boolean | null>>({})
  const [quickPeriod, setQuickPeriod] = useState<keyof typeof QUICK_SUMMARY_DATA>('Este mês')
  const [isQuickPeriodOpen, setIsQuickPeriodOpen] = useState(false)
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const quickPeriodRef = useRef<HTMLDivElement>(null)
  const processedPromptRef = useRef<string | null>(null)

  // Click outside to close quick period dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (quickPeriodRef.current && !quickPeriodRef.current.contains(e.target as Node)) {
        setIsQuickPeriodOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  useEffect(() => {
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, loading])

  const suggestedQuestions = [
    { text: 'Analise meus gastos deste mês', icon: BarChart2 },
    { text: 'Quanto gastei com comida?', icon: Utensils },
    { text: 'Me mostre meu fluxo de caixa', icon: PiggyBank },
    { text: 'Qual foi minha maior despesa?', icon: Calendar },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isImage = file.type.startsWith('image/')
    const previewUrl = isImage ? URL.createObjectURL(file) : undefined
    const sizeInKb = (file.size / 1024).toFixed(0)

    setAttachedFile({
      name: file.name,
      size: `${sizeInKb} KB`,
      previewUrl,
      isImage,
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = () => {
    if (attachedFile?.previewUrl) {
      URL.revokeObjectURL(attachedFile.previewUrl)
    }
    setAttachedFile(null)
  }

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputValue).trim()
    const currentAttachment = attachedFile

    if (!textToSend && !currentAttachment) return
    if (loading) return

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend || `Análise de documento: ${currentAttachment?.name}`,
      attachment: currentAttachment || undefined,
    }

    setMessages((prev) => [...prev, userMsg])
    if (!customText) setInputValue('')
    setAttachedFile(null)
    setLoading(true)

    try {
      if (currentAttachment) {
        await new Promise((resolve) => setTimeout(resolve, 900))
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            text: `📄 **Documento analisado:** \`${currentAttachment.name}\`\n\nIdentifiquei um comprovante financeiro:\n• **Tipo:** Comprovante de Pagamento\n• **Valor Detectado:** R$ 129,90\n• **Categoria Sugerida:** Moradia / Serviços\n• **Status:** Pronto para conciliação no DIO Bank.`,
          },
        ])
      } else {
        const historyPayload = messages.map((m) => ({
          role: m.role,
          content: m.text,
        }))
        const res = await api.sendAIChat(textToSend, historyPayload)

        const assistantMsg: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: res.reply,
          showFoodInsight:
            textToSend.toLowerCase().includes('comida') ||
            textToSend.toLowerCase().includes('alimenta') ||
            textToSend.toLowerCase().includes('mercado'),
        }

        setMessages((prev) => [...prev, assistantMsg])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          text: 'Tive uma instabilidade ao consultar o Open Finance. Poderia tentar novamente em alguns segundos?',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Handle incoming prompts from global header search bar (guarded against duplicate execution)
  useEffect(() => {
    if (incomingPrompt && incomingPrompt.trim()) {
      if (processedPromptRef.current === incomingPrompt) return
      processedPromptRef.current = incomingPrompt
      handleSend(incomingPrompt.trim())
      onClearIncomingPrompt?.()
    } else {
      processedPromptRef.current = null
    }
  }, [incomingPrompt])

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleFeedback = (id: string, isLike: boolean) => {
    setLikedMap((prev) => ({
      ...prev,
      [id]: prev[id] === isLike ? null : isLike,
    }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Headers & Info Cards (~4.5 cols on lg) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Title Area */}
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5">
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Assistente</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-[#EE5D26] fill-[#EE5D26]/20" />
              <span>Assistente DIO Bank</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Faça perguntas sobre suas finanças e receba insights personalizados com o poder do Open Finance.
            </p>
          </div>

          {/* Card 1: Perguntas sugeridas */}
          <div className="bg-gradient-to-br from-[#FFF8F4] via-[#FFF4ED] to-[#FFF8F4] rounded-2xl p-5 border border-[#FFE7D9] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5">
            <div className="flex items-center space-x-2 text-slate-900">
              <Sparkles className="w-4 h-4 text-[#EE5D26]" />
              <h3 className="text-sm font-bold tracking-tight">Perguntas sugeridas</h3>
            </div>

            <div className="space-y-2">
              {suggestedQuestions.map((q, idx) => {
                const Icon = q.icon
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(q.text)}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#FFE5D4]/80 hover:border-orange-300 hover:shadow-sm text-left transition-all duration-200 group cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                      <Icon className="w-4 h-4 text-slate-500 group-hover:text-[#EE5D26] transition-colors shrink-0" />
                      <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 truncate">
                        {q.text}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:text-[#EE5D26] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Card 2: Resumo rápido */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-800">Resumo rápido</h3>
              </div>

              {/* Period Dropdown */}
              <div className="relative" ref={quickPeriodRef}>
                <button
                  onClick={() => setIsQuickPeriodOpen(!isQuickPeriodOpen)}
                  className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-600 bg-slate-50 border border-slate-200/90 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                >
                  <span>{quickPeriod}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isQuickPeriodOpen ? 'rotate-180' : ''}`} />
                </button>

                {isQuickPeriodOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-xl border border-slate-200/90 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    {Object.keys(QUICK_SUMMARY_DATA).map((p) => {
                      const isSelected = p === quickPeriod
                      return (
                        <button
                          key={p}
                          onClick={() => {
                            setQuickPeriod(p as keyof typeof QUICK_SUMMARY_DATA)
                            setIsQuickPeriodOpen(false)
                          }}
                          className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between transition cursor-pointer ${
                            isSelected
                              ? 'bg-orange-50/70 text-[#EE5D26] font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{p}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#EE5D26]" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {(() => {
              const currentSummary = QUICK_SUMMARY_DATA[quickPeriod] || QUICK_SUMMARY_DATA['Este mês']

              return (
                <div className="flex items-center justify-between gap-4">
                  {/* Circular Gauge / Donut */}
                  <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background Track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#F1F5F9"
                        strokeWidth="10"
                        fill="none"
                      />
                      {/* Progress Indicator */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#EE5D26"
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset={currentSummary.progressOffset}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-500 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-bold text-slate-900 tracking-tight">{currentSummary.balance}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Saldo atual</span>
                    </div>
                  </div>

                  {/* 3 Metrics list */}
                  <div className="space-y-2.5 text-xs flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 font-bold">{currentSummary.income}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">Receitas</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-rose-500 font-bold">{currentSummary.expenses}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">Despesas</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <Activity className="w-3.5 h-3.5 text-[#EE5D26]" />
                        <span className="text-slate-800 font-bold">{currentSummary.netFlow}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{currentSummary.flowLabel}</span>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* Right Column: Chat Canvas (~7.5 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[580px]">
            {/* Messages Feed */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant'

                return (
                  <div key={msg.id} className="flex flex-col space-y-2">
                    <div className={`flex items-start space-x-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                      {/* Assistant Avatar */}
                      {isAssistant && (
                        <div className="w-8 h-8 rounded-xl bg-[#FFF4ED] border border-[#FFE7D9] flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 text-[#EE5D26]" />
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                          isAssistant
                            ? 'bg-[#F6F7FA] text-slate-800 rounded-tl-none max-w-[88%]'
                            : 'bg-[#FFF5ED] text-slate-900 border border-[#FFE5D4] rounded-tr-none max-w-[80%] font-medium'
                        }`}
                      >
                        {/* Attached file thumbnail inside message */}
                        {msg.attachment && (
                          <div className="mb-2 max-w-[240px] rounded-xl bg-white/90 border border-orange-200/90 p-2 flex items-center space-x-2 text-[11px] text-slate-800 shadow-xs">
                            {msg.attachment.isImage && msg.attachment.previewUrl ? (
                              <img
                                src={msg.attachment.previewUrl}
                                alt={msg.attachment.name}
                                className="w-8 h-8 object-cover rounded-lg border border-orange-200"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                <FileText className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1 truncate">
                              <p className="font-semibold truncate">{msg.attachment.name}</p>
                              <p className="text-[10px] text-slate-400">{msg.attachment.size}</p>
                            </div>
                          </div>
                        )}

                        {msg.text}

                        {/* Rich Food Insight Card (Shown when requested in the design) */}
                        {msg.showFoodInsight && (
                          <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-4">
                            <div>
                              <div className="font-bold text-slate-900 flex items-center space-x-1.5 mb-1.5">
                                <Utensils className="w-3.5 h-3.5 text-slate-700" />
                                <span>Detalhamento:</span>
                              </div>
                              <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                                <li>Mercado: R$ 523,40 (62,1%)</li>
                                <li>Restaurantes: R$ 319,10 (37,9%)</li>
                              </ul>
                            </div>

                            {/* Chart & Insight Box side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
                              {/* Left: Bar comparison */}
                              <div className="sm:col-span-7 bg-white p-3 rounded-xl border border-slate-200/80">
                                <div className="h-28 flex items-end justify-around pb-2">
                                  {/* Bar 1: Mercado */}
                                  <div className="flex flex-col items-center space-y-1">
                                    <span className="text-[10px] font-bold text-slate-800">R$ 523,40</span>
                                    <div className="w-14 bg-[#EE5D26] rounded-t-lg transition-all duration-500 h-20" />
                                    <span className="text-[10px] text-slate-500 font-medium">Mercado</span>
                                  </div>

                                  {/* Bar 2: Restaurantes */}
                                  <div className="flex flex-col items-center space-y-1">
                                    <span className="text-[10px] font-bold text-slate-800">R$ 319,10</span>
                                    <div className="w-14 bg-[#FDBA74] rounded-t-lg transition-all duration-500 h-12" />
                                    <span className="text-[10px] text-slate-500 font-medium">Restaurantes</span>
                                  </div>
                                </div>
                                <div className="border-t border-slate-100" />
                              </div>

                              {/* Right: Insight Callout Box */}
                              <div className="sm:col-span-5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                                <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-xs">
                                  <span>💡</span>
                                  <span>Insight</span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-normal mt-1.5">
                                  Suas despesas com comida estão dentro da média de 23% a 28% da sua renda.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* User Avatar */}
                      {!isAssistant && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Assistant Message Actions (Thumbs & Copy) */}
                    {isAssistant && (
                      <div className="flex items-center space-x-1 pl-11 text-slate-400">
                        <button
                          onClick={() => handleFeedback(msg.id, true)}
                          className={`p-1.5 rounded-lg hover:bg-slate-100 transition ${
                            likedMap[msg.id] === true ? 'text-emerald-600 bg-emerald-50' : 'hover:text-slate-600'
                          }`}
                          title="Útil"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleFeedback(msg.id, false)}
                          className={`p-1.5 rounded-lg hover:bg-slate-100 transition ${
                            likedMap[msg.id] === false ? 'text-rose-600 bg-rose-50' : 'hover:text-slate-600'
                          }`}
                          title="Não foi útil"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition"
                          title="Copiar resposta"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}

              {loading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF4ED] border border-[#FFE7D9] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#EE5D26]" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#F6F7FA] text-xs text-slate-500 flex items-center space-x-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EE5D26]" />
                    <span>Consultando dados no Open Finance...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Active Attachment Preview Pill */}
            {attachedFile && (
              <div className="mx-4 mb-2 px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-200/90 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center space-x-2 truncate">
                  {attachedFile.isImage ? (
                    <ImageIcon className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  )}
                  <span className="text-slate-800 font-medium text-[11px] truncate">{attachedFile.name}</span>
                  <span className="text-slate-400 text-[10px]">({attachedFile.size})</span>
                </div>
                <button
                  onClick={removeAttachment}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-orange-100/50 transition cursor-pointer"
                  title="Remover anexo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Input Bar at Bottom */}
            <div className="p-4 border-t border-slate-100 flex items-center space-x-2 bg-white rounded-b-3xl">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.csv,.ofx"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  attachedFile
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Anexar comprovante ou extrato"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={attachedFile ? 'Adicione uma observação sobre este documento...' : 'Faça sua pergunta...'}
                disabled={loading}
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none px-2"
              />

              <button
                onClick={() => handleSend()}
                disabled={loading || (!inputValue.trim() && !attachedFile)}
                className="w-9 h-9 rounded-xl bg-[#EE5D26] hover:bg-orange-600 disabled:opacity-40 text-white flex items-center justify-center transition shadow-md shadow-orange-500/20 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
