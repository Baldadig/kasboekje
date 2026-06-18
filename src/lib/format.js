// Formatting & kleine helpers (Nederlands, euro)

const eur0 = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

// €1.234  (hele euro's, nl-NL notatie)
export function euro(n) {
  return eur0.format(Math.round(n || 0));
}

// +€1.234 / −€31  met expliciet teken (voor "over")
export function euroSigned(n) {
  const r = Math.round(n || 0);
  const sign = r < 0 ? '−' : '+';
  return sign + eur0.format(Math.abs(r));
}

const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];
const MAANDEN_KORT = [
  'jan', 'feb', 'mrt', 'apr', 'mei', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
];

export function maandLabel(month) {
  return MAANDEN[(month - 1) % 12];
}
export function maandKort(month) {
  return MAANDEN_KORT[(month - 1) % 12];
}

// "2026-06" -> "Juni 2026"
export function maandTitel(key) {
  const [y, m] = key.split('-').map(Number);
  const label = maandLabel(m);
  return label.charAt(0).toUpperCase() + label.slice(1) + ' ' + y;
}

// uniek id zonder externe lib
export function uid() {
  return 'e_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
