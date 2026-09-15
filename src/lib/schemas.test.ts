import { describe, expect, it } from 'vitest';
import { creneauSchema } from './schemas';

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
