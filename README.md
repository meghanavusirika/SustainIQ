# SustainIQ – ESG Intelligence Platform

A modern ESG (Environmental, Social, and Governance) intelligence platform that empowers users to analyze, compare, and benchmark companies on sustainability metrics. With AI-powered report summarization, industry benchmarking, and interactive data visualizations, SustainIQ helps organizations and individuals make informed, responsible decisions.

# Preview

![Home Page](https://github.com/meghanavusirika/SustainIQ/blob/main/Images/Screenshot%202025-07-21%20at%205.18.09%20AM.png)
![Company Search](https://github.com/meghanavusirika/SustainIQ/blob/main/Images/Screenshot%202025-07-21%20at%205.17.45%20AM.png)
![ESG Dashboard](https://github.com/meghanavusirika/SustainIQ/blob/main/Images/Screenshot%202025-07-21%20at%204.04.32%20AM.png)

## Features

- 🌱 **ESG Dashboard**: Visualize and track ESG scores and metrics for companies
- 🔍 **Company Search & Comparison**: Find and compare companies on ESG performance
- 📊 **Industry Benchmarking**: Benchmark companies against industry standards
- 🗺️ **Interactive Map**: Explore ESG data geographically
- 📰 **ESG News Feed**: Stay updated with the latest ESG-related news
- 🤖 **AI-Powered Report Summarization**: Summarize ESG reports using advanced AI
- 💬 **ESG Report Chat**: Interact with ESG reports via chat interface
- 📄 **PDF Report Parsing**: Extract and analyze data from ESG PDF reports
- ⚡ **AI ESG Risk & Prediction**: Get AI-driven risk scores and ESG trend predictions for companies

## Tech Stack

- **Frontend**: React, TypeScript, CSS Modules
- **Backend**: Node.js, Express
- **AI & NLP**: HuggingFace Transformers, Custom RAG (Retrieval-Augmented Generation)
- **Other Integrations**: News APIs, OpenCorporates API, ESG Book API, PDF Parsing Libraries

## Setup Instructions

### 1. Environment Variables

Create and configure your environment variables for both client and server as needed.

Example for server/.env:

```env
# Server Configuration
PORT=5001
```

Example for client/.env (if needed):

```env
# REACT_APP_API_URL=http://localhost:5001
```

### 2. Get API Keys

#### Hugging Face Inference API (LLMs, NLP, Summarization)
1. Create account at [Hugging Face](https://huggingface.co/)
2. Go to Settings → Access Tokens → Create new token with Read access
3. Copy the token and add to HUGGINGFACE_API_KEY in your .env

#### ESG Book API (Sustainability & ESG Data)
1. Create account at [ESG Book](https://esgbook.com/)
2. Request API access and get Client ID and Access Token
3. Add them to ESGBOOK_CLIENT_ID and ESGBOOK_ACCESS_TOKEN in .env

#### OpenCorporates API (Company & Registry Data)
1. Create account at [OpenCorporates](https://opencorporates.com/info/about_api)
2. Request an API key from the Developer section after logging in
3. Add the key to OPENCORPORATES_API_KEY in .env

#### New API
1. Go to [News API Homepage](https://newsapi.org/)
3. Register for an API key from the dashboard
4. Copy the key and add to .env as NEWS_API_KEY

### 3. Installation

Install dependencies for both the frontend and backend:

```bash
# Frontend dependencies
cd client
npm install

# Backend server dependencies
cd ../server
npm install
```

### 4. Running the Application

Start both the frontend and backend servers (in separate terminals):

**Terminal 1 - Frontend (Port 3000):**
```bash
cd client
npm start
```

**Terminal 2 - Backend (Port 5001):**
```bash
cd server
npm run build
PORT=5001 npm start
```

### 5. Access the Application

Open your browser to: `http://localhost:3000`

## Security Notes

⚠️ **Important**: Never commit the `.env` file to version control. It contains sensitive API keys and database credentials.

The `.env` file is already included in `.gitignore` to prevent accidental commits.

## Architecture

- **Frontend**: React app (TypeScript) for user interface and data visualization
- **Backend**: Express server for API endpoints, AI integration, and data processing
- **AI Services**: HuggingFace for NLP tasks (summarization, chat, etc.)
- **PDF Parsing**: Extracts ESG data from uploaded PDF reports
- **News Integration**: Fetches latest ESG news from external APIs

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make sure to add your own `.env` file (never commit them)
4. Test your changes
5. Submit a pull request

## License

MIT License
