import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: z.string(),
      cover: image().optional(),
    }),
});

// Editorial layer for workflow templates. The template itself (cover, JSON, GPU) comes from the API at build time;
// these files add the unique copy each page needs to rank. File name = the template's share_slug.
export const WORKFLOW_FAMILIES = ['Flux', 'Flux Kontext', 'Qwen-Image', 'Wan', 'Nano Banana', 'HiDream', 'OmniGen2', 'Hunyuan', 'Chroma', 'Seedream', 'Other'] as const;
export const WORKFLOW_TASKS = ['text-to-image', 'image-editing', 'inpaint-outpaint', 'controlnet', 'image-to-video', 'text-to-video', 'video-editing', 'avatar-lipsync', '3d', 'audio', 'restoration'] as const;

const workflows = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/workflows' }),
  schema: z.object({
    title: z.string().max(60),
    seoTitle: z.string().max(60),
    description: z.string().min(110).max(165),
    summary: z.string(),
    family: z.enum(WORKFLOW_FAMILIES),
    tasks: z.array(z.enum(WORKFLOW_TASKS)).min(1).max(3),
    inputs: z.array(z.string()).min(1),
    outputs: z.array(z.string()).min(1),
    useCases: z.array(z.string()).min(3).max(5),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).length(3),
  }),
});

export const collections = { blog, workflows };
