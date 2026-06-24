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
│   │   ├── styles/       # CSS Design system (variables, glassmorphism)
│   │   ├── App.jsx       # Main App Component
│   │   └── main.jsx      # React entry point
│   ├── vercel.json       # Routing configurations for Vercel
│   └── package.json
│
├── backend/              # Node.js Express Server
│   ├── src/
│   │   ├── config/       # Databases & Env configurations
│   │   ├── controllers/  # API Route handlers
│   │   ├── middleware/   # Authentication, validation, rate limiting
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── socket/       # Real-time WebSockets
│   ├── prisma/           # Database schemas and seed files
│   ├── server.js         # Entry point
│   └── package.json
│
├── shared/               # Shared modules between FE/BE
└── docker-compose.yml    # Local PostgreSQL service
```

---

## 💻 Local Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) and [Docker](https://www.docker.com/) installed on your machine.

### 2. Clone the Repository
```bash
git clone https://github.com/RAHUMAN-07/CAMPUS-SKILL-EXCHANGE.git
cd CAMPUS-SKILL-EXCHANGE
```

### 3. Install Dependencies
Run the install command from the root directory:
```bash
npm run install:all
```

### 4. Setup Database
Start the PostgreSQL database service using Docker Compose:
```bash
docker-compose up -d
```

### 5. Run Migrations & Seed Data
Inside the `backend` directory, apply the Prisma schema and populate the database with seed data:
```bash
cd backend
npx prisma migrate dev
node prisma/seed.js
cd ..
```

### 6. Start Development Servers
Run the following command at the root directory to run both the frontend and backend concurrently:
```bash
npm run dev
```
- Frontend will run on: `http://localhost:5173`
- Backend will run on: `http://localhost:3001`

---

## ☁️ Deployment

### Frontend (Vercel)
The frontend is pre-configured with a `vercel.json` file for routing:
1. Link your repository on Vercel.
2. Select `frontend` as the **Root Directory**.
3. Set the Framework Preset to **Vite**.
4. Click **Deploy**.
