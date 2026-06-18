import { useEffect, useState } from 'react';
import { StoreProvider, useStore, monthKeysSorted, monthTotals, nextMonthKey } from './lib/store.jsx';
import { maandTitel } from './lib/format.js';
import Sidebar from './components/Sidebar.jsx';
import Overview from './components/Overview.jsx';
import Historie from './components/Historie.jsx';
import Analytics from './components/Analytics.jsx';
import Onderwerpen from './components/Onderwerpen.jsx';

const TAB_TITLES = {
  historie: { icon: '📜', label: 'Historie' },
  analytics: { icon: '📊', label: 'Analytics' },
  onderwerpen: { icon: '🏷️', label: 'Onderwerpen' },
};

function subtitleFor(over) {
  if (over > 300) return 'Mooie maand — flink overgehouden 🎉';
  if (over >= 0) return 'Een rustige maand — netjes in balans 🙂';
  return 'Let op: deze maand meer uit dan in ⚠️';
}

function ThemeButtons() {
  const { theme, setTheme } = useStore();
  return (
    <>
      <button className={'themebtn' + (theme === 'notion' ? ' on' : '')} onClick={() => setTheme('notion')}>
        <span className="em">📝</span>Notion
      </button>
      <button className={'themebtn' + (theme === 'things' ? ' on' : '')} onClick={() => setTheme('things')}>
        <span className="em">🟦</span>Things
      </button>
      <button className={'themebtn' + (theme === 'brutalist' ? ' on' : '')} onClick={() => setTheme('brutalist')}>
        <span className="em">🟨</span>Bold
      </button>
    </>
  );
}

function AppInner() {
  const { data, theme, fillRecurring } = useStore();
  const keys = monthKeysSorted(data);
  const [tab, setTab] = useState('overzicht');
  const [monthKey, setMonthKey] = useState(keys[keys.length - 1]);

  function addMonth() {
    const nk = nextMonthKey(keys[keys.length - 1]);
    fillRecurring(nk);
    setMonthKey(nk);
    setTab('overzicht');
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const activeKey = keys.includes(monthKey) ? monthKey : keys[keys.length - 1];
  const totals = monthTotals(data.months[activeKey]);

  function openMonth(key) { setMonthKey(key); setTab('overzicht'); }

  return (
    <div className="app">
      <Sidebar active={tab} onNavigate={setTab} />

      <main className="main">
        <div className="mobithemewrap"><ThemeButtons /></div>

        {tab === 'overzicht' && (
          <>
            <div className="topbar">
              <div>
                <div className="h1">
                  <span className="h1word">Overzicht</span>
                  <span className="monthpick">
                    <span className="calic">📅</span>
                    <select className="mswitch" value={activeKey} onChange={(e) => setMonthKey(e.target.value)}>
                      {[...keys].reverse().map((k) => (
                        <option key={k} value={k}>{maandTitel(k)}</option>
                      ))}
                    </select>
                    <button className="addmonth" onClick={addMonth} title="Volgende maand toevoegen" aria-label="Volgende maand toevoegen">＋</button>
                  </span>
                </div>
                <div className="sub">{subtitleFor(totals.over)}</div>
              </div>
            </div>
            <Overview monthKey={activeKey} />
          </>
        )}

        {tab !== 'overzicht' && (
          <>
            <div className="topbar">
              <div className="h1">{TAB_TITLES[tab].icon} {TAB_TITLES[tab].label}</div>
            </div>
            {tab === 'historie' && <Historie onOpenMonth={openMonth} />}
            {tab === 'analytics' && <Analytics />}
            {tab === 'onderwerpen' && <Onderwerpen />}
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
