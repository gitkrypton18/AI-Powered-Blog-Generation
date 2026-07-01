<div align="center">

# 🚀 AI Blog Generator

**Launch your AI content into orbit — generate, edit, and export polished blog posts in seconds.**

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-blog-woad-chi.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-5-000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com)
[![Groq](https://img.shields.io/badge/Groq-Llama_3-F55036?style=for-the-badge&logo=meta&logoColor=white)](https://console.groq.com)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br />

<img src="assets/screenshots/login-page.png" alt="AI Blog Generator — Login Page" width="800" />

<br />

*A full-stack web application that leverages AI to generate complete blog posts with images using Groq (Llama 3) and Unsplash. Users can create, edit, export, and manage AI-generated blog content with an intuitive, modern dark-themed interface.*

</div>

---

## 📐 System Architecture

Below is a simplified diagram of how the client, server, database, and AI integrations connect:

```mermaid
graph LR
    User([User]) <--> Client[React Frontend]
    Client <--> Server[Express Backend]
    Server <--> MongoDB[(MongoDB Database)]
    Server <--> Groq[Groq API - Llama 3]
    Server <--> Unsplash[Unsplash / Pollinations AI]
```

---

## ✨ Key Features

- **🤖 AI-Powered Blog Generation** - Generates complete blog posts using Llama 3 models on Groq.

  <img src="assets/screenshots/blog-generator.png" alt="Blog Generator — topic input, tone selector, and AI model configuration" width="720" />

- **🎨 AI Image Generation** - Automatically retrieves relevant images using Unsplash API search queries based on the generated title (with Pollinations AI fallback).

  <img src="assets/screenshots/ai-image-gallery.png" alt="AI Image Gallery — attached image assets fetched from Unsplash" width="720" />

- **🖼️ Image Upload** - Upload custom images from your local directory to add them to your articles.
- **✏️ Markdown Editor** - Edit blog content in a distraction-free monospace textarea with instant Markdown preview rendering.

  <img src="assets/screenshots/live-preview-editor.png" alt="Live Preview Editor — Web Preview and Studio Editor toggle with rendered article" width="720" />

- **🔄 Selected-Text AI Copilot** - Highlight any text block in the editor to rewrite, improve SEO keywords, or shift its tone using AI.
- **📤 Multiple Export Formats** - Export blogs to PDF, DOCX (Word), and Markdown.

  <img src="assets/screenshots/export-studio.png" alt="Export Studio — compile and download PDF or DOCX documents" width="720" />

- **🔐 User Authentication** - Secure signup/login with JWT-based sessions and password hashing.

  <img src="assets/screenshots/login-page.png" alt="Login Page — glassmorphism auth form with hero tagline" width="720" />

---

## 🖼️ Screenshots

<div align="center">

| Login & Onboarding | Blog Generator |
|:---:|:---:|
| <img src="assets/screenshots/login-page.png" alt="Login Page" width="400" /> | <img src="assets/screenshots/blog-generator.png" alt="Blog Generator" width="400" /> |
| **Live Preview & Editor** | **AI Image Gallery** |
| <img src="assets/screenshots/live-preview-editor.png" alt="Live Preview Editor" width="400" /> | <img src="assets/screenshots/ai-image-gallery.png" alt="AI Image Gallery" width="400" /> |
| **Export Studio** | |
| <img src="assets/screenshots/export-studio.png" alt="Export Studio" width="400" /> | |

</div>

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI rendering
- **Vite** - Build tool and development server
- **Tailwind CSS 4** - Modern CSS framework with dark-theme glassmorphism styles
- **React Router DOM 7** - Client-side routing
- **React Markdown** - Markdown preview parser
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web application framework
- **MongoDB & Mongoose** - Database storage and schema mapping
- **LangChain & Groq** - AI text generation workflows
- **pdfmake & html-to-pdfmake & jsdom** - PDF generation (pure JS, zero native dependencies)
- **@turbodocx/html-to-docx** - Word document builder (pure JS)
- **Turndown** - HTML-to-markdown conversion utility
- **Bcryptjs & Jsonwebtoken** - Hashing and authentication tokens

---

## 📁 File Structure

```
AI-Blog/
├── README.md                   # Project documentation
│
├── backend/                    # Backend server
│   ├── package.json           # Backend dependencies
│   ├── config/
│   │   └── db.js             # MongoDB connection setup
│   └── src/
│       ├── server.js         # Express server entry point
│       ├── controllers/      # Request handlers
│       │   ├── auth.controller.js
│       │   ├── blog.controller.js
│       │   ├── export.controller.js
│       │   ├── regenerate.controller.js
│       │   └── textRegeneration.controller.js
│       ├── middleware/        # Authentication middleware
│       │   └── auth.middleware.js
│       ├── models/           # Mongoose schemas
│       │   ├── blog.model.js
│       │   └── user.model.js
│       ├── routes/           # API routes
│       │   ├── auth.routes.js
│       │   └── blog.routes.js
│       ├── services/         # AI Service wrapper
│       │   └── ai.service.js
│       └── utils/            # Shared utilities
│           ├── errorHandler.js
│           └── validation.js
│
└── frontend/                  # Frontend application
    ├── package.json          # Frontend dependencies
    ├── vite.config.js        # Vite configuration
    ├── eslint.config.js      # ESLint configuration
    ├── index.html            # HTML entry point
    └── src/
        ├── main.jsx          # React entry point
        ├── App.jsx           # Main App component
        ├── index.css         # Global tailwind styles & animations
        ├── api/              # API clients
        │   ├── axios.js
        │   └── index.js
        ├── components/       # UI components
        │   ├── BlogGenerator.jsx
        │   ├── Export.jsx
        │   ├── ImageGallery.jsx
        │   ├── ProtectedRoute.jsx
        │   └── RichTextEditor.jsx
        ├── context/          # State management
        │   └── AuthContext.jsx
        └── pages/            # Page templates
            ├── Dashboard.jsx
            ├── Login.jsx
            └── Signup.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20.x)
- **MongoDB** (local server or Atlas cluster URI)
- **Groq API Key** (get one free at [console.groq.com](https://console.groq.com))
- **Unsplash Access Key** (optional, falls back to Pollinations AI if omitted)

---

### Environment Setup

#### 1. Backend Config
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/yourdb
JWT_SECRET=your_jwt_secret_token
GROQ_API_KEY=gsk_your_groq_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### 2. Frontend Config
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Run Application Locally

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start the Frontend Application**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

---

## 👥 Contributors

Created by:
- [Kalpit Nagar](https://github.com/gitkrypton18)
- [Nikhil Nagar](https://github.com/Nikhil-X-codes)
