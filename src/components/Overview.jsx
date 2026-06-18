import { useState } from 'react';
import { useStore, monthTotals } from '../lib/store.jsx';
import { KNOWN_INCOME, KNOWN_EXPENSE } from '../lib/categories.js';
import { euro, euroSigned } from '../lib/format.js';
import EditableRow from './EditableRow.jsx';

export default function Overview({ monthKey }) {
  const { data, addEntry, fillRecurring } = useStore();
  const [focusId, setFocusId] = useState(null);
  const month = data.months[monthKey] || { income: [], expense: [], year: +monthKey.slice(0, 4) };
  const { totalIn, totalOut, over } = monthTotals(month);

  // Terugkerende onderwerpen (vaste lasten) die nog niet in deze maand staan
  const present = new Set([...month.income, ...month.expense].map((e) => (e.cat || '').toLowerCase()));
  const missing = (data.categories || []).filter(
    (c) => c.recurring && c.name && c.name.trim() && !present.has(c.name.toLowerCase())
  );

  const positive = over >= 0;
  // Pie-vulling op de groepskoppen (Things-stijl):
  //  Inkomsten = vol als de maand uit kan (over >= 0), anders dekkingsgraad
  //  Uitgaven = % van je inkomsten dat je deze maand uitgeeft
  const incomePie = totalOut === 0 ? 100 : (over >= 0 ? 100 : Math.round((totalIn / totalOut) * 100));
  const expensePie = totalIn === 0 ? 100 : Math.min(100, Math.round((totalOut / totalIn) * 100));

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

      {/* AUTO-VULLEN vaste lasten */}
      {missing.length > 0 && (
        <button className="fillbtn span2" onClick={() => fillRecurring(monthKey)}>
          <span className="fillmain">🔁 Vul {missing.length} vaste {missing.length === 1 ? 'last' : 'lasten'} aan</span>
          <span className="fillsub">{missing.map((c) => `${c.emoji} ${c.name}`).join('  ·  ')}</span>
        </button>
      )}

      {/* INKOMSTEN */}
      <div className="tile">
        <div className="lhead">
          <div className="ghead">
            <span className="gpie gin" style={{ '--p': incomePie + '%' }} aria-hidden="true"></span>
            <span className="gemoji">💚</span>
            <span className="tt">Inkomsten</span>
          </div>
          <span className="pill g">{euroSigned(totalIn)}</span>
        </div>
        {renderRows('income', month.income)}
      </div>

      {/* UITGAVEN */}
      <div className="tile">
        <div className="lhead">
          <div className="ghead">
            <span className="gpie gut" style={{ '--p': expensePie + '%' }} aria-hidden="true"></span>
            <span className="gemoji">🔥</span>
            <span className="tt">Uitgaven</span>
          </div>
          <span className="pill r">{euroSigned(-totalOut)}</span>
        </div>
        {renderRows('expense', month.expense)}
      </div>

      <datalist id="cats-in">{KNOWN_INCOME.map((c) => <option key={c} value={c} />)}</datalist>
      <datalist id="cats-out">{KNOWN_EXPENSE.map((c) => <option key={c} value={c} />)}</datalist>

      {/* Magic-＋ (zwevend, Things-stijl) */}
      <button className="magicfab" onClick={() => add('expense')} aria-label="Nieuwe boeking">＋</button>
    </div>
  );
}
