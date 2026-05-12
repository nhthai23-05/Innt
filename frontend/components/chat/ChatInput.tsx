import { useState } from 'react'

interface Props {
  onSend: (message: string) => void
  loading: boolean
}

export default function ChatInput({ onSend, loading }: Props) {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (!message.trim() || loading) return

    onSend(message)
    setMessage('')
  }

  return (
    <div className="border-t p-4 flex gap-2">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit()
          }
        }}
        placeholder="Ask something..."
        className="flex-1 border rounded-xl px-4 py-2 outline-none"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 rounded-xl"
      >
        Send
      </button>
    </div>
  )
}