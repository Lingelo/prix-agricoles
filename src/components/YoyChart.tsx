import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import type { PrixData } from '../types.ts';
import { formatChange } from '../utils/format.ts';

interface Props {
  data: PrixData;
}

export function YoyChart({ data }: Props) {
  const chartData = useMemo(() => {
    return Object.entries(data.series).map(([key, series]) => {
      const pts = series.data;
      if (pts.length === 0) return null;

      const latest = pts[pts.length - 1];
      const [ly, lm] = latest.date.split('-');
      const targetDate = `${parseInt(ly) - 1}-${lm}`;
      const yoyPoint = pts.find(p => p.date === targetDate);

      if (!yoyPoint) return null;

      const change = ((latest.value - yoyPoint.value) / yoyPoint.value) * 100;

      return {
        key,
        label: series.label,
        color: series.color,
        change: parseFloat(change.toFixed(1)),
      };
    }).filter(Boolean) as { key: string; label: string; color: string; change: number }[];
  }, [data]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Variation annuelle (glissement sur 12 mois)
        </h2>
        <div className="h-[300px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11 }}
                width={95}
              />
              <ReferenceLine x={0} stroke="#6b7280" />
              <Tooltip
                formatter={(value) => [formatChange(Number(value)), 'Variation']}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={entry.change >= 0 ? '#16a34a' : '#dc2626'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
