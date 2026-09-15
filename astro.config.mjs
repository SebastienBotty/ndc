import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://new-dance-club.netlify.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
