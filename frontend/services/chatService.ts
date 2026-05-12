import axios from 'axios'
import { ChatResponse } from '../types/chat'

const API_URL = 'http://localhost:8000/api/chat'

export const sendMessage = async (
  message: string
): Promise<ChatResponse> => {
  const response = await axios.post(API_URL, {
    message,
  })

  return response.data
}