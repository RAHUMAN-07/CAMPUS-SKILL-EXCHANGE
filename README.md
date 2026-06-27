# Campus Skill Exchange Network 🎓✨

A complete peer-to-peer skill exchange platform designed for university students to share knowledge, schedule collaborative sessions, track reviews, and earn badges.

---

## 🚀 Features

- **Peer-to-Peer Skill Sharing**: List skills you want to teach and skills you want to learn.
- **Intelligent Match Browser**: Discover and search matches based on skills, proficiency levels, and availability.
- **Session Scheduling**: Coordinate sessions directly with a calendar view, booking status, and automatic meetings.
- **Rich Gamification**: Earn verified badges and build your student trust score through active participation.
- **Responsive Aesthetics**: Modern campus look with a custom CSS design system, dark mode toggle, and glassmorphism styling.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Zustand, Framer Motion |
| **Backend** | Node.js, Express.js, Prisma ORM, Socket.io |
| **Database** | PostgreSQL |
| **Authentication** | JWT (access + refresh tokens), bcrypt |

---

## 📂 Project Structure

```text
campus-skill-exchange/
├── frontend/             # React Client (Vite)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── styles/       # CSS design system
│   │   ├── App.jsx       # Main App component
│   │   └── main.jsx      # React entry point
│   ├── vercel.json       # Vercel routing configs
│   └── package.json
│
├── backend/              # Node.js Express server
│   ├── src/
│   │   ├── config/       # Env and database configs
│   │   ├── controllers/  # API route handlers
│   │   ├── middleware/   # Auth, validation, rate limiting
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── socket/       # Socket.IO setup
│   ├── prisma/           # Database schema and seed files
│   ├── server.js         # Application entry point
│   └── package.json
│
├── shared/               # Shared modules between frontend and backend
├── .nvmrc                # Recommended project Node version
└── docker-compose.yml    # Local PostgreSQL service
```

---

## 💻 Local Setup & Installation

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/).
- Install [nvm for Windows](https://github.com/coreybutler/nvm-windows) or use the Node.js installer.
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop) if you want to run PostgreSQL locally.

### 2. Use the project Node version
This repository includes an `.nvmrc` file with the recommended Node version.

If you use `nvm`:
```bash
nvm install 20.5.1
nvm use 20.5.1
```

If you do not use `nvm`, install Node.js 20.x from the official Node.js website.

### 3. Install dependencies
From the project root:
```bash
npm install
npm run install:all
```

### 4. Setup database
Start the PostgreSQL database service with Docker Compose:
```bash
docker-compose up -d
```

### 5. Run migrations and seed data
From the `backend` folder:
```bash
cd backend
npx prisma migrate dev
node prisma/seed.js
cd ..
```

### 6. Start the app
From the root folder:
```bash
npm run dev
```

Then visit:
- Frontend: `http://localhost:5173`
- Backend health: `://localhost:3001/api/healthttph`

---

## 📌 Useful commands

- `npm run install:all` — install root, backend, and frontend dependencies
- `npm run dev` — start both frontend and backend concurrently
- `npm run db:migrate` — run Prisma migrations
- `npm run db:seed` — seed the database
- `npm run build` — build the frontend

---

## ☁️ Deployment

### Frontend (Vercel)
The frontend is pre-configured with a `vercel.json` file for routing:
1. Link your repository on Vercel.
2. Select `frontend` as the **Root Directory**.
3. Set the Framework Preset to **Vite**.
4. Click **Deploy**.
