import { useState } from "react";

export default function CoinsmateLiquidityTracker() {
  const [tab, setTab] = useState("buy");
  const [averageRate, setAverageRate] = useState(56.5);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ platform: "", amount: "", rate: "", bank: "", owner: "", note: "" });
  const [unlockPassword, setUnlockPassword] = useState("");

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (type) => {
    const amount = parseFloat(form.amount);
    const rate = parseFloat(form.rate);
    if (!form.platform || !form.bank || !form.owner || isNaN(amount) || isNaN(rate)) return alert("Complete the form");
    setTransactions(prev => [...prev, {
      type,
      platform: form.platform,
      bank: form.bank,
      owner: form.owner,
      note: form.note,
      amount,
      rate,
      valuePHP: amount * rate,
      timestamp: new Date()
    }]);
    setForm({ platform: "", amount: "", rate: "", bank: "", owner: "", note: "" });
  };

  const groupedPnL = transactions.reduce((acc, tx) => {
    const date = tx.timestamp.toISOString().split("T")[0];
    const pnl = tx.type === "sell" ? (tx.rate - averageRate) * tx.amount : 0;
    acc[date] = (acc[date] || 0) + pnl;
    return acc;
  }, {});

  const exportToCSV = () => {
    const headers = ["Type","Platform","Amount","Rate","PHP","Bank","Owner","Note","Date","P/L"];
    const rows = transactions.map(tx => [
      tx.type, tx.platform, tx.amount, tx.rate, tx.valuePHP.toFixed(2), tx.bank, tx.owner, tx.note || "", tx.timestamp.toLocaleString(), tx.type === 'sell' ? ((tx.rate - averageRate) * tx.amount).toFixed(2) : ""
    ]);
    const csv = [headers, ...rows]
      .map(row =>
        row
          .map(value =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value
          )
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  const platforms = ["OXS", "Bybit", "Binance"];
  const banks = ["BPI", "BDO", "UB", "Coins.ph"];
  const owners = ["Allen", "Alaa"];

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1 style={{ fontWeight: "bold" }}>Coinsmate Liquidity Tracker v0.1</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        {["buy", "sell", "transactions", "tracker", "export", "balances"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ padding: "6px 12px", background: tab === t ? "#333" : "#ccc", color: tab === t ? "white" : "black" }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {(tab === "buy" || tab === "sell") && (
        <div style={{ display: "grid", gap: 8, maxWidth: 300 }}>
          <strong>{tab === "buy" ? "Buy" : "Sell"} USDT</strong>
          <select value={form.platform} onChange={e => handleChange("platform", e.target.value)}>
            <option value="">Select Platform</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input placeholder="Amount" type="number" value={form.amount} onChange={e => handleChange("amount", e.target.value)} />
          <input placeholder="Rate" type="number" value={form.rate} onChange={e => handleChange("rate", e.target.value)} />
          <select value={form.bank} onChange={e => handleChange("bank", e.target.value)}>
            <option value="">Select Bank</option>
            {banks.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={form.owner} onChange={e => handleChange("owner", e.target.value)}>
            <option value="">Select Owner</option>
            {owners.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <input placeholder="Note (optional)" value={form.note} onChange={e => handleChange("note", e.target.value)} />
          <button onClick={() => handleSubmit(tab)}>Submit {tab.toUpperCase()}</button>
        </div>
      )}

      {tab === "transactions" && (
        <div>
          <strong>Transactions</strong>
          <ul>
            {transactions.map((tx, i) => (
              <li key={i}>
                {tx.type.toUpperCase()} {tx.amount} USDT @ ₱{tx.rate} via {tx.platform} → ₱{(tx.amount * tx.rate).toFixed(2)}
                {tx.note && ` | ${tx.note}`} {tx.type === "sell" && <span style={{ color: (tx.rate - averageRate) * tx.amount >= 0 ? "green" : "red" }}> P/L: ₱{((tx.rate - averageRate) * tx.amount).toFixed(2)}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "tracker" && (
        <div>
          <strong>Daily P/L</strong>
          <ul>
            {Object.entries(groupedPnL).map(([d, v]) => (
              <li key={d}>{d}: <span style={{ color: v >= 0 ? "green" : "red" }}>₱{v.toFixed(2)}</span></li>
            ))}
          </ul>
        </div>
      )}

      {tab === "export" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <strong>Export</strong>
          <button onClick={exportToCSV}>Export to CSV</button>
        </div>
      )}

      {tab === "balances" && (
        <div style={{ display: "grid", gap: 10, maxWidth: 300 }}>
          <strong>Balances (Protected)</strong>
          {unlockPassword !== "Test" ? (
            <>
              <input type="password" placeholder="Enter Password" value={unlockPassword} onChange={e => setUnlockPassword(e.target.value)} />
              <p>Enter password to unlock balance editor</p>
            </>
          ) : (
            <>
              <input type="number" placeholder="New Average Rate" onChange={e => setAverageRate(parseFloat(e.target.value))} />
              <p>Balances adjusted manually here</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
