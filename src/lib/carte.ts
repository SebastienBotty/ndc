const arrondi = (n: number) => Number(n.toFixed(6));

export function osmEmbedUrl(lat: number, lon: number, delta = 0.008): string {
  const bbox = [lon - delta, lat - delta, lon + delta, lat + delta].map(arrondi).join(',');
  const params = new URLSearchParams({ bbox, layer: 'mapnik', marker: `${lat},${lon}` });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}
