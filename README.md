# Prix Agricoles

Dashboard des indices de prix des produits agricoles a la production (IPPAP).

## Fonctionnalites

- 11 categories de produits agricoles
- Cartes statistiques avec variation mensuelle et annuelle
- Graphique d'evolution temporelle interactif avec toggles par categorie
- Variation annuelle en graphique a barres
- Tableau recapitulatif avec sparklines

## Sources de donnees

| Source | API / URL | Frequence |
|--------|-----------|-----------|
| Indices IPPAP (base 2020=100) | INSEE BDM API (SDMX) | Mensuelle |

Donnees mensuelles depuis 2020, consolidees dans `public/data/prix.json`.

## Commandes

```bash
npm run dev          # Serveur de developpement Vite
npm run build        # Build de production (tsc + vite build)
npm run lint         # ESLint
npm run preview      # Preview du build

node scripts/fetch-data.mjs   # Rafraichir les donnees depuis l'API INSEE
```

## Stack technique

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Recharts

## Mise a jour automatique des donnees

GitHub Actions workflow executant `fetch-data.mjs` le 1er de chaque mois a 8h UTC. Les nouvelles series mensuelles sont commitees automatiquement.

## Deploiement

GitHub Pages via GitHub Actions.
