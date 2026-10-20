// The released packages (every packages/* folder; today only i18n) and their version (ADR 0001).
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);

/** Every package under packages/, in name order, with its folder. */
export function packages() {
  return readdirSync(new URL('packages/', root), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = new URL(`packages/${entry.name}/`, root);
      const { name, version } = JSON.parse(readFileSync(new URL('package.json', dir), 'utf8'));
      return { name, version, dir: fileURLToPath(dir) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** The version of the released packages, which the release tag must match. Exits if packages/ ever holds several that disagree. */
export function sharedVersion() {
  const all = packages();
  const versions = new Set(all.map(({ version }) => version));
  if (versions.size > 1) {
    console.error('Every package must have the same version, but:');
    for (const { name, version } of all) console.error(`  ${name} is ${version}`);
    console.error('A release tag names one version, so they must agree; see `pnpm changeset version`.');
    process.exit(1);
  }
  return all[0].version;
}
