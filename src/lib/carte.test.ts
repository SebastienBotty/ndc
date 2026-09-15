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
