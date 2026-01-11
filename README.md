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
- Python with FastAPI or Flask
- Hugging Face Transformers for model loading and inference
- LoRA adapters for parameter-efficient fine-tuning of the BERT reader
- DPR for retrieval (bi-encoder retriever with FAISS or similar)
- Model file: `adapter_model.safetensors` (LoRA-adapted BERT reader)

### Database
- SQL database with schema for document storage and retrieval

## Project Structure

```
ODQA/
├── frontend/                 # React application
│   ├── public/              # public assets (put screenshots here)
│   │   ├── bert_reader.png
│   │   ├── odqa.png
│   │   └── home_page.png
│   ├── src/
│   │   ├── components/      # React components (Auth, Chat, Sidebar, Header)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API and Supabase services
│   │   └── App.jsx
│   └── vite.config.js
├── backend/                  # Python backend
│   ├── main.py               # Flask/FastAPI application
│   ├── adapter_model.safetensors  # LoRA-adapted BERT reader
│   ├── tokenizer.json
│   └── requirements.txt
├── database/
│   └── schema.sql           # Database schema
└── Entrainement-validation-ODQA/  # Training notebooks
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- pip or conda

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
python main.py
```

The backend will be available at `http://localhost:5000` (or specified port).

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env.local` file with your Supabase credentials and API URL:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Features

- **User Authentication**: Sign up and login with Supabase
- **Chat Interface**: Interactive conversation with the QA system
- **Retrieval**: DPR (Dense Passage Retrieval) for candidate retrieval
- **Reader**: LoRA-fine-tuned BERT reader (`bert_reader`) for precise answer extraction
- **Conversation History**: Store and manage previous conversations

## Screenshots

<p align="center">
	<img src="./frontend/public/home_page.png" alt="Home Page" width="800" />
</p>

<p align="center">
	<img src="./frontend/public/odqa.png" alt="ODQA System" width="800" />
</p>

<p align="center">
	<img src="./frontend/public/bert_reader.png" alt="BERT Reader (LoRA)" width="800" />
</p>

## Database Setup

To initialize the database, run the schema:
```bash
psql -U your_user -d your_database -f database/schema.sql
```

## Model Training

Training and evaluation notebooks are available in `Entrainement-validation-ODQA/`:
- `Bertqa-finetuned.ipynb` - BERT model fine-tuning (LoRA)
- `models-evaluation.ipynb` - Model evaluation metrics
- `retreiver-eval.ipynb` - Retrieval component evaluation (DPR)
- `retrival final.ipynb` - Final retrieval system setup

## API Endpoints

The backend provides endpoints for:
- Question submission and answer generation
- Document retrieval and ranking (DPR)
- Conversation management

Refer to `backend/main.py` for detailed endpoint documentation.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Citation

```bash
@misc{bouhafa2025unet3plus,
	author       = {Taha Bouhafa},
	title        = {Open Domain Question Answering (ODQA)},
	year         = {2025},
	howpublished = {\url{https://github.com/Taha-bouhafa1/Open_Domain_Question_Answering}},
	note         = {GitHub repository}
}
```

## License

This project is licensed under the MIT License - see LICENSE file for details.
