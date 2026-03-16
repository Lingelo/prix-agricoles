/** Format a number with 1 decimal place and French locale */
export function formatIndex(value: number): string {
  return value.toFixed(1).replace('.', ',');
}

/** Format a percentage change with sign and French locale */
export function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1).replace('.', ',')}%`;
}

/** Format a date string (YYYY-MM) to French display (janv. 2024) */
export function formatDate(date: string): string {
  const [year, month] = date.split('-');
  const months = [
    'janv.', 'fevr.', 'mars', 'avr.', 'mai', 'juin',
    'juil.', 'aout', 'sept.', 'oct.', 'nov.', 'dec.',
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}

/** French relative time string from ISO date */
export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `il y a ${mins} minute${mins > 1 ? 's' : ''}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  const months = Math.floor(days / 30);
  return `il y a ${months} mois`;
}

/** Format a date for chart axis (M/YY) */
export function formatDateShort(date: string): string {
  const [year, month] = date.split('-');
  return `${parseInt(month)}/${year.slice(2)}`;
}
