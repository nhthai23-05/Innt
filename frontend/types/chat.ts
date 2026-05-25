export type MessageRole = 'user' | 'assistant'

export interface MatchedProduct {
  product_id: string
  product_name: string
  score: number
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  image?: string
  sources?: string[]
  matchedProducts?: MatchedProduct[]
}

export interface ChatRequest {
  message: string
}

export interface ChatResponseMetadata {
  intent?: string
  image_match?: boolean
  matched_products?: MatchedProduct[]
  retrieval_strategy?: string
  retrieved_docs?: number
}

export interface ChatResponse {
  response: string
  sources: string[]
  redirect_to_zalo: boolean
  conversation_id?: string
  metadata?: ChatResponseMetadata
}