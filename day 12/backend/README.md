# Expense Haven - Node.js + Express.js + PostgreSQL Backend

Complete REST API backend for Expense Haven (Finch) personal expense tracker application.

## 🛠 Tech Stack
- **Language**: JavaScript (ES Modules)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Architecture**: REST API (Controllers, Services, Routes, Middlewares)

---

## 📁 Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # PostgreSQL Pool & auto-table initialization
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, get current user
│   │   ├── transactionController.js # CRUD for transactions & summary
│   │   └── userController.js     # User profile management
│   ├── database/
│   │   └── schema.sql            # PostgreSQL DDL table definitions
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer token authentication
│   │   └── errorHandler.js       # Centralized error & 404 handler
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   ├── transactionRoutes.js  # /api/transactions/*
│   │   └── userRoutes.js         # /api/user/*
│   └── app.js                    # Express app configuration & middleware
├── .env.example                  # Environment variable template
├── .env                          # Local environment variables
├── package.json
└── server.js                     # Main server entrypoint
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_haven
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret_key
```

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode (auto-reload on save)
npm run dev
```

---

## 📡 REST API Documentation

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ |
| `GET` | `/api/auth/me` | Get currently authenticated user | ✅ Bearer |

### 💰 Transactions (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/transactions` | Get list of user transactions (filters: `type`, `category`, `search`) | ✅ Bearer |
| `POST` | `/api/transactions` | Create a new transaction | ✅ Bearer |
| `GET` | `/api/transactions/summary` | Get financial summary (income, expense, balance, this month) | ✅ Bearer |
| `GET` | `/api/transactions/:id` | Get single transaction | ✅ Bearer |
| `PUT` | `/api/transactions/:id` | Update an existing transaction | ✅ Bearer |
| `DELETE` | `/api/transactions/:id` | Delete a transaction | ✅ Bearer |

### 👤 Profile (`/api/user`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/user/profile` | Get user profile (display name, avatar) | ✅ Bearer |
| `PUT` | `/api/user/profile` | Update profile information | ✅ Bearer |
