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

/** Format a date for chart axis (M/YY) */
export function formatDateShort(date: string): string {
  const [year, month] = date.split('-');
  return `${parseInt(month)}/${year.slice(2)}`;
}
