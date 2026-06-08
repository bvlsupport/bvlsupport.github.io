/**
 * Fetch Tools Script
 * Reads features.json, clones gh-pages branch from each published tool's repo.
 * For public repos: no auth needed on CI runners.
 * For private repos: set GH_PAT env var (GitHub PAT with repo scope).
 */
import fs from 'fs';
import { execSync } from 'child_process';

const FEATURES_PATH = 'src/lib/data/features.json';
const PAT = process.env.GH_PAT || '';

const features = JSON.parse(fs.readFileSync(FEATURES_PATH, 'utf8'));
const published = features.filter(f => f.status === 'published' && f.repo);

if (published.length === 0) {
  console.log('No published tools with repos to fetch.');
  process.exit(0);
}

for (const feature of published) {
  const targetDir = 'static/' + feature.id;
  const tmpDir = '/tmp/bvlsupport-' + feature.id;

  // Build clone URL — use PAT if available for private repos
  let cloneUrl;
  if (PAT) {
    cloneUrl = 'https://x-access-token:' + PAT + '@github.com/' + feature.repo + '.git';
  } else {
    cloneUrl = 'https://github.com/' + feature.repo + '.git';
  }

  console.log('Fetching ' + feature.name + ' (' + feature.repo + ':gh-pages)');

  // Clean up
  try { fs.rmSync(tmpDir, { recursive: true }); } catch (e) {}
  try { fs.rmSync(targetDir, { recursive: true }); } catch (e) {}

  try {
    execSync('git clone --depth 1 --branch gh-pages ' + cloneUrl + ' ' + tmpDir, {
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60000
    });

    // Remove .git
    try { fs.rmSync(tmpDir + '/.git', { recursive: true }); } catch (e) {}

    // Copy to static/
    fs.mkdirSync(targetDir, { recursive: true });
    execSync('cp -r ' + tmpDir + '/* ' + targetDir + '/', { stdio: 'pipe' });

    let count = 0;
    try { count = fs.readdirSync(targetDir).length; } catch (e) {}
    console.log('  -> ' + count + ' items placed in ' + targetDir + '/');
  } catch (err) {
    console.error('  FAILED: ' + err.message);
  }

  // Clean up temp
  try { fs.rmSync(tmpDir, { recursive: true }); } catch (e) {}
}