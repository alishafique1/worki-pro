/**
 * Paperclip <-> GitHub sync for worki-pro
 *
 * Usage (CLI):
 *   node scripts/paperclip-sync.js update-issue <WOR-XX> <status> [comment]
 *   node scripts/paperclip-sync.js post-comment <WOR-XX> <comment>
 *   node scripts/paperclip-sync.js serve   # webhook server on :3201
 *
 * Statuses: todo | in_progress | done | cancelled
 */

const http = require('http')
const https = require('https')

const COMPANY = '9c06b42b-285a-4a3b-abb7-e6ed0d11e0e6'
const GH_REPO = 'alishafique1/worki-pro'
const CTO_AGENT = '6ff666f2-c0b1-4e5e-b2fe-e4d48f5e4f3a'
const GH_TOKEN = process.env.GITHUB_TOKEN || ''

// Paperclip identifier -> GitHub issue number
const ISSUE_MAP = {
  'WOR-56': 65, 'WOR-57': 62, 'WOR-58': 61, 'WOR-59': 60,
  'WOR-60': 59, 'WOR-61': 58, 'WOR-67': 68, 'WOR-68': 64,
  'WOR-69': 63, 'WOR-70': 57, 'WOR-71': 56, 'WOR-72': 55,
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function pcRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const b = body ? JSON.stringify(body) : null
    const opts = {
      hostname: 'localhost', port: 4000, method, path,
      headers: { 'Content-Type': 'application/json', ...(b ? { 'Content-Length': Buffer.byteLength(b) } : {}) },
    }
    const req = http.request(opts, res => {
      let d = ''
      res.on('data', c => (d += c))
      res.on('end', () => { try { resolve(JSON.parse(d)) } catch { resolve(d) } })
    })
    req.on('error', reject)
    if (b) req.write(b)
    req.end()
  })
}

function ghRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const b = body ? JSON.stringify(body) : null
    const opts = {
      hostname: 'api.github.com', method, path,
      headers: {
        'User-Agent': 'worki-paperclip-sync',
        'Authorization': 'token ' + GH_TOKEN,
        'Content-Type': 'application/json',
        ...(b ? { 'Content-Length': Buffer.byteLength(b) } : {}),
      },
    }
    const req = https.request(opts, res => {
      let d = ''
      res.on('data', c => (d += c))
      res.on('end', () => { try { resolve(JSON.parse(d)) } catch { resolve(d) } })
    })
    req.on('error', reject)
    if (b) req.write(b)
    req.end()
  })
}

// ── Paperclip helpers ─────────────────────────────────────────────────────────

let _issueCache = null

async function getIssues() {
  if (_issueCache) return _issueCache
  const issues = await pcRequest('GET', `/api/companies/${COMPANY}/issues?limit=100`)
  _issueCache = Array.isArray(issues) ? issues : []
  return _issueCache
}

async function getIssueId(identifier) {
  const issues = await getIssues()
  const issue = issues.find(i => i.identifier === identifier)
  return issue ? issue.id : null
}

async function updateIssue(identifier, status, comment) {
  const id = await getIssueId(identifier)
  if (!id) { console.error('Issue not found:', identifier); return }

  if (status) {
    const patch = { status }
    if (status === 'in_progress') patch.assigneeAgentId = CTO_AGENT
    const r = await pcRequest('PATCH', `/api/issues/${id}`, patch)
    console.log(`${identifier} status -> ${status}:`, r.status || r.error || 'ok')
  }

  if (comment) {
    const r = await pcRequest('POST', `/api/issues/${id}/comments`, { body: comment })
    console.log(`${identifier} comment posted:`, r.id ? r.id.slice(0, 8) : r.error || 'ok')

    // Mirror to GitHub
    const ghNum = ISSUE_MAP[identifier]
    if (ghNum && GH_TOKEN) {
      await ghRequest('POST', `/repos/${GH_REPO}/issues/${ghNum}/comments`, { body: comment })
      console.log(`  mirrored to GitHub #${ghNum}`)
    }
  }
}

// ── Webhook server ────────────────────────────────────────────────────────────

function serveWebhook() {
  const server = http.createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/github-webhook') {
      res.writeHead(404); res.end(); return
    }

    let body = ''
    req.on('data', c => (body += c))
    req.on('end', async () => {
      try {
        const event = req.headers['x-github-event']
        const payload = JSON.parse(body)

        if (event === 'issue_comment' && payload.action === 'created') {
          const ghNum = payload.issue.number
          const comment = payload.comment.body
          const author = payload.comment.user.login

          // Avoid loops — skip bot comments and comments we originated
          if (
            author === 'github-actions[bot]' ||
            comment.startsWith('[Paperclip sync]')
          ) {
            res.writeHead(200); res.end('skipped'); return
          }

          const identifier = Object.entries(ISSUE_MAP).find(([, n]) => n === ghNum)?.[0]
          if (identifier) {
            const id = await getIssueId(identifier)
            if (id) {
              await pcRequest('POST', `/api/issues/${id}/comments`, {
                body: `**@${author}** via GitHub #${ghNum}:\n\n${comment}`,
              })
              console.log(`GitHub #${ghNum} comment -> Paperclip ${identifier}`)
            }
          }
        }

        if (event === 'issues' && ['closed', 'reopened'].includes(payload.action)) {
          const ghNum = payload.issue.number
          const identifier = Object.entries(ISSUE_MAP).find(([, n]) => n === ghNum)?.[0]
          if (identifier) {
            const status = payload.action === 'closed' ? 'done' : 'todo'
            const id = await getIssueId(identifier)
            if (id) {
              await pcRequest('PATCH', `/api/issues/${id}`, { status })
              console.log(`GitHub #${ghNum} ${payload.action} -> Paperclip ${identifier} ${status}`)
            }
          }
        }

        res.writeHead(200); res.end('ok')
      } catch (e) {
        console.error('Webhook error:', e.message)
        res.writeHead(500); res.end()
      }
    })
  })

  server.listen(3201, () => console.log('Paperclip webhook server listening on :3201'))
  console.log('Syncing GitHub -> Paperclip for issues:', Object.keys(ISSUE_MAP).join(', '))
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const [, , cmd, arg1, arg2, ...rest] = process.argv

// ── Loop discovery bridge ──────────────────────────────────────────────────
// The loop-engineering skill requires every loop to surface findings
// somewhere a human can review. Paperclip is that somewhere for worki-pro.
//
// Usage:
//   node scripts/paperclip-sync.cjs loop <loop-name> <finding-id> <severity> <summary>
//     severities: blocker | high | medium | low
//   node scripts/paperclip-sync.cjs loop-resolve <loop-name> <finding-id> <verdict>
//     verdicts: passed | false-positive | wontfix

async function loopReport(loopName, findingId, severity, summary) {
  // Map finding → Paperclip identifier using a naming convention:
  //   smoke/finding-2026-06-19-01 → WOR-LOOP-SMOKE-001
  // The actual identifier is created on first report; subsequent reports
  // post comments to the same thread.
  const issueMap = require('fs').existsSync('.hermes/loop-state/_issue-map.json')
    ? JSON.parse(require('fs').readFileSync('.hermes/loop-state/_issue-map.json', 'utf8'))
    : {}
  const key = `${loopName}/${findingId}`
  let identifier = issueMap[key]

  if (!identifier) {
    // Create new issue
    const title = `[loop:${loopName}] ${findingId} — ${severity}`
    const body = `**Loop**: ${loopName}\n**Finding**: ${findingId}\n**Severity**: ${severity}\n\n${summary}\n\n---\n_Auto-created by worki-pro loop system. Update by running:\n  \`node scripts/paperclip-sync.cjs loop ${loopName} ${findingId} <severity> <summary>\`_`
    const created = await pcRequest('POST', `/api/companies/${COMPANY}/issues`, {
      title, body, status: 'todo',
    })
    identifier = created.identifier
    issueMap[key] = identifier
    require('fs').mkdirSync('.hermes/loop-state', { recursive: true })
    require('fs').writeFileSync('.hermes/loop-state/_issue-map.json', JSON.stringify(issueMap, null, 2))
    console.log(`Created ${identifier} for ${key}`)
  } else {
    // Append comment to existing thread
    await updateIssue(identifier, null, `**Update**: ${summary}`)
    console.log(`Updated ${identifier} for ${key}`)
  }
}

async function loopResolve(loopName, findingId, verdict) {
  const issueMap = require('fs').existsSync('.hermes/loop-state/_issue-map.json')
    ? JSON.parse(require('fs').readFileSync('.hermes/loop-state/_issue-map.json', 'utf8'))
    : {}
  const identifier = issueMap[`${loopName}/${findingId}`]
  if (!identifier) {
    console.error(`No tracked issue for ${loopName}/${findingId}`)
    process.exit(1)
  }
  const statusMap = { passed: 'done', 'false-positive': 'cancelled', wontfix: 'cancelled' }
  await updateIssue(identifier, statusMap[verdict] || 'done', `Loop resolved: ${verdict}`)
  console.log(`${identifier} → ${verdict}`)
}

if (cmd === 'update-issue') {
  updateIssue(arg1, arg2, rest.join(' ')).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
} else if (cmd === 'post-comment') {
  updateIssue(arg1, null, [arg2, ...rest].join(' ')).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
} else if (cmd === 'serve') {
  serveWebhook()
} else if (cmd === 'loop') {
  loopReport(arg1, arg2, arg3, rest.join(' ')).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
} else if (cmd === 'loop-resolve') {
  loopResolve(arg1, arg2, arg3).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
} else {
  console.log('Usage:')
  console.log('  node scripts/paperclip-sync.js update-issue <WOR-XX> <status> [comment]')
  console.log('  node scripts/paperclip-sync.js post-comment <WOR-XX> <comment>')
  console.log('  node scripts/paperclip-sync.js loop <loop-name> <finding-id> <severity> <summary>')
  console.log('  node scripts/paperclip-sync.js loop-resolve <loop-name> <finding-id> <verdict>')
  console.log('  node scripts/paperclip-sync.js serve')
  process.exit(1)
}
