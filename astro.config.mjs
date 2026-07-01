import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sprb.chat',
  integrations: [sitemap()],
  output: 'static',
});
