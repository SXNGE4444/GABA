import { cp, mkdir, rm } from 'node:fs/promises';

const out = new URL('../dist/', import.meta.url);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of ['index.html', 'src', 'assets']) {
  await cp(new URL(`../${entry}`, import.meta.url), new URL(`./${entry}`, out), { recursive: true });
}

console.log('Built static Cloudflare bundle in dist/');
