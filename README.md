# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
<h1 align="center">
	ODQA - Open Domain Question Answering
</h1>

<p align="center">
	<img src="https://img.shields.io/badge/Status-Active-brightgreen" />
	<img src="https://img.shields.io/badge/Python-3.8%2B-blue" />
	<img src="https://img.shields.io/badge/HuggingFace-Transformers-orange" />
	<img src="https://img.shields.io/badge/Frontend-React-blueviolet" />
	<img src="https://img.shields.io/badge/License-MIT-grey" />
</p>

An intelligent question-answering system that retrieves relevant documents (for example, Wikipedia) and generates accurate answers from those sources. This project combines Dense Passage Retrieval (DPR) for fast, accurate retrieval with a LoRA-fine-tuned BERT reader (`bert_reader`) for answer extraction.

## Project Overview

ODQA is a full-stack application that allows users to ask questions and receive contextual answers powered by:

- **DPR (Dense Passage Retrieval)** for candidate passage retrieval
- **BERT reader fine-tuned with LoRA** (`bert_reader`) for answer extraction
- **React frontend** with chat-like UI and Supabase authentication
- **Python backend** (FastAPI/Flask) serving the model and retrieval APIs

<p align="center">
	<img src="https://raw.githubusercontent.com/Taha-bouhafa1/Open_Domain_Question_Answering/main/odqa.png" alt="ODQA System screenshot" width="900" />
	<br/>
	<em>System overview: retrieval + reader pipeline</em>
</p>

### BERT Reader (LoRA)

The BERT reader is fine-tuned using LoRA adapters to efficiently adapt the base `bert-base-uncased` model without full-weight updates. It performs answer extraction over retrieved passages.

<p align="center">
	<img src="https://raw.githubusercontent.com/Taha-bouhafa1/Open_Domain_Question_Answering/main/bert_reader.png" alt="BERT Reader architecture" width="700" />
</p>

### Web App (Home Page)

The React frontend provides the chat UI, authentication and conversation management. Example home page:

<p align="center">
	<img src="https://raw.githubusercontent.com/Taha-bouhafa1/Open_Domain_Question_Answering/main/home_page.png" alt="Web App Home Page" width="700" />
</p>

## Tech Stack

### Frontend
- React 18+ with Vite
- Tailwind CSS for styling
- Supabase for authentication and backend integration
- ESLint for code quality

### Backend
# ODQA - Open Domain Question Answering

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" />
  <img src="https://img.shields.io/badge/Python-3.8%2B-blue" />
  <img src="https://img.shields.io/badge/PyTorch-2.1.2-red" />
  <img src="https://img.shields.io/badge/HuggingFace-Transformers-orange" />
  <img src="https://img.shields.io/badge/Frontend-React-blueviolet" />
  <img src="https://img.shields.io/badge/License-MIT-grey" />
</p>

An intelligent question-answering system that retrieves relevant documents (for example, Wikipedia) and generates concise, contextual answers. The system combines Dense Passage Retrieval (DPR) for retrieval with a LoRA-fine-tuned BERT reader (`bert_reader`) for answer extraction.

## Project Overview

ODQA is a full‑stack application that lets users ask natural-language questions and receive answers sourced from a large document collection (e.g., Wikipedia).

- DPR (Dense Passage Retrieval) for candidate passage retrieval
- BERT reader fine-tuned with LoRA for answer extraction
- React frontend with chat UI and Supabase authentication
- Python backend (FastAPI) serving retrieval and reader APIs

Illustration (1): ODQA system overview — https://raw.githubusercontent.com/Taha-bouhafa1/Open_Domain_Question_Answering/main/odqa.png

---

### BERT Reader (LoRA)

The reader uses `bert-base-uncased` with LoRA adapters (PEFT) applied to adapt the model efficiently without full fine-tuning. It scores and extracts short-span answers from retrieved passages.

Illustration (2): BERT reader architecture — https://raw.githubusercontent.com/Taha-bouhafa1/Open_Domain_Question_Answering/main/bert_reader.png

---

### Web App (Home Page)

The React frontend provides the chat interface, conversation history, and links to saved results. It calls backend endpoints for retrieval and reading.

Illustration (3): Web app home page — https://raw.githubusercontent.com/Taha-bouhafa1/Open_Domain_Question_Answering/main/home_page.png

---

## Tech Stack

### Frontend
- React 18+ with Vite
- Tailwind CSS
- Supabase (auth + storage)

### Backend / ML
- Python 3.8+
- FastAPI + Uvicorn
- PyTorch (torch==2.1.2)
- Hugging Face Transformers
- PEFT / LoRA adapters
- DPR retriever (facebook/dpr) + FAISS for vector search

### Database
- SQL schema in `database/schema.sql`

## Project Structure

```
ODQA/
├── frontend/                 # React application
├── backend/                  # FastAPI + model code
├── database/                 # SQL schema
└── Entrainement-validation-ODQA/  # Training & evaluation notebooks
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
# Windows
venv\\Scripts\\activate
# Unix
# source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Features

- DPR-based retrieval of candidate passages
- LoRA-fine-tuned BERT reader for answer extraction
- Conversation history and user auth via Supabase

## Citation

```bash
@misc{bouhafa2025unet3plus,
  author       = {Taha Bouhafa},
  title        = {Open Domain Question Answering (ODQA)},
  year         = {2025},
  howpublished = {\\url{https://github.com/Taha-bouhafa1/Open_Domain_Question_Answering}},
  note         = {GitHub repository}
}
```

## License

This project is licensed under the MIT License - see LICENSE file for details.

