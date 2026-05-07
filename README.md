<div align="center">


# 🎓 Saboo Siddik Student Hub

**Centralized academic dashboard for MHSS College of Engineering students**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Supabase](https://img.shields.io/badge/Supabase-Storage-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Gemini](https://img.shields.io/badge/Gemini_1.5-Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)

</div>

---

## Overview

Saboo Siddik Student Hub is a student-built academic platform for MHSS College of Engineering. It provides a centralized dashboard where students can access shared notes, upload study materials, and interact with an AI-powered oracle for academic queries — all behind secure Google authentication.

## 🚀 The Ultimate Saboo Siddik Student Hub — Full Roadmap

### Phase 1: The Core ✅ `SHIPPED`

> Foundation locked. Notes + AI Oracle live and operational.

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 1 | **📚 Exam-Prep-Sync (Notes Vault)** | Semester-wise, subject-wise verified notes & previous year question papers — decentralized repository with upload support via Supabase | ✅ Done |
| 2 | **🤖 AI Oracle (Campus Bot)** | Gemini 1.5 Flash RAG chatbot — answers queries 24x7 based on college documents, timetables, and notes | ✅ Done |
| — | **🔐 Google Authentication** | Secure sign-in via Firebase Auth with admin/student role separation | ✅ Done |
| — | **🎨 Modern UI** | Framer Motion animations, responsive Tailwind CSS, dark theme | ✅ Done |

---

### Phase 2: Connectivity & Utilities 🔧 `UP NEXT`

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 3 | **🤝 Campus Collab (Project Matchmaker)** | Tinder-style swipe UI — students match for projects based on skills (Python, Blockchain, ML, etc.) | 🔲 Planned |
| 4 | **🔍 Lost-n-Found (Smart Tracker)** | AI-powered portal that auto-matches "Lost" and "Found" items, notifies users on match | 🔲 Planned |
| 5 | **🚂 Ride-Share (Commuter Union)** | Western Line coordination system (Mira Road → Mumbai Central) for group commuting | 🔲 Planned |

---

### Phase 3: Interactive & Emotional 🎭 `THE "COOL" FACTOR`

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 6 | **📱 AR Campus Navigator** | Camera-based AR indoor navigation to find labs, seminar halls, and classrooms | 🔲 Planned |
| 7 | **🕊️ Conflict-Resolution Bot (The Diplomat)** | AI mediator — converts anonymous complaints into polite feedback, resolves group conflicts | 🔲 Planned |
| 8 | **⏳ Memory Lane (Time Capsule)** | Audio-visual snippets & voice notes that unlock on specific dates (Graduation Day, Farewell, etc.) | 🔲 Planned |

---

### Phase 4: Optimization 🧠 `PRO LEVEL`

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 9 | **🍽️ Canteen Crowd-Predictor** | IoT / Vision-based live status — shows canteen crowd density and estimated wait time | 🔲 Planned |
| 10 | **💱 Skill-Barter Marketplace** | Time-exchange platform — no money, just skills ("I teach you Cybersecurity, you teach me SQL") | 🔲 Planned |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4, Framer Motion |
| Auth | Firebase Authentication (Google Sign-In) |
| Database & Storage | Supabase |
| AI | Google Gemini 1.5 Flash (`@google/genai`) |

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- Firebase project with Google Auth enabled
- Supabase project with storage bucket
- Gemini API key

### Installation

```bash
git clone https://github.com/Drago1314/saboo-siddik-student-hub.git
cd saboo-siddik-student-hub
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key
```

> Firebase and Supabase configs are set in `src/lib/firebase.ts` and `src/lib/supabase.ts`.

### Run

```bash
npm run dev
```

App launches at `http://localhost:3000`.

## Project Structure

```
src/
├── components/
│   ├── AIOracle.tsx        # Gemini-powered Q&A interface
│   ├── Login.tsx           # Google sign-in page
│   ├── NotesRepo.tsx       # Notes browsing & search
│   └── UploadNoteModal.tsx # Upload form with metadata
├── lib/
│   ├── firebase.ts         # Firebase config & auth
│   ├── gemini.ts           # Gemini AI client setup
│   ├── supabase.ts         # Supabase client config
│   └── utils.ts            # Utility functions
├── App.tsx                 # Main app with routing & layout
├── index.css               # Global styles
└── main.tsx                # Entry point
```

## Contributors

Built by students of M.H. Saboo Siddik College of Engineering.

## License

This project is for educational purposes.
