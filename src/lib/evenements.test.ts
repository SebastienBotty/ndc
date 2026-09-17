import { describe, expect, it } from 'vitest';
import { getUpcomingEvents, getNextEvent, type Evenement } from './evenements';

const evenements: Evenement[] = [
  { id: 'passe', date: new Date('2026-01-01'), titre: 'Événement passé', lieu: 'Verchamps', description: '' },
  { id: 'futur-proche', date: new Date('2026-11-14'), titre: 'Événement proche', lieu: 'Roimont', description: '' },
  { id: 'futur-lointain', date: new Date('2026-12-12'), titre: 'Événement lointain', lieu: 'Roimont', description: '' },
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
