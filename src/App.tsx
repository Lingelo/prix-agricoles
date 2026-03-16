import { useData } from './hooks/useData.ts';
import { Header } from './components/Header.tsx';
import { StatsCards } from './components/StatsCards.tsx';
import { PriceChart } from './components/PriceChart.tsx';
import { YoyChart } from './components/YoyChart.tsx';
import { DataTable } from './components/DataTable.tsx';
import { Footer } from './components/Footer.tsx';

function App() {
  const { data, loading, error } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-gray-500 text-sm">Chargement des donnees...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 font-medium">Erreur de chargement</p>
          <p className="mt-1 text-gray-500 text-sm">{error ?? 'Donnees introuvables'}</p>
          <p className="mt-3 text-gray-400 text-xs">
            Executez <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">node scripts/fetch-data.mjs</code> pour generer les donnees.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <StatsCards data={data} />
        <PriceChart data={data} />
        <YoyChart data={data} />
        <DataTable data={data} />
      </main>
      <Footer generatedAt={data.meta.generatedAt} />
    </div>
  );
}

export default App;
