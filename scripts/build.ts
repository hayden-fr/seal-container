import { unlinkSync } from 'node:fs'
import { resolve } from 'node:path'

const cwd = process.cwd()

unlinkSync(resolve(cwd, 'dist/index.d.cts'))
unlinkSync(resolve(cwd, 'dist/index.d.mts'))
