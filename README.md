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

## Features

- **🔐 Google Authentication** — Secure sign-in via Firebase Auth with admin/student role separation
- **📚 Notes Repository** — Browse, search, and download shared study materials organized by subject
- **📤 Upload Notes** — Contribute notes with metadata (subject, year, description) stored on Supabase
- **🤖 AI Oracle** — Ask academic questions and get instant answers powered by Gemini 1.5 Flash
- **🎨 Modern UI** — Smooth animations via Framer Motion, responsive Tailwind CSS design, dark theme

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
