# NovaPortfolio (Full-Stack Portfolio Platform)

A production-oriented portfolio platform where creators can build and share a personal portfolio at `website.com/username`.

## Tech Stack

- **Frontend:** HTML + TailwindCSS + Vanilla JavaScript
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcryptjs
- **Image Uploads:** Cloudinary + multer
- **Hardening:** helmet + rate limiting + CORS

## UI / Design System

- Font: **Manrope** (Google Fonts)
- Theme colors:
  - Background: `#0B0B0F`
  - Card background: `#111117`
  - Border: `#1E1E26`
  - Primary accent: `#6B8CFF`
  - Text: `#FFFFFF`
  - Secondary text: `#A0A0B0`
- Smooth hover transitions, glassmorphism cards, responsive layout.

## Folder Structure

```txt
.
├── public/
│   ├── js/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── main.js
│   │   └── portfolio.js
│   ├── auth.html
│   ├── dashboard.html
│   ├── index.html
│   └── portfolio.html
├── src/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Like.js
│   │   ├── Project.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── portfolioRoutes.js
│   └── utils/
│       └── generateToken.js
├── .env.example
├── package.json
├── README.md
└── server.js
```

## Core Features

### 1) Authentication

- Signup
- Login
- Logout (frontend token clear)
- JWT auth middleware (`Authorization: Bearer <token>`)
- Password hashing with bcryptjs

### 2) User Portfolio (`/username`)

Each portfolio includes:
- profile image
- full name
- bio
- skills
- social links
- contact link

### 3) Projects

Users can:
- create project
- update project
- delete project

Each project includes:
- title
- description
- image upload (Cloudinary)
- tags
- external link

### 4) Dashboard

- edit profile
- upload avatar
- add/manage projects
- copy portfolio link

### 5) Search

Search portfolios by:
- username
- skills
- project tags

### 6) Admin Panel API

Admin can:
- list users
- delete users
- feature/unfeature portfolios

### 7) Extra Features

- portfolio view counter
- like system
- share button
- copy link button

## Database Schema Overview

### User

- `username` (unique)
- `fullName`
- `email` (unique)
- `password` (hashed)
- `bio`
- `skills[]`
- `socialLinks` (`github`, `linkedin`, `twitter`, `website`, `email`)
- `profileImage`
- `role` (`user|admin`)
- `featured` (boolean)
- `viewCount`

### Project

- `user` (ref User)
- `title`
- `description`
- `imageUrl`
- `tags[]`
- `externalLink`

### Like

- `portfolioOwner` (ref User)
- `likedBy` (ref User)
- unique compound index on (`portfolioOwner`, `likedBy`)

## API Routes

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Portfolio/Public
- `GET /api/portfolios/featured`
- `GET /api/portfolios/search?q=...`
- `GET /api/portfolios/:username`
- `POST /api/portfolios/:username/like`

### Dashboard (JWT required)
- `GET /api/dashboard/overview`
- `PUT /api/dashboard/profile`
- `POST /api/dashboard/projects`
- `PUT /api/dashboard/projects/:id`
- `DELETE /api/dashboard/projects/:id`

### Admin (JWT + admin role)
- `GET /api/admin/users`
- `DELETE /api/admin/users/:id`
- `PATCH /api/admin/users/:id/feature`

## Installation Guide

1. Clone repo and open folder.
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5000`.

## Environment Variables

See `.env.example`:

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PUBLIC_APP_URL`
- `CORS_ORIGIN`

## Deployment Instructions

### Option A: Render / Railway / Fly.io

1. Push code to Git provider.
2. Create a web service and set build/start:
   - Build: `npm install`
   - Start: `npm start`
3. Add all env vars from `.env.example`.
4. Point `PUBLIC_APP_URL` to deployed URL.
5. Ensure MongoDB Atlas network/IP settings allow deployment host.

### Option B: VPS + PM2

```bash
npm install
npm install -g pm2
pm2 start server.js --name novaportfolio
pm2 save
```

Use Nginx as reverse proxy with HTTPS (Let's Encrypt).

## Production Readiness Checklist

- [x] JWT auth + protected routes
- [x] Hashed passwords
- [x] Input parsing + API error handling
- [x] Helmet security headers
- [x] API rate limiting
- [x] CORS handling
- [x] Cloudinary-backed image uploads
- [x] Responsive frontend

---

Built to give creators a modern dark, futuristic portfolio experience inspired by ElevenLabs-like aesthetics.
