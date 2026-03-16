import { timeAgo } from '../utils/format';

interface Props {
  generatedAt?: string;
  onAboutClick: () => void;
}

export function Footer({ generatedAt, onAboutClick }: Props) {
  return (
    <footer className="bg-green-900 text-green-200 text-xs sm:text-sm px-4 sm:px-6 py-4 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p>
          Donnees :{' '}
          <a
            href="https://www.insee.fr/fr/statistiques/serie/010776593"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            INSEE — IPPAP Base 2020
          </a>
          {' · '}
          <button onClick={onAboutClick} className="underline hover:text-white">
            A propos
          </button>
        </p>
        {generatedAt && (
          <p className="text-green-300/70">
            Mise a jour {timeAgo(generatedAt)}
          </p>
        )}
      </div>
    </footer>
  );
}
