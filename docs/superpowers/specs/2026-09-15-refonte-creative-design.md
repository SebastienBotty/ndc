# New Dance Club — Refonte créative de la maquette

Date : 2026-09-15
Statut : validé en brainstorming
Remplace la partie « Identité visuelle » et « Pages » de `2026-09-15-new-dance-club-maquette-design.md`. Le reste de cette spec (stack, contenu, hors périmètre) reste valable.

## Pourquoi

La première version est propre mais générique : cartes arrondies, badges en pilule, sections empilées, aucune photo. Elle ne suffit pas à convaincre le club. Objectif : un site au caractère éditorial marqué, avec du mouvement et des photos.

## Direction

Base **éditoriale type affiche de spectacle / magazine de danse**, avec des **animations au scroll dosées**. La palette chaleureuse est conservée : bordeaux `#7A1F2B`, or `#D9A441`, crème `#FBF5EC`, brun `#2A1A14`. Typos conservées : Fraunces (titres) et Figtree (texte).

## Système visuel

- **Typographie géante** : titres Fraunces de 4 à 9rem via `clamp()`. Un mot-clé par titre en italique or. Labels de section en capitales espacées : « — 01 NOS DANSES ».
- **Texture** : grain papier en surimpression sur le fond crème (SVG `feTurbulence` inline en data URI, opacité faible).
- **Formes** : photos découpées en arches (`border-radius` haut en demi-cercle) et en cercles qui se chevauchent.
- **Motif** : fine courbe dorée (SVG) qui se trace au scroll (`stroke-dashoffset`).
- **Texte détouré** : jours de la semaine en contour seul (`-webkit-text-stroke`).
- **Mouvement** :
  - apparitions (fondu + translation) et parallaxe via les scroll-driven animations CSS (`animation-timeline: view()`) ;
  - script de secours `IntersectionObserver` pour les navigateurs qui ne les supportent pas ;
  - bandeaux de texte défilants ;
  - tout est désactivé sous `prefers-reduced-motion: reduce`.
- La contrainte « zéro JS » de la première version est levée. Le JS reste limité à : secours des apparitions, révélation des photos au survol de l'index des danses, confirmation du formulaire.

## Photos

Stratégie hybride validée :
- 8 photos Unsplash (licence Unsplash, usage commercial gratuit) choisies pour l'ambiance, sans visage mis en avant autant que possible.
- Emplacements explicites « Photo du club ici » dans la section « La vie du club ».
- Le club doit être informé que les photos Unsplash sont provisoires (noté dans `docs/resume-club.md`).
- Fichiers WebP pré-redimensionnés via les paramètres d'URL Unsplash, servis depuis `public/images/` en deux tailles (`-lg`, `-sm`). Pas de `astro:assets` : le script d'installation de `sharp` est bloqué dans cet environnement.
- Crédits dans `CREDITS.md`.

| Fichier | Photo Unsplash | Photographe | Usage |
|---|---|---|---|
| `tango-couple` | UgsUG_v2Mr8 | Christian Harb | Hero accueil (arche) |
| `milonga` | WRYtatG6kqs | Christian Harb | Hero accueil (cercle), citation (duotone) |
| `solo` | KHipnBn7sdY | Ahmad Odeh | Famille Solo & line dance, en-tête Cours |
| `jupes` | VxNb5NGrQCY | Sydney Rae | Famille Rock, Salsa, Bachata |
| `salon` | 7EgJS51LZVM | preillumination SeTh | Famille Danses standard |
| `flamenco` | WApo7-iPU9U | Yucel Moran | Famille Danses latines |
| `rouge` | b2PQRFk0CeI | Molly Mears | La vie du club |
| `lumieres` | OcPxecAVXLA | Vladyslav Tobolenko | La vie du club |

## Modèle de contenu

- Nouveau champ `image` (nom de base, ex. `"jupes"`) dans le frontmatter des danses.
- Nouvelle collection `lieux` (`src/content/lieux.json`) : `id`, `nom`, `role` (`cours` | `entrainement`), `adresse`, `lat`, `lon`.
- `horaires.json` : le champ texte `lieu` est remplacé par `lieu`, référence à l'id d'un lieu (`hannut` | `jandrain`).
- `src/lib/carte.ts` : fonction pure `osmEmbedUrl(lat, lon, delta?)` qui construit l'URL d'embed OpenStreetMap. Testée unitairement.

## Pages

### Commun

- **Header** : logo en Fraunces italique, liens soulignés or au survol, fond qui devient opaque au scroll (scroll-driven CSS). Menu mobile plein écran avec liens géants (`<details>`).
- **Footer** : « New Dance Club » en typo géante sur toute la largeur, coordonnées dessous.

### Accueil

1. Hero asymétrique : titre géant sur 3 lignes (« On danse *ensemble* »), courbe dorée qui le traverse, photo en arche à droite chevauchée par une photo ronde, deux boutons.
2. Bandeau bordeaux défilant : « Rock · Salsa · Bachata · Tango · Valse · Cha-cha · Rumba · Line dance ».
3. « 01 — Nos danses » : index éditorial en 4 lignes (numéro, nom géant, liste des danses). Photo révélée au survol sur desktop, vignette sur mobile.
4. « 02 — La semaine » : jours en lettres détourées, créneaux dessous.
5. « 03 — La vie du club » : mosaïque asymétrique de 2 photos d'ambiance et 3 cadres « Photo du club ici ».
6. Prochain événement : date géante en or, événement à côté.
7. Citation : photo pleine largeur en duotone bordeaux, citation géante.
8. Sponsors : bandeau défilant restylé.

La barre de chiffres est supprimée.

### Nos cours

1. En-tête : « Nos *cours* » géant, photo en arche, accroche, « Tarifs : contactez-nous ».
2. « 01 — Le planning » : 3 colonnes, jours détourés, heures en grand, niveau en texte avec pastille de couleur, tampon « Entraînement » incliné sur le vendredi, adresse du lieu sous chaque jour.
3. « 02 — Nos danses » : une section pleine largeur par famille, photo en arche et texte en alternance gauche/droite, grand numéro, danses sur 2 colonnes séparées par des filets or.
4. « 03 — Calendrier » : lignes avec date géante, titre, lieu, étiquette « exemple ».
5. Final : aplat bordeaux, « Envie d'*essayer* ? » géant, courbe dorée, bouton.

### Contact

1. Titre « On se *rencontre* ? ».
2. Téléphone en typo géante cliquable, email, Facebook.
3. « Où nous trouver » : deux lieux côte à côte depuis la collection `lieux`, carte OSM dans un cadre arrondi.
4. Formulaire minimaliste (champs soulignés, grands labels, bouton avec flèche animée). Comportement maquette inchangé : aucun envoi réel.

## Vérification

- `npm run test`, `npm run check` (0 erreur), `npm run build`.
- Contrôles grep sur le HTML généré (photos référencées, textes clés, deux lieux, ancres des danses).
- Captures d'écran à 375px et 1440px si un navigateur headless est disponible ; sinon vérification manuelle par Seb avec `npm run dev`.
- Poids total des images de la page d'accueil : viser moins de 1,5 Mo.
