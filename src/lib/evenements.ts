export interface Evenement {
  id: string;
  date: Date;
  titre: string;
  lieu: string;
  description: string;
  exemple?: boolean;
}

export function getUpcomingEvents(evenements: Evenement[], now: Date = new Date()): Evenement[] {
  return evenements
    .filter((e) => e.date.getTime() >= now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getNextEvent(evenements: Evenement[], now: Date = new Date()): Evenement | undefined {
  return getUpcomingEvents(evenements, now)[0];
}
