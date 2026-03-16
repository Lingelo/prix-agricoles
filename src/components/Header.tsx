export function Header() {
  return (
    <header className="bg-green-900 text-white px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Prix Agricoles
        </h1>
        <p className="mt-1 text-green-200 text-sm sm:text-base">
          Indices des prix des produits agricoles a la production (IPPAP)
          — Base 2020 = 100 — Source INSEE
        </p>
      </div>
    </header>
  );
}
