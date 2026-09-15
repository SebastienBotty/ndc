# Refonte créative — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer la maquette générique en site éditorial animé avec photos, sans casser le modèle de contenu ni les tests existants.

**Architecture:** Même base Astro 5 + Tailwind v4. Le système visuel (tokens, grain, arches, texte détouré, bandeaux, apparitions au scroll) vit dans `src/styles/global.css` et un script unique `src/scripts/reveal.ts`. Les composants de page sont réécrits. La logique pure reste dans `src/lib` et reste testée par Vitest.

**Tech Stack:** Astro 5.18, Tailwind CSS 4, Fontsource (Fraunces variable + italique, Figtree), Vitest 2.1, photos Unsplash WebP dans `public/images/`.

**Spec:** `docs/superpowers/specs/2026-09-15-refonte-creative-design.md`

**Note d'exécution :** plan exécuté inline par le même agent qui l'a écrit. Les tâches purement visuelles décrivent la structure attendue et les contrôles d'acceptation plutôt que de dupliquer tout le markup ; la logique et le modèle de données sont donnés en entier.

## Global Constraints

- Palette inchangée : bordeaux `#7A1F2B`, or `#D9A441`, crème `#FBF5EC`, brun `#2A1A14`. L'or n'est jamais une couleur de texte sur fond crème, sauf en taille ≥ 3rem (contraste « grand texte » non requis pour un mot décoratif dupliqué en contour).
- Toute animation est désactivée sous `prefers-reduced-motion: reduce`.
- Le contenu reste lisible sans JavaScript : les éléments `.reveal` sont visibles par défaut, le masquage initial n'est appliqué que si JS ou les scroll-driven animations sont disponibles.
- Photos servies depuis `public/images/{nom}-lg.webp` et `{nom}-sm.webp`, avec `width`/`height` ou `aspect-ratio` explicites, `loading="lazy"` sauf pour le hero, `alt` descriptif.
- Tout contenu éditable reste dans `src/content`.
- Tests existants (8) doivent rester verts à chaque commit.

---

### Task 1 : Modèle de contenu — lieux, images des danses, URL de carte

**Files:**
- Create: `src/lib/carte.ts`, `src/lib/carte.test.ts`, `src/content/lieux.json`
- Modify: `src/content.config.ts`, `src/content/horaires.json`, `src/content/danses/*.md`

**Interfaces:**
- Produces: `osmEmbedUrl(lat: number, lon: number, delta?: number): string`
- Produces: collection `lieux` → `data: { nom: string; role: 'cours' | 'entrainement'; adresse: string; lat: number; lon: number }`
- Produces: `horaires` → `data.lieu: string` (id d'un lieu) ; `danses` → `data.image: string`

- [ ] **Step 1 : Test qui échoue**

```ts
// src/lib/carte.test.ts
import { describe, expect, it } from 'vitest';
import { osmEmbedUrl } from './carte';

describe('osmEmbedUrl', () => {
  it('centre la bbox et le marqueur sur les coordonnées', () => {
    const url = new URL(osmEmbedUrl(50.671, 5.0712, 0.01));
    expect(url.origin + url.pathname).toBe('https://www.openstreetmap.org/export/embed.html');
    expect(url.searchParams.get('bbox')).toBe('5.0612,50.661,5.0812,50.681');
    expect(url.searchParams.get('marker')).toBe('50.671,5.0712');
    expect(url.searchParams.get('layer')).toBe('mapnik');
  });

  it('utilise un delta par défaut de 0.008', () => {
    const url = new URL(osmEmbedUrl(50, 5));
    expect(url.searchParams.get('bbox')).toBe('4.992,49.992,5.008,50.008');
  });
});
```

Run: `npm run test` — Expected: FAIL, module `./carte` introuvable.

- [ ] **Step 2 : Implémentation**

```ts
// src/lib/carte.ts
const arrondi = (n: number) => Number(n.toFixed(6));

export function osmEmbedUrl(lat: number, lon: number, delta = 0.008): string {
  const bbox = [lon - delta, lat - delta, lon + delta, lat + delta].map(arrondi).join(',');
  const params = new URLSearchParams({ bbox, layer: 'mapnik', marker: `${lat},${lon}` });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}
```

Note : `URLSearchParams` encode les virgules en `%2C` ; `searchParams.get` les décode, le test compare donc les valeurs décodées.

Run: `npm run test` — Expected: 10 tests verts.

- [ ] **Step 3 : Données et schémas**

`src/content/lieux.json` :

```json
[
  { "id": "hannut", "nom": "Hannut", "role": "cours", "adresse": "Av. Paul Brien 4, 4280 Hannut", "lat": 50.671, "lon": 5.0712 },
  { "id": "jandrain", "nom": "Jandrain", "role": "entrainement", "adresse": "Rue des Tanneurs 4, 1350 Jandrain", "lat": 50.6836, "lon": 4.9989 }
]
```

`src/content.config.ts` : ajouter la collection `lieux` (schéma ci-dessus via `z.enum(['cours', 'entrainement'])`), ajouter `image: z.string()` au schéma `danses`, l'exporter dans `collections`.

`horaires.json` : `"lieu": "Hannut"` → `"lieu": "hannut"` (lundi, jeudi), `"lieu": "Jandrain"` → `"lieu": "jandrain"` (vendredi).

Frontmatter des danses : `image: "solo"`, `"jupes"`, `"salon"`, `"flamenco"` respectivement.

Adapter temporairement `WeekPreviewCard.astro`, `DayPlanning.astro` et `contact.astro` pour résoudre le lieu via `getEntry('lieux', id)` afin que le build reste vert (ces fichiers sont réécrits dans les tâches suivantes).

- [ ] **Step 4 : Vérification**

Run: `npm run test && npm run check && npm run build`
Expected: 10 tests verts, 0 erreur, build OK.

- [ ] **Step 5 : Commit** — `feat: add lieux collection and dance images to content model`

---

### Task 2 : Système visuel, header, footer, crédits

**Files:**
- Modify: `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `package.json` (police Fraunces variable)
- Create: `src/scripts/reveal.ts`, `src/components/SectionLabel.astro`, `src/components/Marquee.astro`, `src/components/GoldCurve.astro`, `CREDITS.md`

**Interfaces:**
- Produces (CSS) : classes `.grain`, `.arch`, `.outline-text`, `.reveal`, `.reveal-stagger`, `.parallax`, `.draw-curve`, `.marquee-track`, `.link-underline`, `.display-xl` / `.display-lg` / `.display-md`
- Produces : `<SectionLabel numero="01" texte="Nos danses" />`, `<Marquee items={string[]} tone="bordeaux" | "creme" />`, `<GoldCurve class?: string />`
- Produces : `reveal.ts` ajoute `html.js-reveal` puis `.is-visible` aux `.reveal` entrant dans le viewport, uniquement si `CSS.supports('animation-timeline: view()')` est faux.

- [ ] **Step 1 :** Remplacer `@fontsource/fraunces` par `@fontsource-variable/fraunces` (axes `opsz`, `wght`, italique inclus). `npm install`.
- [ ] **Step 2 :** Écrire le système CSS dans `global.css` (tokens, tailles display avec `clamp()`, grain en `body::before` fixe, arches, texte détouré, bandeau, soulignement animé, apparitions : scroll-driven dans `@supports (animation-timeline: view())`, sinon via `html.js-reveal .reveal:not(.is-visible)`), le tout neutralisé sous `prefers-reduced-motion`.
- [ ] **Step 3 :** `reveal.ts` + inclusion dans `Base.astro` via `<script>` traité par Astro.
- [ ] **Step 4 :** Header (logo italique, liens `.link-underline`, fond opaque au scroll, menu mobile plein écran) et Footer (wordmark géant, coordonnées).
- [ ] **Step 5 :** `SectionLabel`, `Marquee`, `GoldCurve`, `CREDITS.md` (tableau de la spec + lien vers la licence Unsplash).
- [ ] **Step 6 : Vérification** — `npm run check && npm run build` ; `grep -c "outline-text" dist/_astro/*.css` ≥ 1 ; `grep -c "prefers-reduced-motion" dist/_astro/*.css` ≥ 1.
- [ ] **Step 7 : Commit** — `feat: add editorial visual system, header and footer`

---

### Task 3 : Accueil

**Files:**
- Create: `src/components/home/HeroHome.astro`, `DanceIndex.astro`, `WeekOutline.astro`, `ClubLife.astro`, `NextEventBig.astro`, `QuoteDuotone.astro`
- Modify: `src/pages/index.astro`, `src/components/SponsorBar.astro`
- Delete: `src/components/Hero.astro`, `StatsBar.astro`, `DanceCard.astro`, `WeekPreviewCard.astro`, `NextEvent.astro`, `Quote.astro`

**Interfaces:**
- Consumes: collections `danses` (dont `image`), `horaires`, `lieux`, `evenements`, `sponsors` ; `getNextEvent` ; `Marquee`, `SectionLabel`, `GoldCurve`.
- `DanceIndex` : script local, au survol/focus d'une ligne `[data-image]`, change la `src` et l'état visible d'une image flottante unique ; lien de chaque ligne vers `/cours#{slug}`.

- [ ] **Step 1 :** Écrire les composants selon la spec (sections 1 à 8 de l'accueil).
- [ ] **Step 2 :** Assembler `index.astro`, supprimer les anciens composants.
- [ ] **Step 3 : Vérification**
  - `npm run check && npm run build`
  - `grep -o 'images/[a-z-]*-\(lg\|sm\)\.webp' dist/index.html | sort -u` liste au moins `tango-couple`, `milonga`, `solo`, `jupes`, `salon`, `flamenco`, `rouge`, `lumieres`
  - `grep -o "Photo du club ici" dist/index.html | wc -l` = 3
  - `grep -o 'href="/cours#[a-z-]*"' dist/index.html | sort -u | wc -l` = 4
  - `grep -c "Stage danses latines" dist/index.html` = 1
- [ ] **Step 4 : Commit** — `feat: redesign home page with editorial layout and photos`

---

### Task 4 : Nos cours

**Files:**
- Create: `src/components/cours/PlanningDay.astro`, `DanceFamily.astro`, `CalendarRow.astro`, `CtaFinal.astro`
- Modify: `src/pages/cours.astro`, `src/components/LevelBadge.astro` (pastille + texte)
- Delete: `src/components/DayPlanning.astro`

- [ ] **Step 1 :** Composants et page selon la spec.
- [ ] **Step 2 : Vérification** — check + build ; 4 ancres `id="{slug}"` ; `grep -o "Av. Paul Brien 4" dist/cours/index.html | wc -l` ≥ 1 ; `grep -o "(exemple)\|>exemple<" dist/cours/index.html | wc -l` = 2 ; les 4 photos de familles référencées.
- [ ] **Step 3 : Commit** — `feat: redesign cours page`

---

### Task 5 : Contact

**Files:**
- Modify: `src/pages/contact.astro`, `src/components/ContactForm.astro`
- Delete: `src/components/ContactCard.astro`

- [ ] **Step 1 :** Page selon la spec ; cartes générées par `osmEmbedUrl(lieu.data.lat, lieu.data.lon)` depuis la collection `lieux`.
- [ ] **Step 2 : Vérification** — check + build ; `grep -o "marker=" dist/contact/index.html | wc -l` = 2 ; `data-netlify="true"` et `bot-field` présents.
- [ ] **Step 3 : Commit** — `feat: redesign contact page`

---

### Task 6 : Vérification visuelle, documentation, finalisation

**Files:**
- Modify: `docs/resume-club.md`

- [ ] **Step 1 :** Captures headless (Edge ou Chrome si présent) de `/`, `/cours`, `/contact` à 375px et 1440px depuis `astro preview` ; inspecter et corriger les défauts visibles.
- [ ] **Step 2 :** Mesurer le poids des images référencées par la page d'accueil (objectif < 1,5 Mo hors lazy-load).
- [ ] **Step 3 :** `resume-club.md` : photos Unsplash provisoires, emplacements « Photo du club ici », proposition de séance photo.
- [ ] **Step 4 :** `npm run test && npm run check && npm run build`, commit `docs: update client summary for creative redesign`, puis superpowers:finishing-a-development-branch.
