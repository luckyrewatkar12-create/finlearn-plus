# 💰 FinLearn+

> India's all-in-one financial literacy, stock market simulation, and investment platform.

![FinLearn+](https://img.shields.io/badge/FinLearn+-v1.0-6366f1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-02042B?style=for-the-badge&logo=razorpay)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

---

## 🌐 Live Demo

### 👉 [https://client-one-theta-27.vercel.app](https://client-one-theta-27.vercel.app)

> Fully deployed on Vercel — open in any browser, no setup needed. Share with anyone!

---

## 📖 About The Project

**FinLearn+** is a full-stack web application designed to make financial education accessible and engaging for Indians. It combines gamified learning, a real-time stock trading simulator, investment tools (Mutual Funds, SIP, Bonds), and a secure payment gateway — all in one platform.

Whether you're a complete beginner or an experienced investor, FinLearn+ helps you:
- **Learn** finance through interactive, gamified modules
- **Practice** trading with ₹1,00,000 virtual currency — zero risk
- **Simulate** real investments with live stock data
- **Track** your portfolio with beautiful analytics and charts
- **Invest** smarter with SIP calculators and fund comparisons

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 📚 Gamified Learning | Modules with XP, badges, streaks, and level-ups |
| 🎮 Demo Mode | Practice with ₹1,00,000 virtual currency — no real money |
| 📈 Stock Trading | Real-time simulator — buy/sell 10+ Indian stocks |
| 💼 Mutual Funds | Browse and invest in top Indian mutual funds |
| 📊 SIP Calculator | Interactive SIP planner with compound interest visualization |
| 🏦 Bond Investing | Government and corporate bonds with maturity tracking |
| 🏧 Banking | Link bank accounts and view transaction history |
| 💳 Payments | Razorpay integration — UPI, Cards, Net Banking |
| 📉 Analytics | Portfolio performance, asset allocation, risk analysis charts |
| 🔐 Secure Auth | JWT-based login/signup with bcrypt password hashing |
| 📰 Finance News | Live financial news feed (NewsAPI integrated) |

---

## 🖥️ Pages

- **/** — Landing page with hero, features, and learning modules
- **/dashboard** — Personal dashboard with portfolio stats and charts
- **/trading** — Stock trading simulator with 10+ Indian stocks
- **/investments** — Mutual funds, bonds, and SIP calculator
- **/analytics** — Portfolio performance, allocation pie chart, returns bar chart
- **/demo** — Beginner mode with guided learning modules and XP system
- **/banking** — Linked bank accounts and transaction history
- **/payments** — Deposit/withdraw via Razorpay (UPI, Card, Net Banking)
- **/login** & **/signup** — Authentication pages

---

## 🗂️ Project Structure

```
finlearn-plus/
├── client/                  ← Next.js 14 Frontend
│   ├── pages/               ← All app pages
│   ├── components/
│   │   ├── ui/              ← Navbar, Layout, StatCard, LoadingSpinner
│   │   └── charts/          ← PortfolioChart, AllocationChart, ReturnsChart
│   ├── context/             ← AuthContext (JWT management)
│   ├── utils/               ← API helper functions
│   └── styles/              ← Global CSS + Tailwind config
│
└── server/                  ← Node.js + Express Backend
    ├── routes/              ← auth, stocks, investments, banking, payments, learning, news
    ├── models/              ← User, Transaction, Portfolio, Investment, LearningProgress
    ├── middleware/          ← JWT auth, error handler, input validation
    ├── config/              ← MongoDB connection
    └── utils/               ← Token generator
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Framer Motion |
| Charts | Recharts (Area, Pie, Bar charts) |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose (hosted on Atlas) |
| Auth | JWT + bcryptjs |
| Payments | Razorpay (UPI, Cards, Net Banking) |
| Deployment | Vercel (Frontend) |
| Stock Data | Alpha Vantage API (mock-ready) |
| News | NewsAPI.org (mock-ready) |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/luckyrewatkar12-create/finlearn-plus.git
cd finlearn-plus
```

### 2. Install dependencies
```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 3. Configure environment
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Run development servers

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
# → http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
# → http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/profile` | Get profile | ✅ |
| GET | `/api/wallet` | Get balances | ✅ |
| POST | `/api/wallet/deposit` | Deposit funds | ✅ |
| GET | `/api/stocks/quote/:symbol` | Get stock quote | ✅ |
| POST | `/api/stocks/buy` | Buy stock | ✅ |
| POST | `/api/stocks/sell` | Sell stock | ✅ |
| GET | `/api/stocks/portfolio` | Get portfolio | ✅ |
| GET | `/api/investments/mutualfunds` | List MF investments | ✅ |
| POST | `/api/investments/sip/create` | Create SIP | ✅ |
| GET | `/api/banking/accounts` | Linked accounts | ✅ |
| POST | `/api/payments/order` | Create Razorpay order | ✅ |
| GET | `/api/learning/modules` | Get modules | ✅ |
| POST | `/api/learning/modules/:id/complete` | Complete module | ✅ |
| GET | `/api/news` | Finance news feed | ✅ |

---

## 💳 Razorpay Test Credentials

| Method | Details |
|--------|---------|
| ✅ Success Card | `4111 1111 1111 1111` • Any future expiry • Any CVV |
| 📱 Test UPI | `success@razorpay` |
| ❌ Fail Card | `4000 0000 0000 0002` |

---

## 📅 Daily Contribution Log

This project is built as part of a **daily GitHub contributions challenge**.
Each day, new features, fixes, or improvements are committed and pushed.

---

## 👤 Author

**Lucky Rewatkar**
- GitHub: [@luckyrewatkar12-create](https://github.com/luckyrewatkar12-create)

---

*Built with ❤️ for financial literacy in India 🇮🇳*
