import { z } from 'zod';

export const creneauSchema = z.object({
  heure: z.string(),
  cours: z.string(),
  niveau: z.enum(['debutant', 'intermediaire', 'avance', 'tous']),
});
