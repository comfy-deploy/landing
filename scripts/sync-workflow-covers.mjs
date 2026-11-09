// Pulls each public template's cover from the API and writes a still poster to src/assets/workflows/<slug>.jpg,
// so the gallery ships optimized local images (Astro <Image>) instead of multi-MB S3 PNGs and MP4s.
// Run after new templates are shared: `bun scripts/sync-workflow-covers.mjs` (needs ffmpeg). Existing posters are kept.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const API = 'https://api.comfydeploy.com/api/shared-workflows';
const out = 'src/assets/workflows';
mkdirSync(out, { recursive: true });

const { shared_workflows: list } = await (await fetch(`${API}?limit=500&offset=0`)).json();
for (const w of list) {
  const dest = join(out, `${w.share_slug}.jpg`);
  if (existsSync(dest) && !process.argv.includes('--force')) continue;
  const url = w.cover_image;
  const ext = (url?.match(/\.(\w+)(?:\?|$)/)?.[1] ?? '').toLowerCase();
  if (!url || ext === 'glb') {
    console.warn(`skip ${w.share_slug}: no image cover (${ext || 'none'})`);
    continue;
  }
  const tmp = join(tmpdir(), `cover-${w.share_slug}.${ext}`);
  writeFileSync(tmp, Buffer.from(await (await fetch(url)).arrayBuffer()));
  // Videos: grab a frame 1s in (falls back to the first frame for very short clips). Images: just re-encode.
  const seek = ext === 'mp4' || ext === 'webm' || ext === 'mov' ? ['-ss', '1'] : [];
  const args = (s) => ['-y', '-loglevel', 'error', ...s, '-i', tmp, '-frames:v', '1', '-vf', "scale='min(1600,iw)':-2", '-q:v', '3', dest];
  try {
    execFileSync('ffmpeg', args(seek));
    if (!existsSync(dest)) execFileSync('ffmpeg', args([]));
    console.log(`ok ${w.share_slug}`);
  } catch (e) {
    console.warn(`fail ${w.share_slug}: ${e.message}`);
  }
  rmSync(tmp, { force: true });
}
