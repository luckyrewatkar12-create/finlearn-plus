# 💰 FinLearn+

> India's all-in-one financial literacy + investment simulation platform.

![FinLearn+](https://img.shields.io/badge/FinLearn+-v1.0-6366f1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)

---

## 🚀 Features

- 📚 **Gamified Learning** — Modules, XP, badges, and streaks
- 🎮 **Demo Mode** — Practice with ₹1,00,000 virtual currency
- 📈 **Stock Trading** — Real-time simulator with portfolio tracking
- 💼 **Investments** — Mutual funds, bonds, and SIP with calculator
- 🏦 **Banking** — Link bank accounts, view transaction history
- 💳 **Payments** — Deposit/withdraw via UPI, card, net banking
- 📊 **Analytics** — Portfolio performance, allocation, and risk charts
- 🔐 **Secure Auth** — JWT-based authentication with bcrypt

---

## 🗂️ Project Structure

```
finlearn-plus/
├── client/                  ← Next.js 14 frontend
│   ├── pages/               ← All app pages
│   │   ├── index.js         ← Landing page
│   │   ├── dashboard.js     ← User dashboard
│   │   ├── trading.js       ← Stock trading
│   │   ├── investments.js   ← Mutual funds, bonds, SIP
│   │   ├── banking.js       ← Bank accounts
│   │   ├── payments.js      ← Deposit/withdraw
│   │   ├── analytics.js     ← Portfolio analytics
│   │   ├── demo.js          ← Beginner demo mode
│   │   ├── login.js
│   │   └── signup.js
│   ├── components/
│   │   ├── ui/              ← Navbar, Layout, Cards
│   │   └── charts/          ← Portfolio, Allocation, Returns charts
│   ├── context/             ← AuthContext
│   └── utils/               ← API helper functions
│
└── server/                  ← Node.js + Express backend
    ├── routes/              ← auth, stocks, investments, banking, payments, learning, news
    ├── models/              ← User, Transaction, Portfolio, Investment, LearningProgress
    ├── middleware/          ← JWT auth, error handler, validation
    ├── config/              ← MongoDB connection
    └── utils/               ← Token generator
```

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
cd finlearn-plus
npm run install:all
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your values:
```env
MONGODB_URI=mongodb://localhost:27017/finlearn_plus
JWT_SECRET=your_secret_key
ALPHA_VANTAGE_KEY=your_key      # https://www.alphavantage.co/support/#api-key
NEWS_API_KEY=your_key            # https://newsapi.org/register
RAZORPAY_KEY_ID=your_key        # https://razorpay.com/
RAZORPAY_KEY_SECRET=your_secret
```

### 3. Run development servers

**Terminal 1 — Backend:**
```bash
npm run dev:server
# → http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
npm run dev:client
# → http://localhost:3000
```

> **No API keys?** No problem — the app runs with mock data out of the box.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile |
| GET | `/api/wallet` | Get balances |
| POST | `/api/wallet/deposit` | Deposit funds |
| GET | `/api/stocks/quote/:symbol` | Get stock quote |
| POST | `/api/stocks/buy` | Buy stock |
| POST | `/api/stocks/sell` | Sell stock |
| GET | `/api/stocks/portfolio` | Get portfolio |
| GET | `/api/investments/mutualfunds` | List MF investments |
| POST | `/api/investments/sip/create` | Create SIP |
| GET | `/api/banking/accounts` | Linked accounts |
| POST | `/api/banking/link` | Link bank account |
| POST | `/api/payments/order` | Create payment order |
| POST | `/api/payments/verify` | Verify payment |
| GET | `/api/learning/modules` | Get modules |
| POST | `/api/learning/modules/:id/complete` | Complete module |
| GET | `/api/news` | Finance news |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS, Framer Motion |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Payments | Razorpay (mock-ready) |
| Stock Data | Alpha Vantage (mock-ready) |
| News | NewsAPI (mock-ready) |

---

## 📅 Daily Contribution Log

This project is built as part of a daily GitHub contributions challenge.
Each day, new features, fixes, or improvements are committed.

---

*Built with ❤️ for financial literacy in India*
