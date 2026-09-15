# New Dance Club — Maquette : Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire une maquette de site (Accueil, Nos cours, Contact) pour New Dance Club, prête à démarcher le club, avec un contenu déjà séparé du code pour brancher un CMS plus tard.

**Architecture:** Site statique Astro 5 + Tailwind CSS v4. Le contenu (horaires, danses, événements, sponsors) vit dans des content collections Astro validées par zod dans `src/content.config.ts`. Les pages assemblent des composants Astro qui consomment ces collections. Deux fonctions pures (`src/lib/niveaux.ts`, `src/lib/evenements.ts`) portent la seule logique métier testable unitairement ; le reste est vérifié par build + inspection du HTML généré.

**Tech Stack:** Astro 5, `@tailwindcss/vite` (Tailwind v4), Fontsource (Fraunces, Figtree), Vitest (avec `getViteConfig` pour résoudre `astro:content` dans les tests), déploiement Netlify (site statique + Netlify Forms).

**Spec:** `docs/superpowers/specs/2026-09-15-new-dance-club-maquette-design.md`

## Global Constraints

- Couleurs exactes : bordeaux `#7A1F2B`, or `#D9A441`, crème `#FBF5EC`, brun `#2A1A14`. L'or ne sert jamais de couleur de texte sur fond crème.
- Typographie : Fraunces (titres), Figtree (texte), auto-hébergées via Fontsource — pas de Google Fonts CDN.
- Zéro JavaScript, sauf le menu mobile (implémenté sans JS via `<details>`/`<summary>`) et le formulaire de contact (script minimal de confirmation).
- Mobile-first ; vérifié visuellement à 375px et 1440px.
- Tout le contenu éditable (horaires, danses, événements, sponsors) vit dans `src/content`, jamais en dur dans une page ou un composant.
- Un niveau ou une donnée invalide dans le contenu fait échouer `astro build` avec un message explicite (validation zod).
- Node ≥ 20 (installé : v24.19.0), npm ≥ 10 (installé : 12.0.2).
- Données manquantes affichées comme placeholders visibles, jamais inventées : tarifs (« Tarifs : contactez-nous »), adresse de la salle de Hannut, sponsors (« Partenaire à ajouter »), 2 événements du calendrier marqués « (exemple) ».
- Aucune vraie photo du club : les albums du site actuel ont été inspectés (buffets, déguisements de fêtes, photos hors-sujet ou mal cadrées) et ne contiennent aucune image exploitable pour une page d'accueil. La maquette utilise des fonds dégradés et motifs SVG décoratifs à la place. Le club pourra fournir de vraies photos plus tard.
- Formulaire de contact : dans la maquette, la soumission est interceptée en JavaScript et n'envoie rien réellement (confirmation visuelle uniquement). Les attributs Netlify Forms sont déjà en place pour activer l'envoi réel en une étape le jour où le site passe en production.

---

## Task 1 : Scaffold Astro + Tailwind + polices + structure de base

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `src/styles/global.css`
- Create: `src/layouts/Base.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/cours.astro`
- Create: `src/pages/contact.astro`

**Interfaces:**
- Produces: `Base.astro` avec `Props { title: string; description: string }`, rend `<slot />` entre `<Header />` et `<Footer />`. Toutes les pages suivantes l'utilisent ainsi : `<Base title="..." description="..."> ... </Base>`.
- Produces: variables CSS Tailwind `bg-bordeaux`, `text-bordeaux`, `bg-or`, `text-or`, `bg-creme`, `text-creme`, `bg-brun`, `text-brun`, `font-display`, `font-body`, utilisables dans tous les composants suivants.

- [ ] **Step 1 : Écrire `package.json`**

```json
{
  "name": "new-dance-club",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "@fontsource/figtree": "^5.0.0",
    "@fontsource/fraunces": "^5.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2 : Écrire `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://new-dance-club.netlify.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3 : Écrire `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4 : Écrire `vitest.config.ts`**

Ce fichier utilise `getViteConfig` d'Astro pour que les tests puissent résoudre `astro:content` et `astro:assets` exactement comme le fait `astro build` (nécessaire pour la Task 2).

```ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'node',
  },
});
```

- [ ] **Step 5 : Écrire `.gitignore`**

```
node_modules/
dist/
.astro/
.env
```

- [ ] **Step 6 : Installer les dépendances**

Run: `npm install`
Expected: installation sans erreur, `node_modules/` créé.

- [ ] **Step 7 : Écrire `src/styles/global.css`**

```css
@import "tailwindcss";
@import "@fontsource/fraunces/400.css";
@import "@fontsource/fraunces/600.css";
@import "@fontsource/figtree/400.css";
@import "@fontsource/figtree/600.css";

@theme {
  --color-bordeaux: #7A1F2B;
  --color-or: #D9A441;
  --color-creme: #FBF5EC;
  --color-brun: #2A1A14;
  --font-display: "Fraunces", ui-serif, serif;
  --font-body: "Figtree", ui-sans-serif, sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 8 : Écrire `src/components/Header.astro`**

```astro
---
const liens = [
  { href: '/', label: 'Accueil' },
  { href: '/cours', label: 'Nos cours' },
  { href: '/contact', label: 'Contact' },
];
const currentPath = Astro.url.pathname;
---
<header class="sticky top-0 z-40 border-b border-brun/10 bg-creme/95 backdrop-blur">
  <div class="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="/" class="font-display text-xl font-semibold text-bordeaux">New Dance Club</a>

    <nav class="hidden items-center gap-6 sm:flex">
      {liens.map((lien) => (
        <a
          href={lien.href}
          class={`text-sm font-semibold ${currentPath === lien.href ? 'text-bordeaux' : 'text-brun/70 hover:text-bordeaux'}`}
        >
          {lien.label}
        </a>
      ))}
      <a href="/contact" class="rounded-full bg-bordeaux px-5 py-2 text-sm font-semibold text-creme hover:bg-bordeaux/90">
        Venir essayer
      </a>
    </nav>

    <details class="sm:hidden">
      <summary class="cursor-pointer list-none rounded-lg border border-brun/20 px-3 py-2 text-sm font-semibold text-brun">
        Menu
      </summary>
      <nav class="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-brun/10 bg-creme px-6 py-4 shadow-md">
        {liens.map((lien) => (
          <a href={lien.href} class="py-2 text-sm font-semibold text-brun/80 hover:text-bordeaux">
            {lien.label}
          </a>
        ))}
        <a href="/contact" class="mt-2 rounded-full bg-bordeaux px-5 py-2 text-center text-sm font-semibold text-creme">
          Venir essayer
        </a>
      </nav>
    </details>
  </div>
</header>
```

- [ ] **Step 9 : Écrire `src/components/Footer.astro`**

```astro
---
const annee = new Date().getFullYear();
---
<footer class="border-t border-brun/10 bg-creme px-6 py-10 text-sm text-brun/70">
  <div class="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <p class="font-display text-lg font-semibold text-bordeaux">New Dance Club</p>
      <p class="mt-2">Rue des Tanneurs 4, 1350 Jandrain</p>
      <p><a href="tel:+32495326647" class="hover:text-bordeaux">0495/32.66.47</a></p>
      <p><a href="mailto:ndc1350@gmail.com" class="hover:text-bordeaux">ndc1350@gmail.com</a></p>
    </div>
    <div class="flex flex-col gap-2">
      <a href="/" class="hover:text-bordeaux">Accueil</a>
      <a href="/cours" class="hover:text-bordeaux">Nos cours</a>
      <a href="/contact" class="hover:text-bordeaux">Contact</a>
      <a href="https://www.facebook.com/profile.php?id=100057211669508" class="hover:text-bordeaux">Facebook</a>
    </div>
  </div>
  <p class="mx-auto mt-8 max-w-6xl border-t border-brun/10 pt-6 text-xs text-brun/50">
    © {annee} New Dance Club — Maquette de démonstration.
  </p>
</footer>
```

- [ ] **Step 10 : Écrire `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

export interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
const url = new URL(Astro.url.pathname, Astro.site);
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'DanceSchool',
  name: 'New Dance Club',
  url: Astro.site?.toString(),
  telephone: '+32495326647',
  email: 'ndc1350@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rue des Tanneurs 4',
    postalCode: '1350',
    addressLocality: 'Jandrain',
    addressCountry: 'BE',
  },
};
---
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <script type="application/ld+json" set:html={JSON.stringify(structuredData)} />
  </head>
  <body class="bg-creme font-body text-brun antialiased">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 11 : Écrire les 3 pages (placeholder de contenu, layout final)**

`src/pages/index.astro` :

```astro
---
import Base from '../layouts/Base.astro';
---
<Base
  title="New Dance Club — Cours de danse à Hannut et Jandrain"
  description="Cours de danse pour tous niveaux à Hannut et Jandrain."
>
  <h1 class="mx-auto max-w-4xl px-6 py-16 font-display text-3xl text-brun">Accueil</h1>
</Base>
```

`src/pages/cours.astro` :

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Nos cours — New Dance Club" description="Horaires et danses du New Dance Club.">
  <h1 class="mx-auto max-w-4xl px-6 py-16 font-display text-3xl text-brun">Nos cours</h1>
</Base>
```

`src/pages/contact.astro` :

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Contact — New Dance Club" description="Contactez le New Dance Club à Jandrain.">
  <h1 class="mx-auto max-w-4xl px-6 py-16 font-display text-3xl text-brun">Contact</h1>
</Base>
```

- [ ] **Step 12 : Build et vérification**

Run: `npm run build`
Expected: build réussi, dossier `dist/` créé.

Run: `grep -l "New Dance Club" dist/index.html dist/cours/index.html dist/contact/index.html`
Expected: les 3 fichiers listés (logo du header présent partout).

Run: `grep -c "Rue des Tanneurs" dist/index.html`
Expected: `1` (adresse du footer présente).

- [ ] **Step 13 : Commit**

```bash
git add package.json astro.config.mjs tsconfig.json vitest.config.ts .gitignore src package-lock.json
git commit -m "feat: scaffold Astro + Tailwind + layout de base

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 2 : Collections de contenu (schémas + données)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content.config.test.ts`
- Create: `src/content/horaires.json`
- Create: `src/content/danses/01-solo-line-dance.md`
- Create: `src/content/danses/02-rock-salsa-bachata.md`
- Create: `src/content/danses/03-danses-standard.md`
- Create: `src/content/danses/04-danses-latines.md`
- Create: `src/content/evenements.json`
- Create: `src/content/sponsors.json`

**Interfaces:**
- Consumes: rien (première tâche à définir le contenu).
- Produces: `export const creneauSchema` (zod), `export const collections` avec les clés `horaires`, `danses`, `evenements`, `sponsors`. Chaque entrée de `danses` a `data: { titre: string; slug: string; ordre: number; couleur: 'bordeaux' | 'or'; danses: { nom: string; description: string }[] }`. Chaque entrée de `evenements` a `data: { date: Date; titre: string; lieu: string; description: string; exemple: boolean }`. Chaque entrée de `horaires` a `data: { jour: string; lieu: string; label?: string; creneaux: { heure: string; cours: string; niveau: 'debutant' | 'intermediaire' | 'avance' | 'tous' }[] }`. Ces formes sont utilisées telles quelles dans les Tasks 4 à 6.

- [ ] **Step 1 : Écrire le test du schéma (échoue, le fichier n'existe pas encore)**

`src/content.config.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { creneauSchema } from './content.config';

describe('creneauSchema', () => {
  it('accepte un créneau valide', () => {
    const resultat = creneauSchema.safeParse({
      heure: '18h15',
      cours: 'Danses solo — Débutants',
      niveau: 'debutant',
    });
    expect(resultat.success).toBe(true);
  });

  it('rejette un niveau inconnu', () => {
    const resultat = creneauSchema.safeParse({
      heure: '18h15',
      cours: 'Danses solo — Débutants',
      niveau: 'expert',
    });
    expect(resultat.success).toBe(false);
  });
});
```

- [ ] **Step 2 : Lancer le test, vérifier qu'il échoue**

Run: `npm run test`
Expected: FAIL — `Cannot find module './content.config'` (ou équivalent).

- [ ] **Step 3 : Écrire `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

export const creneauSchema = z.object({
  heure: z.string(),
  cours: z.string(),
  niveau: z.enum(['debutant', 'intermediaire', 'avance', 'tous']),
});

const horaires = defineCollection({
  loader: file('src/content/horaires.json'),
  schema: z.object({
    jour: z.string(),
    lieu: z.string(),
    label: z.string().optional(),
    creneaux: z.array(creneauSchema),
  }),
});

const danses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/danses' }),
  schema: z.object({
    titre: z.string(),
    slug: z.string(),
    ordre: z.number(),
    couleur: z.enum(['bordeaux', 'or']).default('bordeaux'),
    danses: z.array(
      z.object({
        nom: z.string(),
        description: z.string(),
      })
    ),
  }),
});

const evenements = defineCollection({
  loader: file('src/content/evenements.json'),
  schema: z.object({
    date: z.coerce.date(),
    titre: z.string(),
    lieu: z.string(),
    description: z.string(),
    exemple: z.boolean().optional().default(false),
  }),
});

const sponsors = defineCollection({
  loader: file('src/content/sponsors.json'),
  schema: z.object({
    nom: z.string(),
    logo: z.string().optional(),
  }),
});

export const collections = { horaires, danses, evenements, sponsors };
```

- [ ] **Step 4 : Lancer le test, vérifier qu'il passe**

Run: `npm run test`
Expected: PASS — 2 tests verts.

- [ ] **Step 5 : Écrire `src/content/horaires.json`**

```json
[
  {
    "id": "lundi",
    "jour": "Lundi",
    "lieu": "Hannut",
    "creneaux": [
      { "heure": "18h15", "cours": "Danses solo — Intermédiaires", "niveau": "intermediaire" },
      { "heure": "19h15", "cours": "Danses solo — Avancés", "niveau": "avance" },
      { "heure": "20h15", "cours": "Rock, Salsa, Bachata — Débutants", "niveau": "debutant" },
      { "heure": "21h15", "cours": "Rock, Salsa, Bachata — Avancés", "niveau": "avance" }
    ]
  },
  {
    "id": "jeudi",
    "jour": "Jeudi",
    "lieu": "Hannut",
    "creneaux": [
      { "heure": "18h15", "cours": "Danses solo — Débutants", "niveau": "debutant" },
      { "heure": "19h15", "cours": "Danses de salon — Débutants", "niveau": "debutant" },
      { "heure": "20h15", "cours": "Danses de salon — Intermédiaires", "niveau": "intermediaire" },
      { "heure": "21h15", "cours": "Danses de salon — Avancés", "niveau": "avance" }
    ]
  },
  {
    "id": "vendredi",
    "jour": "Vendredi",
    "lieu": "Jandrain",
    "label": "Entraînement",
    "creneaux": [
      { "heure": "19h00", "cours": "Danses solo", "niveau": "tous" },
      { "heure": "20h00", "cours": "Danses en couple", "niveau": "tous" },
      { "heure": "21h00", "cours": "Mix", "niveau": "tous" }
    ]
  }
]
```

- [ ] **Step 6 : Écrire les 4 fichiers de danses**

`src/content/danses/01-solo-line-dance.md` :

```markdown
---
titre: "Solo & line dance"
slug: "solo-line-dance"
ordre: 1
couleur: "bordeaux"
danses:
  - nom: "Line dance"
    description: "Chorégraphies de groupe dansées en rangs, sans partenaire, sur des musiques variées : reggae, twist, mambo, bachata, sirtaki ou tubes du moment."
---

On bouge ensemble, en rythme, sans avoir besoin de cavalier ou de cavalière. Idéal pour commencer la danse en toute simplicité.
```

`src/content/danses/02-rock-salsa-bachata.md` :

```markdown
---
titre: "Rock, Salsa, Bachata"
slug: "rock-salsa-bachata"
ordre: 2
couleur: "or"
danses:
  - nom: "Rock"
    description: "Danse née aux États-Unis : le cavalier guide sa partenaire dans des figures rythmées, sur une musique à 4 ou 6 temps."
  - nom: "Salsa"
    description: "Danse afro-cubaine, rapide et festive, dansée en couple ou en solo sur des rythmes latins marqués."
  - nom: "Bachata"
    description: "Rythme dominicain né de la rencontre du boléro et d'influences africaines et cubaines, dansé en couple rapproché."
---

Trois danses de couple accessibles, parfaites pour les soirées et les fêtes de famille.
```

`src/content/danses/03-danses-standard.md` :

```markdown
---
titre: "Danses standard"
slug: "danses-standard"
ordre: 3
couleur: "bordeaux"
danses:
  - nom: "Quickstep"
    description: "Version rapide du fox-trot des années 1920, ponctuée de sautillés inspirés du charleston."
  - nom: "Tango"
    description: "Danse née dans les faubourgs de Buenos Aires, entre passion et mélancolie, portée par un jeu de regards et de silences."
  - nom: "Valse viennoise"
    description: "Valse tournante popularisée dès 1820, portée par les compositions de la famille Strauss."
  - nom: "Valse anglaise"
    description: "Valse lente et fluide, codifiée en Angleterre au début du XXe siècle, aux mouvements amples et circulaires."
  - nom: "Slow fox"
    description: "Danse de société d'origine nord-américaine, apparue en 1912, aux pas marqués et au rythme binaire."
---

Les grandes danses de bal, pour celles et ceux qui aiment l'élégance et la précision.
```

`src/content/danses/04-danses-latines.md` :

```markdown
---
titre: "Danses latines"
slug: "danses-latines"
ordre: 4
couleur: "or"
danses:
  - nom: "Cha-cha-cha"
    description: "Née à Cuba dans les années 1950, entre rumba et mambo, avec ses célèbres pas chassés."
  - nom: "Rumba"
    description: "Danse cubaine lente et sensuelle, souvent surnommée la danse de l'amour."
  - nom: "Samba"
    description: "Danse brésilienne rythmée, populaire depuis les années 1930, tout en mouvement de hanches."
  - nom: "Jive"
    description: "Danse rapide à six temps, cousine du rock, codifiée par les professeurs de danse anglais."
  - nom: "Paso doble"
    description: "Danse espagnole inspirée de la corrida, portée par un tempo vif et des postures marquées."
---

Des danses vives et expressives, pour celles et ceux qui aiment le mouvement.
```

Note pour l'exécutant : les descriptions ci-dessus corrigent deux erreurs du site actuel — la valse anglaise y est décrite comme « d'origine allemande » (elle est codifiée en Angleterre), et le tango comme né d'« influences africaines » sans mention de son origine géographique réelle (Buenos Aires). Garder ces corrections.

- [ ] **Step 7 : Écrire `src/content/evenements.json`**

```json
[
  {
    "id": "marche-hannut-2026",
    "date": "2026-09-06",
    "titre": "Petit marché de Hannut",
    "lieu": "Hannut",
    "description": "Le club tient un stand au petit marché de Hannut. Venez nous rencontrer !",
    "exemple": false
  },
  {
    "id": "exemple-stage-1",
    "date": "2026-11-14",
    "titre": "Stage danses latines (exemple)",
    "lieu": "Salle de Jandrain",
    "description": "Exemple de mise en page — date et contenu à confirmer avec le club.",
    "exemple": true
  },
  {
    "id": "exemple-soiree-1",
    "date": "2026-12-12",
    "titre": "Soirée de fin d'année (exemple)",
    "lieu": "À confirmer",
    "description": "Exemple de mise en page — date et contenu à confirmer avec le club.",
    "exemple": true
  }
]
```

Note : l'événement « Petit marché de Hannut » est daté du 6 septembre 2026, déjà passé à la date de rédaction (15 septembre 2026). C'est volontaire : il sert à vérifier que le filtrage des événements passés fonctionne (voir Task 3). Le bloc « Prochain événement » de l'accueil affichera donc le stage de novembre.

- [ ] **Step 8 : Écrire `src/content/sponsors.json`**

```json
[
  { "id": "sponsor-1", "nom": "Partenaire à ajouter" },
  { "id": "sponsor-2", "nom": "Partenaire à ajouter" },
  { "id": "sponsor-3", "nom": "Partenaire à ajouter" },
  { "id": "sponsor-4", "nom": "Partenaire à ajouter" }
]
```

- [ ] **Step 9 : Build pour valider que les données respectent les schémas**

Run: `npm run build`
Expected: build réussi (si un niveau ou un champ était invalide, Astro échouerait ici avec un message zod explicite).

- [ ] **Step 10 : Commit**

```bash
git add src/content.config.ts src/content.config.test.ts src/content
git commit -m "feat: add content collections (horaires, danses, evenements, sponsors)

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 3 : Logique métier pure (niveaux, événements)

**Files:**
- Create: `src/lib/niveaux.ts`
- Create: `src/lib/niveaux.test.ts`
- Create: `src/lib/evenements.ts`
- Create: `src/lib/evenements.test.ts`

**Interfaces:**
- Consumes: le type `niveau` défini dans `creneauSchema` (Task 2) : `'debutant' | 'intermediaire' | 'avance' | 'tous'`.
- Produces: `labelNiveau(niveau: Niveau): string`, `classeNiveau(niveau: Niveau): string`, utilisés par `LevelBadge.astro` (Task 6). `getUpcomingEvents(evenements: Evenement[], now?: Date): Evenement[]` et `getNextEvent(evenements: Evenement[], now?: Date): Evenement | undefined`, utilisés par `src/pages/index.astro` (Task 5). `Evenement` a la forme `{ id: string; date: Date; titre: string; lieu: string; description: string; exemple?: boolean }`.

- [ ] **Step 1 : Écrire le test de `niveaux.ts` (échoue, le fichier n'existe pas)**

`src/lib/niveaux.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { labelNiveau, classeNiveau } from './niveaux';

describe('labelNiveau', () => {
  it('retourne le libellé français de chaque niveau', () => {
    expect(labelNiveau('debutant')).toBe('Débutant');
    expect(labelNiveau('intermediaire')).toBe('Intermédiaire');
    expect(labelNiveau('avance')).toBe('Avancé');
    expect(labelNiveau('tous')).toBe('Tous niveaux');
  });
});

describe('classeNiveau', () => {
  it('retourne une classe Tailwind différente selon le niveau', () => {
    expect(classeNiveau('debutant')).not.toBe(classeNiveau('avance'));
    expect(classeNiveau('debutant').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2 : Lancer le test, vérifier qu'il échoue**

Run: `npm run test`
Expected: FAIL — `Cannot find module './niveaux'`.

- [ ] **Step 3 : Écrire `src/lib/niveaux.ts`**

```ts
export type Niveau = 'debutant' | 'intermediaire' | 'avance' | 'tous';

const LABELS: Record<Niveau, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
  tous: 'Tous niveaux',
};

const CLASSES: Record<Niveau, string> = {
  debutant: 'bg-or/20 text-bordeaux',
  intermediaire: 'bg-bordeaux/10 text-bordeaux',
  avance: 'bg-bordeaux text-creme',
  tous: 'bg-brun/10 text-brun',
};

export function labelNiveau(niveau: Niveau): string {
  return LABELS[niveau];
}

export function classeNiveau(niveau: Niveau): string {
  return CLASSES[niveau];
}
```

- [ ] **Step 4 : Lancer le test, vérifier qu'il passe**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5 : Écrire le test de `evenements.ts` (échoue, le fichier n'existe pas)**

`src/lib/evenements.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { getUpcomingEvents, getNextEvent, type Evenement } from './evenements';

const evenements: Evenement[] = [
  { id: 'passe', date: new Date('2026-01-01'), titre: 'Événement passé', lieu: 'Hannut', description: '' },
  { id: 'futur-proche', date: new Date('2026-11-14'), titre: 'Événement proche', lieu: 'Jandrain', description: '' },
  { id: 'futur-lointain', date: new Date('2026-12-12'), titre: 'Événement lointain', lieu: 'Jandrain', description: '' },
];
const maintenant = new Date('2026-09-15');

describe('getUpcomingEvents', () => {
  it('exclut les événements passés et trie par date croissante', () => {
    const resultat = getUpcomingEvents(evenements, maintenant);
    expect(resultat.map((e) => e.id)).toEqual(['futur-proche', 'futur-lointain']);
  });

  it('retourne un tableau vide si aucun événement à venir', () => {
    const resultat = getUpcomingEvents(evenements, new Date('2027-01-01'));
    expect(resultat).toEqual([]);
  });
});

describe('getNextEvent', () => {
  it('retourne le premier événement à venir', () => {
    expect(getNextEvent(evenements, maintenant)?.id).toBe('futur-proche');
  });

  it('retourne undefined si aucun événement à venir', () => {
    expect(getNextEvent(evenements, new Date('2027-01-01'))).toBeUndefined();
  });
});
```

- [ ] **Step 6 : Lancer le test, vérifier qu'il échoue**

Run: `npm run test`
Expected: FAIL — `Cannot find module './evenements'`.

- [ ] **Step 7 : Écrire `src/lib/evenements.ts`**

```ts
export interface Evenement {
  id: string;
  date: Date;
  titre: string;
  lieu: string;
  description: string;
  exemple?: boolean;
}

export function getUpcomingEvents(evenements: Evenement[], now: Date = new Date()): Evenement[] {
  return evenements
    .filter((e) => e.date.getTime() >= now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getNextEvent(evenements: Evenement[], now: Date = new Date()): Evenement | undefined {
  return getUpcomingEvents(evenements, now)[0];
}
```

- [ ] **Step 8 : Lancer le test, vérifier qu'il passe**

Run: `npm run test`
Expected: PASS — 8 tests verts au total (4 de Task 2 + 4 fichiers de tests de cette tâche).

- [ ] **Step 9 : Commit**

```bash
git add src/lib
git commit -m "feat: add niveaux and evenements pure logic

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 4 : Accueil, partie 1 — Hero, repères, cartes danses

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/StatsBar.astro`
- Create: `src/components/DanceCard.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getCollection('danses')` (Task 2), champs `data.titre`, `data.slug`, `data.couleur`, `data.danses[].nom`.
- Produces: rien de consommé par d'autres tâches (composants terminaux de la page d'accueil).

- [ ] **Step 1 : Écrire `src/components/Hero.astro`**

```astro
---
export interface Props {
  titre: string;
  sousTitre: string;
}
const { titre, sousTitre } = Astro.props;
---
<section class="relative overflow-hidden bg-bordeaux text-creme">
  <div class="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
    <svg viewBox="0 0 400 400" class="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <circle cx="80" cy="320" r="140" fill="none" stroke="currentColor" stroke-width="2" />
      <circle cx="340" cy="60" r="100" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M40 200 Q 200 40 360 200" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>
  </div>
  <div class="relative mx-auto flex max-w-4xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
    <h1 class="font-display text-4xl font-semibold leading-tight sm:text-5xl">{titre}</h1>
    <p class="max-w-xl text-lg text-creme/90">{sousTitre}</p>
    <div class="flex flex-wrap gap-4">
      <a href="/cours" class="rounded-full bg-or px-6 py-3 font-semibold text-bordeaux transition hover:bg-creme">
        Voir les horaires
      </a>
      <a
        href="/contact"
        class="rounded-full border border-creme px-6 py-3 font-semibold text-creme transition hover:bg-creme hover:text-bordeaux"
      >
        Nous contacter
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2 : Écrire `src/components/StatsBar.astro`**

```astro
---
const stats = [
  { valeur: '3', label: 'soirs de cours par semaine' },
  { valeur: 'Tous', label: 'niveaux bienvenus' },
  { valeur: '4', label: 'familles de danses' },
];
---
<div class="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 py-12 text-center sm:grid-cols-3">
  {stats.map((s) => (
    <div>
      <p class="font-display text-3xl font-semibold text-bordeaux">{s.valeur}</p>
      <p class="text-sm text-brun/70">{s.label}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 3 : Écrire `src/components/DanceCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

export interface Props {
  danse: CollectionEntry<'danses'>;
}
const { danse } = Astro.props;
const { titre, slug, couleur, danses } = danse.data;
const accent = couleur === 'or' ? 'bg-or/15 text-bordeaux' : 'bg-bordeaux/10 text-bordeaux';
---
<a
  href={`/cours#${slug}`}
  class="group flex flex-col gap-3 rounded-2xl border border-brun/10 bg-creme p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
>
  <span class={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${accent}`}>{titre}</span>
  <span class="font-display text-lg text-brun">{danses.map((d) => d.nom).join(' · ')}</span>
  <span class="text-sm font-semibold text-bordeaux group-hover:underline">Découvrir →</span>
</a>
```

- [ ] **Step 4 : Modifier `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import StatsBar from '../components/StatsBar.astro';
import DanceCard from '../components/DanceCard.astro';
import { getCollection } from 'astro:content';

const danses = (await getCollection('danses')).sort((a, b) => a.data.ordre - b.data.ordre);
---
<Base
  title="New Dance Club — Cours de danse à Hannut et Jandrain"
  description="Cours de danse pour tous niveaux à Hannut et Jandrain : rock, salsa, bachata, danses de salon et danses latines."
>
  <Hero
    titre="On danse ensemble, à Hannut et Jandrain"
    sousTitre="Rock, salsa, bachata, danses de salon et danses latines : un club convivial pour tous les niveaux, débutants compris."
  />
  <StatsBar />
  <section class="mx-auto max-w-5xl px-6 py-12">
    <h2 class="font-display text-2xl font-semibold text-brun">Nos danses</h2>
    <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {danses.map((danse) => <DanceCard danse={danse} />)}
    </div>
  </section>
</Base>
```

- [ ] **Step 5 : Build et vérification**

Run: `npm run build`
Expected: build réussi.

Run: `grep -c "On danse ensemble" dist/index.html`
Expected: `1`.

Run: `grep -o 'href="/cours#[a-z-]*"' dist/index.html | sort -u`
Expected: 4 lignes — `href="/cours#solo-line-dance"`, `href="/cours#rock-salsa-bachata"`, `href="/cours#danses-standard"`, `href="/cours#danses-latines"`.

- [ ] **Step 6 : Commit**

```bash
git add src/components/Hero.astro src/components/StatsBar.astro src/components/DanceCard.astro src/pages/index.astro
git commit -m "feat: build home page hero, stats and dance cards

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 5 : Accueil, partie 2 — semaine, événement, citation, sponsors

**Files:**
- Create: `src/components/WeekPreviewCard.astro`
- Create: `src/components/NextEvent.astro`
- Create: `src/components/Quote.astro`
- Create: `src/components/SponsorBar.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getCollection('horaires')` et `getCollection('evenements')`, `getCollection('sponsors')` (Task 2) ; `getNextEvent` (Task 3, signature `(evenements: Evenement[], now?: Date) => Evenement | undefined`).
- Produces: rien de consommé ailleurs.

- [ ] **Step 1 : Écrire `src/components/WeekPreviewCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

export interface Props {
  jour: CollectionEntry<'horaires'>;
}
const { jour } = Astro.props;
const { jour: nomJour, lieu, label, creneaux } = jour.data;
---
<div class="rounded-2xl border border-brun/10 bg-creme p-6">
  <p class="font-display text-lg font-semibold text-bordeaux">
    {nomJour}{label ? ` — ${label}` : ''}
  </p>
  <p class="text-sm text-brun/70">{lieu}</p>
  <ul class="mt-4 space-y-1 text-sm text-brun">
    {creneaux.map((c) => (
      <li>{c.heure} — {c.cours}</li>
    ))}
  </ul>
</div>
```

- [ ] **Step 2 : Écrire `src/components/NextEvent.astro`**

```astro
---
export interface Props {
  titre: string;
  date: Date;
  lieu: string;
  description: string;
}
const { titre, date, lieu, description } = Astro.props;
const dateFormatee = new Intl.DateTimeFormat('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
---
<section class="mx-auto max-w-3xl px-6 py-12">
  <div class="rounded-2xl border-2 border-or bg-creme p-6">
    <p class="text-sm font-semibold uppercase tracking-wide text-or">Prochain événement</p>
    <h2 class="mt-2 font-display text-2xl font-semibold text-brun">{titre}</h2>
    <p class="mt-1 text-sm text-brun/70">{dateFormatee} — {lieu}</p>
    <p class="mt-3 text-brun">{description}</p>
  </div>
</section>
```

- [ ] **Step 3 : Écrire `src/components/Quote.astro`**

```astro
<section class="bg-bordeaux px-6 py-16 text-center text-creme">
  <blockquote class="mx-auto max-w-2xl font-display text-2xl italic sm:text-3xl">
    « Dansez comme si personne ne vous regardait. »
  </blockquote>
  <p class="mt-4 text-sm text-creme/70">— William W. Purkey</p>
</section>
```

- [ ] **Step 4 : Écrire `src/components/SponsorBar.astro`**

```astro
---
import { getCollection } from 'astro:content';
const sponsors = await getCollection('sponsors');
const boucle = [...sponsors, ...sponsors];
---
<section class="overflow-hidden border-y border-brun/10 bg-creme py-8" aria-label="Nos sponsors">
  <p class="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-brun/60">Ils soutiennent le club</p>
  <div class="sponsor-track flex w-max gap-8 px-6">
    {boucle.map((s) => (
      <span class="flex h-16 items-center rounded-lg border border-brun/10 bg-white px-5 text-sm font-semibold text-brun/70">
        {s.data.nom}
      </span>
    ))}
  </div>
</section>

<style>
  .sponsor-track {
    animation: scroll 30s linear infinite;
  }
  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
</style>
```

L'arrêt de l'animation sous `prefers-reduced-motion` est déjà couvert globalement par `src/styles/global.css` (Task 1, Step 7) — pas besoin de le répéter ici.

- [ ] **Step 5 : Modifier `src/pages/index.astro` (assemblage complet)**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import StatsBar from '../components/StatsBar.astro';
import DanceCard from '../components/DanceCard.astro';
import WeekPreviewCard from '../components/WeekPreviewCard.astro';
import NextEvent from '../components/NextEvent.astro';
import Quote from '../components/Quote.astro';
import SponsorBar from '../components/SponsorBar.astro';
import { getCollection } from 'astro:content';
import { getNextEvent } from '../lib/evenements';

const danses = (await getCollection('danses')).sort((a, b) => a.data.ordre - b.data.ordre);

const ordreJours = ['lundi', 'jeudi', 'vendredi'];
const horaires = (await getCollection('horaires')).sort(
  (a, b) => ordreJours.indexOf(a.id) - ordreJours.indexOf(b.id)
);

const evenements = await getCollection('evenements');
const prochainEvenement = getNextEvent(evenements.map((e) => ({ id: e.id, ...e.data })));
---
<Base
  title="New Dance Club — Cours de danse à Hannut et Jandrain"
  description="Cours de danse pour tous niveaux à Hannut et Jandrain : rock, salsa, bachata, danses de salon et danses latines."
>
  <Hero
    titre="On danse ensemble, à Hannut et Jandrain"
    sousTitre="Rock, salsa, bachata, danses de salon et danses latines : un club convivial pour tous les niveaux, débutants compris."
  />
  <StatsBar />
  <section class="mx-auto max-w-5xl px-6 py-12">
    <h2 class="font-display text-2xl font-semibold text-brun">Nos danses</h2>
    <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {danses.map((danse) => <DanceCard danse={danse} />)}
    </div>
  </section>
  <section class="mx-auto max-w-5xl px-6 py-12">
    <h2 class="font-display text-2xl font-semibold text-brun">La semaine en un coup d'œil</h2>
    <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
      {horaires.map((jour) => <WeekPreviewCard jour={jour} />)}
    </div>
  </section>
  {prochainEvenement && (
    <NextEvent
      titre={prochainEvenement.titre}
      date={prochainEvenement.date}
      lieu={prochainEvenement.lieu}
      description={prochainEvenement.description}
    />
  )}
  <Quote />
  <SponsorBar />
</Base>
```

- [ ] **Step 6 : Build et vérification**

Run: `npm run build`
Expected: build réussi.

Run: `grep -c "Lundi" dist/index.html && grep -c "Jeudi" dist/index.html && grep -c "Vendredi" dist/index.html`
Expected: `1` pour chacune des 3 commandes.

Run: `grep -c "Stage danses latines" dist/index.html`
Expected: `1` — c'est le prochain événement à venir (le marché de Hannut, daté du 6 septembre 2026, est déjà passé à la date de génération et ne doit donc pas apparaître).

Run: `grep -c "Petit marché de Hannut" dist/index.html`
Expected: `0`.

Run: `grep -c "Dansez comme si personne" dist/index.html && grep -c "Partenaire à ajouter" dist/index.html`
Expected: `1` puis un nombre pair (les sponsors sont dupliqués pour l'effet de boucle).

- [ ] **Step 7 : Commit**

```bash
git add src/components/WeekPreviewCard.astro src/components/NextEvent.astro src/components/Quote.astro src/components/SponsorBar.astro src/pages/index.astro
git commit -m "feat: complete home page with week preview, next event, quote and sponsors

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 6 : Page Nos cours

**Files:**
- Create: `src/components/LevelBadge.astro`
- Create: `src/components/DayPlanning.astro`
- Modify: `src/pages/cours.astro`

**Interfaces:**
- Consumes: `labelNiveau`, `classeNiveau`, type `Niveau` (Task 3) ; `getCollection('horaires')`, `getCollection('danses')`, `getCollection('evenements')`, et `render` de `astro:content` (Task 2).
- Produces: rien de consommé ailleurs.

- [ ] **Step 1 : Écrire `src/components/LevelBadge.astro`**

```astro
---
import { labelNiveau, classeNiveau } from '../lib/niveaux';
import type { Niveau } from '../lib/niveaux';

export interface Props {
  niveau: Niveau;
}
const { niveau } = Astro.props;
---
<span class={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classeNiveau(niveau)}`}>
  {labelNiveau(niveau)}
</span>
```

- [ ] **Step 2 : Écrire `src/components/DayPlanning.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import LevelBadge from './LevelBadge.astro';

export interface Props {
  jour: CollectionEntry<'horaires'>;
}
const { jour } = Astro.props;
const { jour: nomJour, lieu, label, creneaux } = jour.data;
---
<div class="rounded-2xl border border-brun/10 bg-creme p-6">
  <div class="flex items-baseline justify-between">
    <h3 class="font-display text-xl font-semibold text-bordeaux">{nomJour}</h3>
    {label && <span class="text-sm font-semibold text-or">{label}</span>}
  </div>
  <p class="text-sm text-brun/70">{lieu}</p>
  <ul class="mt-4 space-y-3">
    {creneaux.map((c) => (
      <li class="flex flex-wrap items-center justify-between gap-2 border-t border-brun/10 pt-3 first:border-0 first:pt-0">
        <div>
          <p class="font-semibold text-brun">{c.heure}</p>
          <p class="text-sm text-brun/80">{c.cours}</p>
        </div>
        <LevelBadge niveau={c.niveau} />
      </li>
    ))}
  </ul>
</div>
```

- [ ] **Step 3 : Modifier `src/pages/cours.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import DayPlanning from '../components/DayPlanning.astro';
import { getCollection, render } from 'astro:content';

const ordreJours = ['lundi', 'jeudi', 'vendredi'];
const horaires = (await getCollection('horaires')).sort(
  (a, b) => ordreJours.indexOf(a.id) - ordreJours.indexOf(b.id)
);

const dansesTriees = (await getCollection('danses')).sort((a, b) => a.data.ordre - b.data.ordre);
const danses = await Promise.all(
  dansesTriees.map(async (danse) => {
    const { Content } = await render(danse);
    return { danse, Content };
  })
);

const evenements = (await getCollection('evenements')).sort(
  (a, b) => a.data.date.getTime() - b.data.date.getTime()
);
const dateFormatter = new Intl.DateTimeFormat('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' });
---
<Base
  title="Nos cours — New Dance Club"
  description="Horaires, danses enseignées et calendrier du New Dance Club à Hannut et Jandrain."
>
  <section class="mx-auto max-w-4xl px-6 py-16 text-center">
    <h1 class="font-display text-4xl font-semibold text-brun">Nos cours</h1>
    <p class="mt-4 text-brun/80">Trois soirs par semaine, à Hannut et à Jandrain. Tarifs : contactez-nous.</p>
  </section>

  <section class="mx-auto max-w-5xl px-6 pb-16">
    <h2 class="font-display text-2xl font-semibold text-brun">Le planning</h2>
    <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
      {horaires.map((jour) => <DayPlanning jour={jour} />)}
    </div>
  </section>

  <section class="mx-auto max-w-5xl px-6 pb-16">
    <h2 class="font-display text-2xl font-semibold text-brun">Nos danses</h2>
    <div class="mt-6 space-y-12">
      {danses.map(({ danse, Content }) => (
        <div id={danse.data.slug} class="scroll-mt-24">
          <span class="inline-flex rounded-full bg-bordeaux/10 px-3 py-1 text-sm font-semibold text-bordeaux">
            {danse.data.titre}
          </span>
          <div class="mt-3 text-brun/90">
            <Content />
          </div>
          <dl class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {danse.data.danses.map((d) => (
              <div class="rounded-xl border border-brun/10 bg-creme p-4">
                <dt class="font-display font-semibold text-bordeaux">{d.nom}</dt>
                <dd class="mt-1 text-sm text-brun/80">{d.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  </section>

  <section class="mx-auto max-w-4xl px-6 pb-16">
    <h2 class="font-display text-2xl font-semibold text-brun">Calendrier</h2>
    <ul class="mt-6 space-y-4">
      {evenements.map((e) => (
        <li class="flex flex-wrap items-baseline justify-between gap-2 border-b border-brun/10 pb-3">
          <div>
            <p class="font-semibold text-brun">
              {e.data.titre}{e.data.exemple ? ' (exemple)' : ''}
            </p>
            <p class="text-sm text-brun/70">{e.data.lieu}</p>
          </div>
          <p class="text-sm font-semibold text-bordeaux">{dateFormatter.format(e.data.date)}</p>
        </li>
      ))}
    </ul>
  </section>

  <section class="bg-bordeaux px-6 py-16 text-center text-creme">
    <h2 class="font-display text-2xl font-semibold">Envie d'essayer ?</h2>
    <p class="mt-2 text-creme/90">Premier cours, on vous accueille.</p>
    <a
      href="/contact"
      class="mt-6 inline-flex rounded-full bg-or px-6 py-3 font-semibold text-bordeaux transition hover:bg-creme"
    >
      Nous contacter
    </a>
  </section>
</Base>
```

- [ ] **Step 4 : Build et vérification**

Run: `npm run build`
Expected: build réussi.

Run: `grep -c 'id="solo-line-dance"' dist/cours/index.html && grep -c 'id="danses-latines"' dist/cours/index.html`
Expected: `1` pour chaque commande.

Run: `grep -c "Débutant" dist/cours/index.html && grep -c "Avancé" dist/cours/index.html`
Expected: au moins `1` pour chacune (badges de niveau présents).

Run: `grep -c "(exemple)" dist/cours/index.html`
Expected: `2` (les deux événements d'exemple).

- [ ] **Step 5 : Commit**

```bash
git add src/components/LevelBadge.astro src/components/DayPlanning.astro src/pages/cours.astro
git commit -m "feat: build cours page with planning, dances and calendar

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 7 : Page Contact

**Files:**
- Create: `src/components/ContactCard.astro`
- Create: `src/components/ContactForm.astro`
- Modify: `src/pages/contact.astro`

**Interfaces:**
- Consumes: rien des tâches précédentes (page terminale).
- Produces: rien de consommé ailleurs.

- [ ] **Step 1 : Écrire `src/components/ContactCard.astro`**

```astro
---
export interface Props {
  icone: 'telephone' | 'email' | 'facebook';
  titre: string;
  valeur: string;
  href: string;
}
const { icone, titre, valeur, href } = Astro.props;
const icones: Record<Props['icone'], string> = {
  telephone: 'M2 3h4l2 5-2 2a12 12 0 006 6l2-2 5 2v4a2 2 0 01-2 2A16 16 0 012 5a2 2 0 012-2z',
  email: 'M3 5h18v14H3V5zm0 0l9 7 9-7',
  facebook: 'M14 9h3V6h-3a4 4 0 00-4 4v2H8v3h2v6h3v-6h3l1-3h-4v-2a1 1 0 011-1z',
};
---
<a
  href={href}
  class="flex items-center gap-4 rounded-2xl border border-brun/10 bg-creme p-5 transition hover:-translate-y-0.5 hover:shadow-md"
>
  <svg
    class="h-6 w-6 flex-none text-bordeaux"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    aria-hidden="true"
  >
    <path d={icones[icone]} stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <span>
    <span class="block text-sm font-semibold text-brun/60">{titre}</span>
    <span class="block font-semibold text-brun">{valeur}</span>
  </span>
</a>
```

- [ ] **Step 2 : Écrire `src/components/ContactForm.astro`**

Ce formulaire porte déjà les attributs Netlify Forms (`data-netlify`, `netlify-honeypot`, champ caché `form-name`) pour un envoi réel en production. Dans la maquette, le script en bas de fichier intercepte la soumission et n'envoie rien : il affiche uniquement le message de confirmation. **En production, supprimer ce `<script>`** pour laisser Netlify traiter le formulaire normalement.

```astro
<form
  name="contact"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  class="grid grid-cols-1 gap-4 sm:grid-cols-2"
  id="contact-form"
>
  <input type="hidden" name="form-name" value="contact" />
  <p class="hidden">
    <label>Ne pas remplir : <input name="bot-field" /></label>
  </p>

  <div>
    <label for="prenom" class="block text-sm font-semibold text-brun">Prénom</label>
    <input id="prenom" name="prenom" type="text" required class="mt-1 w-full rounded-lg border border-brun/20 bg-white px-3 py-2" />
  </div>
  <div>
    <label for="nom" class="block text-sm font-semibold text-brun">Nom</label>
    <input id="nom" name="nom" type="text" required class="mt-1 w-full rounded-lg border border-brun/20 bg-white px-3 py-2" />
  </div>
  <div class="sm:col-span-2">
    <label for="email" class="block text-sm font-semibold text-brun">Email</label>
    <input id="email" name="email" type="email" required class="mt-1 w-full rounded-lg border border-brun/20 bg-white px-3 py-2" />
  </div>
  <div class="sm:col-span-2">
    <label for="message" class="block text-sm font-semibold text-brun">Message</label>
    <textarea id="message" name="message" rows="4" required class="mt-1 w-full rounded-lg border border-brun/20 bg-white px-3 py-2"></textarea>
  </div>

  <div class="sm:col-span-2">
    <button type="submit" class="rounded-full bg-bordeaux px-6 py-3 font-semibold text-creme transition hover:bg-bordeaux/90">
      Envoyer
    </button>
  </div>

  <p id="contact-confirmation" class="hidden text-sm font-semibold text-bordeaux sm:col-span-2" role="status">
    Merci, votre message a bien été pris en compte. (Maquette : aucun message n'est réellement envoyé.)
  </p>
</form>

<script>
  const form = document.getElementById('contact-form');
  const confirmation = document.getElementById('contact-confirmation');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.reset();
    confirmation.classList.remove('hidden');
  });
</script>
```

- [ ] **Step 3 : Modifier `src/pages/contact.astro`**

Coordonnées GPS approximatives pour Jandrain (Rue des Tanneurs 4, 1350 Jandrain), à confirmer avec le club.

```astro
---
import Base from '../layouts/Base.astro';
import ContactCard from '../components/ContactCard.astro';
import ContactForm from '../components/ContactForm.astro';
---
<Base
  title="Contact — New Dance Club"
  description="Contactez le New Dance Club à Jandrain (Hannut) : téléphone, email, Facebook ou formulaire en ligne."
>
  <section class="mx-auto max-w-4xl px-6 py-16 text-center">
    <h1 class="font-display text-4xl font-semibold text-brun">Contact</h1>
    <p class="mt-4 text-brun/80">Une question ? Envie d'essayer un cours ? On vous répond avec plaisir.</p>
  </section>

  <section class="mx-auto grid max-w-4xl grid-cols-1 gap-4 px-6 pb-12 sm:grid-cols-3">
    <ContactCard icone="telephone" titre="Téléphone" valeur="0495/32.66.47" href="tel:+32495326647" />
    <ContactCard icone="email" titre="Email" valeur="ndc1350@gmail.com" href="mailto:ndc1350@gmail.com" />
    <ContactCard
      icone="facebook"
      titre="Facebook"
      valeur="New Dance Club"
      href="https://www.facebook.com/profile.php?id=100057211669508"
    />
  </section>

  <section class="mx-auto max-w-4xl px-6 pb-12">
    <iframe
      title="Localisation du New Dance Club à Jandrain"
      class="h-80 w-full rounded-2xl border border-brun/10"
      src="https://www.openstreetmap.org/export/embed.html?bbox=4.9889%2C50.6786%2C5.0089%2C50.6886&layer=mapnik&marker=50.6836%2C4.9989"
      loading="lazy"
    ></iframe>
    <p class="mt-2 text-sm text-brun/60">Rue des Tanneurs 4, 1350 Jandrain (coordonnées approximatives, à confirmer).</p>
  </section>

  <section class="mx-auto max-w-2xl px-6 pb-16">
    <h2 class="font-display text-2xl font-semibold text-brun">Écrivez-nous</h2>
    <div class="mt-6">
      <ContactForm />
    </div>
  </section>
</Base>
```

- [ ] **Step 4 : Build et vérification**

Run: `npm run build`
Expected: build réussi.

Run: `grep -c 'href="tel:+32495326647"' dist/contact/index.html`
Expected: `1`.

Run: `grep -c 'href="mailto:ndc1350@gmail.com"' dist/contact/index.html`
Expected: `1`.

Run: `grep -c 'name="contact"' dist/contact/index.html && grep -c 'data-netlify="true"' dist/contact/index.html && grep -c 'name="bot-field"' dist/contact/index.html`
Expected: `1` pour chaque commande.

Run: `grep -c "openstreetmap.org/export/embed.html" dist/contact/index.html`
Expected: `1`.

- [ ] **Step 5 : Commit**

```bash
git add src/components/ContactCard.astro src/components/ContactForm.astro src/pages/contact.astro
git commit -m "feat: build contact page with map and form

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 8 : Déploiement, résumé client, vérification finale

**Files:**
- Create: `public/robots.txt`
- Create: `public/favicon.svg`
- Create: `netlify.toml`
- Create: `docs/resume-club.md`

**Interfaces:**
- Consumes: rien de code ; s'appuie sur l'ensemble du site construit dans les Tasks 1 à 7.
- Produces: rien (tâche finale).

- [ ] **Step 1 : Écrire `public/robots.txt`**

```
User-agent: *
Allow: /
```

- [ ] **Step 2 : Écrire `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#7A1F2B" />
  <path d="M10 22c0-4 3-8 6-8s6 4 6 8" stroke="#D9A441" stroke-width="2" fill="none" stroke-linecap="round" />
  <circle cx="16" cy="10" r="3" fill="#D9A441" />
</svg>
```

- [ ] **Step 3 : Écrire `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

- [ ] **Step 4 : Écrire `docs/resume-club.md`**

Ce fichier est un document destiné au client (le comité du club) : prose normale, sans jargon technique inutile.

```markdown
# Résumé pour le club — New Dance Club

## Ce que c'est

Une maquette du futur site du club, à trois pages : Accueil, Nos cours, Contact.
Le contenu (horaires, danses, événements) est déjà organisé pour être modifié
facilement plus tard, sans toucher au code.

## Hébergement et coûts

- Le site est hébergé sur Netlify, gratuit pour ce volume de trafic.
- Aucun serveur à gérer, aucune mise à jour de sécurité à faire (site statique).
- Nom de domaine : à connecter (le domaine actuel new-dance-club.be peut être
  redirigé vers le nouveau site).

## Comment le comité modifiera le contenu

- Actuellement, la maquette utilise des fichiers de contenu séparés du code
  (horaires, danses, événements, sponsors).
- Si le club valide le projet, on y branche une interface d'administration
  simple (Decap CMS) : le comité pourra modifier les horaires, ajouter des
  événements et changer les photos depuis un navigateur, sans toucher au code.
- Les photos et vidéos volumineuses (albums) seront gérées séparément (par
  exemple Cloudinary pour les photos, YouTube/Facebook pour les vidéos) pour
  ne pas alourdir le site.

## Informations à confirmer avec le club

- Adresse exacte de la salle de Hannut.
- Tarifs des cours.
- Photos et vidéos actuelles : les albums du site actuel ne contiennent pas
  de photo de danse exploitable pour la page d'accueil (essentiellement des
  photos de soirées et de buffets). Il faudra soit de nouvelles photos, soit
  garder le style graphique actuel de la maquette (dégradés et motifs).
- Noms et logos des sponsors à afficher.
- Dates réelles du calendrier (le calendrier de la maquette contient des
  exemples clairement marqués comme tels).

## Ce qui n'est pas inclus dans cette maquette

- Inscription en ligne.
- Pages Comité, Albums, Informations, Street Jazz, Connexion (présentes sur
  l'ancien site).
- Envoi réel du formulaire de contact (activable en une étape avec Netlify
  Forms).
```

- [ ] **Step 5 : Vérification finale complète**

Run: `npm run test`
Expected: PASS — 8 tests verts.

Run: `npm run check`
Expected: `0 errors`.

Run: `npm run build`
Expected: build réussi, `dist/index.html`, `dist/cours/index.html`, `dist/contact/index.html` présents.

Run: `npx astro preview` puis ouvrir `http://localhost:4321` dans un navigateur (manuel) : vérifier à 375px et 1440px que le menu mobile s'ouvre, que les 3 pages sont cohérentes visuellement, et que le bandeau sponsors défile.

Avec le serveur de preview toujours lancé, dans un autre terminal : `npx lighthouse http://localhost:4321 --view --preset=desktop` puis répéter pour `/cours`. Viser ≥ 90 sur Performance, Accessibilité, Bonnes pratiques, SEO (indicatif pour une maquette — noter les écarts plutôt que bloquer dessus). Arrêter le serveur de preview (Ctrl+C) une fois les deux vérifications faites.

- [ ] **Step 6 : Commit**

```bash
git add public/robots.txt public/favicon.svg netlify.toml docs/resume-club.md
git commit -m "docs: add netlify config and client summary

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

- [ ] **Step 7 : Déploiement (manuel, nécessite le compte Netlify de Seb)**

Ces commandes ne sont pas exécutées automatiquement : elles nécessitent une connexion interactive au compte Netlify de l'utilisateur.

```bash
npx netlify login
npx netlify init
npx netlify deploy --prod
```

Une fois déployé, noter l'URL de preview dans `docs/resume-club.md` sous la section « Hébergement et coûts » et commit cette mise à jour.
