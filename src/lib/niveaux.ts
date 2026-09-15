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
