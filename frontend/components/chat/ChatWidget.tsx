import { useEffect, useRef, useState } from 'react'
import {
  MessageCircle,
  SendHorizonal,
  X,
  Sparkles,
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [messages, setMessages] = useState<
    ChatMessage[]
  >([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        'Hello 👋 Welcome to INNT. I’m your AI assistant and I can help you explore products, printing solutions, and packaging services.',
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState('')

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, loading])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    const currentInput = input

    setInput('')

    try {
      setLoading(true)

      // FAKE AI RESPONSE
      // Replace with your backend API later

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      )

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'Thank you for your message. Our AI assistant is currently connected successfully to the frontend UI.',
        timestamp: new Date(),
      }

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          'Something went wrong. Please try again.',
        timestamp: new Date(),
      }

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed
            bottom-6
            right-6
            z-[9999]

            w-16
            h-16

            rounded-full

            bg-gradient-to-br
            from-[#E62026]
            to-[#b31217]

            shadow-[0_20px_50px_rgba(230,32,38,0.35)]

            flex
            items-center
            justify-center

            text-white

            transition-all
            duration-300

            hover:scale-105
            hover:shadow-[0_25px_60px_rgba(230,32,38,0.45)]
          "
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Container */}
      {open && (
        <div
          className="
            fixed
            bottom-6
            right-6
            z-[9999]

            flex
            flex-col

            overflow-hidden

            rounded-[32px]

            border
            border-white/20

            bg-white/80
            backdrop-blur-2xl

            shadow-[0_20px_80px_rgba(0,0,0,0.18)]

            transition-all
            duration-300

            w-[320px]
            h-[720px]

            max-md:w-full
            max-md:h-full
            max-md:bottom-0
            max-md:right-0
            max-md:rounded-none
          "
        >
          {/* Header */}
          <div
            className="
              relative

              px-5
              py-4

              bg-gradient-to-r
              from-[#E62026]
              via-[#d11b20]
              to-[#b31217]

              text-white

              flex
              items-center
              justify-between
            "
          >
            {/* Glow */}
            <div
              className="
                absolute
                inset-0
                bg-white/10
                backdrop-blur-xl
              "
            />

            {/* Left */}
            <div className="relative flex items-center gap-3">
              {/* Avatar */}
              <div
                className="
                  w-12
                  h-12

                  rounded-full

                  bg-white/20
                  border
                  border-white/30

                  flex
                  items-center
                  justify-center

                  backdrop-blur-xl
                "
              >
                <Sparkles size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-[16px]">
                  INNT AI Assistant
                </h2>

                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-green-400
                    "
                  />

                  <p className="text-xs text-red-100">
                    Online now
                  </p>
                </div>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="
                relative

                w-10
                h-10

                rounded-full

                flex
                items-center
                justify-center

                hover:bg-white/15

                transition
              "
            >
              <X size={22} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="
              flex-1
              overflow-y-auto

              px-4
              py-5

              space-y-4

              bg-gradient-to-b
              from-[#fafafa]
              to-[#f3f4f6]
            "
          >
            {messages.map((message) => {
              const isUser =
                message.role === 'user'

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isUser
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`
                      max-w-[85%]

                      px-4
                      py-3

                      rounded-2xl

                      text-[14px]
                      leading-relaxed

                      whitespace-pre-wrap

                      shadow-sm

                      transition-all
                      duration-300

                      ${
                        isUser
                          ? `
                            bg-[#E62026]
                            text-white
                            rounded-br-md
                            shadow-[0_8px_25px_rgba(230,32,38,0.25)]
                          `
                          : `
                            bg-white
                            text-gray-800
                            rounded-bl-md
                            border
                            border-gray-100
                          `
                      }
                    `}
                  >
                    <p>{message.content}</p>

                    <div
                      className={`
                        text-[11px]
                        mt-2

                        ${
                          isUser
                            ? 'text-red-100'
                            : 'text-gray-400'
                        }
                      `}
                    >
                      {message.timestamp.toLocaleTimeString(
                        [],
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="
                    bg-white

                    border
                    border-gray-100

                    px-4
                    py-3

                    rounded-2xl
                    rounded-bl-md

                    shadow-sm
                  "
                >
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>

                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>

                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="
              p-4

              border-t
              border-gray-100

              bg-white/70
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex
                items-center
                gap-3

                bg-white

                border
                border-gray-200

                rounded-full

                px-3
                py-2

                shadow-sm
              "
            >
              <input
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend()
                  }
                }}
                placeholder="Ask something..."
                className="
                  flex-1

                  bg-transparent

                  px-2

                  text-sm

                  outline-none
                "
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="
                  w-11
                  h-11

                  rounded-full

                  bg-gradient-to-br
                  from-[#E62026]
                  to-[#b31217]

                  text-white

                  flex
                  items-center
                  justify-center

                  shadow-lg

                  transition-all
                  duration-300

                  hover:scale-105

                  disabled:opacity-50
                "
              >
                <SendHorizonal size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}