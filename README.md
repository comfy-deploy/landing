# comfydeploy.com

Marketing site + blog for [ComfyDeploy](https://www.comfydeploy.com). Astro, static, deployed on Vercel.

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # → dist/
```

- Pages: `src/pages/` (home, `/comfyui-online-workspace`, `/comfyui-playground`, `/comfyui-api`, `/blog`)
- Blog posts: `src/content/blog/<slug>.mdx`, images in `src/content/blog/<slug>/` (auto-optimized to WebP)
- Links (app, docs, demo, socials): `src/consts.ts`
- Design tokens (light/dark): `src/styles/global.css`
