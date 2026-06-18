import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { PALETTE, softTint } from '../lib/categories.js';
import { euro } from '../lib/format.js';

function Row({ cat, editing, onEdit, onClose }) {
  const { updateCategory, deleteCategory } = useStore();

  if (editing) {
    return (
      <div className="oedit">
        <div className="oerow">
          <input
            className="ofield oemoji"
            value={cat.emoji}
            maxLength={4}
            aria-label="Emoji"
            onChange={(e) => updateCategory(cat.id, { emoji: e.target.value })}
          />
          <input
            className="ofield oname"
            value={cat.name}
            placeholder="Naam onderwerp…"
            autoFocus
            onChange={(e) => updateCategory(cat.id, { name: e.target.value })}
          />
          <div className="oamtwrap">
            <span className="eur">€</span>
            <input
              className="ofield oamtin"
              inputMode="numeric"
              value={cat.amount || ''}
              placeholder="0"
              onChange={(e) => updateCategory(cat.id, { amount: parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0 })}
            />
            <span className="permnd">/mnd</span>
          </div>
        </div>

        <div className="olbl">Kleur</div>
        <div className="opal">
          {PALETTE.map((c) => (
            <button
              key={c}
              className={'opc' + (cat.color === c ? ' on' : '')}
              style={{ background: c }}
              aria-label={'Kleur ' + c}
              onClick={() => updateCategory(cat.id, { color: c })}
            />
          ))}
        </div>

        <div className="otoggle">
          <button
            className={'tg ' + (cat.recurring ? 'on' : 'off')}
            role="switch"
            aria-checked={cat.recurring}
            aria-label="Terugkerend"
            onClick={() => updateCategory(cat.id, { recurring: !cat.recurring })}
          />
          <span>Komt elke maand terug (vaste last)</span>
          <button className="odel" onClick={() => deleteCategory(cat.id)}>🗑️ Verwijderen</button>
          <button className="osave" onClick={onClose}>Klaar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orow">
      <div className="who" onClick={() => onEdit(cat.id)}>
        <span className="omk" style={{ '--cat': cat.color, background: softTint(cat.color || '#888780') }}>{cat.emoji}</span>
        <span className="onm">{cat.name || '— naamloos —'}</span>
        <span className="osw" style={{ background: cat.color }} />
      </div>
      <div className={'oamtd' + (cat.amount ? '' : ' var')} onClick={() => onEdit(cat.id)}>
        {cat.amount ? euro(cat.amount) : (cat.recurring ? '€0' : 'variabel')}
      </div>
      <button
        className={'tg ' + (cat.recurring ? 'on' : 'off')}
        role="switch"
        aria-checked={cat.recurring}
        aria-label="Terugkerend"
        onClick={() => updateCategory(cat.id, { recurring: !cat.recurring })}
      />
    </div>
  );
}

export default function Onderwerpen() {
  const { data, addCategory } = useStore();
  const [editId, setEditId] = useState(null);
  const cats = data.categories || [];
  const income = cats.filter((c) => c.type === 'income');
  const expense = cats.filter((c) => c.type === 'expense');

  function addNew(type) {
    const id = addCategory(type);
    setEditId(id);
  }

  const renderGroup = (type, list) => (
    <>
      {list.map((c) => (
        <Row key={c.id} cat={c} editing={editId === c.id} onEdit={setEditId} onClose={() => setEditId(null)} />
      ))}
      <button className="oadd" onClick={() => addNew(type)}><span className="plus">＋</span> Nieuw onderwerp</button>
    </>
  );

  return (
    <div className="onderwerpen">
      <p className="osub">Je vaste categorieën — kies een kleur, een vast maandbedrag en of ze elke maand terugkomen.</p>
      <div className="ocolh"><span>Onderwerp · kleur</span><span>Vast / mnd</span><span>Terugkerend</span></div>

      <div className="ogrp"><span className="ogd g" />Inkomsten</div>
      <div className="olist">{renderGroup('income', income)}</div>

      <div className="ogrp"><span className="ogd r" />Uitgaven</div>
      <div className="olist">{renderGroup('expense', expense)}</div>
    </div>
  );
}
