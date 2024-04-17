import Jsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [Jsx()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
})
