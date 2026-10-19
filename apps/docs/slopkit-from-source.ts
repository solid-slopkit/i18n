import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const runtimeSource = fileURLToPath(new URL('../../packages/i18n/src/runtime/index.ts', import.meta.url));

// In dev, @solid-slopkit/i18n resolves to the package source, so edits show up without a build.
// @solid-slopkit/components comes from npm like in any app.
export function slopkitFromSource(): Plugin {
  return {
    name: 'slopkit-from-source',
    apply: 'serve',
    enforce: 'pre',
    resolveId(id) {
      if (id === '@solid-slopkit/i18n') return runtimeSource;
    },
  };
}
