/**
 * Agentic plan task executor.
 * Reads the next incomplete task from a plan file, executes it via
 * an OpenAI-compatible API with tool use, then commits changes.
 *
 * Usage:
 *   OPENCODE_API_KEY=<key> node scripts/execute-task.mjs [plan-file] [task-number]
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import OpenAI from 'openai'

// ── Config ────────────────────────────────────────────────────────────────────

const PLAN_FILE = process.argv[2] || 'docs/superpowers/plans/2026-05-19-bark-style-redesign.md'
const REQUESTED_TASK = process.argv[3] ? parseInt(process.argv[3]) : null
const MAX_TOOL_ROUNDS = 60

const client = new OpenAI({
  apiKey: process.env.OPENCODE_API_KEY,
  baseURL: 'https://opencode.ai/zen/v1',
})
const MODEL = 'deepseek-v4-flash-free'

// ── Tool definitions ──────────────────────────────────────────────────────────

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read the contents of a file. Returns the file content as a string.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'File path relative to repo root' },
        },
        required: ['path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Write content to a NEW file (creating it). For EXISTING files, prefer edit_file to avoid token limits.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'File path relative to repo root' },
          content: { type: 'string', description: 'Full file content to write' },
        },
        required: ['path', 'content'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'edit_file',
      description: 'Make a targeted edit to an existing file by replacing an exact string. Much safer than write_file for large files — avoids token limits. old_string must match exactly (including whitespace/indentation).',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'File path relative to repo root' },
          old_string: { type: 'string', description: 'Exact string to find and replace. Must be unique in the file.' },
          new_string: { type: 'string', description: 'Replacement string' },
        },
        required: ['path', 'old_string', 'new_string'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'run_command',
      description: 'Run a shell command. Returns stdout+stderr. Use for git commands, npm, etc. Avoid wasp CLI — not available in CI.',
      parameters: {
        type: 'object',
        properties: {
          command: { type: 'string', description: 'Shell command to run from repo root' },
        },
        required: ['command'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'mark_step_complete',
      description: 'Mark a specific step in the plan file as complete by changing "- [ ]" to "- [x]" for that step text.',
      parameters: {
        type: 'object',
        properties: {
          step_text: {
            type: 'string',
            description: 'The exact text after "- [ ] " that identifies the step (e.g. "Write the failing test")',
          },
        },
        required: ['step_text'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'task_complete',
      description: 'Signal that the current task is fully done. Call this after all steps are complete and changes committed.',
      parameters: {
        type: 'object',
        properties: {
          summary: { type: 'string', description: 'One-sentence summary of what was done' },
        },
        required: ['summary'],
      },
    },
  },
]

// ── Tool execution ────────────────────────────────────────────────────────────

function executeTool(name, args) {
  switch (name) {
    case 'read_file': {
      const filePath = path.resolve(process.cwd(), args.path)
      if (!fs.existsSync(filePath)) return `Error: file not found: ${args.path}`
      return fs.readFileSync(filePath, 'utf8')
    }

    case 'write_file': {
      const filePath = path.resolve(process.cwd(), args.path)
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, args.content, 'utf8')
      return `Written: ${args.path}`
    }

    case 'run_command': {
      // Safety: block destructive commands
      const blocked = ['rm -rf /', 'git push --force', 'wasp start', 'wasp build']
      if (blocked.some(b => args.command.includes(b))) {
        return `Blocked: command not allowed in CI: ${args.command}`
      }
      try {
        const output = execSync(args.command, {
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: 60_000,
        })
        return output || '(no output)'
      } catch (err) {
        return `Exit ${err.status}: ${err.stdout || ''}${err.stderr || ''}`
      }
    }

    case 'edit_file': {
      const filePath = path.resolve(process.cwd(), args.path)
      if (!fs.existsSync(filePath)) return `Error: file not found: ${args.path}`
      const original = fs.readFileSync(filePath, 'utf8')
      if (!original.includes(args.old_string)) {
        return `Error: old_string not found in ${args.path}. Check exact whitespace/indentation.`
      }
      const updated = original.replace(args.old_string, args.new_string)
      fs.writeFileSync(filePath, updated, 'utf8')
      return `Edited: ${args.path}`
    }

    case 'mark_step_complete': {
      const planPath = path.resolve(process.cwd(), PLAN_FILE)
      let content = fs.readFileSync(planPath, 'utf8')
      const escaped = args.step_text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const updated = content.replace(
        new RegExp(`^- \\[ \\] (\\*\\*)?${escaped}`, 'm'),
        (match) => match.replace('- [ ]', '- [x]')
      )
      if (updated === content) {
        // Try loose match
        const lines = content.split('\n')
        const idx = lines.findIndex(l => l.includes('- [ ]') && l.includes(args.step_text.slice(0, 20)))
        if (idx !== -1) {
          lines[idx] = lines[idx].replace('- [ ]', '- [x]')
          fs.writeFileSync(planPath, lines.join('\n'), 'utf8')
          return `Marked complete (loose match line ${idx + 1})`
        }
        return `Warning: step not found in plan: "${args.step_text.slice(0, 50)}"`
      }
      fs.writeFileSync(planPath, updated, 'utf8')
      return `Marked complete: ${args.step_text.slice(0, 60)}`
    }

    case 'task_complete':
      return `TASK_COMPLETE: ${args.summary}`

    default:
      return `Unknown tool: ${name}`
  }
}

// ── Plan parsing ──────────────────────────────────────────────────────────────

function findNextTask(planContent) {
  const lines = planContent.split('\n')
  let currentTask = null
  let currentTaskNum = 0
  let taskHasPending = false
  let taskStartLine = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const taskMatch = line.match(/^## Task (\d+):/)
    if (taskMatch) {
      if (currentTask && taskHasPending) {
        return { num: currentTaskNum, title: currentTask, startLine: taskStartLine }
      }
      currentTaskNum = parseInt(taskMatch[1])
      currentTask = line.replace(/^## /, '')
      taskHasPending = false
      taskStartLine = i
    }
    if (line.match(/^- \[ \]/)) {
      taskHasPending = true
    }
  }
  // Check last task
  if (currentTask && taskHasPending) {
    return { num: currentTaskNum, title: currentTask, startLine: taskStartLine }
  }
  return null
}

function extractTaskSection(planContent, taskNum) {
  const lines = planContent.split('\n')
  let inTask = false
  let taskLines = []
  for (const line of lines) {
    if (line.match(new RegExp(`^## Task ${taskNum}:`))) inTask = true
    else if (line.match(/^## Task \d+:/) && inTask) break
    if (inTask) taskLines.push(line)
  }
  return taskLines.join('\n')
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const planContent = fs.readFileSync(PLAN_FILE, 'utf8')

  let targetTask
  if (REQUESTED_TASK) {
    targetTask = { num: REQUESTED_TASK, title: `Task ${REQUESTED_TASK}` }
  } else {
    targetTask = findNextTask(planContent)
  }

  if (!targetTask) {
    console.log('✅ All tasks complete — nothing to do.')
    process.exit(0)
  }

  const taskSection = extractTaskSection(planContent, targetTask.num)
  console.log(`\n🤖 Executing: ${targetTask.title}\n`)

  // Read spec for context
  let specContent = ''
  try {
    specContent = fs.readFileSync('docs/superpowers/specs/2026-05-19-bark-style-redesign-design.md', 'utf8')
  } catch {}

  const systemPrompt = `You are an expert software engineer executing a specific task from an implementation plan for a Wasp 0.21 full-stack app (React 19 + Tailwind CSS 4 + Node.js + Prisma v5 + PostgreSQL).

You have access to tools: read_file, write_file, run_command, mark_step_complete, task_complete.

KEY RULES:
- Execute the task steps IN ORDER. Do not skip any step.
- After completing each step, call mark_step_complete with the step's bold title text.
- After each code change, run: git add -A && git commit -m "feat: <description>"
- Do NOT run: wasp start, wasp build, wasp db migrate-dev (no Wasp CLI in CI)
- For DB migrations: write the migration SQL file in migrations/ but skip running it
- For TypeScript checks: only run if .wasp/out/server exists
- Import paths in Wasp: use 'wasp/client/operations', 'wasp/entities', 'wasp/server' etc.
- When the task is fully done and committed, call task_complete.

CRITICAL — AVOID TOKEN LIMIT CRASHES:
- NEVER use write_file on existing files (schema.prisma, operations.ts, etc.) — they are too large.
- ALWAYS use edit_file for modifying existing files. Make one targeted change at a time.
- Only use write_file when creating a brand new file that doesn't exist yet.
- If edit_file returns "old_string not found", read the file first and find the exact text to match.

DESIGN SPEC (abbreviated):
${specContent.slice(0, 3000)}
`

  const userPrompt = `Execute this task completely:

${taskSection}

Work through every step. Call mark_step_complete after each step. Commit all changes. Call task_complete when done.`

  const messages = [{ role: 'user', content: userPrompt }]

  let rounds = 0
  let done = false

  while (!done && rounds < MAX_TOOL_ROUNDS) {
    rounds++
    console.log(`\n--- Round ${rounds} ---`)

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      tools: TOOLS,
      tool_choice: 'auto',
      max_tokens: 8192,
    })

    const msg = response.choices[0].message
    messages.push(msg)

    if (msg.content) console.log('AI:', msg.content.slice(0, 300))

    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      console.log('AI returned no tool calls — task may be complete.')
      break
    }

    const toolResults = []
    for (const call of msg.tool_calls) {
      let args
      try {
        args = JSON.parse(call.function.arguments)
      } catch (parseErr) {
        console.log(`  ⚠️  JSON parse error for ${call.function.name}: ${parseErr.message}`)
        toolResults.push({
          role: 'tool',
          tool_call_id: call.id,
          content: `Error: your tool call arguments were truncated (JSON parse failed). Please retry with shorter content, or use edit_file instead of write_file for large files.`,
        })
        continue
      }
      console.log(`  → ${call.function.name}(${JSON.stringify(args).slice(0, 100)})`)
      const result = executeTool(call.function.name, args)
      const truncated = typeof result === 'string' && result.length > 500
        ? result.slice(0, 500) + '\n...(truncated)'
        : result
      console.log(`  ← ${String(truncated).slice(0, 200)}`)

      toolResults.push({
        role: 'tool',
        tool_call_id: call.id,
        content: String(result),
      })

      if (call.function.name === 'task_complete') {
        done = true
        console.log(`\n✅ Task complete: ${args.summary}`)
      }
    }

    messages.push(...toolResults)
  }

  if (rounds >= MAX_TOOL_ROUNDS) {
    console.log(`\n⚠️  Hit max rounds (${MAX_TOOL_ROUNDS}) — check the plan for partial progress.`)
    process.exit(1)
  }

  // Final git push
  try {
    execSync('git push origin main', { stdio: 'inherit', cwd: process.cwd() })
    console.log('\n🚀 Pushed to main.')
  } catch (e) {
    console.log('\n⚠️  Push failed — may need manual push.')
  }
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
