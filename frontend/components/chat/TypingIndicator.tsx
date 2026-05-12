export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div
        className="
          bg-white
          border
          px-4
          py-3
          rounded-2xl
          shadow-sm
        "
      >
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>

          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>

          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  )
}