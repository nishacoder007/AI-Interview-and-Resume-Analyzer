# AI Interview & Resume Analyzer Platform (ElevateAI)

ElevateAI is a premium, full-stack MERN (MongoDB, Express, React, Node.js) SaaS-style web application designed to help candidates benchmark their CVs for Applicant Tracking Systems (ATS) and practice technical mock interview rounds graded by AI metrics.

---

## 🌟 Key Features

1.  **AI-Powered ATS Auditing:** Upload PDF resumes to parse full text, retrieve keyword compliance matches, review grammar improvements, and find best-fit career tracks.
2.  **Bespoke AI Mock Interviews:** Practice domain technical categories (MERN Stack Developer, Frontend Developer, Backend Developer) or HR behavioral boards. Questions are custom formulated, responses are tracked with word counters, and scores are graded across technical accuracy, confidence, communication, and problem-solving.
3.  **Actionable Dashboard Analytics:** Chronological score progress chart (Chart.js lines), core capability indices (Chart.js bars), and historical review logs.
4.  **Premium Glassmorphic Styling:** Vibrant violet neon gradients, fully mobile-responsive menus, and dark theme designs.
5.  **Smart Offline Fallback Engine:** Features a dual database and mockup layer that boots 100% offline out-of-the-box using local JSON file data and custom AI response models, transitioning automatically when MongoDB Atlas or OpenAI API credentials are set!

---

## 📂 Project Architecture

```text
AI-Interview-Resume-Analyzer/
├── client/                     # React Frontend (Vite)
│   ├── public/                 # Static visual assets
│   ├── src/
│   │   ├── components/         # Sidebar, Navbar, Footer, Loader, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT management)
│   │   ├── pages/              # Home, Login, Register, Dashboard, UploadResume, ResumeResult, MockInterview, InterviewResult, Profile, Settings, NotFound
│   │   ├── services/           # API (Axios wrapper with auto headers injection)
│   │   ├── index.css           # Google Fonts & Tailwind definitions
│   │   └── App.jsx             # Routes orchestration table
│   ├── tailwind.config.js      # Styling configuration presets
│   └── index.html              # HTML DOM hooks
├── server/                     # Express Backend (Node.js)
│   ├── config/                 # db.js (dynamic MongoDB vs offline JSON database)
│   ├── controllers/            # authController, resumeController, interviewController
│   ├── data/                   # local_db.json (fallback offline JSON file store)
│   ├── middleware/             # authMiddleware, uploadMiddleware
│   ├── models/                 # User schema, Resume schema, Interview schema
│   ├── routes/                 # Express API routing tables
│   ├── services/               # openaiService, mockAiService
│   ├── uploads/                # Temporary disk storage for uploaded resumes
│   └── server.js               # Entry port server listener
└── README.md                   # Setup manual
```

---

## ⚙️ Setting Up Environment Variables

### Backend (`server/.env`)
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000

# Leave MONGO_URI blank to use the local JSON database automatically!
MONGO_URI=your_mongodb_atlas_connection_string

# JWT Secret to sign authentication tokens
JWT_SECRET=ai_interview_secret_key_token_2026

# Leave OPENAI_API_KEY blank to use the high-fidelity Mock AI Simulator!
OPENAI_API_KEY=your_openai_api_key_here
```

### Frontend (`client/.env`)
Create a `.env` file in the `client` directory and add the following:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 How to Run Locally

Since PowerShell script execution might be disabled on Windows environments, always invoke command line utilities directly using batch references (**`.cmd`**) to run successfully!

### Step 1: Run the Backend
Open a terminal in the root workspace and run:
```bash
cd server
npm.cmd run dev
```
*(If nodemon is not configured, run `npm.cmd start`)*

### Step 2: Run the Frontend
Open a new terminal in the root workspace and run:
```bash
cd client
npm.cmd run dev
```

### Step 3: Open in Browser
Open your browser and visit: **`http://localhost:5173`** (or the URL displayed in the client terminal).

---

## 📡 REST API Endpoint Map

### Authentication Router (`/api/auth`)
*   `POST /register` - User registration. Returns JWT token.
*   `POST /login` - User login. Returns JWT token.
*   `GET /profile` - Fetches active profile meta details (Secured).

### Resume Router (`/api/resume`)
*   `POST /upload` - Uploads PDF resume, extracts text, calls AI matching, and stores report (Secured).
*   `GET /all` - Retrieves history lists of candidate cv logs (Secured).
*   `GET /:id` - Fetches single parsed resume audit (Secured).
*   `DELETE /:id` - Deletes single audit log and removes temporary file from server disk (Secured).

### Interview Router (`/api/interview`)
*   `POST /start` - Generates 5 customized technical questions based on target track (Secured).
*   `POST /answer` - Audits candidate typed responses and stores detailed scorecard metrics (Secured).
*   `GET /result/:id` - Fetches single mock round results (Secured).
*   `GET /history` - Fetches completed mock history logs (Secured).
