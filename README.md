# AI Resume Ecosystem

An AI-powered resume management platform that helps you build, analyze, and optimize resumes for Applicant Tracking Systems (ATS). Features intelligent resume scoring, job description matching, and automated cover letter generation — all powered by Google Gemini AI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, Framer Motion, CSS Modules |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **AI** | Google Gemini 2.5 Flash |
| **Auth** | JWT (cookie-based), Passport.js (Google + GitHub OAuth) |
| **File Parsing** | pdf-parse, mammoth (DOCX) |

## Features

- **Resume Builder** — Create resumes with a structured form (personal info, experience, education, skills, projects, certifications)
- **Resume Upload** — Upload PDF/DOCX files with automatic text extraction
- **ATS Analysis** — AI-powered ATS scoring with section-by-section feedback, strengths, weaknesses, and improvement suggestions
- **JD Matching** — Compare your resume against a job description to find matched/missing keywords
- **Cover Letter Generation** — AI-generated, tailored cover letters based on your resume and target JD
- **Template Selection** — Choose from Modern, Classic, or Minimal resume templates
- **Dashboard** — Centralized view with real-time stats, context-aware quick actions, and recent analysis feed
- **Auth** — Local registration/login + Google and GitHub OAuth

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or Atlas)
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/app/apikey)
- *(Optional)* Google OAuth and GitHub OAuth credentials

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Dhairya2716/AI-Resume-Ecosystem.git
cd AI-Resume-Ecosystem
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see `server/.env.example`):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resume-ecosystem
JWT_SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
CLIENT_URL=http://localhost:5173
PORT=5000

# Optional: OAuth providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Start the server:

```bash
npm start
```

The API will run at `http://localhost:5000`.

### 3. Set up the frontend

```bash
cd client
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

## Project Structure

```
AI-Resume-Ecosystem/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── api/               # API service wrappers (resumeService, atsService)
│       ├── components/
│       │   ├── dashbaord/     # Dashboard components (Sidebar, StatCard, Modals, etc.)
│       │   ├── shared/        # Shared UI components
│       │   └── ...
│       ├── context/           # AuthContext (session management)
│       ├── pages/             # Route pages (Dashboard, ATS, JD, CoverLetter, etc.)
│       │   └── resume/        # Resume CRUD pages (Create, Edit, View, MyResume)
│       ├── routes/            # AppRoutes, ProtectedRoute
│       └── services/          # Axios instance
│
├── server/                    # Express.js backend
│   ├── config/                # DB connection, Passport strategies
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth, upload, error middleware
│   ├── models/                # Mongoose schemas (User, Resume, ATSReport, etc.)
│   ├── routes/                # Express route definitions
│   ├── services/              # AI service (Gemini), ATS service, resume parser
│   └── server.js              # Entry point
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/resume/create` | Create resume (form or file upload) |
| `GET` | `/api/resume/my-resumes` | Get all user resumes |
| `GET` | `/api/resume/:id` | Get single resume |
| `PUT` | `/api/resume/:id` | Update resume |
| `DELETE` | `/api/resume/:id` | Delete resume |
| `POST` | `/api/resume/:id/match-jd` | Match resume to job description |
| `POST` | `/api/resume/:id/cover-letter` | Generate cover letter |
| `GET` | `/api/resume/cover-letters` | Get all cover letters |
| `POST` | `/api/ats/:resumeId/analyze` | Run detailed ATS analysis |
| `GET` | `/api/ats/reports` | Get all ATS reports |
| `GET` | `/api/ats/reports/:id` | Get single ATS report |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET_KEY` | ✅ | Secret for JWT token signing |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `CLIENT_URL` | ⚠️ | Frontend URL for CORS (default: `http://localhost:5173`) |
| `PORT` | — | Server port (default: `5000`) |
| `GOOGLE_CLIENT_ID` | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | — | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | — | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | — | GitHub OAuth client secret |

## License

MIT
