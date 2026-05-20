import { useEffect, useRef } from 'react'
import { ChatMessage } from '../../types/chat'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

interface Props {
  messages: ChatMessage[]
  loading: boolean
}

export default function ChatWindow({
  messages,
  loading,
}: Props) {
  const bottomRef =
    useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, loading])

  return (
    <div className="h-full overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      {loading && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  )
}