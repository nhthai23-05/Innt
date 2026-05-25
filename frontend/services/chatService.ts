/// <reference types="vite/client" />
import { ChatResponse } from '../types/chat'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export const sendMessage = async (
  message: string,
  imageFile?: File,
): Promise<ChatResponse> => {
  const form = new FormData()
  form.append('message', message)
  if (imageFile) {
    form.append('image', imageFile, imageFile.name)
  }

  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    throw new Error(`Lỗi kết nối server (${res.status})`)
  }

  return res.json()
}