# eCitizenHub - County Digital Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-indigo.svg)](https://www.prisma.io/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-purple.svg)](https://vitejs.dev/)
[![MUI](https://img.shields.io/badge/Material--UI-v6-blueviolet.svg)](https://mui.com/)

**eCitizenServiceHub** is a clean, county-level digital public services and community issue reporting platform built for **Murang'a County**. It provides a transparent bridge between citizens and local government operations without unnecessary enterprise complexity.

---

## 🏛️ System Structure

The system has strictly two user-facing experiences:

1. **Citizen Portal (`/` and `/portal/*`)**
   - **Service Directory & Catalog:** Detailed catalog of 8 county municipal service areas with standard resolution benchmarks.
   - **Community Issue Reporting & Requests:** Guided multi-step form supporting title, description, location name, ward selection, optional GPS coordinates via an interactive map, and file attachments.
   - **Reference Number Generation:** Instant generation of unique reference numbers (e.g. `CSR-2026-0001`).
   - **Citizen Dashboard:** Real-time visibility into submitted requests with status tabs (`ALL`, `IN_PROGRESS`, `AWAITING_CITIZEN`, `RESOLVED`, `REJECTED`).
   - **Interactive Tracking:** Full workflow timeline, citizen-visible administrative updates, info request responses, resolution feedback with star ratings, and dispute reopening.
   - **Public Issue Map:** Anonymized geographic map centered on Murang'a County (`[-0.7210, 37.1520]`) with zero personal citizen details exposed.
   - **AI Citizen Assistant:** Multilingual assistant (English & Kiswahili) recommending the most appropriate county category, drafting clear descriptions, and clarifying status terms.

2. **Administrator Portal (`/admin/*`)**
   - **Operations Dashboard:** Balanced 4-card high-level metric grid (*Total Logged*, *Active Work Queue*, *Action Required*, *Resolved & Closed*), secondary status breakdown pill bar, average resolution time, and citizen satisfaction ratings.
   - **Request Inbox & Queue:** Multi-filter inbox (search by reference, citizen name, keyword, category, priority, and status).
   - **Request Processing Workspace:** Priority adjustment, category correction, valid status transition enforcement, citizen-visible updates vs. strictly private internal notes, requesting info, rejection with reason, and resolution with documented actions taken.
   - **Geographic County Map:** Interactive Leaflet map displaying active county requests by location and priority.
   - **Category Management:** View and manage municipal service categories.
   - **Operational Reports:** Export filtered request data to CSV for county reporting.

---

## 🔒 Security & Role Enforcement

- **Strict Two-Role System (`CITIZEN` and `ADMIN`):** Administrator privileges cannot be granted through public registration. Public signup assigns only the `CITIZEN` role.
- **Prebuilt Administrator Account:** Administrator accounts are pre-seeded at database initialization and cannot be self-registered.
- **Privacy Enforcement:** Citizens can only query their own requests. Internal administrative notes and audit logs are stripped at the database layer from citizen responses.
- **Workflow State Machine:** Enforces valid status transitions:
  `SUBMITTED → UNDER_REVIEW → IN_PROGRESS → AWAITING_CITIZEN → IN_PROGRESS → RESOLVED → CLOSED`, with support for `ON_HOLD`, `REJECTED`, and `REOPENED`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL |
| **Frontend** | React 18, TypeScript, Vite, Material-UI (MUI v6), React Router v7 |
| **State & Data Fetching** | TanStack React Query v5, Zustand v5, Axios |
| **Mapping & UI** | Leaflet, React-Leaflet |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing |
| **File Uploads** | Multer with MIME-type and file-size validation |

---

## 📁 Project Directory Structure

```text
eCitizen/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema and models
│   │   ├── seed.ts             # Clean production seed (Admin + 8 Categories)
│   │        
│   ├── src/
│   │   ├── config/             # Environment configuration (Port 5600)
│   │   ├── controllers/        # Request handling logic
│   │   ├── middlewares/        # Auth, rateLimiter, upload, validation
│   │   ├── routes/             # Modular REST API endpoints
│   │   ├── utils/              # Reference generator, workflow validator
│   │   ├── app.ts              # Express application setup
│   │   └── index.ts            # Server entrypoint with graceful shutdown
│   ├           
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/client.ts       # Axios client with VITE_API_URL support
│   │   ├── asssets/            # Official eC logo and hero media
│   │   ├── components/         # Navbar, Footers, Sidebars, Headers, Maps
│   │   ├── layouts/            # Public, CitizenPortal, and Admin layouts
│   │   ├── pages/
│   │   │   ├── citizen/        # HomePage, ServicesPage, Dashboard, Tracking
│   │   │   └── admin/          # AdminDashboard, RequestInbox, Map, Reports
│   │   ├── store/              # Zustand authentication store
│   │   ├── theme/              # MUI Theme and CSS color variables
│   │   └── App.tsx             # Application router
│   
│   ├── vercel.json             # Vercel SPA routing configuration
│   └── package.json
│
├── .gitignore                  # Root gitignore (node_modules, .env, tests, uploads)
└── README.md
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js:** v18+ (tested on Node v20/v24)
- **PostgreSQL:** Local PostgreSQL or hosted Supabase database

### 2. Backend Setup

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file :
   ```env
   NODE_ENV=development
   PORT=5600
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ecitizen_hub?schema=public"
   JWT_SECRET="super_secret_jwt_key_ecitizen_hub_2026_county_platform"
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE_MB=10
   COUNTY_NAME="Murang'a County"
   COUNTY_EMAIL="services@muranga.go.ke"
   COUNTY_PHONE="+254 700 000 000"
   COUNTY_OFFICE="Murang'a County Headquarters, P.O. Box 52-10200 Murang'a"
   ```

3. Push the schema to PostgreSQL:
   ```bash
   npm run prisma:push
   ```

4. Prebuild the Administrator account and official categories:
   ```bash
   npm run prisma:seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API will start on `http://localhost:5600`.*

### 3. Frontend Setup

1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_URL=/api
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will open on `http://localhost:5173`.*

---

## 🔑 Default Administrator Credentials

When the database is initialized with `npm run prisma:seed`, the official county administrator account is prebuilt:

- **Portal URL:** `http://localhost:5173/admin/login`
- **Email:** `admin@muranga.go.ke`
- **Password:** `AdminPassword123!`


---

## 🌐 Production Deployment Guide

### Architecture:
- **Database:** Supabase (Managed PostgreSQL)
- **Backend API:** Render (Web Service)
- **Frontend App:** Vercel (Static )

---

### Step 1: Set Up Database on Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings → Database**, find your **Connection String (URI)**.
   - Choose the **Transaction pooler** or **Direct connection** (URI mode).
   - Format: `postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require`
   *(Replace `[PASSWORD]` with your Supabase database password).*

---

### Step 2: Deploy Backend to Render

1. Push your repository to GitHub (ensure `.gitignore` excludes `.env` and `node_modules`).
2. Log into [render.com](https://render.com) and click **New → Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service:
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm install && npx prisma generate && npx prisma db push && npm run prisma:seed && npm run build
     ```
   - **Start Command:**
     ```bash
     npm run start
     ```
5. Add the **Environment Variables** in Render Dashboard:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `(Your Supabase connection string from Step 1)`
   - `JWT_SECRET`: `(Generate a secure 32+ character random string)`
   - `JWT_EXPIRES_IN`: `7d`
   - `CORS_ORIGIN`: `https://your-frontend.vercel.app` *(update once frontend is deployed)*
   - `COUNTY_NAME`: `Murang'a County`
   - `COUNTY_EMAIL`: `services@muranga.go.ke`
   - `COUNTY_PHONE`: `+254 700 000 000`
   - `COUNTY_OFFICE`: `Murang'a County Headquarters, P.O. Box 52-10200 Murang'a`
   - `ADMIN_EMAIL`: `admin@muranga.go.ke`
   - `ADMIN_PASSWORD`: `(Set your secure administrator password)`

6. Click **Deploy Web Service**.
   Render will install packages, run Prisma schema push, execute the clean seed (prebuilding the administrator and categories), compile TypeScript, and start the API on Render's assigned port.
   *Copy your Render service URL (e.g., `https://ecitizen-backend.onrender.com`).*

---

### Step 3: Deploy Frontend to Vercel

1. Log into [vercel.com](https://vercel.com) and click **Add New → Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
   *(Point to your Render backend URL with `/api` appended).*
5. Click **Deploy**.
6. Once deployed, copy your Vercel URL (e.g., `https://ecitizen-hub.vercel.app`) and update the `CORS_ORIGIN` variable on Render.

---

