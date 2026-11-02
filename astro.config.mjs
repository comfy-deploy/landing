// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.comfydeploy.com',
  trailingSlash: 'never',
  // /blog/foo.html + vercel.json cleanUrls → served at /blog/foo (same URLs as Framer)
  build: { format: 'file' },
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
