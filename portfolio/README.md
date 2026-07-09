# Sreshtha OS - Interactive Developer Portfolio

A production-grade, game-like developer portfolio built with React, TypeScript, Node.js, and Supabase.

## 🏗️ Architecture

This project follows a 3-tier architecture:

```
Frontend (React + Vite)
    ↓
Backend (Node.js + Express)
    ↓
Database (Supabase)
```

## 📁 Project Structure

```
portfolio/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
└── backend/           # Node.js + Express API
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── services/
    │   └── config/
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

npm run dev
```

The backend will run on `http://localhost:5000`

## 🎨 Features

- **Entry Screen**: Animated boot screen with navigation
- **Project Hub**: Floating project cards with glassmorphism
- **Project Details**: Deep dive into each project with interactive demos
- **Resume**: Timeline-based resume display
- **Contact**: Contact form with backend integration

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router

### Backend
- Node.js
- Express
- TypeScript
- Supabase

## 🎯 Design System

- **Theme**: Dark futuristic OS-style
- **Colors**: 
  - Background: #0B0F19
  - Primary: #8B5CF6 (Purple)
  - Accent: #F59E0B (Gold)
- **Effects**: Glassmorphism, blur, glow

## 📝 License

MIT

## 👤 Author

**Sreshtha Saxena**
- Role: Project Manager + Full Stack Developer
- Tech: React, TypeScript, Node.js, Supabase
