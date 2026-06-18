import { useStore } from '../lib/store.jsx';
import { monthSummaries, averages, categoryTotals } from '../lib/analytics.js';
import { resolveCat, softTint } from '../lib/categories.js';
import { euro, euroSigned, maandKort } from '../lib/format.js';

function CatBars({ rows, max }) {
  const { data } = useStore();
  return (
    <div className="clist">
      {rows.map((r) => {
        const meta = resolveCat(data.categories, r.cat);
        return (
          <div className="crow" key={r.cat}>
            <span className="lem" style={{ background: softTint(meta.hex) }}>{meta.emoji}</span>
            <div className="cmeta">
              <div className="cname">{r.cat}</div>
              <div className="ctrack">
                <i style={{ width: Math.max(3, Math.round((r.amt / max) * 100)) + '%', background: meta.hex }} />
              </div>
            </div>
            <div className="camt">{euro(r.amt)}<span className="cpct">{r.pct}%</span></div>
          </div>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const { data } = useStore();
  const a = averages(data);
  const months = monthSummaries(data).slice(-12);
  const maxBar = Math.max(1, ...months.map((m) => Math.max(m.totalIn, m.totalOut)));
  const maxOverAbs = Math.max(1, ...months.map((m) => Math.abs(m.over)));

  const expense = categoryTotals(data, 'expense').slice(0, 8);
  const income = categoryTotals(data, 'income').slice(0, 6);
  const maxExp = Math.max(1, ...expense.map((r) => r.amt));
  const maxInc = Math.max(1, ...income.map((r) => r.amt));

  return (
    <div>
      <div className="stats four">
        <div className="stat"><div className="sl">📈 Gem. inkomsten</div><div className="sv g">{euro(a.avgIn)}</div></div>
        <div className="stat"><div className="sl">📉 Gem. uitgaven</div><div className="sv r">{euro(a.avgOut)}</div></div>
        <div className="stat"><div className="sl">💸 Gem. over</div><div className={'sv ' + (a.avgOver >= 0 ? 'g' : 'r')}>{euroSigned(a.avgOver)}</div></div>
        <div className="stat"><div className="sl">🐷 Spaarquote</div><div className="sv g">{a.savingsRate}%</div></div>
      </div>

      <div className="grid">
        <div className="tile span2">
          <div className="tt" style={{ marginBottom: 4 }}>📈 Verloop ‘Over’ · laatste {months.length} maanden</div>
          <div className="chart">
            {months.map((m) => {
              const h = Math.max(6, Math.round((Math.abs(m.over) / maxOverAbs) * 100));
              return (
                <div className="ccol" key={m.key} title={euroSigned(m.over)}>
                  <div className={'cbar' + (m.over < 0 ? ' neg' : '')} style={{ height: h + '%' }} />
                  <div className="cmo">{maandKort(m.month)}</div>
                </div>
              );
            })}
          </div>
          <div className="chcap">
            <span>Gemiddeld <b className="g">{euroSigned(a.avgOver)}</b> over per maand</span>
            <span>Beste maand <b className="g">{euroSigned(Math.max(...months.map((m) => m.over)))}</b></span>
          </div>
        </div>

        <div className="tile span2">
          <div className="lhead">
            <div className="tt">📊 Inkomsten vs uitgaven · laatste {months.length} maanden</div>
            <div className="legend">
              <span><i className="dotg" /> Inkomsten</span>
              <span><i className="dotr" /> Uitgaven</span>
            </div>
          </div>
          <div className="gchart">
            {months.map((m) => (
              <div className="gcol" key={m.key} title={`${euro(m.totalIn)} in · ${euro(m.totalOut)} uit`}>
                <div className="gbars">
                  <div className="gbar gi" style={{ height: Math.round((m.totalIn / maxBar) * 100) + '%' }} />
                  <div className="gbar gu" style={{ height: Math.round((m.totalOut / maxBar) * 100) + '%' }} />
                </div>
                <div className="cmo">{maandKort(m.month)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tile">
          <div className="tt" style={{ marginBottom: 12 }}>🔥 Grootste uitgaven</div>
          <CatBars rows={expense} max={maxExp} />
        </div>

        <div className="tile">
          <div className="tt" style={{ marginBottom: 12 }}>💚 Inkomstenbronnen</div>
          <CatBars rows={income} max={maxInc} />
        </div>
      </div>
    </div>
  );
}
