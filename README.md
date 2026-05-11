# Privacy Risk Scanner

Privacy Risk Scanner is a Chrome extension project designed to analyze websites’ privacy policies and Terms of Service using AI.

The goal of the project is to provide users with a clear and accessible privacy risk score based on how websites collect, store, share, and use personal data.

---

# Project Goals

The project aims to:

- Analyze privacy policies and Terms of Service automatically
- Detect potentially abusive or risky clauses
- Generate a privacy risk score
- Provide understandable summaries for non-technical users
- Store analysis history for future comparison
- Offer a modern browser extension experience
- Prepare a scalable AI-powered architecture

---

# Current State of the Project

The project is currently in its initial development phase.

Implemented features:

- Chrome extension initialized with Plasmo
- React + TypeScript setup
- TailwindCSS integration
- Docker monorepo architecture
- PostgreSQL and Redis services prepared
- Extension popup UI
- Active tab URL detection

Planned features:

- AI privacy policy analysis
- Backend API with FastAPI
- Analysis queue with Redis + Celery
- PostgreSQL storage
- History dashboard with React / Next.js
- Privacy score engine
- Risk comparison between websites
- Structured AI outputs

---

# Project Architecture

```text
privacy-risk-scanner/
│
├── apps/
│   ├── extension/     # Chrome extension (Plasmo)
│   ├── backend/       # FastAPI backend
│   ├── worker/        # Celery workers
│   └── frontend/      # React / Next.js dashboard
│
├── packages/
│   ├── prompts/
│   ├── scoring-engine/
│   ├── shared-types/
│   └── shared-config/
│
├── infra/
│
├── docker-compose.yml
└── README.md
```

---

# Technologies Used

## Frontend

- React
- TypeScript
- TailwindCSS
- Plasmo

## Backend

- FastAPI
- SQLAlchemy
- Celery

## Infrastructure

- Docker
- Docker Compose
- PostgreSQL
- Redis
- Nginx

## AI

- OpenAI API
- Structured outputs
- Prompt engineering

---

# Installation

## Requirements

- Node.js 22+
- npm
- Docker
- Docker Compose
- Google Chrome

---

# Clone the Repository

```bash
git clone <repository-url>
cd privacy-risk-scanner
```

---

# Start Docker Services

```bash
docker compose up --build
```

This starts:

- PostgreSQL
- Redis
- Backend placeholder
- Worker placeholder
- Frontend placeholder

---

# Extension Setup

Go to the extension folder:

```bash
cd apps/extension
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

# Load the Extension in Chrome

Open:

```text
chrome://extensions
```

Then:

1. Enable "Developer mode"
2. Click "Load unpacked"
3. Select:

```text
apps/extension/build/chrome-mv3-dev
```

---

# Current Extension Features

The extension currently:

- Displays a popup UI
- Uses TailwindCSS styling
- Detects the currently opened website URL
- Prepares the future privacy analysis workflow

---

# Example Current Popup

```text
Privacy Risk Scanner

Current website:
https://example.com
```

---

# Development Roadmap

## Phase 1

- Extension initialization
- Popup UI
- URL detection
- Tailwind integration

## Phase 2

- Website analysis button
- Mock privacy scoring
- Backend API integration

## Phase 3

- AI analysis engine
- Structured legal clause extraction
- PostgreSQL persistence
- Redis queue system

## Phase 4

- User dashboard
- Analysis history
- Website comparison
- Statistics and analytics

---

# Security & Privacy

The extension is designed to analyze website legal documents only.

The project does not aim to track user browsing behavior.

Future versions will:

- Minimize collected data
- Avoid storing unnecessary personal information
- Use secure API communication
- Respect GDPR principles

---

# Contributing

The project architecture is designed for scalability and modularity.

Contributions, architecture suggestions, and improvements are welcome.

---

# License

MIT License