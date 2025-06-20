# Coinsmate Liquidity Tracker v0.1

Coinsmate Liquidity Tracker is a lightweight React app designed for tracking USDT (Tether) liquidity transactions in the P2P market, especially within teams managing multiple banks and platforms. 

---

## 🔍 Features

- 📥 **Buy/Sell Tabs**  
  Log USDT purchases and sales with:
  - Platform (e.g. OXS, Binance)
  - PHP rate and amount
  - Bank used and account owner
  - Optional notes

- 🧾 **Transactions Tab**  
  - List of all buy/sell logs
  - P/L displayed in real time for each sale

- 📊 **Tracker Tab**  
  - Daily profit/loss breakdown
  - Grouped by transaction date

- 📤 **Export Tab**  
  - One-click CSV export of all transactions
  - Optional PDF/print layout coming soon

- 🔐 **Balances Tab (password protected)**  
  - Enter password `Test` to manually set average USDT rate

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed

### Run Locally

```bash
git clone https://github.com/Danz17/Coinsmate-p2p.git
cd coinsmate-liquidity-tracker
npm install
npm start
```

App will run on `http://localhost:3000`

---

## 📁 Folder Structure

```
coinsmate-liquidity-tracker/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          # Full app logic
│   └── index.js         # ReactDOM entry
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

- React (Create React App)
- JavaScript (ES6+)
- No backend (data in memory)

---

## ✅ Roadmap for v0.2

- [ ] Add login support for team access
- [ ] Chart-based insights
- [ ] Per-bank and per-owner balance visibility
- [ ] Sync to Google Sheets or Firebase
- [ ] Export to signed PDF

---

## 📄 License

MIT — free for commercial use. Created by [@Danz17](https://github.com/Danz17)
