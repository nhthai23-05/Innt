import { useEffect, useRef, useState } from 'react'
import { MessageCircle, SendHorizonal, X, Sparkles } from 'lucide-react'

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  timestamp: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello 👋 Welcome to INNT. I’m your AI assistant...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = () => {
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Tôi đang xử lý yêu cầu của bạn... Vui lòng đợi giây lát.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setLoading(false)
    }, 1000)
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#E62026] shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform">
          <MessageCircle size={28} />
        </button>
      )}

      {open && (
        <div 
          className="fixed bottom-6 right-6 z-[9999] flex flex-col bg-white shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-300"
          style={{
            width: '400px',         
            height: '600px',        // 1. CHIỀU CAO CỐ ĐỊNH CHO KHUNG TỔNG
            maxHeight: 'calc(100vh - 40px)', 
            borderRadius: '24px',   
            overflow: 'hidden',     
            display: 'flex',        
            flexDirection: 'column' // Xếp theo chiều dọc: Header -> Chat -> Input
          }}
        >
          {/* --- HEADER --- */}
          <div 
            className="bg-[#E62026] p-5 text-white flex items-center justify-center relative" 
            style={{ flexShrink: 0, minHeight: '70px' }} 
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
                <Sparkles size={18} />
              </div>
              <span className="font-bold text-base tracking-wide">
                INNT AI Assistant
              </span>
            </div>

            {/* Nút X được đặt absolute để không chiếm không gian, giúp chữ căn giữa tuyệt đối */}
            <button 
              onClick={() => setOpen(false)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/10 p-2 rounded-full cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* --- VÙNG CHAT: PHẦN DUY NHẤT ĐƯỢC PHÉP CUỘN --- */}
          <div 
            className="flex-1 overflow-y-auto p-4 bg-[#fcfcfc] custom-scrollbar" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '15px',
              minHeight: 0, // QUAN TRỌNG: Để thanh cuộn hoạt động trong Flexbox
              overflowY: 'auto' // HIỆN THANH CUỘN KHI TIN NHẮN DÀI
            }}
          >
            {messages.map((m) => {
              const isUser = m.role === 'user'
              return (
                <div 
                  key={m.id} 
                  className="w-full flex" 
                  style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }} // TIN NHẮN NGƯỜI DÙNG SANG PHẢI
                >
                  <div 
                    className="flex flex-col" 
                    style={{ maxWidth: '85%', alignItems: isUser ? 'flex-end' : 'flex-start' }}
                  >
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
                    <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              )
            })}
            {loading && <div className="text-[10px] text-gray-400 italic px-2">AI đang trả lời...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* --- THANH NHẬP LIỆU: KHÓA CHẶT Ở ĐÁY (flex-shrink-0) --- */}
          <div 
            className="p-4 bg-white border-t border-gray-100 z-20"
            style={{ flexShrink: 0 }} // ĐẢM BẢO KHÔNG BỊ TRÔI THEO TIN NHẮN
          >
            <div 
              className="flex items-center gap-2 bg-[#F3F4F6] px-4 py-1 border border-transparent focus-within:border-gray-200 focus-within:bg-white transition-all"
              style={{ borderRadius: '30px' }} 
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập câu hỏi..."
                className="flex-1 bg-transparent border-none outline-none text-sm py-3 text-gray-700"
              />
              <button onClick={handleSend} className="text-[#E62026] hover:scale-110 transition-transform p-1">
                <SendHorizonal size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}