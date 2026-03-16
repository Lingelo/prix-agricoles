export interface DataPoint {
  date: string;
  value: number;
}

export interface SeriesData {
  label: string;
  color: string;
  data: DataPoint[];
}

export interface PrixData {
  meta: {
    generatedAt: string;
    base: string;
  };
  series: Record<string, SeriesData>;
}

export type DateRange = '1a' | '2a' | '5a' | 'all';
