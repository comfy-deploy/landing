// Public ComfyUI workflow templates, fetched from the ComfyDeploy API at build time and merged with the
// editorial copy in src/content/workflows/<slug>.md. A template without copy still gets a page (from API data);
// the daily rebuild picks up newly shared templates.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { WORKFLOW_FAMILIES, WORKFLOW_TASKS } from '../content.config';

const API = 'https://api.comfydeploy.com/api/shared-workflows';
// Kept off the site: img2lora is marked broken by its author.
const HIDDEN = new Set(['img2lora']);
const MODEL_EXT = /\.(safetensors|ckpt|pt|pth|bin|gguf|sft|onnx)$/i;

export type Family = (typeof WORKFLOW_FAMILIES)[number];
export type Task = (typeof WORKFLOW_TASKS)[number];

export const TASK_LABEL: Record<Task, string> = {
  'text-to-image': 'Text to image',
  'image-editing': 'Image editing',
  'inpaint-outpaint': 'Inpaint & outpaint',
  controlnet: 'ControlNet',
  'image-to-video': 'Image to video',
  'text-to-video': 'Text to video',
  'video-editing': 'Video editing',
  'avatar-lipsync': 'Avatars & lip sync',
  '3d': '3D',
  audio: 'Audio & voice',
  restoration: 'Restoration',
};

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export interface Workflow {
  slug: string;
  id: string;
  title: string;
  seoTitle: string;
  description: string;
  summary: string;
  family: Family;
  tasks: Task[];
  inputs: string[];
  outputs: string[];
  useCases: string[];
  faq: [string, string][];
  entry?: CollectionEntry<'workflows'>;
  views: number;
  gpu: string | null;
  nodeCount: number;
  models: string[];
  packages: string[];
  comfyui: string | null;
  poster?: ImageMetadata;
  video?: string;
  created: Date;
  updated: Date;
  runUrl: string;
  downloadUrl: string;
}

const posters = import.meta.glob<{ default: ImageMetadata }>('../assets/workflows/*.jpg', { eager: true });
const posterFor = (slug: string) => posters[`../assets/workflows/${slug}.jpg`]?.default;

async function getJson(url: string) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res.json();
    // Fail the build rather than ship a gallery with missing templates; Vercel keeps the last good deploy.
    if (attempt === 3) throw new Error(`${url} → ${res.status}`);
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
}

function analyse(nodes: any[]) {
  const models = new Set<string>();
  const packages = new Set<string>();
  for (const n of nodes) {
    for (const v of Array.isArray(n.widgets_values) ? n.widgets_values : [])
      if (typeof v === 'string' && MODEL_EXT.test(v)) models.add(v.split(/[\\/]/).pop()!);
    const pkg = n.properties?.cnr_id;
    if (pkg && pkg !== 'comfy-core') packages.add(pkg);
  }
  return { models: [...models].sort(), packages: [...packages].sort() };
}

let cache: Promise<Workflow[]> | undefined;

export function getWorkflows(): Promise<Workflow[]> {
  return (cache ??= load());
}

async function load(): Promise<Workflow[]> {
  const { shared_workflows: list } = await getJson(`${API}?limit=500&offset=0`);
  const copy = new Map((await getCollection('workflows')).map((e) => [e.id, e]));
  const wanted = list.filter((w: any) => !HIDDEN.has(w.share_slug));
  const details: any[] = [];
  for (let i = 0; i < wanted.length; i += 10)
    details.push(...(await Promise.all(wanted.slice(i, i + 10).map((w: any) => getJson(`${API}/${w.share_slug}`)))));

  return details
    .filter((d) => d.is_public && !HIDDEN.has(d.share_slug))
    .map((d): Workflow => {
      const slug: string = d.share_slug;
      const ex = d.workflow_export ?? {};
      const env = ex.environment ?? {};
      const { models, packages } = analyse(ex.nodes ?? []);
      const e = copy.get(slug);
      const c = e?.data;
      const fallbackDesc = (d.description || d.title).trim();
      const cover: string = d.cover_image ?? '';
      return {
        slug,
        id: d.id,
        title: c?.title ?? d.title,
        seoTitle: c?.seoTitle ?? `${d.title} ComfyUI Workflow`,
        description: c?.description ?? (fallbackDesc.length > 160 ? `${fallbackDesc.slice(0, 157)}…` : fallbackDesc),
        summary: c?.summary ?? fallbackDesc,
        family: c?.family ?? 'Other',
        tasks: c?.tasks ?? [],
        inputs: c?.inputs ?? [],
        outputs: c?.outputs ?? [],
        useCases: c?.useCases ?? [],
        faq: (c?.faq ?? []).map((f) => [f.q, f.a] as [string, string]),
        entry: e,
        views: d.view_count ?? 0,
        gpu: env.gpu ?? null,
        nodeCount: (ex.nodes ?? []).length,
        models,
        packages,
        comfyui: env.comfyui_version ? String(env.comfyui_version).slice(0, 7) : null,
        poster: posterFor(slug),
        video: /\.(mp4|webm)(\?|$)/i.test(cover) ? cover : undefined,
        created: new Date(d.created_at),
        updated: new Date(d.updated_at),
        runUrl: `https://app.comfydeploy.com/workflows?view=import&shared_workflow_id=${d.id}&shared_slug=${slug}`,
        downloadUrl: `${API}/${slug}/download`,
      };
    })
    .sort((a, b) => b.created.valueOf() - a.created.valueOf());
}

/** Families / tasks with at least `min` templates get their own indexable filter page. */
export function facets(all: Workflow[], min = 2) {
  const count = <T extends string>(pick: (w: Workflow) => T[]) => {
    const m = new Map<T, number>();
    for (const w of all) for (const k of pick(w)) m.set(k, (m.get(k) ?? 0) + 1);
    return [...m].filter(([, n]) => n >= min).sort((a, b) => b[1] - a[1]);
  };
  return {
    families: count((w) => (w.family === 'Other' ? [] : [w.family])),
    tasks: count((w) => w.tasks),
  };
}
