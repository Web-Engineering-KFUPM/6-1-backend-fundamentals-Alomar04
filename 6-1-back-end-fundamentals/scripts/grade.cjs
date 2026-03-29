#!/usr/bin/env node

/**
 * Lab Autograder — 6-1 Back-end Fundamentals
 *
 * Grades ONLY based on the TODOs in this lab:
 *  - backend/server.js
 *  - src/App.jsx
 *
 * Marking:
 * - 80 marks for TODOs (lenient, top-level checks only)
 * - 20 marks for submission timing
 *   - On/before deadline => 20/20
 *   - After deadline     => 10/20
 *
 * Deadline: 30 Mar 2026 20:59 (Asia/Riyadh, UTC+03:00)
 *
 * Repo layout:
 * - repo root contains .github/workflows
 * - project folder: 6-1-back-end-fundamentals/
 * - grader file:   6-1-back-end-fundamentals/scripts/grade.cjs
 * - student files:
 *      6-1-back-end-fundamentals/backend/server.js
 *      6-1-back-end-fundamentals/src/App.jsx
 *
 * Notes:
 * - Ignores JS/JSX comments (starter TODO comments do NOT count).
 * - Very lenient checks: looks for key constructs, not exact code.
 * - Server port is intentionally NOT enforced exactly.
 * - Route order does not matter.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ARTIFACTS_DIR = "artifacts";
const FEEDBACK_DIR = path.join(ARTIFACTS_DIR, "feedback");
fs.mkdirSync(FEEDBACK_DIR, { recursive: true });

/* -----------------------------
   Deadline (Asia/Riyadh)
   30 Mar 2026, 20:59
-------------------------------- */
const DEADLINE_RIYADH_ISO = "2026-03-30T20:59:00+03:00";
const DEADLINE_MS = Date.parse(DEADLINE_RIYADH_ISO);

// Submission marks policy
const SUBMISSION_MAX = 20;
const SUBMISSION_LATE = 10;

/* -----------------------------
   TODO marks (out of 80)
-------------------------------- */
const tasks = [
  { id: "t1", name: "TODO 1: Import Express (server.js)", marks: 8 },
  { id: "t2", name: "TODO 2: Create the Express app (server.js)", marks: 8 },
  { id: "t3", name: "TODO 3: Allow React to access the server with cors (server.js)", marks: 8 },
  { id: "t4", name: "TODO 4: Start the server with app.listen(...) + console message (server.js)", marks: 8 },
  { id: "t5", name: 'TODO 5: Create the home route "/" (server.js)', marks: 10 },
  { id: "t6", name: 'TODO 6: Create the "/about" route (server.js)', marks: 10 },
  { id: "t7", name: 'TODO 7: Create the "/student" JSON route (server.js)', marks: 10 },
  { id: "t8", name: 'TODO 8: Request student data in App.jsx using fetch', marks: 9 },
  { id: "t9", name: "TODO 9: Store and display student data in App.jsx", marks: 9 },
];

const STEPS_MAX = tasks.reduce((sum, t) => sum + t.marks, 0); // 80
const TOTAL_MAX = STEPS_MAX + SUBMISSION_MAX; // 100

/* -----------------------------
   Helpers
-------------------------------- */
function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function mdEscape(s) {
  return String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function splitMarks(stepMarks, missingCount, totalChecks) {
  if (missingCount <= 0) return stepMarks;
  const perItem = stepMarks / totalChecks;
  const deducted = perItem * missingCount;
  return Math.max(0, round2(stepMarks - deducted));
}

/**
 * Strip JS/JSX comments while trying to preserve strings/templates.
 */
function stripJsComments(code) {
  if (!code) return code;

  let out = "";
  let i = 0;

  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;

  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];

    if (!inDouble && !inTemplate && ch === "'" && !inSingle) {
      inSingle = true;
      out += ch;
      i++;
      continue;
    }
    if (inSingle && ch === "'") {
      let backslashes = 0;
      for (let k = i - 1; k >= 0 && code[k] === "\\"; k--) backslashes++;
      if (backslashes % 2 === 0) inSingle = false;
      out += ch;
      i++;
      continue;
    }

    if (!inSingle && !inTemplate && ch === '"' && !inDouble) {
      inDouble = true;
      out += ch;
      i++;
      continue;
    }
    if (inDouble && ch === '"') {
      let backslashes = 0;
      for (let k = i - 1; k >= 0 && code[k] === "\\"; k--) backslashes++;
      if (backslashes % 2 === 0) inDouble = false;
      out += ch;
      i++;
      continue;
    }

    if (!inSingle && !inDouble && ch === "`" && !inTemplate) {
      inTemplate = true;
      out += ch;
      i++;
      continue;
    }
    if (inTemplate && ch === "`") {
      let backslashes = 0;
      for (let k = i - 1; k >= 0 && code[k] === "\\"; k--) backslashes++;
      if (backslashes % 2 === 0) inTemplate = false;
      out += ch;
      i++;
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate) {
      if (ch === "/" && next === "/") {
        i += 2;
        while (i < code.length && code[i] !== "\n") i++;
        continue;
      }
      if (ch === "/" && next === "*") {
        i += 2;
        while (i < code.length) {
          if (code[i] === "*" && code[i + 1] === "/") {
            i += 2;
            break;
          }
          i++;
        }
        continue;
      }
    }

    out += ch;
    i++;
  }

  return out;
}

function existsFile(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function listAllFiles(rootDir) {
  const ignoreDirs = new Set([
    "node_modules",
    ".git",
    ARTIFACTS_DIR,
    "dist",
    "build",
    ".next",
    ".cache",
  ]);

  const stack = [rootDir];
  const out = [];

  while (stack.length) {
    const dir = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!ignoreDirs.has(e.name)) stack.push(full);
      } else if (e.isFile()) {
        out.push(full);
      }
    }
  }
  return out;
}

/* -----------------------------
   Project root detection
-------------------------------- */
const REPO_ROOT = process.cwd();

function isLabProjectFolder(p) {
  try {
    return (
      fs.existsSync(path.join(p, "package.json")) &&
      fs.existsSync(path.join(p, "src")) &&
      fs.existsSync(path.join(p, "backend"))
    );
  } catch {
    return false;
  }
}

function pickProjectRoot(cwd) {
  if (isLabProjectFolder(cwd)) return cwd;

  const preferred = path.join(cwd, "6-1-back-end-fundamentals");
  if (isLabProjectFolder(preferred)) return preferred;

  let subs = [];
  try {
    subs = fs
      .readdirSync(cwd, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    subs = [];
  }

  for (const name of subs) {
    const p = path.join(cwd, name);
    if (isLabProjectFolder(p)) return p;
  }

  return cwd;
}

const PROJECT_ROOT = pickProjectRoot(REPO_ROOT);

/* -----------------------------
   Find files
-------------------------------- */
const appFileCandidates = [
  path.join(PROJECT_ROOT, "src", "App.jsx"),
  path.join(PROJECT_ROOT, "src", "App.js"),
];

const serverFileCandidates = [
  path.join(PROJECT_ROOT, "backend", "server.js"),
  path.join(PROJECT_ROOT, "backend", "server.mjs"),
];

const appFile = appFileCandidates.find(existsFile) || null;
const serverFile = serverFileCandidates.find(existsFile) || null;

/* -----------------------------
   Determine submission time
-------------------------------- */
let lastCommitISO = null;
let lastCommitMS = null;

try {
  lastCommitISO = execSync("git log -1 --format=%cI", { encoding: "utf8" }).trim();
  lastCommitMS = Date.parse(lastCommitISO);
} catch {
  lastCommitISO = new Date().toISOString();
  lastCommitMS = Date.now();
}

/* -----------------------------
   Submission marks
-------------------------------- */
const isLate = Number.isFinite(lastCommitMS) ? lastCommitMS > DEADLINE_MS : true;
const submissionScore = isLate ? SUBMISSION_LATE : SUBMISSION_MAX;

/* -----------------------------
   Load & strip student files
-------------------------------- */
const appRaw = appFile ? safeRead(appFile) : null;
const serverRaw = serverFile ? safeRead(serverFile) : null;

const app = appRaw ? stripJsComments(appRaw) : null;
const server = serverRaw ? stripJsComments(serverRaw) : null;

const results = [];

/* -----------------------------
   Result helpers
-------------------------------- */
function addResult(task, required) {
  const missing = required.filter((r) => !r.ok);
  const score = splitMarks(task.marks, missing.length, required.length);

  results.push({
    id: task.id,
    name: task.name,
    max: task.marks,
    score,
    checklist: required.map((r) => `${r.ok ? "✅" : "❌"} ${r.label}`),
    deductions: missing.length ? missing.map((m) => `Missing: ${m.label}`) : [],
  });
}

function failTask(task, reason) {
  results.push({
    id: task.id,
    name: task.name,
    max: task.marks,
    score: 0,
    checklist: [],
    deductions: [reason],
  });
}

function mkHas(code) {
  return (re) => re.test(code);
}

function anyOf(has, res) {
  return res.some((r) => has(r));
}

/* -----------------------------
   Grade TODOs
-------------------------------- */

/**
 * TODO 1 — Import Express
 */
{
  if (!server) {
    failTask(tasks[0], serverFile ? `Could not read server file at: ${serverFile}` : "backend/server.js not found");
  } else {
    const has = mkHas(server);

    const required = [
      {
        label: "Imports or requires Express",
        ok: anyOf(has, [
          /import\s+\w+\s+from\s+['"]express['"]/i,
          /const\s+\w+\s*=\s*require\s*\(\s*['"]express['"]\s*\)/i,
        ]),
      },
    ];

    addResult(tasks[0], required);
  }
}

/**
 * TODO 2 — Create app
 */
{
  if (!server) {
    failTask(tasks[1], "backend/server.js not found / unreadable.");
  } else {
    const has = mkHas(server);

    const required = [
      {
        label: "Creates Express app (for example: const app = express())",
        ok: anyOf(has, [
          /const\s+app\s*=\s*express\s*\(\s*\)/i,
          /let\s+app\s*=\s*express\s*\(\s*\)/i,
          /var\s+app\s*=\s*express\s*\(\s*\)/i,
        ]),
      },
    ];

    addResult(tasks[1], required);
  }
}

/**
 * TODO 3 — cors
 */
{
  if (!server) {
    failTask(tasks[2], "backend/server.js not found / unreadable.");
  } else {
    const has = mkHas(server);

    const required = [
      {
        label: "Imports or requires cors",
        ok: anyOf(has, [
          /import\s+\w+\s+from\s+['"]cors['"]/i,
          /const\s+\w+\s*=\s*require\s*\(\s*['"]cors['"]\s*\)/i,
        ]),
      },
      {
        label: "Uses cors middleware (app.use(cors()))",
        ok: anyOf(has, [
          /app\s*\.use\s*\(\s*cors\s*\(\s*\)\s*\)/i,
          /app\s*\.use\s*\(\s*\w+\s*\(\s*\)\s*\)/i,
        ]),
      },
    ];

    addResult(tasks[2], required);
  }
}

/**
 * TODO 4 — app.listen (ignore exact port number)
 */
{
  if (!server) {
    failTask(tasks[3], "backend/server.js not found / unreadable.");
  } else {
    const has = mkHas(server);

    const required = [
      {
        label: "Starts server using app.listen(...)",
        ok: anyOf(has, [
          /app\s*\.listen\s*\(\s*[^,]+,/i,
          /app\s*\.listen\s*\(\s*[^)]+\)/i,
        ]),
      },
      {
        label: "Includes a console message when server starts",
        ok: anyOf(has, [
          /app\s*\.listen\s*\([\s\S]*?console\s*\.log\s*\(/i,
          /console\s*\.log\s*\(/i,
        ]),
      },
    ];

    addResult(tasks[3], required);
  }
}

/**
 * TODO 5 — "/" route
 */
{
  if (!server) {
    failTask(tasks[4], "backend/server.js not found / unreadable.");
  } else {
    const has = mkHas(server);

    const required = [
      {
        label: 'Creates GET route for "/"',
        ok: anyOf(has, [
          /app\s*\.get\s*\(\s*['"]\/['"]\s*,/i,
        ]),
      },
      {
        label: 'Sends a text response for "/" using res.send(...)',
        ok: anyOf(has, [
          /app\s*\.get\s*\(\s*['"]\/['"]\s*,[\s\S]*?res\s*\.send\s*\(/i,
        ]),
      },
    ];

    addResult(tasks[4], required);
  }
}

/**
 * TODO 6 — "/about" route
 */
{
  if (!server) {
    failTask(tasks[5], "backend/server.js not found / unreadable.");
  } else {
    const has = mkHas(server);

    const required = [
      {
        label: 'Creates GET route for "/about"',
        ok: anyOf(has, [
          /app\s*\.get\s*\(\s*['"]\/about['"]\s*,/i,
        ]),
      },
      {
        label: 'Sends a text response for "/about" using res.send(...)',
        ok: anyOf(has, [
          /app\s*\.get\s*\(\s*['"]\/about['"]\s*,[\s\S]*?res\s*\.send\s*\(/i,
        ]),
      },
    ];

    addResult(tasks[5], required);
  }
}

/**
 * TODO 7 — "/student" route with JSON
 */
{
  if (!server) {
    failTask(tasks[6], "backend/server.js not found / unreadable.");
  } else {
    const has = mkHas(server);

    const required = [
      {
        label: 'Creates GET route for "/student"',
        ok: anyOf(has, [
          /app\s*\.get\s*\(\s*['"]\/student['"]\s*,/i,
        ]),
      },
      {
        label: 'Uses res.json(...) in the "/student" route',
        ok: anyOf(has, [
          /app\s*\.get\s*\(\s*['"]\/student['"]\s*,[\s\S]*?res\s*\.json\s*\(/i,
        ]),
      },
      {
        label: 'Student JSON includes top-level name and major fields',
        ok: anyOf(has, [
          /res\s*\.json\s*\(\s*\{[\s\S]*?\bname\s*:\s*['"`][^'"`]+['"`][\s\S]*?\bmajor\s*:\s*['"`][^'"`]+['"`][\s\S]*?\}\s*\)/i,
          /res\s*\.json\s*\(\s*\{[\s\S]*?\bmajor\s*:\s*['"`][^'"`]+['"`][\s\S]*?\bname\s*:\s*['"`][^'"`]+['"`][\s\S]*?\}\s*\)/i,
        ]),
      },
    ];

    addResult(tasks[6], required);
  }
}

/**
 * TODO 8 — fetch student data in App.jsx
 * Port is NOT enforced. We only check that fetch targets the student route.
 */
{
  if (!app) {
    failTask(tasks[7], appFile ? `Could not read App file at: ${appFile}` : "src/App.jsx not found");
  } else {
    const has = mkHas(app);

    const required = [
      {
        label: "Uses useEffect(...) for request on page load",
        ok: anyOf(has, [
          /useEffect\s*\(\s*\(\s*\)\s*=>/i,
          /useEffect\s*\(\s*function\s*\(/i,
        ]),
      },
      {
        label: 'Fetches the "/student" route (exact port not enforced)',
        ok: anyOf(has, [
          /fetch\s*\(\s*['"`][^'"`]*\/student['"`]\s*\)/i,
        ]),
      },
      {
        label: "Converts response to JSON",
        ok: anyOf(has, [
          /\.then\s*\(\s*\(\s*\w+\s*\)\s*=>\s*\w+\.json\s*\(\s*\)\s*\)/i,
          /\.json\s*\(\s*\)/i,
        ]),
      },
      {
        label: "Uses returned data in a then(...) block or equivalent",
        ok: anyOf(has, [
          /\.then\s*\(\s*\(\s*(data|\w+)\s*\)\s*=>/i,
          /const\s+\w+\s*=\s*await\s+.*json\s*\(\s*\)/i,
        ]),
      },
    ];

    addResult(tasks[7], required);
  }
}

/**
 * TODO 9 — state + display student data
 */
{
  if (!app) {
    failTask(tasks[8], "src/App.jsx not found / unreadable.");
  } else {
    const has = mkHas(app);

    const required = [
      {
        label: "Creates student state with useState(...)",
        ok: anyOf(has, [
          /const\s*\[\s*student\s*,\s*setStudent\s*\]\s*=\s*useState\s*\(/i,
        ]),
      },
      {
        label: "Stores fetched response in student state using setStudent(...)",
        ok: anyOf(has, [
          /setStudent\s*\(\s*data\s*\)/i,
          /setStudent\s*\(\s*\w+\s*\)/i,
        ]),
      },
      {
        label: "Displays student name in JSX",
        ok: anyOf(has, [
          /\{\s*student\s*\.\s*name\s*\}/i,
          /\{\s*student\s*\?\.\s*name\s*\}/i,
        ]),
      },
      {
        label: "Displays student major in JSX",
        ok: anyOf(has, [
          /\{\s*student\s*\.\s*major\s*\}/i,
          /\{\s*student\s*\?\.\s*major\s*\}/i,
        ]),
      },
    ];

    addResult(tasks[8], required);
  }
}

/* -----------------------------
   Final scoring
-------------------------------- */
const stepsScore = results.reduce((sum, r) => sum + r.score, 0);
const totalScore = round2(stepsScore + submissionScore);

/* -----------------------------
   Build summary + feedback
-------------------------------- */
const LAB_NAME = "6-1-back-end-fundamentals";

const submissionLine = `- **Lab:** ${LAB_NAME}
- **Deadline (Riyadh / UTC+03:00):** ${DEADLINE_RIYADH_ISO}
- **Last commit time (from git log):** ${lastCommitISO}
- **Submission marks:** **${submissionScore}/${SUBMISSION_MAX}** ${isLate ? "(Late submission)" : "(On time)"}
`;

let summary = `# ${LAB_NAME} — Autograding Summary

## Submission

${submissionLine}

## Files Checked

- Repo root (cwd): ${REPO_ROOT}
- Detected project root: ${PROJECT_ROOT}
- App: ${appFile ? `✅ ${appFile}` : "❌ src/App.jsx not found"}
- Server: ${serverFile ? `✅ ${serverFile}` : "❌ backend/server.js not found"}

## Marks Breakdown

| Component | Marks |
|---|---:|
`;

for (const r of results) summary += `| ${r.name} | ${r.score}/${r.max} |\n`;
summary += `| Submission (timing) | ${submissionScore}/${SUBMISSION_MAX} |\n`;

summary += `
## Total Marks

**${totalScore} / ${TOTAL_MAX}**

## Detailed Checks (What you did / missed)
`;

for (const r of results) {
  const done = (r.checklist || []).filter((x) => x.startsWith("✅"));
  const missed = (r.checklist || []).filter((x) => x.startsWith("❌"));

  summary += `
<details>
  <summary><strong>${mdEscape(r.name)}</strong> — ${r.score}/${r.max}</summary>

  <br/>

  <strong>✅ Found</strong>
  ${done.length ? "\n" + done.map((x) => `- ${mdEscape(x)}`).join("\n") : "\n- (Nothing detected)"}

  <br/><br/>

  <strong>❌ Missing</strong>
  ${missed.length ? "\n" + missed.map((x) => `- ${mdEscape(x)}`).join("\n") : "\n- (Nothing missing)"}

  <br/><br/>

  <strong>❗ Deductions / Notes</strong>
  ${
    r.deductions && r.deductions.length
      ? "\n" + r.deductions.map((d) => `- ${mdEscape(d)}`).join("\n")
      : "\n- No deductions."
  }

</details>
`;
}

summary += `
> Full feedback is also available in: \`artifacts/feedback/README.md\`
`;

let feedback = `# ${LAB_NAME} — Feedback

## Submission

${submissionLine}

## Files Checked

- Repo root (cwd): ${REPO_ROOT}
- Detected project root: ${PROJECT_ROOT}
- App: ${appFile ? `✅ ${appFile}` : "❌ src/App.jsx not found"}
- Server: ${serverFile ? `✅ ${serverFile}` : "❌ backend/server.js not found"}

---

## TODO-by-TODO Feedback
`;

for (const r of results) {
  feedback += `
### ${r.name} — **${r.score}/${r.max}**

**Checklist**
${r.checklist.length ? r.checklist.map((x) => `- ${x}`).join("\n") : "- (No checks available)"}

**Deductions / Notes**
${r.deductions.length ? r.deductions.map((d) => `- ❗ ${d}`).join("\n") : "- ✅ No deductions. Good job!"}
`;
}

feedback += `
---

## How marks were deducted (rules)

- JS/JSX comments are ignored (so starter TODO comments do NOT count).
- Checks are intentionally light: they look for key constructs and basic structure only.
- Code can be in ANY order; repeated code is allowed.
- Common equivalents are accepted, and naming is flexible where possible.
- The exact port number is NOT enforced for server start or fetch request checks.
- Missing required items reduce marks proportionally within that TODO.
`;

/* -----------------------------
   Write outputs
-------------------------------- */
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}

const csv = `student,score,max_score
all_students,${totalScore},${TOTAL_MAX}
`;

fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
fs.writeFileSync(path.join(ARTIFACTS_DIR, "grade.csv"), csv);
fs.writeFileSync(path.join(FEEDBACK_DIR, "README.md"), feedback);

console.log(
  `✔ Lab graded: ${totalScore}/${TOTAL_MAX} (Submission: ${submissionScore}/${SUBMISSION_MAX}, TODOs: ${stepsScore}/${STEPS_MAX}).`
);