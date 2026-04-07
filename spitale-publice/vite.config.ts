import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Serves specific files from the parent directory during dev
function serveParentFiles(files: string[]) {
  return {
    name: 'serve-parent-files',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const match = files.find((f) => req.url === `/${f}`)
        if (match) {
          const filePath = path.resolve(__dirname, '..', match)
          const content = fs.readFileSync(filePath)
          res.setHeader('Content-Type', 'application/json')
          res.end(content)
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), serveParentFiles(['hospitals.json'])],
})
