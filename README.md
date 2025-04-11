
# 🛡️ Backend - Mobile Financial Service Web App (MFS)

This is the backend service for the MFS platform using Node.js, Express, TypeScript, and MongoDB.

## 🛠️ Tech Stack
- **Node.js**
- **Express.js**
- **TypeScript**
- **Mongoose**
- **Zod**
- **JWT Authentication**
- **Nodemailer**
- **Modular Folder Structure**

## 💻 Getting Started
```bash
cd backend
npm install
npm run dev
```

## 📁 Folder Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── index.ts
```

## 🌐 API Routes

### 🔐 Auth
- `POST /api/v1/auth/register` - Register user/agent
  - Body: `{ name, email, phone, pin, nid, role }`
- `POST /api/v1/auth/login` - Login with JWT
  - Body: `{ phone pin }`

### 💰 Transactions
- `POST /api/transaction/send-money`
  - Body: `{ recipientPhone, amount }`
- `POST /api/transaction/cash-in`
  - Body: `{ userPhone, amount, agentPin }`
- `POST /api/transaction/cash-out`
  - Body: `{ agentPhone, amount, userPin }`

### 📈 Balance
- `GET /api/balance` - Get user/agent balance

### 🧾 Transactions
- `GET /api/transaction/history` - Last 100 transactions

### 🧑‍💼 Agent
- `GET /api/agent/pending` - Get pending agents (Admin)
- `PATCH /api/agent/approve/:agentId` - Approve agent
- `POST /api/agent/request-recharge` - Request balance
- `POST /api/agent/request-withdraw` - Request withdrawal

### 🛡️ Admin
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/block/:id` - Block user/agent
- `GET /api/admin/stats` - System stats and earnings
- `POST /api/admin/add-balance/:agentId` - Add balance to agent

## 📦 Deployment
Ready for deployment on platforms like Render, Railway, or Heroku.
