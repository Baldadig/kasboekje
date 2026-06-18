import { monthKeysSorted, monthTotals } from './store.jsx';

// Samenvatting per maand (gesorteerd, oud -> nieuw)
export function monthSummaries(data) {
  return monthKeysSorted(data).map((k) => {
    const m = data.months[k];
    const t = monthTotals(m);
    return { key: k, year: m.year, month: m.month, ...t };
  });
}

// Gemiddelden over alle maanden
export function averages(data) {
  const rows = monthSummaries(data);
  const n = rows.length || 1;
  const sum = rows.reduce(
    (a, r) => ({ i: a.i + r.totalIn, o: a.o + r.totalOut, ov: a.ov + r.over }),
    { i: 0, o: 0, ov: 0 }
  );
  return {
    n: rows.length,
    avgIn: Math.round(sum.i / n),
    avgOut: Math.round(sum.o / n),
    avgOver: Math.round(sum.ov / n),
    totalOver: sum.ov,
    savingsRate: sum.i ? Math.round((sum.ov / sum.i) * 100) : 0,
  };
}

// Totalen per categorie over alle maanden (gesorteerd, hoog -> laag)
export function categoryTotals(data, type) {
  const map = {};
  for (const k of monthKeysSorted(data)) {
    for (const e of data.months[k][type]) {
      map[e.cat] = (map[e.cat] || 0) + e.amt;
    }
  }
  const rows = Object.entries(map)
    .map(([cat, amt]) => ({ cat, amt }))
    .filter((r) => r.amt > 0)
    .sort((a, b) => b.amt - a.amt);
  const total = rows.reduce((s, r) => s + r.amt, 0) || 1;
  return rows.map((r) => ({ ...r, pct: Math.round((r.amt / total) * 100) }));
}

// Beleggen: rij per leeftijd opzoeken
export function investByAge(investments, age) {
  return (investments || []).find((r) => r.age === age) || null;
}
