import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import seed from '../data/seed.json';
import { uid } from './format.js';
import { DEFAULT_ONDERWERPEN } from './categories.js';

function seedOnderwerpen() {
  return DEFAULT_ONDERWERPEN.map((o) => ({ id: uid(), ...o }));
}

// ───────────────────────────────────────────────────────────────────────────
// Data-store voor het kasboekje.
//
// Nu: opslag in localStorage (blijft per apparaat bewaard).
// Straks: dezelfde methodes (addEntry/updateEntry/deleteEntry) praten met
// Supabase, zodat je data overal hetzelfde is. De UI hoeft dan niet te wijzigen.
// ───────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'kasboekje_data_v1';
const THEME_KEY = 'kasboekje_theme';

function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'notion';
  } catch {
    return 'notion';
  }
}

// Seed -> genormaliseerde vorm met id's per regel (nodig om te kunnen wijzigen).
function buildInitial() {
  const months = {};
  for (const m of seed.months) {
    months[m.key] = {
      key: m.key,
      year: m.year,
      month: m.month,
      income: (m.income || []).map((r) => ({ id: uid(), cat: r.cat, amt: r.amt })),
      expense: (m.expense || []).map((r) => ({ id: uid(), cat: r.cat, amt: r.amt })),
    };
  }
  return {
    months,
    investments: seed.investments || [],
    investmentsKid: seed.investmentsKid || [],
    kidLabel: seed.kidLabel || 'Spaarpot kind',
    categories: seedOnderwerpen(),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (!d.categories) d.categories = seedOnderwerpen();
      return d;
    }
  } catch {
    /* val terug op seed */
  }
  return buildInitial();
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* opslag vol of geblokkeerd — negeren */
  }
}

// Vult een maand aan met de terugkerende onderwerpen (vaste lasten) die er nog
// niet in staan, met hun vaste maandbedrag. Maakt de maand aan als die ontbreekt.
function fillRecurringInto(d, key) {
  const recurring = (d.categories || []).filter((c) => c.recurring && c.name && c.name.trim());
  const cur = d.months[key] || { key, year: +key.slice(0, 4), month: +key.slice(5, 7), income: [], expense: [] };
  const income = [...cur.income];
  const expense = [...cur.expense];
  for (const c of recurring) {
    const list = c.type === 'income' ? income : expense;
    if (!list.some((e) => (e.cat || '').toLowerCase() === c.name.toLowerCase())) {
      list.push({ id: uid(), cat: c.name, amt: Math.round(c.amount || 0) });
    }
  }
  return { ...d, months: { ...d.months, [key]: { ...cur, income, expense } } };
}

// "2026-06" -> "2026-07"
export function nextMonthKey(key) {
  let [y, m] = key.split('-').map(Number);
  m += 1;
  if (m > 12) { m = 1; y += 1; }
  return y + '-' + String(m).padStart(2, '0');
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [data, setData] = useState(load);
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    save(data);
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* negeren */
    }
  }, [theme]);

  const api = useMemo(() => {
    function mutateMonth(key, fn) {
      setData((d) => {
        const cur = d.months[key] || { key, year: +key.slice(0, 4), month: +key.slice(5, 7), income: [], expense: [] };
        const next = fn({ ...cur, income: [...cur.income], expense: [...cur.expense] });
        return { ...d, months: { ...d.months, [key]: next } };
      });
    }

    return {
      addEntry(key, type, cat = '', amt = 0) {
        const id = uid();
        mutateMonth(key, (m) => {
          m[type] = [...m[type], { id, cat, amt: Math.round(amt) }];
          return m;
        });
        return id;
      },
      updateEntry(key, type, id, patch) {
        mutateMonth(key, (m) => {
          m[type] = m[type].map((e) =>
            e.id === id ? { ...e, ...patch, amt: patch.amt != null ? Math.round(patch.amt) : e.amt } : e
          );
          return m;
        });
      },
      deleteEntry(key, type, id) {
        mutateMonth(key, (m) => {
          m[type] = m[type].filter((e) => e.id !== id);
          return m;
        });
      },
      addCategory(type) {
        const id = uid();
        setData((d) => ({
          ...d,
          categories: [...(d.categories || []), { id, name: '', emoji: '🏷️', color: '#6d5ef0', type, amount: 0, recurring: false }],
        }));
        return id;
      },
      updateCategory(id, patch) {
        setData((d) => ({
          ...d,
          categories: (d.categories || []).map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
      },
      deleteCategory(id) {
        setData((d) => ({ ...d, categories: (d.categories || []).filter((c) => c.id !== id) }));
      },
      fillRecurring(key) {
        setData((d) => fillRecurringInto(d, key));
      },
      resetToSeed() {
        const fresh = buildInitial();
        setData(fresh);
      },
    };
  }, []);

  const value = useMemo(() => ({ data, theme, setTheme, ...api }), [data, theme, api]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore moet binnen StoreProvider gebruikt worden');
  return ctx;
}

// Afgeleide helpers
export function monthKeysSorted(data) {
  return Object.keys(data.months).sort();
}
export function monthTotals(m) {
  const totalIn = (m.income || []).reduce((s, e) => s + e.amt, 0);
  const totalOut = (m.expense || []).reduce((s, e) => s + e.amt, 0);
  return { totalIn, totalOut, over: totalIn - totalOut };
}
