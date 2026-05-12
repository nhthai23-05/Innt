# PHASE 3 API Documentation

## Notable Adjustments (Outside API Folder)
- Added display fields / modified pipeline response according to ChatResponse standard
- Since ChatRequest is not in JSON form (because it can include images), it is transmitted directly via form-data

## How to Run/Test
- After cloning, remember to copy `.env.example` to `.env` and paste the API KEY
- Then `docker build backend`, `compose up` will automatically run the FastAPI server in the backend container on localhost: http://localhost:8000/docs
- This is the list of HTTP methods (POST/GET) with the following endpoints:

## API Endpoints (Chỉ có POST, mấy cái GET mọi người tự xem)

### POST /api/config
**Purpose:** Change system parameters

**Example Request Body:**
```json
{
  "retrieval_strategy": "dense",
  "top_k": 6,
  "use_reranking": false,
  "use_query_enhancement": false
}
```

**Response:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "retrieval_strategy": "dense",
  "top_k": 6,
  "use_reranking": false,
  "use_query_enhancement": false
}
```
- **Response Headers:**
  - access-control-allow-credentials: true
  - content-length: 92
  - content-type: application/json
  - date: Fri,08 May 2026 08:00:30 GMT
  - server: uvicorn

### POST /api/index/rebuild
**Purpose:** Update the vector database (delete old, create new)

**Response:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "status": "success",
  "message": "Index rebuilt successfully with 24 documents",
  "indexed_documents": 24
}
```
- **Response Headers:**
  - access-control-allow-credentials: true
  - content-length: 100
  - content-type: application/json
  - date: Fri,08 May 2026 08:13:35 GMT
  - server: uvicorn

### POST /api/chat
**Purpose:** Receive customer query input, config can be predefined or updated via POST /api/config

**Response:**
- **Status Code:** 200
- **Response Body:**
```json
{
  "response": "Chào quý khách,\n\nRất tiếc, tôi không thể báo giá trực tiếp \"túi giấy\" là bao nhiêu tiền ngay tại đây được ạ. Thông tin về giá cả không được cung cấp trong các tài liệu tham khảo của tôi (Tài liệu 1, 2, 3 về túi giấy Kraft).\n\nGiá của túi giấy thường phụ thuộc vào nhiều yếu tố như:\n*   Loại túi giấy (Túi giấy Kraft cỡ nhỏ, cỡ trung, cỡ lớn).\n*   Số lượng đặt hàng (tối thiểu 1000 chiếc cho các loại túi giấy Kraft).\n*   Chất liệu giấy, định lượng giấy (ví dụ: 100g/m2 - 200g/m2 tùy loại túi).\n*   Số lượng màu in (in offset/flexo 1 đến 4 màu).\n*   Yêu cầu thiết kế riêng và gia công",
  "sources": [
    "Túi giấy Kraft cỡ nhỏ (Size S)",
    "Túi giấy Kraft cỡ trung (Size M)",
    "Túi giấy Kraft cỡ lớn (Size L)",
    "Phong bì A4 (Phong bì hồ sơ)",
    "Tờ gấp đôi (A4 trải - Gấp đôi A5)",
    "Phong bì A5"
  ],
  "redirect_to_zalo": false,
  "zalo_link": null,
  "conversation_id": "string",
  "metadata": {
    "llm_name": "models/gemini-2.5-flash",
    "retrieval_strategy": "dense",
    "retrieved_docs": 6,
    "use_rerank": false,
    "use_query_enhancement": false,
    "intent": "general",
    "top_k": 6
  }
}
```
- **Response Headers:**
  - access-control-allow-credentials: true
  - content-length: 1249
  - content-type: application/json
  - date: Fri,08 May 2026 08:09:24 GMT
  - server: uvicorn 

