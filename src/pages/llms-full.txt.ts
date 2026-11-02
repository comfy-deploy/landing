// Full-text dump for LLMs (llmstxt.org convention): site summary + every blog post as markdown.
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import { SITE } from '../consts';

export async function GET() {
  const intro = fs.readFileSync('public/llms.txt', 'utf8');
  const posts = (await getCollection('blog')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const body = posts
    .map((p) => {
      const md = (p.body ?? '').replace(/!\[[^\]]*\]\([^)]*\)\n?/g, ''); // images carry no text
      return `## ${p.data.title}\n\nURL: ${SITE.url}/blog/${p.id}\nPublished: ${p.data.date.toISOString().slice(0, 10)}\n\n${p.data.description}\n\n${md.trim()}\n`;
    })
    .join('\n---\n\n');
  return new Response(`${intro}\n# Blog posts (full text)\n\n${body}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
