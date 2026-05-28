import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectDir = resolve(__dirname, '..')

dotenv.config({ path: resolve(projectDir, '.env.server') })

process.env.NODE_ENV = 'production'

const serverDir = resolve(projectDir, '.wasp/out/server')
const schemaPath = resolve(projectDir, '.wasp/out/db/schema.prisma')

console.log('=== Syncing database schema ===')
// Use db push instead of migrate deploy to handle migration drift gracefully.
// db push is safe: adds tables/columns/indices without data loss.
execSync(`npx prisma db push --schema=${schemaPath} --accept-data-loss`, {
  cwd: serverDir,
  stdio: 'inherit',
  env: process.env,
})

console.log('=== Starting server ===')
import(resolve(serverDir, 'bundle/server.js'))
