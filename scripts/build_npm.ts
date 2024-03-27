import { build, emptyDir } from '@deno/dnt'

await emptyDir('./npm')

await build({
  entryPoints: ['./mod.ts'],
  outDir: './npm',
  shims: {
    deno: true,
  },
  package: {
    name: 'nodocentes-sueldos',
    author: 'emigpa',
    version: Deno.args[0],
    description: 'Libreria para calcular sueldos nodocentes.',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/emigpa/nodocentes-sueldos.git',
    },
    bugs: {
      url: 'https://github.com/emigpa/nodocentes-sueldos/issues',
    },
  },
  postBuild() {
    Deno.copyFileSync('LICENSE', 'npm/LICENSE')
    Deno.copyFileSync('README.md', 'npm/README.md')
  },
})
