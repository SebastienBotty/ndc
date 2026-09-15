export type Niveau = 'debutant' | 'intermediaire' | 'avance' | 'tous';

const LABELS: Record<Niveau, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
  tous: 'Tous niveaux',
};

const CLASSES: Record<Niveau, string> = {
  debutant: 'bg-or',
  intermediaire: 'bg-bordeaux/50',
  avance: 'bg-bordeaux',
  tous: 'bg-brun/30',
};

export function labelNiveau(niveau: Niveau): string {
  return LABELS[niveau];
}

export function classeNiveau(niveau: Niveau): string {
  return CLASSES[niveau];
}
