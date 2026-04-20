# Step 1: Setup (3 min)
create conda
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
or 
pip install torch --index-url https://download.pytorch.org/whl/cpu (if you do not have GPU)

pip install -r backend/requirements.txt

# Step 2: Configure (1 min)
cp backend/.env.example backend\.env
# Edit .env: add RAG_GEMINI_API_KEY=your_key_here

# Step 3: Build index (10 min)
python -m app.indexing.indexer --rebuild

# Step 4: Test RAG (2 min)
python test_rag.py

# Step 5: Start API server (new terminal)
cd backend
uvicorn app.main:app --reload --port 8000
(not active yet)
