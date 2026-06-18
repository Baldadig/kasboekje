import { useStore } from '../lib/store.jsx';
import { monthSummaries, averages } from '../lib/analytics.js';
import { euro, euroSigned, maandTitel } from '../lib/format.js';

export default function Historie({ onOpenMonth }) {
  const { data } = useStore();
  const rows = monthSummaries(data).slice().reverse(); // nieuwste eerst
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

      <div className="hlist">
        {rows.map((r) => (
          <button key={r.key} className="hrow" onClick={() => onOpenMonth(r.key)}>
            <div className="hm">
              <div className="hm-name">{maandTitel(r.key)}</div>
              <div className="hsub">{euro(r.totalIn)} in · {euro(r.totalOut)} uit</div>
            </div>
            <div className="hnums">
              <span className="hn g">↑ {euro(r.totalIn)}</span>
              <span className="hn r">↓ {euro(r.totalOut)}</span>
            </div>
            <span className={'pill ' + (r.over >= 0 ? 'g' : 'r')}>{euroSigned(r.over)}</span>
            <span className="hchev">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
