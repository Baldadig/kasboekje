// Emoji + kleur per categorie. Onbekende categorieën krijgen een nette fallback.
// Kleur wordt als zachte tint achter de emoji gebruikt (werkt in light én dark).

// Generieke financiële categorieën + de demo-set. Persoonlijke/echte categorie-
// namen worden NIET hardgecodeerd (die komen straks met je eigen data via login).
const META = {
  // Inkomsten
  'Salaris':         { emoji: '💼', hex: '#6d5ef0' },
  'Freelance':       { emoji: '🤝', hex: '#1d9e75' },
  'Bonus':           { emoji: '🎁', hex: '#d4537e' },
  'Spaarrente':      { emoji: '🏦', hex: '#378add' },
  'Vakantiegeld':    { emoji: '🏖️', hex: '#ef9f27' },
  'Spaarrekening':   { emoji: '🐷', hex: '#639922' },
  'Boodschappen':    { emoji: '🛒', hex: '#7cb342' },

  // Uitgaven
  'Huur':            { emoji: '🏠', hex: '#6d5ef0' },
  'Zorgverzekering': { emoji: '🏥', hex: '#e24b4a' },
  'Zorg':            { emoji: '🏥', hex: '#e24b4a' },
  'Sportschool':     { emoji: '🏋️', hex: '#ef9f27' },
  'Abonnementen':    { emoji: '📺', hex: '#8b5cf6' },
  'Uit eten':        { emoji: '🍽️', hex: '#ef9f27' },
  'Pensioen':        { emoji: '👴', hex: '#378add' },
  'Sparen':          { emoji: '🐷', hex: '#639922' },
  'Beleggen':        { emoji: '📈', hex: '#1d9e75' },
  'Belastingdienst': { emoji: '🧾', hex: '#6b7280' },
  'Vakantie':        { emoji: '🏖️', hex: '#ef9f27' },
  'Wintersport':     { emoji: '⛷️', hex: '#378add' },
};

const FALLBACK = { emoji: '💸', hex: '#888780' };

export function catMeta(name) {
  return META[name] || FALLBACK;
}

// Zachte tint-achtergrond voor de emoji-chip (hex -> rgba met lage alpha).
export function softTint(hex, alpha = 0.16) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Lijst met bekende categorieën per type (voor het keuzemenu bij invoer).
export const KNOWN_INCOME = [
  'Baldadig', 'Mr. Jealousy', 'Partnership', 'Rekening', 'Verzekering', 'Vakantiegeld', 'Boodschappen',
];
export const KNOWN_EXPENSE = [
  'Gezamelijke rek.', 'Zorg', 'Sportschool', 'Pensioen', 'Beleggen', 'Sparen',
  'Belastingdienst', 'Stufi terug', 'CC terug', 'Amex',
];

// Kleurenpalet voor onderwerpen
export const PALETTE = [
  '#6d5ef0', '#1d9e75', '#7cb342', '#4a8bf5', '#2c4f9e',
  '#e24b4a', '#ef9f27', '#8a8a8e', '#d4537e', '#16a89a',
];

// Standaard-onderwerpen (categorieën): naam, emoji, kleur, type,
// vast maandbedrag en of ze elke maand terugkomen (vaste last).
export const DEFAULT_ONDERWERPEN = [
  { name: 'Baldadig', emoji: '💼', color: '#6d5ef0', type: 'income', amount: 2000, recurring: true },
  { name: 'Mr. Jealousy', emoji: '😼', color: '#d4537e', type: 'income', amount: 2000, recurring: true },
  { name: 'Partnership', emoji: '🤝', color: '#16a89a', type: 'income', amount: 250, recurring: true },
  { name: 'Rekening', emoji: '🏦', color: '#4a8bf5', type: 'income', amount: 0, recurring: false },
  { name: 'Verzekering', emoji: '🛡️', color: '#0ea5b7', type: 'income', amount: 0, recurring: false },
  { name: 'Vakantiegeld', emoji: '🏖️', color: '#ef9f27', type: 'income', amount: 0, recurring: false },
  { name: 'Boodschappen', emoji: '🛒', color: '#7cb342', type: 'income', amount: 0, recurring: false },
  { name: 'Gezamelijke rek.', emoji: '🏠', color: '#6d5ef0', type: 'expense', amount: 1750, recurring: true },
  { name: 'Zorg', emoji: '🏥', color: '#e24b4a', type: 'expense', amount: 150, recurring: true },
  { name: 'Sportschool', emoji: '🏋️', color: '#ef9f27', type: 'expense', amount: 75, recurring: true },
  { name: 'Pensioen', emoji: '👴', color: '#4a8bf5', type: 'expense', amount: 100, recurring: true },
  { name: 'Beleggen', emoji: '📈', color: '#1d9e75', type: 'expense', amount: 150, recurring: true },
  { name: 'Sparen', emoji: '🐷', color: '#4a8bf5', type: 'expense', amount: 750, recurring: true },
  { name: 'Belastingdienst', emoji: '🧾', color: '#2c4f9e', type: 'expense', amount: 625, recurring: true },
  { name: 'Stufi terug', emoji: '🎓', color: '#8a8a8e', type: 'expense', amount: 175, recurring: true },
  { name: 'CC terug', emoji: '💳', color: '#2c4f9e', type: 'expense', amount: 0, recurring: false },
  { name: 'Amex', emoji: '💳', color: '#8b5cf6', type: 'expense', amount: 0, recurring: false },
];

// Stijl (emoji + kleur) voor een categorie-naam: eerst uit de onderwerpen,
// anders de ingebouwde fallback.
export function resolveCat(categories, name) {
  const n = (name || '').trim().toLowerCase();
  const o = (categories || []).find((c) => (c.name || '').toLowerCase() === n);
  if (o) return { emoji: o.emoji || '💸', hex: o.color || '#888780' };
  return catMeta(name);
}
