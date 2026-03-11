import { useState, useCallback } from "react";

const newRow = (idx) => ({
  id: Date.now() + Math.random() + idx,
  productName: "",
  buyPrice: "",
  sellPrice: "",
  customerShipping: "",
  actualShipping: "",
  rivalTotal: "",
});

function calcRow(r) {
  const buy = parseFloat(r.buyPrice) || 0;
  const sell = parseFloat(r.sellPrice) || 0;
  const custShip = parseFloat(r.customerShipping) || 0;
  const actShip = parseFloat(r.actualShipping) || 0;
  const rival = parseFloat(r.rivalTotal) || 0;
  const revenue = sell + custShip;
  const fee = revenue * 0.11;
  const cardRebate = buy * 0.03;
  const profit = revenue - (buy + fee + actShip) + cardRebate;
  const margin = revenue > 0 ? profit / revenue : 0;
  const isWinner = rival > 0 ? revenue < rival : null;
  return { fee, cardRebate, profit, margin, isWinner };
}

const fmt = (n) => Math.round(n).toLocaleString("ko-KR") + "원";
const pct = (n) => (n * 100).toFixed(1) + "%";

const S = {
  container: {
    minHeight: "100vh",
    background: "#F9FAFB",
    fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
    paddingBottom: 40,
  },
  header: {
    background: "#fff",
    borderBottom: "3px solid #FCD34D",
    padding: "16px 16px 12px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  brandIcon: {
    background: "#FCD34D",
    borderRadius: 8,
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    flexShrink: 0,
  },
  brandName: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 3,
    color: "#92400E",
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: "#111827",
  },
  subtitle: {
    margin: "3px 0 0",
    fontSize: 11,
    color: "#9CA3AF",
  },
  summaryRow: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  },
  summaryCard: {
    flex: 1,
    background: "#FFFBEB",
    border: "1.5px solid #FCD34D",
    borderRadius: 10,
    padding: "8px 10px",
  },
  summaryLabel: {
    fontSize: 9,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 800,
    fontFamily: "monospace",
  },
  cardList: {
    padding: "12px 12px 0",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  card: {
    background: "#fff",
    border: "1.5px solid #E5E7EB",
    borderRadius: 12,
    padding: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardNum: {
    fontSize: 11,
    fontWeight: 700,
    color: "#9CA3AF",
  },
  nameInput: {
    flex: 1,
    margin: "0 8px",
    border: "1.5px solid #E5E7EB",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 13,
    fontWeight: 600,
    color: "#111",
    outline: "none",
    fontFamily: "inherit",
  },
  deleteBtn: {
    background: "transparent",
    border: "1.5px solid #E5E7EB",
    borderRadius: 6,
    color: "#9CA3AF",
    width: 26,
    height: 26,
    cursor: "pointer",
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: 8,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#B45309",
  },
  numInput: {
    border: "1.5px solid #FCD34D",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 14,
    color: "#111",
    background: "#FFFDF5",
    outline: "none",
    fontFamily: "monospace",
    width: "100%",
    boxSizing: "border-box",
  },
  divider: {
    height: 1,
    background: "#F3F4F6",
    margin: "10px 0",
  },
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 6,
    marginBottom: 8,
  },
  resultBox: {
    background: "#F3F4F6",
    borderRadius: 8,
    padding: "7px 8px",
    textAlign: "right",
  },
  resultLabel: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 2,
  },
  resultValue: {
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "monospace",
  },
  marginBarWrap: {
    marginBottom: 8,
  },
  marginBarBg: {
    height: 8,
    background: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 3,
  },
  winnerRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  rivalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#B45309",
    whiteSpace: "nowrap",
  },
  addBtn: {
    margin: "10px 12px 0",
    width: "calc(100% - 24px)",
    padding: 12,
    background: "transparent",
    border: "1.5px dashed #FCD34D",
    borderRadius: 12,
    color: "#B45309",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  legend: {
    margin: "12px 12px 0",
    padding: "10px 12px",
    background: "#FFFBEB",
    border: "1px solid #FCD34D",
    borderRadius: 10,
    fontSize: 10,
    color: "#92400E",
    lineHeight: 1.8,
  },
};

function WinnerBadge({ isWinner }) {
  if (isWinner === null) return <span style={{ fontSize: 11, color: "#9CA3AF" }}>-</span>;
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: isWinner ? "#D1FAE5" : "#FEE2E2",
      color: isWinner ? "#059669" : "#DC2626",
      border: `1px solid ${isWinner ? "#6EE7B7" : "#FCA5A5"}`,
    }}>
      {isWinner ? "⚡ 위너 선점" : "⚠ 가격조정필요"}
    </span>
  );
}

function MarginBar({ margin, hasData }) {
  const v = Math.max(0, Math.min(1, margin));
  const color = !hasData ? "#E5E7EB"
    : margin < 0 ? "#EF4444"
    : margin < 0.1 ? "#F97316"
    : margin < 0.2 ? "#F59E0B"
    : "#10B981";
  return (
    <div style={S.marginBarWrap}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: "#6B7280" }}>마진율</span>
        <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "monospace" }}>
          {hasData ? pct(margin) : "-"}
        </span>
      </div>
      <div style={S.marginBarBg}>
        <div style={{ width: `${v * 100}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

function NumInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={S.numInput}
      onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
      onBlur={(e) => (e.target.style.borderColor = "#FCD34D")}
    />
  );
}

export default function App() {
  const [rows, setRows] = useState([newRow(1), newRow(2), newRow(3)]);

  const update = useCallback((id, field, val) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  }, []);

  const addRow = () => setRows((prev) => [...prev, newRow(prev.length + 1)]);
  const removeRow = (id) => setRows((prev) => prev.length > 1 ? prev.filter((r) => r.id !== id) : prev);

  const totals = rows.reduce((acc, r) => {
    const hd = parseFloat(r.sellPrice) > 0 || parseFloat(r.buyPrice) > 0;
    if (hd) {
      const c = calcRow(r);
      acc.profit += c.profit;
      acc.count += 1;
      if (c.isWinner === true) acc.winners += 1;
    }
    return acc;
  }, { profit: 0, count: 0, winners: 0 });

  return (
    <div style={S.container}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.brandRow}>
          <div style={S.brandIcon}>🛒</div>
          <span style={S.brandName}>더바른커머스</span>
        </div>
        <h1 style={S.title}>코스트코 마진 계산기</h1>
        <p style={S.subtitle}>노란칸 입력 → 나머지 자동 계산 · 수수료 11% · 카드적립 3%</p>
        <div style={S.summaryRow}>
          {[
            { label: "총 예상 순이익", value: fmt(totals.profit), color: totals.profit >= 0 ? "#059669" : "#DC2626" },
            { label: "입력 상품", value: `${totals.count}개`, color: "#2563EB" },
            { label: "위너 상품", value: `${totals.winners}개`, color: "#D97706" },
          ].map((c) => (
            <div key={c.label} style={S.summaryCard}>
              <div style={S.summaryLabel}>{c.label}</div>
              <div style={{ ...S.summaryValue, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={S.cardList}>
        {rows.map((row, idx) => {
          const hd = parseFloat(row.sellPrice) > 0 || parseFloat(row.buyPrice) > 0;
          const c = calcRow(row);
          return (
            <div key={row.id} style={{
              ...S.card,
              borderColor: hd ? "#FCD34D" : "#E5E7EB",
            }}>
              {/* Card Header */}
              <div style={S.cardHeader}>
                <span style={S.cardNum}>#{idx + 1}</span>
                <input
                  type="text"
                  value={row.productName}
                  onChange={(e) => update(row.id, "productName", e.target.value)}
                  placeholder={`상품명 입력`}
                  style={S.nameInput}
                />
                <button
                  style={S.deleteBtn}
                  onClick={() => removeRow(row.id)}
                  onTouchStart={(e) => { e.currentTarget.style.background = "#FEE2E2"; e.currentTarget.style.color = "#DC2626"; }}
                  onTouchEnd={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9CA3AF"; }}
                >×</button>
              </div>

              {/* Inputs */}
              <div style={S.grid2}>
                <div style={S.inputGroup}>
                  <span style={S.inputLabel}>💰 매입가 (코스트코)</span>
                  <NumInput value={row.buyPrice} onChange={(v) => update(row.id, "buyPrice", v)} placeholder="14000" />
                </div>
                <div style={S.inputGroup}>
                  <span style={S.inputLabel}>🏷 내 판매가 (쿠팡)</span>
                  <NumInput value={row.sellPrice} onChange={(v) => update(row.id, "sellPrice", v)} placeholder="19900" />
                </div>
                <div style={S.inputGroup}>
                  <span style={S.inputLabel}>📦 고객 배송비</span>
                  <NumInput value={row.customerShipping} onChange={(v) => update(row.id, "customerShipping", v)} placeholder="6000" />
                </div>
                <div style={S.inputGroup}>
                  <span style={S.inputLabel}>🚚 실제 택배비</span>
                  <NumInput value={row.actualShipping} onChange={(v) => update(row.id, "actualShipping", v)} placeholder="4000" />
                </div>
              </div>

              {/* Divider */}
              <div style={S.divider} />

              {/* Auto Results */}
              <div style={S.resultGrid}>
                <div style={S.resultBox}>
                  <div style={S.resultLabel}>쿠팡 수수료</div>
                  <div style={{ ...S.resultValue, color: "#374151" }}>{hd ? fmt(c.fee) : "-"}</div>
                </div>
                <div style={S.resultBox}>
                  <div style={S.resultLabel}>카드 적립</div>
                  <div style={{ ...S.resultValue, color: "#2563EB" }}>{hd ? fmt(c.cardRebate) : "-"}</div>
                </div>
                <div style={{ ...S.resultBox, background: !hd ? "#F3F4F6" : c.profit >= 0 ? "#D1FAE5" : "#FEE2E2" }}>
                  <div style={S.resultLabel}>최종 순이익</div>
                  <div style={{ ...S.resultValue, color: !hd ? "#9CA3AF" : c.profit >= 0 ? "#059669" : "#DC2626" }}>
                    {hd ? fmt(c.profit) : "-"}
                  </div>
                </div>
              </div>

              {/* Margin Bar */}
              <MarginBar margin={c.margin} hasData={hd} />

              {/* Winner Row */}
              <div style={S.winnerRow}>
                <span style={S.rivalLabel}>🥊 라이벌 총액</span>
                <div style={{ flex: 1 }}>
                  <NumInput value={row.rivalTotal} onChange={(v) => update(row.id, "rivalTotal", v)} placeholder="경쟁자 판매가+배송비" />
                </div>
                <WinnerBadge isWinner={hd ? c.isWinner : null} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      <button style={S.addBtn} onClick={addRow}>+ 상품 추가</button>

      {/* Legend */}
      <div style={S.legend}>
        <strong>수식 안내</strong><br />
        쿠팡수수료 = (판매가 + 고객배송비) × 11%<br />
        카드적립 = 매입가 × 3% (현대카드)<br />
        순이익 = (판매가+배송비) − (매입가+수수료+택배비) + 카드적립<br />
        위너 판독 = 내 총액 &lt; 라이벌 총액
      </div>
    </div>
  );
}
