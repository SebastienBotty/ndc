// Lien « Maps URLs » officiel de Google : aucune clé API, aucun script ni cookie Google sur le site.
export function googleMapsUrl(adresse: string): string {
  const params = new URLSearchParams({ api: '1', query: adresse });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}
