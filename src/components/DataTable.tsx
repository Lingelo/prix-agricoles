import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { PrixData } from '../types.ts';
import { formatIndex, formatChange, formatDate } from '../utils/format.ts';

interface Props {
  data: PrixData;
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const chartData = values.map((v, i) => ({ i, v }));
  return (
    <div className="w-20 h-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DataTable({ data }: Props) {
  const entries = Object.entries(data.series);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dernieres valeurs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2 pr-4 font-medium">Serie</th>
                <th className="py-2 px-3 font-medium text-right">Valeur</th>
                <th className="py-2 px-3 font-medium text-right">Date</th>
                <th className="py-2 px-3 font-medium text-right">Var. /mois</th>
                <th className="py-2 px-3 font-medium text-right">Var. /an</th>
                <th className="py-2 pl-3 font-medium">Tendance 12 mois</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([key, series]) => {
                const pts = series.data;
                if (pts.length === 0) return null;

                const latest = pts[pts.length - 1];
                const prev = pts.length >= 2 ? pts[pts.length - 2] : null;
                const [ly, lm] = latest.date.split('-');
                const yoyDate = `${parseInt(ly) - 1}-${lm}`;
                const yoyPoint = pts.find(p => p.date === yoyDate);

                const momChange = prev
                  ? ((latest.value - prev.value) / prev.value) * 100
                  : null;
                const yoyChange = yoyPoint
                  ? ((latest.value - yoyPoint.value) / yoyPoint.value) * 100
                  : null;

                const last12 = pts.slice(-12).map(p => p.value);

                return (
                  <tr key={key} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: series.color }}
                        />
                        <span className="text-gray-900 font-medium">{series.label}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-gray-900">
                      {formatIndex(latest.value)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-500">
                      {formatDate(latest.date)}
                    </td>
                    <td className={`py-2.5 px-3 text-right ${momChange !== null && momChange >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {momChange !== null ? formatChange(momChange) : '-'}
                    </td>
                    <td className={`py-2.5 px-3 text-right ${yoyChange !== null && yoyChange >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {yoyChange !== null ? formatChange(yoyChange) : '-'}
                    </td>
                    <td className="py-2.5 pl-3">
                      <Sparkline values={last12} color={series.color} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
