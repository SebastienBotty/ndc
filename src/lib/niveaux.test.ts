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
