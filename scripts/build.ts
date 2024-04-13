import { existsSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'

const cwd = process.cwd()
const unlinkFiles = ['index.d.cts', 'index.d.mts']
for (const file of unlinkFiles) {
  const filepath = resolve(cwd, 'dist', file)
  if (existsSync(filepath)) {
    unlinkSync(filepath)
  }
}
