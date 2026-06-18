import { useStore, monthKeysSorted, monthTotals } from '../lib/store.jsx';
import { averages } from '../lib/analytics.js';
import { catMeta, softTint } from '../lib/categories.js';
import { euro, euroSigned, maandLabel } from '../lib/format.js';

function Row({ e, type }) {
  const meta = catMeta(e.cat || '');
  return (
    <div className="qrow">
      <span className="qem" style={{ background: softTint(meta.hex) }}>{meta.emoji}</span>
      <span className="qnm">{e.cat || '—'}</span>
      <span className={'qam' + (type === 'income' ? ' g' : '')}>{euro(e.amt)}</span>
    </div>
  );
}

function MonthBlock({ m, onOpen }) {
  const { totalIn, totalOut, over } = monthTotals(m);
  const cap = maandLabel(m.month);
  return (
    <button className="qblock" onClick={() => onOpen(m.key)}>
      <div className="qmh">
        <span className="qmn">{cap.charAt(0).toUpperCase() + cap.slice(1)}</span>
        <span className="qyr">{m.year}</span>
      </div>

      <div className="qsub"><span className="qdot g" /><span>Inkomsten</span><span className="qt">{euro(totalIn)}</span></div>
      {m.income.length === 0 && <div className="qempty">—</div>}
      {m.income.map((e) => <Row key={e.id} e={e} type="income" />)}

      <div className="qsub"><span className="qdot r" /><span>Uitgaven</span><span className="qt">{euro(totalOut)}</span></div>
      {m.expense.length === 0 && <div className="qempty">—</div>}
      {m.expense.map((e) => <Row key={e.id} e={e} type="expense" />)}

      <div className="qover">
        <span className="ql">💰 Over</span>
        <span className={'qv ' + (over >= 0 ? 'pos' : 'neg')}>{euroSigned(over)}</span>
      </div>
    </button>
  );
}

export default function Historie({ onOpenMonth }) {
  const { data } = useStore();
  const keys = monthKeysSorted(data); // chronologisch (oud → nieuw), net als je Excel
  const a = averages(data);

  return (
    <div>
      <div className="stats">
        <div className="stat">
          <div className="sl">💰 Totaal overgehouden</div>
          <div className={'sv ' + (a.totalOver >= 0 ? 'g' : 'r')}>{euroSigned(a.totalOver)}</div>
          <div className="sl" style={{ marginTop: 4, fontWeight: 600 }}>over {a.n} maanden</div>
        </div>
        <div className="stat">
          <div className="sl">📊 Gemiddeld per maand</div>
          <div className={'sv ' + (a.avgOver >= 0 ? 'g' : 'r')}>{euroSigned(a.avgOver)}</div>
          <div className="sl" style={{ marginTop: 4, fontWeight: 600 }}>{euro(a.avgIn)} in · {euro(a.avgOut)} uit</div>
        </div>
        <div className="stat">
          <div className="sl">🐷 Spaarquote</div>
          <div className="sv g">{a.savingsRate}%</div>
          <div className="sl" style={{ marginTop: 4, fontWeight: 600 }}>van je inkomsten</div>
        </div>
      </div>

      <div className="kwartaal">
        {keys.map((k) => <MonthBlock key={k} m={data.months[k]} onOpen={onOpenMonth} />)}
      </div>
    </div>
  );
}
