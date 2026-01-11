import faiss
import pickle
import torch
import uvicorn
import os
import re
import numpy as np
from datetime import datetime
from typing import Optional, List
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import (
    DPRQuestionEncoder, 
    DPRQuestionEncoderTokenizer,
    BertForQuestionAnswering, 
    BertTokenizerFast
)
from peft import PeftModel

# Charger les variables d'environnement
load_dotenv()

# =========================
# CONFIGURATION
# =========================
INDEX_PATH = os.getenv("INDEX_PATH", "passage.index")
PASSAGES_PATH = os.getenv("PASSAGES_PATH", "passages.pkl")
LORA_FOLDER = os.getenv("LORA_FOLDER", ".")
DEVICE = os.getenv("DEVICE", "cuda" if torch.cuda.is_available() else "cpu")
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8000))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# =========================
# MODÈLES PYDANTIC
# =========================
class QuestionRequest(BaseModel):
    question: str
    k: int = 5
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None

class ConversationCreate(BaseModel):
    user_id: str
    title: str = "Nouvelle conversation"

class ConversationUpdate(BaseModel):
    title: str

class MessageCreate(BaseModel):
    conversation_id: str
    user_id: str
    question: str
    answer: str
    confidence: Optional[float] = None

# =========================
# STOCKAGE EN MÉMOIRE (POUR DÉMO)
# =========================
# En production, utilisez une vraie base de données
conversations_db = {}
messages_db = {}

# =========================
# 1. LOAD RETRIEVAL DATA
# =========================
print("Loading FAISS index and passages...")
index = faiss.read_index(INDEX_PATH)
with open(PASSAGES_PATH, "rb") as f:
    passages = pickle.load(f)

# =========================
# 2. LOAD DPR RETRIEVER
# =========================
print("Loading DPR Retriever...")
q_tokenizer = DPRQuestionEncoderTokenizer.from_pretrained("facebook/dpr-question_encoder-single-nq-base")
q_encoder = DPRQuestionEncoder.from_pretrained("facebook/dpr-question_encoder-single-nq-base").to(DEVICE)
q_encoder.eval()

# =========================
# 3. LOAD BERT READER (LoRA)
# =========================
print("Loading BERT Reader...")
base_reader = BertForQuestionAnswering.from_pretrained("bert-base-uncased")
r_tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")
r_model = PeftModel.from_pretrained(base_reader, LORA_FOLDER)
r_model.to(DEVICE)
r_model.eval()
print("Reader LoRA weights synchronized and loaded!")

# =========================
# 4. CORE LOGIC FUNCTIONS
# =========================
def get_short_answer(question, context):
    context = re.sub(r'<[^>]+>', '', context)
    
    inputs = r_tokenizer(
        question, 
        context, 
        return_tensors="pt", 
        truncation=True, 
        max_length=512
    ).to(DEVICE)
    
    with torch.no_grad():
        outputs = r_model(**inputs)
    
    start_logits = outputs.start_logits[0]
    end_logits = outputs.end_logits[0]

    sequence_ids = inputs.sequence_ids(0)
    for i, sid in enumerate(sequence_ids):
        if sid != 1: 
            start_logits[i] = -10000
            end_logits[i] = -10000

    start_idx = torch.argmax(start_logits).item()
    end_idx = torch.argmax(end_logits).item()
    
    confidence_score = (start_logits[start_idx] + end_logits[end_idx]).item()
    
    answer_tokens = inputs.input_ids[0][start_idx : end_idx + 1]
    answer = r_tokenizer.decode(answer_tokens, skip_special_tokens=True)
    
    return answer.strip(), confidence_score

# =========================
# 5. FASTAPI APPLICATION
# =========================
app = FastAPI(title="QueryMind API", version="1.0.0")

# Activer CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ENDPOINTS - HEALTH CHECK
# =========================
@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "QueryMind API is running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "device": DEVICE,
        "passages_count": len(passages),
        "index_size": index.ntotal
    }

# =========================
# ENDPOINTS - Q&A
# =========================
@app.post("/api/ask")
async def ask(query: QuestionRequest):
    try:
        # Step 1: Retrieval
        q_input = q_tokenizer(query.question, return_tensors="pt").to(DEVICE)
        with torch.no_grad():
            q_emb = q_encoder(**q_input).pooler_output.cpu().numpy().astype('float32')
        
        faiss.normalize_L2(q_emb)
        scores, indices = index.search(q_emb, query.k)
        
        # Step 2: Deduplicate passages
        candidate_passages = []
        seen = set()
        for i in indices[0]:
            if 0 <= i < len(passages):
                text = passages[i]
                if text not in seen:
                    candidate_passages.append(text)
                    seen.add(text)
        
        # Step 3: Reading
        results = []
        for text in candidate_passages:
            ans, score = get_short_answer(query.question, text)
            if ans and len(ans) > 0 and ans.lower() != "[cls]":
                results.append({"answer": ans, "score": score})

        if not results:
            return {
                "question": query.question,
                "answer": "No answer found.",
                "confidence_logit": 0.0
            }

        # Step 4: Pick best result
        best_result = max(results, key=lambda x: x["score"])

        return {
            "question": query.question,
            "answer": best_result["answer"],
            "confidence_logit": round(best_result["score"], 2)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

# =========================
# ENDPOINTS - CONVERSATIONS
# =========================
@app.get("/api/conversations/{user_id}")
async def get_conversations(user_id: str):
    user_conversations = [
        conv for conv in conversations_db.values() 
        if conv["user_id"] == user_id
    ]
    return sorted(user_conversations, key=lambda x: x["updated_at"], reverse=True)

@app.post("/api/conversations")
async def create_conversation(conv: ConversationCreate):
    conversation_id = f"conv_{len(conversations_db) + 1}_{datetime.now().timestamp()}"
    conversation = {
        "id": conversation_id,
        "user_id": conv.user_id,
        "title": conv.title,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    conversations_db[conversation_id] = conversation
    return conversation

@app.put("/api/conversations/{conversation_id}")
async def update_conversation(conversation_id: str, update: ConversationUpdate):
    if conversation_id not in conversations_db:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conversations_db[conversation_id]["title"] = update.title
    conversations_db[conversation_id]["updated_at"] = datetime.now().isoformat()
    return conversations_db[conversation_id]

@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    if conversation_id not in conversations_db:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Supprimer aussi les messages associés
    messages_db.pop(conversation_id, None)
    del conversations_db[conversation_id]
    return {"message": "Conversation deleted successfully"}

# =========================
# ENDPOINTS - MESSAGES
# =========================
@app.get("/api/messages/{conversation_id}")
async def get_messages(conversation_id: str):
    if conversation_id not in messages_db:
        return []
    return messages_db[conversation_id]

@app.post("/api/messages")
async def save_message(message: MessageCreate):
    if message.conversation_id not in messages_db:
        messages_db[message.conversation_id] = []
    
    new_message = {
        "id": f"msg_{len(messages_db[message.conversation_id]) + 1}",
        "conversation_id": message.conversation_id,
        "user_id": message.user_id,
        "question": message.question,
        "answer": message.answer,
        "confidence": message.confidence,
        "created_at": datetime.now().isoformat()
    }
    
    messages_db[message.conversation_id].append(new_message)
    
    # Mettre à jour la conversation
    if message.conversation_id in conversations_db:
        conversations_db[message.conversation_id]["updated_at"] = datetime.now().isoformat()
    
    return new_message

# =========================
# LANCEMENT
# =========================
if __name__ == "__main__":
    print(f"Starting QueryMind API on {API_HOST}:{API_PORT}")
    print(f" Device: {DEVICE}")
    print(f" Passages loaded: {len(passages)}")
    uvicorn.run(app, host=API_HOST, port=API_PORT)