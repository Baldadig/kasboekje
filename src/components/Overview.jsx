import { useState } from 'react';
import { useStore, monthKeysSorted, monthTotals } from '../lib/store.jsx';
import { KNOWN_INCOME, KNOWN_EXPENSE } from '../lib/categories.js';
import { euro, euroSigned, maandKort } from '../lib/format.js';
import EditableRow from './EditableRow.jsx';

export default function Overview({ monthKey }) {
  const { data, addEntry } = useStore();
  const [focusId, setFocusId] = useState(null);
  const keys = monthKeysSorted(data);
  const month = data.months[monthKey] || { income: [], expense: [], year: +monthKey.slice(0, 4) };
  const { totalIn, totalOut, over } = monthTotals(month);

  // Trend: tot 12 maanden eindigend bij de geselecteerde maand
  const idx = keys.indexOf(monthKey);
  const window = keys.slice(Math.max(0, idx - 11), idx + 1);
  const trend = window.map((k) => ({ key: k, month: data.months[k].month, over: monthTotals(data.months[k]).over }));
  const maxAbs = Math.max(1, ...trend.map((t) => Math.abs(t.over)));
  const overValues = trend.map((t) => t.over);
  const avg = overValues.length ? Math.round(overValues.reduce((a, b) => a + b, 0) / overValues.length) : 0;
  const best = overValues.length ? Math.max(...overValues) : 0;

  const positive = over >= 0;
  const inWidth = Math.max(totalIn, totalOut) === 0 ? 0 : Math.round((totalIn / Math.max(totalIn, totalOut)) * 100);
  const utWidth = Math.max(totalIn, totalOut) === 0 ? 0 : Math.round((totalOut / Math.max(totalIn, totalOut)) * 100);

  function add(type) {
    const id = addEntry(monthKey, type);
    setFocusId(id);
  }

  const renderRows = (type, list) => (
    <>
      {list.map((e) => (
        <EditableRow
          key={e.id}
          monthKey={monthKey}
          type={type}
          entry={e}
          listId={type === 'income' ? 'cats-in' : 'cats-out'}
          autoFocus={e.id === focusId}
        />
      ))}
      <button className="addrow" onClick={() => add(type)}>
        <span className="plus">＋</span> Regel toevoegen
      </button>
    </>
  );

  return (
    <div className="grid">
      {/* HERO */}
      <div className="tile hero span2">
        <div className="hcol-l">
          <div className="htt">📊 Over deze maand</div>
          <div className={'big ' + (positive ? 'pos' : 'neg')}>{euroSigned(over)}</div>
          <div className="hsub">{euro(totalIn)} binnen · {euro(totalOut)} uit</div>
        </div>
        <div className="hcol-r">
          <div className="hstat in">
            <div className="k">📈 Inkomsten</div>
            <div className="v in">{euro(totalIn)}</div>
          </div>
          <div className="hstat ut">
            <div className="k">📉 Uitgaven</div>
            <div className="v ut">{euro(totalOut)}</div>
          </div>
        </div>
      </div>

      {/* TREND */}
      <div className="tile span2">
        <div className="tt">📈 Verloop ‘Over’ · laatste {trend.length} maanden</div>
        <div className="chart">
          {trend.map((t) => {
            const h = Math.max(6, Math.round((Math.abs(t.over) / maxAbs) * 100));
            const cls = 'cbar' + (t.over < 0 ? ' neg' : '') + (t.key === monthKey ? ' cur' : '');
            return (
              <div className="ccol" key={t.key} title={euroSigned(t.over)}>
                <div className={cls} style={{ height: h + '%' }} />
                <div className="cmo">{maandKort(t.month)}</div>
              </div>
            );
          })}
        </div>
        <div className="chcap">
          <span>Gemiddeld <b className="g">{euroSigned(avg)}</b> over per maand</span>
          <span>Beste maand <b className="g">{euroSigned(best)}</b></span>
        </div>
      </div>

      {/* INKOMSTEN */}
      <div className="tile">
        <div className="lhead">
          <div className="tt">💚 Inkomsten</div>
          <span className="pill g">{euroSigned(totalIn)}</span>
        </div>
        {renderRows('income', month.income)}
      </div>

      {/* UITGAVEN */}
      <div className="tile">
        <div className="lhead">
          <div className="tt">🔥 Uitgaven</div>
          <span className="pill r">{euroSigned(-totalOut)}</span>
        </div>
        {renderRows('expense', month.expense)}
      </div>

      <datalist id="cats-in">{KNOWN_INCOME.map((c) => <option key={c} value={c} />)}</datalist>
      <datalist id="cats-out">{KNOWN_EXPENSE.map((c) => <option key={c} value={c} />)}</datalist>
    </div>
  );
}
