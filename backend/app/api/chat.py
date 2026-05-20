from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post('/chat')
async def chat(request: ChatRequest):

    user_message = request.message

    return {
        "response": f"AI response for: {user_message}"
    }