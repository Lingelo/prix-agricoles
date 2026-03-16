import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { PrixData, DateRange } from '../types.ts';
import { formatDateShort, formatIndex } from '../utils/format.ts';

interface Props {
  data: PrixData;
}

const RANGE_LABELS: Record<DateRange, string> = {
  '1a': '1 an',
  '2a': '2 ans',
  '5a': '5 ans',
  'all': 'Tout',
};

function getStartDate(range: DateRange): string | null {
  if (range === 'all') return null;
  const now = new Date();
  const years = range === '1a' ? 1 : range === '2a' ? 2 : 5;
  now.setFullYear(now.getFullYear() - years);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function PriceChart({ data }: Props) {
  const seriesEntries = Object.entries(data.series);
  const [range, setRange] = useState<DateRange>('2a');
  const [visible, setVisible] = useState<Set<string>>(() => new Set(['general']));

  const toggle = (key: string) => {
    setVisible(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const chartData = useMemo(() => {
    // Collect all dates from visible series
    const startDate = getStartDate(range);
    const dateSet = new Set<string>();
    for (const [key, series] of seriesEntries) {
      if (!visible.has(key)) continue;
      for (const pt of series.data) {
        if (startDate && pt.date < startDate) continue;
        dateSet.add(pt.date);
      }
    }

    const dates = [...dateSet].sort();

    // Build lookup maps
    const lookups = new Map<string, Map<string, number>>();
    for (const [key, series] of seriesEntries) {
      if (!visible.has(key)) continue;
      const m = new Map<string, number>();
      for (const pt of series.data) {
        m.set(pt.date, pt.value);
      }
      lookups.set(key, m);
    }

    return dates.map(date => {
      const row: Record<string, string | number> = { date };
      for (const [key, lookup] of lookups) {
        const val = lookup.get(date);
        if (val !== undefined) row[key] = val;
      }
      return row;
    });
  }, [seriesEntries, visible, range]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Evolution des indices
          </h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {(Object.entries(RANGE_LABELS) as [DateRange, string][]).map(([r, label]) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  range === r
                    ? 'bg-green-800 text-white font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Series toggles */}
        <div className="flex flex-wrap gap-2 mb-4">
          {seriesEntries.map(([key, series]) => (
            <label
              key={key}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs cursor-pointer border transition-colors ${
                visible.has(key)
                  ? 'border-current font-medium'
                  : 'border-gray-200 text-gray-400'
              }`}
              style={visible.has(key) ? { color: series.color } : undefined}
            >
              <input
                type="checkbox"
                checked={visible.has(key)}
                onChange={() => toggle(key)}
                className="sr-only"
              />
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: visible.has(key) ? series.color : '#d1d5db' }}
              />
              {series.label}
            </label>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[350px] sm:h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateShort}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                domain={['auto', 'auto']}
              />
              <ReferenceLine y={100} stroke="#9ca3af" strokeDasharray="6 3" label={{ value: 'Base 100', position: 'left', fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip
                labelFormatter={(label) => formatDateShort(String(label))}
                formatter={(value, name) => {
                  const series = data.series[String(name)];
                  return [formatIndex(Number(value)), series?.label ?? String(name)];
                }}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend
                formatter={(value: string) => data.series[value]?.label ?? value}
                wrapperStyle={{ fontSize: 11 }}
              />
              {seriesEntries
                .filter(([key]) => visible.has(key))
                .map(([key, series]) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={series.color}
                    strokeWidth={key === 'general' ? 2.5 : 1.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
