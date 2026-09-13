import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const signupUser = (data) => API.post("/auth/signup", data);
export const getProfile = () => API.get("/auth/profile");

// Wallet
export const getWallet = () => API.get("/wallet");
export const depositFunds = (amount) => API.post("/wallet/deposit", { amount });
export const withdrawFunds = (amount) => API.post("/wallet/withdraw", { amount });

// Stocks
export const getStockQuote = (symbol) => API.get(`/stocks/quote/${symbol}`);
export const buyStock = (data) => API.post("/stocks/buy", data);
export const sellStock = (data) => API.post("/stocks/sell", data);
export const getPortfolio = () => API.get("/stocks/portfolio");

// Investments
export const getMutualFunds = () => API.get("/investments/mutualfunds");
export const investMutualFund = (data) => API.post("/investments/mutualfunds/invest", data);
export const getSIPPlans = () => API.get("/investments/sip");
export const createSIP = (data) => API.post("/investments/sip/create", data);
export const getBonds = () => API.get("/investments/bonds");

// Banking
export const getBankAccounts = () => API.get("/banking/accounts");
export const linkBankAccount = (data) => API.post("/banking/link", data);
export const getTransactions = () => API.get("/banking/transactions");

// Payments
export const createPaymentOrder = (data) => API.post("/payments/order", data);
export const verifyPayment = (data) => API.post("/payments/verify", data);

// Learning
export const getModules = () => API.get("/learning/modules");
export const completeModule = (id) => API.post(`/learning/modules/${id}/complete`);
export const getLearningProgress = () => API.get("/learning/progress");

// News
export const getFinanceNews = () => API.get("/news");

export default API;
