export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  image?: string
}

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  response: string
  sources: string[]
  redirect_to_zalo: boolean
  conversation_id?: string
}