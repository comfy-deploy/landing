// Full-text dump for LLMs (llmstxt.org convention): site summary + every blog post and workflow template as markdown.
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import { SITE } from '../consts';
import { getWorkflows } from '../lib/workflows';

export async function GET() {
  const intro = fs.readFileSync('public/llms.txt', 'utf8');
  const posts = (await getCollection('blog')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const body = posts
    .map((p) => {
      const md = (p.body ?? '').replace(/!\[[^\]]*\]\([^)]*\)\n?/g, ''); // images carry no text
      return `## ${p.data.title}\n\nURL: ${SITE.url}/blog/${p.id}\nPublished: ${p.data.date.toISOString().slice(0, 10)}\n\n${p.data.description}\n\n${md.trim()}\n`;
    })
    .join('\n---\n\n');
  const flows = (await getWorkflows())
    .map((w) => {
      const facts = [
        w.gpu && `Recommended GPU: ${w.gpu}`,
        w.inputs.length && `Inputs: ${w.inputs.join(', ')}`,
        w.outputs.length && `Outputs: ${w.outputs.join(', ')}`,
        w.models.length && `Models: ${w.models.join(', ')}`,
        w.packages.length && `Custom nodes: ${w.packages.join(', ')}`,
      ].filter(Boolean);
      return `## ${w.title}\n\nURL: ${SITE.url}/workflows/${w.slug}\nRun: ${w.runUrl}\nDownload JSON: ${w.downloadUrl}\n${facts.join('\n')}\n\n${w.summary}\n\n${(w.entry?.body ?? '').trim()}\n`;
    })
    .join('\n---\n\n');
  return new Response(`${intro}\n# Blog posts (full text)\n\n${body}\n\n# ComfyUI workflow templates\n\n${flows}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
