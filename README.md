# Finance Tracker

Finance Tracker is a full-stack personal finance app with JWT authentication, MongoDB persistence, expense analytics, category budgets, and a mobile-first dashboard styled with soft gradients and rounded cards.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts
- Backend: Node.js, Express, Mongoose
- Auth: JWT in `localStorage`
- Database: MongoDB

## Project Structure

```text
.
|-- client
|-- server
|-- package.json
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Variables

Create these files from the examples before starting:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Server variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance-tracker
JWT_SECRET=change-me
CLIENT_URL=http://localhost:5173
```

Client variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Install

From the project root:

```bash
npm install
```

This repo uses npm workspaces, so the root install also installs `client` and `server` dependencies.

## Run in Development

Start both apps together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Seed Demo Data

The demo seed creates one user and the sample transactions requested in the brief.

```bash
npm run seed
```

Demo credentials:

- Email: `demo@financetracker.app`
- Password: `password123`

The seed currently clears existing users and transactions before inserting demo data.

## API Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Transactions:

- `POST /api/transactions`
- `GET /api/transactions`
- `DELETE /api/transactions/:id`

Analytics:

- `GET /api/analytics/summary`
- `GET /api/analytics/monthly`
- `GET /api/analytics/categories`
- `PUT /api/analytics/categories/limits`

## Features Included

- Sign up and sign in with hashed passwords
- Protected dashboard route with persisted login state
- Summary cards for income, expenses, balance, and savings rate
- Six-month income vs expenses chart
- Current-month expense pie chart
- Income and expense creation forms
- Monthly spending comparison card
- Category budget limits with alerts
- Recent transactions list with delete support
- Loading states and inline error handling

## Build for Production

```bash
npm run build
npm run start
```
