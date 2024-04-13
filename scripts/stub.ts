import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const cwd = process.cwd()

writeFileSync(
  resolve(cwd, 'dist/index.mjs'),
  readFileSync(resolve(cwd, 'dist/index.d.ts')),
)
