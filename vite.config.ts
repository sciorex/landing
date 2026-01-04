import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), 'SCIOREX_')

  // Build the SCIOREX_* environment object
  const sciorexEnv: Record<string, string> = {}
  for (const key of Object.keys(env)) {
    if (key.startsWith('SCIOREX_')) {
      sciorexEnv[key] = env[key]
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      __SCIOREX_ENV__: JSON.stringify(sciorexEnv),
    },
  }
})
