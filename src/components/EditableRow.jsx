import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { catMeta, softTint } from '../lib/categories.js';

// Eén inline-bewerkbare regel: categorie + bedrag, direct typen zoals in Excel.
export default function EditableRow({ monthKey, type, entry, listId, autoFocus }) {
  const { updateEntry, deleteEntry } = useStore();
  const [cat, setCat] = useState(entry.cat);
  const [amt, setAmt] = useState(entry.amt ? String(entry.amt) : '');
  const meta = catMeta(cat || '');

  function commitCat() {
    const v = cat.trim();
    if (v !== entry.cat) updateEntry(monthKey, type, entry.id, { cat: v });
  }
  function commitAmt() {
    const n = parseInt(amt, 10);
    const val = Number.isNaN(n) ? 0 : n;
    if (val !== entry.amt) updateEntry(monthKey, type, entry.id, { amt: val });
    setAmt(val ? String(val) : '');
  }

  return (
    <div className={'erow ' + type}>
      <span className="lem" style={{ '--cat': meta.hex, background: softTint(meta.hex) }}>{meta.emoji}</span>
      <div className="cellcat">
        <input
          className="cell-in"
          list={listId}
          value={cat}
          placeholder="Categorie…"
          autoFocus={autoFocus}
          onChange={(e) => setCat(e.target.value)}
          onBlur={commitCat}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        />
      </div>
      <div className="cellamt" style={{ display: 'flex', alignItems: 'center' }}>
        <span className="eur">€</span>
        <input
          className="cell-in"
          inputMode="numeric"
          value={amt}
          placeholder="0"
          onChange={(e) => setAmt(e.target.value.replace(/[^0-9]/g, ''))}
          onBlur={commitAmt}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        />
      </div>
      <button className="del" onClick={() => deleteEntry(monthKey, type, entry.id)} aria-label="Regel verwijderen">✕</button>
    </div>
  );
}
