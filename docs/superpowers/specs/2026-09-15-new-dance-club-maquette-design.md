# New Dance Club — Maquette de refonte

Date : 2026-09-15
Statut : validé en brainstorming, en attente de relecture

## Contexte

New Dance Club est un club de danse (Hannut / Jandrain, Belgique). Son site actuel (https://www.new-dance-club.be/) tourne sur Wix. Il est daté, sa page d'accueil est pauvre (une citation, un événement, un mur de 24 logos de sponsors) et le contenu utile (horaires, danses, calendrier) est éclaté en sous-pages.

Cette maquette sert à **démarcher le club**. Elle n'est pas jetable : si le club signe, un CMS sera branché dessus pour que le comité modifie lui-même photos, vidéos, horaires et événements.

## Objectifs

- Montrer un site nettement plus attrayant et plus lisible que l'actuel.
- Rendre les horaires consultables en quelques secondes, surtout sur mobile.
- Séparer le contenu du code, pour permettre l'ajout d'un CMS sans réécrire les pages.

## Hors périmètre

- Inscription en ligne.
- Decap CMS (ajouté seulement si le club signe).
- Pages Comité, Albums photo/vidéo, Informations (liens utiles, R.O.I., mentions légales), Le Street Jazz, Connexion membre. Les liens correspondants du footer peuvent pointer vers `#` ou ne pas apparaître.
- Envoi réel du formulaire de contact.

## Stack

- **Astro** (site statique) + **Tailwind CSS**.
- Content collections Astro, validées par des schémas **zod**.
- Images optimisées via `astro:assets`.
- Polices auto-hébergées (Fontsource).
- Déploiement : **Netlify** (URL de preview).
- Évolution prévue : **Decap CMS** écrivant dans `src/content`. Photos à gros volume via Cloudinary, vidéos en embed YouTube/Facebook.

## Identité visuelle

Direction : chaleureuse et conviviale, « club où on s'amuse », accessible aux débutants et à tous les âges.

| Rôle | Couleur |
|---|---|
| Principale (boutons, titres) | Bordeaux `#7A1F2B` |
| Accents (soulignés, badges, décor) | Or chaud `#D9A441` |
| Fond | Crème `#FBF5EC` |
| Texte | Brun foncé `#2A1A14` |

Règle : l'or ne sert jamais de couleur de texte sur fond crème (contraste insuffisant).

Typographie : **Fraunces** pour les titres, **Figtree** pour le texte.

Photos : reprises du site actuel du club (contenu du club, démo privée), complétées par des placeholders si la qualité est insuffisante.

## Pages

### Commun

- **Header sticky** : logo, liens Accueil / Nos cours / Contact, bouton « Venir essayer » vers `/contact`. Menu burger sur mobile.
- **Footer** : adresse (Rue des Tanneurs 4, 1350 Jandrain), téléphone (0495/32.66.47), email (ndc1350@gmail.com), lien Facebook (https://www.facebook.com/profile.php?id=100057211669508).

### Accueil (`/`)

1. Hero : grande photo, titre du type « On danse ensemble, à Hannut et Jandrain », boutons « Voir les horaires » (`/cours`) et « Nous contacter » (`/contact`).
2. Repères : 3 soirs par semaine · tous niveaux · 4 familles de danses.
3. Nos danses : 4 cartes (Solo & line dance, Rock/Salsa/Bachata, Danses standard, Danses latines), chacune liée à sa section de `/cours`.
4. Aperçu de la semaine : lundi, jeudi, vendredi en 3 colonnes (lieu + créneaux), généré depuis `horaires.json`.
5. Prochain événement : premier événement futur de `evenements.json` ; masqué s'il n'y en a aucun.
6. Citation (William W. Purkey) sur bandeau bordeaux.
7. Sponsors : bandeau de logos défilant, animation coupée si `prefers-reduced-motion`.

### Nos cours (`/cours`)

1. En-tête court.
2. Planning : une carte par jour. Chaque créneau affiche l'heure, l'intitulé et un badge de niveau (Débutant / Intermédiaire / Avancé / Tous niveaux). Le vendredi porte le label « Entraînement ».
3. Nos danses : 4 blocs par famille, avec ancre, texte court, liste des danses. Les descriptions sont réécrites (celles du site actuel sont longues et contiennent des erreurs historiques).
4. Calendrier : liste des prochaines dates depuis `evenements.json`.
5. Bandeau final « Envie d'essayer ? » avec un bouton vers `/contact`.

### Contact (`/contact`)

1. Cartes cliquables : téléphone (`tel:`), email (`mailto:`), Facebook.
2. Carte OpenStreetMap intégrée (iframe, sans clé API) centrée sur Jandrain.
3. Formulaire prénom / nom / email / message, avec validation HTML5. En maquette, la soumission n'envoie rien et affiche un message de confirmation. Le formulaire porte déjà les attributs Netlify Forms pour la mise en production.

## Contenu

### Horaires (depuis le site actuel)

**Lundi — Hannut**
- 18h15 Danses solo P1 — Intermédiaires
- 19h15 Danses solo P2 — Avancés
- 20h15 Rock, Salsa, Bachata — Débutants
- 21h15 Rock, Salsa, Bachata — Avancés

**Jeudi — Hannut**
- 18h15 Danses solo — Débutants
- 19h15 Danses de salon — Débutants
- 20h15 Danses de salon — Intermédiaires P1
- 21h15 Danses de salon — Avancés P2

**Vendredi — Jandrain (entraînement)**
- 19h Danses solo
- 20h Danses en couple
- 21h–22h Mix

### Familles de danses

- Solo & line dance : danses en groupe sans partenaire (reggae, twist, mambo, bachata, sirtaki, chansons populaires).
- Rock, Salsa, Bachata.
- Danses standard : quickstep, tango, valse viennoise, valse anglaise, slow fox.
- Danses latines : cha-cha-cha, rumba, samba, jive, paso doble.

### Placeholders visibles (« à confirmer »)

- Adresse de la salle de Hannut.
- Tarifs : affichés « Tarifs : contactez-nous ».
- Calendrier : l'événement connu (Petit marché de Hannut, 6 septembre 2026) et 2 à 3 exemples marqués comme tels.

## Architecture

```
src/
  content.config.ts    schémas zod des collections
  content/
    horaires.json      [{ jour, lieu, label?, creneaux: [{ heure, cours, niveau }] }]
    danses/*.md        frontmatter { titre, slug, ordre, image, danses: string[] } + texte
    evenements.json    [{ date, titre, lieu, description, exemple?: boolean }]
    sponsors.json      [{ nom, logo, lien? }]
  components/          Header, Footer, Hero, CarteDanse, PlanningJour, BadgeNiveau,
                       ProchainEvenement, BandeauSponsors, FormulaireContact
  layouts/Base.astro   head (SEO, polices), header, footer
  pages/               index.astro, cours.astro, contact.astro
  assets/images/       photos traitées par astro:assets
public/                favicon, logos sponsors
```

Règles :
- Les pages ne contiennent aucun contenu éditable en dur ; tout vient de `src/content`.
- `niveau` est une enum (`debutant`, `intermediaire`, `avance`, `tous`). Une valeur invalide fait échouer le build avec un message explicite.
- Les événements passés sont filtrés au build.

## Qualité

- Mobile-first ; planning en une colonne sur mobile.
- Accessibilité : contrastes AA, navigation clavier, focus visible, `alt` sur les images, `prefers-reduced-motion` respecté.
- Performance : zéro JS hors menu mobile et formulaire ; images WebP responsives.
- SEO : `title` et `description` par page, Open Graph, JSON-LD `DanceSchool` (adresse, téléphone).

## Vérification

- `astro build` sans erreur ni avertissement.
- `astro check` sans erreur.
- Lighthouse ≥ 90 sur Performance, Accessibilité, Bonnes pratiques, SEO (accueil et cours, mobile).
- Contrôle visuel à 375 px et 1440 px.
- Test de schéma : un niveau invalide dans `horaires.json` fait échouer le build.

## Livrables

1. Code du site dans ce dépôt.
2. Déploiement Netlify (URL de preview).
3. `docs/resume-club.md` : résumé d'une page, sans jargon, pour la présentation au club (hébergement et coûts, modification du contenu par le comité, informations à fournir).
