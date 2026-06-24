# GatherSphere

A full-stack event management platform for hosting events, managing registrations, and checking in attendees — built from scratch.

**Core idea:** Hosting requires an account. Attending does not. Anyone can register for an event with just name, email, and phone.

---

## Status

**v1 complete** — core flows work end-to-end locally. Deployment-ready with minor config changes (CORS, env vars). Event banners and profile photos are deferred to v2 (colored placeholders only).

---

## Features

### For hosts
- Create, edit, publish, and delete events (offline or online)
- Set capacity, registration deadlines, and auto vs manual approval
- Dashboard with hosted events and registration stats
- Manage registrations — approve, reject, mark attendance
- Close registrations and auto-reject pending/waitlisted signups
- QR-based ticket check-in via camera

### For participants
- Browse and discover published events (no account required)
- Register on public event pages as a guest or logged-in user
- Cancel registrations from the dashboard
- Digital tickets with scannable QR codes
- Guest registrations link to your account when you sign up with the same email

### Platform
- JWT authentication with stale-session handling (401 interceptor)
- Event lifecycle: Draft → Published → Registration Closed → Completed / Cancelled
- Waitlist with automatic promotion when a spot opens
- HTML email notifications (registration, approval, rejection, cancellation)
- Responsive UI with Tailwind CSS

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 19, Vite, React Router, Tailwind CSS v4, Axios |
| **Backend** | Node.js, Express 5, Zod validation |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (Bearer tokens), bcrypt |
| **Email** | Nodemailer (Gmail SMTP) |
| **QR / tickets** | html5-qrcode, qrcode.react |

---

## Project structure

```
GatherSphere/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── api/            # Axios instance + interceptors
│       ├── components/     # Navbar, forms, badges, etc.
│       ├── context/        # AuthContext
│       └── pages/          # Home, listing, dashboard, camera, ...
└── server/                 # Express API
    ├── config/             # env, db
    ├── controllers/        # Business logic
    ├── middlewares/        # JWT auth
    ├── models/             # User, Event, Registration
    ├── routes/             # API routes
    ├── utils/              # Email templates, tickets
    └── validators/         # Zod schemas
```

---

## Getting started (local)

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas connection string)

### 1. Clone and install

```bash
git clone https://github.com/dheerajp45/GatherSphere.git
cd GatherSphere

cd server && npm install
cd ../client && npm install
```

### 2. Server environment

Copy `server/.env.example` to `server/.env` and fill in values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/gathersphere
JWT_SECRET=your_long_random_secret

EMAIL=your@gmail.com
APP_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

### 3. Client environment

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run

Terminal 1 — API:
```bash
cd server
npm start
```

Terminal 2 — frontend:
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## API overview

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, receive JWT |
| GET | `/api/events` | List published events |
| GET | `/api/events/:slug` | Public event detail |
| POST | `/api/events` | Create event (auth) |
| PATCH | `/api/events/:id/status` | Publish / close registrations |
| POST | `/api/registrations/events/:eventId/register` | Register for event |
| GET | `/api/dashboard/stats` | Host dashboard stats |
| POST | `/api/registrations/check-in` | QR check-in (auth) |

Protected routes require `Authorization: Bearer <token>`.

---

## Deployment notes

Deploy **client** and **server** separately.

| App | Suggested host | Key env var |
|-----|----------------|-------------|
| `client/` | Vercel / Netlify | `VITE_API_URL` → production API URL |
| `server/` | Render / Railway | `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, email vars |

Before production:
- Update CORS in `server/index.js` to use `FRONTEND_URL` (not hardcoded localhost)
- Change server `start` script to `node index.js`
- Add SPA rewrites so React Router routes work on refresh
- Use MongoDB Atlas for the database

---

## Author

Built by **Dheeraj** — [GitHub](https://github.com/dheerajp45)

---

## License

ISC
