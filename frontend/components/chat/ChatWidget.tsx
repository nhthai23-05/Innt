import { useEffect, useRef, useState } from 'react'
import { MessageCircle, SendHorizonal, X, Sparkles, Paperclip, XCircle } from 'lucide-react'
import { sendMessage as apiSendMessage } from '../../services/chatService'
import { MatchedProduct } from '../../types/chat'

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  timestamp: string;
  sources?: string[];
  imagePreview?: string;
  matchedProducts?: MatchedProduct[];
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI của INNT. Bạn có thể hỏi tôi về sản phẩm in ấn hoặc gửi ảnh sản phẩm để tôi nhận diện.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSend = async () => {
    const trimmedInput = input.trim()
    if ((!trimmedInput && !imageFile) || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput || '[ảnh sản phẩm]',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imagePreview: imagePreview ?? undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    const sentImage = imageFile
    clearImage()
    setLoading(true)

    try {
      const data = await apiSendMessage(trimmedInput || 'anh', sentImage ?? undefined)
      const matched = data.metadata?.matched_products
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources?.length ? data.sources : undefined,
          matchedProducts: matched?.length ? matched : undefined,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Xin lỗi, không thể kết nối đến server. Vui lòng thử lại sau.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#E62026] shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-6 right-6 z-[9999] flex flex-col bg-white shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-300"
          style={{
            width: '400px',
            height: '600px',
            maxHeight: 'calc(100vh - 40px)',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* HEADER */}
          <div
            className="bg-[#E62026] p-5 text-white flex items-center justify-center relative"
            style={{ flexShrink: 0, minHeight: '70px' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
                <Sparkles size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }} className="text-white">
                INNT AI Assistant
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/10 p-2 rounded-full cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* CHAT AREA */}
          <div
            className="flex-1 overflow-y-auto p-4 bg-[#fcfcfc] custom-scrollbar"
            style={{ display: 'flex', flexDirection: 'column', gap: '15px', minHeight: 0 }}
          >
            {messages.map((m) => {
              const isUser = m.role === 'user'
              return (
                <div
                  key={m.id}
                  className="w-full flex"
                  style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}
                >
                  <div
                    className="flex flex-col"
                    style={{ maxWidth: '85%', alignItems: isUser ? 'flex-end' : 'flex-start' }}
                  >
                    {isUser && m.imagePreview && (
                      <img
                        src={m.imagePreview}
                        alt="anh da gui"
                        style={{
                          maxWidth: '160px',
                          borderRadius: '12px',
                          marginBottom: '4px',
                          border: '2px solid #E62026',
                        }}
                      />
                    )}

                    <div
                      style={{
                        backgroundColor: isUser ? '#E62026' : '#FFFFFF',
                        color: isUser ? '#FFFFFF' : '#333333',
                        borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                        padding: '10px 16px',
                        fontSize: '14px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        border: isUser ? 'none' : '1px solid #E5E7EB',
                      }}
                    >
                      {m.content}
                    </div>

                    {!isUser && m.sources && m.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {m.sources.map((src, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderRadius: '99px',
                              backgroundColor: '#FEF2F2',
                              color: '#E62026',
                              border: '1px solid #FECACA',
                            }}
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}

                    {!isUser && m.matchedProducts && m.matchedProducts.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {m.matchedProducts.map((mp, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderRadius: '99px',
                              backgroundColor: '#EFF6FF',
                              color: '#2563EB',
                              border: '1px solid #BFDBFE',
                            }}
                          >
                            {mp.product_name} ({(mp.score * 100).toFixed(0)}%)
                          </span>
                        ))}
                      </div>
                    )}

                    <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              )
            })}
            {loading && (
              <div className="text-[10px] text-gray-400 italic px-2">AI đang trả lời...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="p-4 bg-white border-t border-gray-100 z-20" style={{ flexShrink: 0 }}>
            {imagePreview && (
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                  }}
                />
                <button onClick={clearImage} className="text-gray-400 hover:text-red-500 transition-colors">
                  <XCircle size={18} />
                </button>
              </div>
            )}

            <div
              className="flex items-center gap-2 bg-[#F3F4F6] px-4 py-1 border border-transparent focus-within:border-gray-200 focus-within:bg-white transition-all"
              style={{ borderRadius: '30px' }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                title="Gửi ảnh sản phẩm"
                className="text-gray-400 hover:text-[#E62026] transition-colors p-1 shrink-0"
              >
                <Paperclip size={18} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={imageFile ? 'Thêm câu hỏi về ảnh (tuỳ chọn)...' : 'Nhập câu hỏi...'}
                className="flex-1 bg-transparent border-none outline-none text-sm py-3 text-gray-700"
              />

              <button
                onClick={handleSend}
                className="text-[#E62026] hover:scale-110 transition-transform p-1"
              >
                <SendHorizonal size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
