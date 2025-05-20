# Virro
Virro is a full-stack productivity and habit-building app that rewards task completion and accountability through a verification system. It was built from the ground up using a custom backend with Node.js, PostgreSQL, JWT-based authentication, and a React Native frontend powered by Expo.

>  Designed, built, and maintained solely by Pavlo Vovk

---

## Features

- ✅ User registration and login with hashed passwords
- 🔐 Secure JWT-based authentication
- 🧑‍⚖ Verifier roles with restricted access
- 📋 Task creation, completion, and submission for approval
- 👥 Group task support with member tracking
- 📅 Calendar-friendly API structure
- 🔄 Role-switching: any user can become a verifier
- 🔧 Built with scalability and flexibility in mind

---

## Tech Stack

| Layer          | Tech                      |
|----------------|---------------------------|
| Backend        | Node.js, Express          |
| Database       | PostgreSQL, pg            |
| Auth           | JWT, bcryptjs             |
| Dev Tools      | TypeScript, ts-node-dev   |
| Mobile Frontend| React Native + Expo Go    |
| API Testing    | Postman                   |

---

## Project Structure

app/
├── client/ # React Native frontend (Expo)
├── server/ # Express API backend
│ ├── controllers/ # Route logic
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & role middleware
│ ├── models/ # DB connection
│ ├── utils/ # Token helpers, etc.
│ ├── .env # Environment config (not committed)
│ └── index.ts # Server entry point

---

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/Virro-Clean.git
cd Virro-Clean/app/server

**### 2. Create .env File**

DATABASE_URL=postgres://postgres:your_password@localhost:5432/virro_db
JWT_SECRET=your_jwt_secret

**### 3. Install Dependencies

```bash
npm install

**### Start the backend Server

```bash
npm run dev

(Server will run on http://localhost:3001)

---

**## API Endpoints**

| Method | Route                     | Description                |
| ------ | ------------------------- | -------------------------- |
| POST   | `/auth/register`          | Register a new user        |
| POST   | `/auth/login`             | Login and receive token    |
| PATCH  | `/auth/role`              | Switch to verifier role    |
| GET    | `/tasks`                  | Get user tasks             |
| POST   | `/tasks`                  | Create a new task          |
| GET    | `/verify/pending`         | Verifier: view submissions |
| POST   | `/verify/:taskId/approve` | Verifier: approve task     |
All protected routes require a Bearer token.

---

**##License**
This project is under the MIT License.
Feel free to fork it for learning or inspiration — but attribution is appreciated.

---

**##Contact**
For questions, feedback, or collaboration opportunities
Email: pavlovovk1@gmail.vom
Github: github.com/PavloVovk2002

