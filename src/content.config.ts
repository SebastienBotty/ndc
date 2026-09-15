import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { creneauSchema } from './lib/schemas';

const horaires = defineCollection({
  loader: file('src/content/horaires.json'),
  schema: z.object({
    jour: z.string(),
    lieu: z.string(),
    label: z.string().optional(),
    creneaux: z.array(creneauSchema),
  }),
});

const danses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/danses' }),
  schema: z.object({
    titre: z.string(),
    slug: z.string(),
    ordre: z.number(),
    couleur: z.enum(['bordeaux', 'or']).default('bordeaux'),
    danses: z.array(
      z.object({
        nom: z.string(),
        description: z.string(),
      })
    ),
  }),
});

const evenements = defineCollection({
  loader: file('src/content/evenements.json'),
  schema: z.object({
    date: z.coerce.date(),
    titre: z.string(),
    lieu: z.string(),
    description: z.string(),
    exemple: z.boolean().optional().default(false),
  }),
});

const sponsors = defineCollection({
  loader: file('src/content/sponsors.json'),
  schema: z.object({
    nom: z.string(),
    logo: z.string().optional(),
  }),
});

export const collections = { horaires, danses, evenements, sponsors };
