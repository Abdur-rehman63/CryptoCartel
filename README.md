# Crypto Cartel Transparency Platform

A premium, institutional-grade transparency portal for crypto spot trading transparency. This platform allows administrators to manage portfolios and provides clients with real-time visibility into their investments, trade history, and performance metrics.

![Dashboard Preview](frontend/public/images/hero-dashboard.png)

## 🚀 Key Features

### For Clients
- **Real-time Dashboard**: Live overview of total balance, ROI, and active trades.
- **My Coins**: Detailed breakdown of held assets with quantity and current value.
- **Live Price Updates**: Integration with CoinGecko API for real-time market data.
- **Performance Reports**: Detailed reports on personal trading performance.
- **Announcements**: Receive important updates directly from the admin team.

### For Administrators
- **Client Management**: Full CRUD capabilities for managing client accounts.
- **Global Portfolio**: Overview of all managed funds and unified trade management.
- **Spot Trading Logic**: Optimized for spot workflows (Buy/Sell logic, auto-quantity calculation).
- **Transparency Tools**: Post announcements and updates to all clients instantly.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with a custom dark/premium theme
- **State Management**: React Hooks & Context
- **Testing**: Jest & React Testing Library

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (Production) / SQLite (Dev)
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
- **Validation**: Pydantic models
- **Testing**: Pytest

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (Optional, defaults to SQLite for dev)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python3 main.py
```
The API will be available at `http://0.0.0.0:8000`.
Documentation is available at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env if needed (default API URL is http://127.0.0.1:8000)

# Start development server
npm run dev
```
The application will be available at `http://localhost:3001` (or next available port).

## 🔒 Security

- **JWT Authentication**: Secure, stateless session management.
- **Session Persistence**: Auto-restore sessions on reload.
- **RBAC**: Strict separation between Admin and Client routes.
- **Environment Variables**: Sensitive configuration handled via `.env` files.

## 🧪 Testing

### Backend Tests
```bash
cd backend
python3 tests/test_auth_flow.py
python3 tests/test_e2e_user_management.py
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📜 License
Private & Confidential.
