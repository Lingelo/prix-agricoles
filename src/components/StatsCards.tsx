import type { PrixData } from '../types.ts';
import { formatIndex, formatChange, formatDate } from '../utils/format.ts';

interface Props {
  data: PrixData;
}

export function StatsCards({ data }: Props) {
  const entries = Object.entries(data.series);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {entries.map(([key, series]) => {
          const pts = series.data;
          if (pts.length === 0) return null;

          const latest = pts[pts.length - 1];
          const prev = pts.length >= 2 ? pts[pts.length - 2] : null;
          const yoyPoint = pts.find(p => {
            const [ly, lm] = latest.date.split('-');
            const targetYear = String(parseInt(ly) - 1);
            const targetMonth = lm;
            return p.date === `${targetYear}-${targetMonth}`;
          });

          const momChange = prev ? ((latest.value - prev.value) / prev.value) * 100 : null;
          const yoyChange = yoyPoint ? ((latest.value - yoyPoint.value) / yoyPoint.value) * 100 : null;

          return (
            <div
              key={key}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3"
              style={{ borderLeftColor: series.color, borderLeftWidth: 4 }}
            >
              <p className="text-xs text-gray-500 truncate" title={series.label}>
                {series.label}
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {formatIndex(latest.value)}
              </p>
              <p className="text-[10px] text-gray-400">{formatDate(latest.date)}</p>
              <div className="mt-1.5 flex flex-col gap-0.5 text-xs">
                {momChange !== null && (
                  <span className={momChange >= 0 ? 'text-green-700' : 'text-red-600'}>
                    {momChange >= 0 ? '\u2191' : '\u2193'} {formatChange(momChange)} /mois
                  </span>
                )}
                {yoyChange !== null && (
                  <span className={yoyChange >= 0 ? 'text-green-700' : 'text-red-600'}>
                    {yoyChange >= 0 ? '\u2191' : '\u2193'} {formatChange(yoyChange)} /an
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
