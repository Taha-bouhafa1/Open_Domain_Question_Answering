# ODQA — Open Domain Question Answering

<p align="center">
	<img src="https://img.shields.io/badge/Status-Active-brightgreen" />
	<img src="https://img.shields.io/badge/Python-3.8%2B-blue" />
	<img src="https://img.shields.io/badge/PyTorch-2.1.2-red" />
	<img src="https://img.shields.io/badge/HuggingFace-Transformers-orange" />
	<img src="https://img.shields.io/badge/Frontend-React-blueviolet" />
	<img src="https://img.shields.io/badge/License-MIT-grey" />
</p>

## Overview

ODQA answers natural-language questions by retrieving relevant passages from a large document collection (e.g., Wikipedia) and extracting concise answers via a reader model. The pipeline is:

- Retriever — DPR (Dense Passage Retrieval) to produce candidate passages
- Reader — LoRA-fine-tuned BERT (`bert_reader`) to extract answer spans

<p align="center">
  <img src="https://raw.githubusercontent.com/Taha-bouhafa1/Open_Domain_Question_Answering/main/odqa.png" alt="ODQA System Overview" width="800" />
</p>

## Components

### Retriever (DPR + FAISS)

- Dense bi-encoder (facebook/dpr) to encode queries and passages
- FAISS for efficient nearest-neighbor search over passage embeddings

### Reader (BERT + LoRA)

- Base model: `bert-base-uncased` with PEFT/LoRA adapters applied
- Responsible for span extraction and confidence scoring

<p align="center">
  <img src="https://raw.githubusercontent.com/Taha-bouhafa1/Open_Domain_Question_Answering/main/bert_reader.png" alt="BERT Reader Architecture" width="700" />
</p>

### Frontend (Web App)

- React + Vite for the UI
- Tailwind CSS for styling
- Supabase for authentication and (optional) storage

<p align="center">
  <img src="https://raw.githubusercontent.com/Taha-bouhafa1/Open_Domain_Question_Answering/main/home_page.png" alt="Web App Home Page" width="700" />
</p>

## Tech Stack

- Frontend: React 18+, Vite, Tailwind CSS
- Backend: FastAPI, Uvicorn
- ML: PyTorch (torch==2.1.2), Hugging Face Transformers, PEFT (LoRA), sentencepiece
- Vector search: FAISS
- Utilities: numpy, safetensors, accelerate

See `backend/requirements.txt` for exact versions.

## Project Layout

```
ODQA/
├── frontend/
│   ├── public/               # Static assets & screenshots
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/         # LoginForm, SignUpForm, AuthPage, WelcomeSetup
│   │   │   ├── Chat/         # ChatInterface, InputBox, MessageBubble, MessageList
│   │   │   ├── Header/       # WelcomeHeader
│   │   │   └── Sidebar/      # Sidebar, ConversationList, UserProfile
│   │   ├── hooks/            # useAuth.js, useConversations.js
│   │   ├── services/         # api.js, supabase.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── eslint.config.js
├── backend/
│   ├── main.py               # FastAPI app, endpoints (/api/ask, /api/conversations, /api/messages)
│   ├── requirements.txt       # Python dependencies (torch, transformers, PEFT, FAISS, etc.)
│   ├── adapter_model.safetensors  # LoRA-adapted BERT reader weights
│   ├── tokenizer.json        # BERT tokenizer config
│   ├── tokenizer_config.json
│   ├── vocab.txt
│   ├── special_tokens_map.json
│   └── adapter_config.json   # LoRA adapter config
├── database/
│   └── schema.sql            # SQL schema for user, conversation, message tables
├── Entrainement-validation-ODQA/
│   ├── Bertqa-finetuned.ipynb      # BERT reader fine-tuning (LoRA)
│   ├── models-evaluation.ipynb      # Evaluation metrics
│   ├── retreiver-eval.ipynb         # Retriever (DPR) evaluation
│   └── retrival final.ipynb         # Final retrieval system setup
├── question_chat.json        # Sample Q&A data / config
├── eslint.config.js
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── package.json
├── README.md                 # This file
└── .gitignore
```

**Key files:**
- `backend/main.py` — FastAPI server with DPR retriever, BERT reader, conversation management
- `backend/adapter_model.safetensors` — LoRA-adapted BERT weights for answer extraction
- `frontend/src/App.jsx` — React root component
- `database/schema.sql` — Database initialization script

## Quickstart

Backend (Linux/macOS):

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

Backend (Windows PowerShell):

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Environment variables used by the services (example):

- `INDEX_PATH`, `PASSAGES_PATH`, `LORA_FOLDER`, `API_HOST`, `API_PORT`, `CORS_ORIGINS`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`

## API (summary)

- `GET /` — health/status
- `POST /api/ask` — submit question (body: `question`, `k`, optional `conversation_id`, `user_id`) → returns best answer + confidence
- Conversation and message endpoints under `/api/conversations` and `/api/messages` (see `backend/main.py`)

## Model & Data

- Model weights: `adapter_model.safetensors` (LoRA-adapted reader) in `backend/`
- Tokenizers: `tokenizer.json` / `tokenizer_config.json`
- Passages index: FAISS index file (default `passage.index`) and `passages.pkl`

Training and evaluation notebooks are in `Entrainement-validation-ODQA/`.

## Contributing

1. Fork the repo
2. Create branch `feature/your-feature`
3. Add tests / update notebooks
4. Open a Pull Request

## Citation

```bibtex
@misc{bouhafa2025unet3plus,
	author       = {Taha Bouhafa},
	title        = {Open Domain Question Answering (ODQA)},
	year         = {2025},
	howpublished = {\url{https://github.com/Taha-bouhafa1/Open_Domain_Question_Answering}},
	note         = {GitHub repository}
}
```

## License

MIT — see `LICENSE`


