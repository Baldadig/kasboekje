import { useStore } from '../lib/store.jsx';

const TABS = [
  { id: 'overzicht', icon: '🏠', label: 'Overzicht' },
  { id: 'historie', icon: '📜', label: 'Historie' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'onderwerpen', icon: '🏷️', label: 'Onderwerpen' },
];

export default function Sidebar({ active, onNavigate }) {
  const { theme, setTheme } = useStore();
  return (
    <nav className="sidebar">
      <div className="brand">💸 Kasboekje</div>
      {TABS.map((t) => (
        <button
          key={t.id}
          className={'nav' + (active === t.id ? ' on' : '')}
          onClick={() => onNavigate(t.id)}
        >
          <span className="ic">{t.icon}</span>
          {t.label}
        </button>
      ))}
      <div className="spacer" />
      <div className="themesw">
        <div className="tlabel">🎨 Thema</div>
        <div className="themeopts">
          <button className={'themebtn' + (theme === 'notion' ? ' on' : '')} onClick={() => setTheme('notion')}>
            <span className="em">📝</span>Notion
          </button>
          <button className={'themebtn' + (theme === 'things' ? ' on' : '')} onClick={() => setTheme('things')}>
            <span className="em">🟦</span>Things
          </button>
          <button className={'themebtn' + (theme === 'brutalist' ? ' on' : '')} onClick={() => setTheme('brutalist')}>
            <span className="em">🟨</span>Bold
          </button>
        </div>
      </div>
      <div className="profile">
        <div className="avatar">A</div>
        <div>
          <div className="pn">Alex</div>
          <div className="ps">Ingelogd</div>
        </div>
      </div>
    </nav>
  );
}
