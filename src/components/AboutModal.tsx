import { timeAgo } from '../utils/format';

interface Props {
  onClose: () => void;
  lastUpdate?: string;
}

export function AboutModal({ onClose, lastUpdate }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900">A propos</h2>
        <div className="mt-3 space-y-3 text-sm text-gray-600">
          <p>
            Cette application presente l'evolution des indices des prix des produits
            agricoles a la production (IPPAP) en France, base 2020 = 100. Elle
            permet de suivre les variations mensuelles et annuelles des prix par
            grande filiere agricole.
          </p>
          <p>
            <strong>Source :</strong> INSEE — Indices des prix des produits agricoles
            a la production (IPPAP), base 2020 = 100 ·{' '}
            <a
              href="https://bdm.insee.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              bdm.insee.fr
            </a>
          </p>
          <p>
            <strong>Licence :</strong> Licence Ouverte
          </p>
          {lastUpdate && (
            <p>
              <strong>Derniere mise a jour :</strong> {timeAgo(lastUpdate)}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
