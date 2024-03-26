// ex. scripts/build_npm.ts
import { build, emptyDir } from '@deno/dnt'

await emptyDir('./npm')

await build({
  entryPoints: ['./mod.ts'],
  outDir: './npm',
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: 'nodocentes-sueldos',
    author: 'emigpa',
    version: Deno.args[0],
    description: 'Libreria para calcular sueldos nodocentes.',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/emigpa/nodocentes-sueldos.gi',
    },
    bugs: {
      url: 'https://github.com/emigpa/nodocentes-sueldos/issues',
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync('LICENSE', 'npm/LICENSE')
    Deno.copyFileSync('README.md', 'npm/README.md')
  },
})
