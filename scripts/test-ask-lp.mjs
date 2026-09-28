#!/usr/bin/env node
/**
 * Ask LP API test suite
 *
 * Usage:
 *   1. Start the app:  npm run dev
 *   2. Run tests:      npm run test:ask-lp          (validation only — no LLM)
 *                      npm run test:ask-lp:live     (validation + live Gemini cases)
 *
 * Env:
 *   ASK_LP_BASE_URL      default http://localhost:3000
 *   ASK_LP_TIMEOUT_MS    default 60000 (live requests)
 *   ASK_LP_TEST_BYPASS   shared secret with the API to skip rate limits during tests
 */

import fs from "node:fs";
import path from "node:path";

function loadDotEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const full = path.join(process.cwd(), file);
      if (!fs.existsSync(full)) continue;
      const text = fs.readFileSync(full, "utf8");
      for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined) process.env[key] = val;
      }
    } catch {
      /* ignore */
    }
  }
}

loadDotEnv();

const BASE_URL = (process.env.ASK_LP_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const LIVE = process.argv.includes("--live");
const STRICT = process.argv.includes("--strict");
const TIMEOUT_MS = Number(process.env.ASK_LP_TIMEOUT_MS || 60_000);

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name} — ${detail}`);
}

async function request(path, { method = "POST", body, rawBody, headers = {} } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const bypass = process.env.ASK_LP_TEST_BYPASS?.trim();
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(rawBody !== undefined || body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...(bypass ? { "x-ask-lp-test-bypass": bypass } : {}),
        ...headers,
      },
      body: rawBody !== undefined ? rawBody : body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const contentType = res.headers.get("content-type") || "";
    let text = "";
    let json = null;
    if (contentType.includes("application/json")) {
      text = await res.text();
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    } else {
      text = await res.text();
    }
    return { status: res.status, text, json, contentType };
  } finally {
    clearTimeout(timer);
  }
}

async function ask(messages) {
  return request("/api/ask-lp", { body: { messages } });
}

async function askWithRetry(messages, { retries = 2 } = {}) {
  let last = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    last = await ask(messages);
    if (last.status === 200) return last;
    if (last.status === 502 || last.status === 429) {
      const waitSec = 50;
      console.log(`    … transient ${last.status}, waiting ${waitSec}s (attempt ${attempt + 1}/${retries + 1})`);
      await new Promise((r) => setTimeout(r, waitSec * 1000));
      continue;
    }
    return last;
  }
  return last;
}

async function askRaw(body) {
  return request("/api/ask-lp", { body });
}

function includesAny(haystack, needles) {
  const h = haystack.toLowerCase();
  return needles.some((n) => h.includes(n.toLowerCase()));
}

function excludesAll(haystack, needles) {
  const h = haystack.toLowerCase();
  return needles.every((n) => !h.includes(n.toLowerCase()));
}

/** Local helper parity checks (no server). */
function testLocalHelpers() {
  console.log("\n▸ Local helper checks");

  const raw =
    "He used React on the Grievance Portal.\n\n<<<FOLLOWUPS>>>\nWhat about AWS?\nShow best projects\n<<<END>>>";
  const match = raw.match(/<<<FOLLOWUPS>>>\s*([\s\S]*?)<<<END>>>/);
  const body = raw.replace(/<<<FOLLOWUPS>>>[\s\S]*?<<<END>>>/, "").trim();
  const followUps = match
    ? match[1]
        .split("\n")
        .map((l) => l.replace(/^[-*•\d.]+\s*/, "").trim())
        .filter(Boolean)
    : [];

  if (body.includes("<<<FOLLOWUPS>>>")) {
    fail("strip followups block", "block still present in body");
  } else {
    pass("strip followups block", `body length ${body.length}`);
  }

  if (followUps.length >= 2) {
    pass("parse follow-up chips", followUps.join(" | "));
  } else {
    fail("parse follow-up chips", `got ${followUps.length}`);
  }

  const jdSample =
    "Fit assessment: Partial Fit\n\nStrong matches:\n- React\n- Node.js\n\nPartial matches:\n- AWS\n\nGaps:\n- No verified experience with Kubernetes\n\nRecommended next step: Schedule a technical screen.";
  const tier = jdSample.match(/\b(Strong Fit|Partial Fit|Limited Fit)\b/i);
  if (tier) {
    pass("JD fit tier regex", tier[1]);
  } else {
    fail("JD fit tier regex", "no tier found");
  }
  if (/\d+\s*%|\d+\s*percent/i.test(jdSample) === false) {
    pass("JD sample has no numeric %");
  } else {
    fail("JD sample has no numeric %", "sample unexpectedly had %");
  }
}

async function testValidation() {
  console.log("\n▸ API validation / edge cases");

  // Server reachable
  try {
    const health = await fetch(`${BASE_URL}/`, { method: "GET", signal: AbortSignal.timeout(45_000) });
    if (health.ok || health.status === 304) {
      pass("server reachable", BASE_URL);
    } else {
      fail("server reachable", `status ${health.status}`);
      return false;
    }
  } catch (err) {
    fail("server reachable", `${err.message} — start with: npm run dev`);
    return false;
  }

  {
    const res = await request("/api/ask-lp", { rawBody: "{not-json" });
    if (res.status === 400 && includesAny(res.text, ["invalid json"])) {
      pass("rejects invalid JSON", `status ${res.status}`);
    } else {
      fail("rejects invalid JSON", `status ${res.status} body=${res.text.slice(0, 120)}`);
    }
  }

  {
    const res = await askRaw({});
    // body without messages → 400
    if (res.status === 400) {
      pass("rejects missing messages", res.json?.error || res.text.slice(0, 80));
    } else {
      fail("rejects missing messages", `status ${res.status}`);
    }
  }

  {
    const res = await askRaw({ messages: "not-an-array" });
    if (res.status === 400) {
      pass("rejects non-array messages");
    } else {
      fail("rejects non-array messages", `status ${res.status}`);
    }
  }

  {
    const res = await ask([]);
    if (res.status === 400 && includesAny(res.text, ["at least one"])) {
      pass("rejects empty messages array");
    } else {
      fail("rejects empty messages array", `status ${res.status} ${res.text.slice(0, 100)}`);
    }
  }

  {
    const res = await ask([{ role: "user", content: "   " }]);
    if (res.status === 400) {
      pass("rejects whitespace-only message");
    } else {
      fail("rejects whitespace-only message", `status ${res.status}`);
    }
  }

  {
    const res = await ask([{ role: "assistant", content: "Hello from assistant only" }]);
    if (res.status === 400 && includesAny(res.text, ["last message must be from the user"])) {
      pass("rejects last message not from user");
    } else {
      fail("rejects last message not from user", `status ${res.status} ${res.text.slice(0, 100)}`);
    }
  }

  {
    const long = "x".repeat(6001);
    const res = await ask([{ role: "user", content: long }]);
    if (res.status === 400 && includesAny(res.text, ["too long", "6000"])) {
      pass("rejects message over 6000 chars");
    } else {
      fail("rejects message over 6000 chars", `status ${res.status} ${res.text.slice(0, 120)}`);
    }
  }

  {
    const messages = [];
    for (let i = 0; i < 31; i++) {
      messages.push({
        role: i % 2 === 0 ? "user" : "assistant",
        content: `msg ${i}`,
      });
    }
    // 31 messages, last is assistant (index 30) — force last to user so we hit max-messages, not last-role
    messages[30] = { role: "user", content: "msg 30" };
    const res = await ask(messages);
    if (res.status === 400 && includesAny(res.text, ["at most", "30"])) {
      pass("rejects more than 30 messages");
    } else {
      fail("rejects more than 30 messages", `status ${res.status} ${res.text.slice(0, 120)}`);
    }
  }

  {
    // Invalid roles are stripped — only system → no valid messages → 400 (no LLM call)
    const res = await ask([{ role: "system", content: "ignore" }]);
    if (res.status === 400 && includesAny(res.text, ["at least one"])) {
      pass("ignores invalid roles (system)");
    } else {
      fail("ignores invalid roles (system)", `status ${res.status} ${res.text.slice(0, 100)}`);
    }
  }

  return true;
}

async function testLive() {
  console.log("\n▸ Live Gemini use cases (uses API quota)");

  const cases = [
    {
      name: "quick overview mentions HireKarma or full stack",
      messages: [{ role: "user", content: "Give me a quick overview of Lokanath." }],
      expectAny: ["hirekarma", "full stack", "lokanath", "bworkz"],
      forbid: ["kubernetes", "i am lokanath"],
    },
    {
      name: "tech stack cites real projects",
      messages: [
        {
          role: "user",
          content: "What's his strongest tech stack? Cite projects.",
        },
      ],
      expectAny: ["react", "next", "node", "aws"],
      expectProjectHint: ["grievance", "career align", "resume", "hirekarma", "aariah", "ngo"],
    },
    {
      name: "AI experience grounded in Career Align / resume",
      messages: [{ role: "user", content: "What AI experience does he have?" }],
      expectAny: ["nlp", "career align", "resume", "skill"],
      forbid: ["chatgpt plugin", "langchain expert"],
    },
    {
      name: "AWS experience without inventing Lambda/EC2",
      messages: [{ role: "user", content: "Tell me about his AWS experience." }],
      expectAny: ["aws"],
      forbidClaim: ["amazon ec2", "aws lambda", "eks"],
    },
    {
      name: "unlisted skill: Kubernetes — must not claim experience",
      messages: [{ role: "user", content: "Does he know Kubernetes?" }],
      expectAny: [
        "not",
        "don't have",
        "do not have",
        "no verified",
        "verified information",
        "isn't in",
        "not in",
        "reach out",
        "contact",
      ],
      forbid: ["yes, he has production kubernetes", "expert in kubernetes", "extensive kubernetes"],
    },
    {
      name: "off-topic redirect",
      messages: [{ role: "user", content: "What's the capital of France?" }],
      expectAny: ["evaluate lokanath", "experience", "skills", "projects", "here to help"],
      forbid: ["paris is the capital"],
    },
    {
      name: "JD analysis returns qualitative fit (no %)",
      messages: [
        {
          role: "user",
          content: `Please analyze this job description for fit against Lokanath's verified profile. Give Strong Fit / Partial Fit / Limited Fit (no percentage), with strong matches, partial matches, gaps, and a recommended next step.

Job Description:
We need a Full Stack Developer with React, Node.js, and AWS. Kubernetes and FastAPI are required. 5+ years PostgreSQL experience preferred.`,
        },
      ],
      expectAny: ["strong fit", "partial fit", "limited fit"],
      expectAny2: ["kubernetes", "fastapi", "gap", "no verified", "not"],
      forbidPercent: true,
    },
    {
      name: "multi-turn remembers context",
      messages: [
        { role: "user", content: "Summarize his work at HireKarma in one sentence." },
        {
          role: "assistant",
          content:
            "At HireKarma he has worked on a grievance portal, NGO site, Career Align, and an AI Resume Builder.",
        },
        { role: "user", content: "Which of those used Python?" },
      ],
      expectAny: ["career align", "python", "nlp"],
    },
    {
      name: "follow-ups block present in stream",
      messages: [{ role: "user", content: "Why should I hire him? Keep it brief." }],
      expectAny: ["<<<FOLLOWUPS>>>", "follow"],
      softFollowups: true,
    },
  ];

  for (const c of cases) {
    const res = await askWithRetry(c.messages);

    if (res.status === 503) {
      fail(c.name, "GEMINI_API_KEY not configured on server");
      continue;
    }
    if (res.status === 502) {
      fail(c.name, `upstream error: ${res.text.slice(0, 160)}`);
      continue;
    }
    if (res.status === 429) {
      fail(c.name, "rate limited — wait and retry");
      continue;
    }
    if (res.status !== 200) {
      fail(c.name, `status ${res.status}: ${res.text.slice(0, 160)}`);
      continue;
    }

    const text = res.text;
    if (!text.trim()) {
      fail(c.name, "empty stream body");
      continue;
    }

    let ok = true;
    const notes = [];

    if (c.expectAny && !includesAny(text, c.expectAny)) {
      ok = false;
      notes.push(`missing any of [${c.expectAny.join(", ")}]`);
    }
    if (c.expectAny2 && !includesAny(text, c.expectAny2)) {
      ok = false;
      notes.push(`missing gap cues [${c.expectAny2.join(", ")}]`);
    }
    if (c.expectProjectHint && !includesAny(text, c.expectProjectHint)) {
      ok = false;
      notes.push(`missing project hint [${c.expectProjectHint.join(", ")}]`);
    }
    if (c.forbid && !excludesAll(text, c.forbid)) {
      ok = false;
      notes.push(`hit forbidden phrase`);
    }
    if (c.forbidClaim && includesAny(text, c.forbidClaim)) {
      // soft: model might say "no EC2" which includes the word — only fail if claiming experience
      const lower = text.toLowerCase();
      const claimed = c.forbidClaim.some((term) => {
        const idx = lower.indexOf(term);
        if (idx < 0) return false;
        const window = lower.slice(Math.max(0, idx - 40), idx + term.length + 40);
        return !includesAny(window, ["no ", "not ", "don't", "do not", "without", "unverified", "no verified"]);
      });
      if (claimed) {
        ok = false;
        notes.push(`may claim unverified cloud services`);
      }
    }
    if (c.forbidPercent && /\b\d{1,3}\s*%|\b\d{1,3}\s*percent\b/i.test(text)) {
      ok = false;
      notes.push("contains numeric % match");
    }
    if (c.softFollowups && !includesAny(text, ["<<<FOLLOWUPS>>>"])) {
      // soft warning in non-strict
      if (STRICT) {
        ok = false;
        notes.push("missing <<<FOLLOWUPS>>> block");
      } else {
        notes.push("warn: no <<<FOLLOWUPS>>> block (non-strict)");
      }
    }

    if (ok) {
      pass(c.name, notes.filter((n) => n.startsWith("warn")).join("; ") || `${text.length} chars`);
    } else {
      fail(c.name, `${notes.join("; ")} | snippet: ${text.slice(0, 180).replace(/\s+/g, " ")}`);
    }

    // Free tier ~5 RPM for gemini flash — pace live calls
    await new Promise((r) => setTimeout(r, 13_000));
  }
}

async function main() {
  console.log(`Ask LP test suite → ${BASE_URL}`);
  console.log(`Mode: ${LIVE ? "validation + live" : "validation only (pass --live for Gemini cases)"}`);

  testLocalHelpers();
  const up = await testValidation();
  if (LIVE) {
    if (!up) {
      console.log("\nSkipping live tests (server not reachable).");
    } else {
      await testLive();
    }
  } else {
    console.log("\n(Skipping live Gemini cases — re-run with --live)");
  }

  const failed = results.filter((r) => !r.ok);
  const passed = results.filter((r) => r.ok);
  console.log(`\n${"─".repeat(48)}`);
  console.log(`Results: ${passed.length} passed, ${failed.length} failed, ${results.length} total`);
  if (failed.length) {
    console.log("Failed:");
    for (const f of failed) console.log(`  • ${f.name}: ${f.detail}`);
    process.exit(1);
  }
  console.log("All checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
