import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Zap,
  Paperclip,
  Send,
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

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  attachment?: AttachedFile
  tools?: string[]
}

export const AIAssistantWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Olá! 👋\nSou seu assistente financeiro com Open Finance. Como posso ajudar hoje?',
    },
  ])
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(false)
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    // Reset input so re-selecting same file works
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

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || inputVal).trim()
    const currentAttachment = attachedFile

    if (!text && !currentAttachment) return
    if (loading) return

    const userMessageText = text || `Análise de documento: ${currentAttachment?.name}`
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: userMessageText,
        attachment: currentAttachment || undefined,
      },
    ])

    if (!customPrompt) setInputVal('')
    setAttachedFile(null)
    setLoading(true)

    try {
      if (currentAttachment) {
        // Simulated smart receipt & document OCR / analysis
        await new Promise((resolve) => setTimeout(resolve, 900))
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `📄 **Documento analisado:** \`${currentAttachment.name}\`\n\nIdentifiquei um comprovante com sucesso!\n• **Tipo:** Comprovante de Pagamento / Recibo\n• **Valor Detectado:** R$ 129,90\n• **Categoria Sugerida:** Moradia / Serviços\n• **Status:** Pronto para conciliação no DIO Bank.`,
            tools: ['ocr_receipt_parser', 'classify_transaction'],
          },
        ])
      } else {
        const history = messages.map((m) => ({ role: m.role, content: m.text }))
        const res = await api.sendAIChat(text, history)
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: res.reply, tools: res.tools_used },
        ])
      }
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

            {/* Attached file thumbnail inside message */}
            {msg.attachment && (
              <div className="mb-1.5 max-w-[85%] rounded-xl bg-orange-50/80 border border-orange-200/80 p-2 flex items-center space-x-2 text-[11px] text-orange-950">
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
                  <p className="text-[10px] text-orange-700">{msg.attachment.size}</p>
                </div>
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

      {/* Active Attachment Preview Pill */}
      {attachedFile && (
        <div className="mb-2 px-2.5 py-1.5 bg-orange-50 rounded-xl border border-orange-200/90 flex items-center justify-between text-xs animate-in fade-in">
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

      {/* Input bar */}
      <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,.pdf,.csv,.ofx"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className={`p-2 transition rounded-lg cursor-pointer ${
            attachedFile
              ? 'bg-orange-100 text-orange-600'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
          title="Anexar comprovante ou extrato (PDF, imagem, CSV)"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={attachedFile ? 'Adicione uma mensagem sobre o anexo...' : 'Digite sua pergunta...'}
          disabled={loading}
          className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || (!inputVal.trim() && !attachedFile)}
          className="w-8 h-8 rounded-xl bg-[#EE5D26] hover:bg-orange-600 disabled:opacity-40 text-white flex items-center justify-center transition shadow-sm cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
