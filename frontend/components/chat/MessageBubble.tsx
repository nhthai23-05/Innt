import { ChatMessage } from '../../types/chat'

interface Props {
  message: ChatMessage
}

export default function MessageBubble({
  message,
}: Props) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex mb-4 ${
        isUser
          ? 'justify-end'
          : 'justify-start'
      }`}
    >
      <div
        className={`
          max-w-[80%]
          px-4
          py-3
          rounded-2xl
          shadow-sm
          text-sm
          leading-relaxed
          ${
            isUser
              ? 'bg-red-500 text-white rounded-br-md'
              : 'bg-white text-gray-800 rounded-bl-md border'
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
}