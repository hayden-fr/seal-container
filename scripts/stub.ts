import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const cwd = process.cwd()

const esmPath = 'dist/index.mjs'
writeFileSync(resolve(esmPath), `export * from "${cwd}/src/index";\n`)
