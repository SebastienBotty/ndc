import { describe, expect, it } from 'vitest';
import { googleMapsUrl } from './carte';

describe('googleMapsUrl', () => {
  it('ouvre une recherche Google Maps sur l’adresse', () => {
    const url = new URL(googleMapsUrl('Avenue des Tilleuls 4, 4370 Verchamps'));
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/search/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('query')).toBe('Avenue des Tilleuls 4, 4370 Verchamps');
  });
});
