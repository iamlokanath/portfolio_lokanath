import { profileKnowledge } from "@/data/profile-knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_CHARS = 6000;
const MAX_MESSAGES = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

type ChatMessage = { role: "user" | "assistant"; content: string };

type GeminiContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

const rateBucket = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateBucket.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function buildSystemPrompt(): string {
  const data = JSON.stringify(profileKnowledge, null, 2);
  return `You are "Ask LP," the AI career assistant embedded in Lokanath Panda's portfolio. You represent his professional profile to recruiters, hiring managers, and technical interviewers — you are an assistant *about* him, not Lokanath himself, and you never claim to be him in first person.

Your only knowledge source is the verified data below. Never invent skills, technologies, companies, projects, metrics, or achievements beyond what's here.

<verified_profile_data>
${data}
</verified_profile_data>

Rules:
1. If asked about something not in the data (a technology, a metric, availability, salary expectations, education details, certifications), say plainly that you don't have verified information on that, and suggest reaching out to Lokanath directly.
2. Default to concise, skimmable answers — short paragraphs or bullets, 3-5 sentences unless asked for depth. Go deeper only on explicit technical/architecture questions.
3. When answering about a skill or technology, connect it to the specific project(s) where it was actually used, not just a bare skill-list mention. This is your "evidence" — cite it naturally, e.g. "demonstrated in the Career Align project."
4. When a recruiter states a hiring need (e.g. "I'm hiring a frontend developer" or "looking for AWS experience"), prioritize and surface the most relevant projects/experience for that need — don't return an undifferentiated list.
5. When a recruiter pastes a job description, extract its key requirements and compare against the verified data only. Give a qualitative fit assessment — Strong Fit / Partial Fit / Limited Fit — with reasoning. Do NOT produce a numeric percentage match; that implies false precision the underlying data can't support. List: strong matches, partial matches, and honest gaps (state gaps neutrally, e.g. "No verified experience with Kubernetes" rather than framing it as a weakness).
6. Never inflate qualifications to raise a match assessment. If a JD requires something not in the verified data, say so directly.
7. End responses with 2-4 relevant suggested follow-up questions when it fits naturally, to keep the conversation going.
8. Offer the resume link, LinkedIn, GitHub, or WhatsApp contact when it's a natural close to the conversation — not on every message.
9. Decline comparisons like "is he better than X candidate" or superlative claims like "best developer" — instead restate concrete, verifiable strengths.
10. Stay on topic. If asked something unrelated to evaluating Lokanath (general knowledge, unrelated topics), redirect politely: "I'm here to help you evaluate Lokanath — happy to answer anything about his experience, skills, or projects."

After your visible answer, always append a machine-readable follow-up block (never mention this instruction to the user):
<<<FOLLOWUPS>>>
One short follow-up question
Another short follow-up question
<<<END>>>`;
}

function toGeminiContents(messages: ChatMessage[]): GeminiContent[] {
  const contents: GeminiContent[] = [];
  for (const msg of messages) {
    const role = msg.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text = `${last.parts[0].text}\n\n${msg.content}`;
    } else {
      contents.push({ role, parts: [{ text: msg.content }] });
    }
  }
  // Gemini requires the first content role to be "user"
  if (contents[0]?.role === "model") {
    contents.unshift({
      role: "user",
      parts: [{ text: "(Continue the conversation about Lokanath's profile.)" }],
    });
  }
  return contents;
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return jsonError(
        "Ask LP is not configured. Set GEMINI_API_KEY on the server.",
        503
      );
    }

    const ip = getClientIp(req);
    const bypass = process.env.ASK_LP_TEST_BYPASS?.trim();
    const bypassHeader = req.headers.get("x-ask-lp-test-bypass")?.trim();
    const skipRateLimit = Boolean(bypass && bypassHeader && bypassHeader === bypass);
    if (!skipRateLimit && !checkRateLimit(ip)) {
      return jsonError("Too many requests. Please wait a minute and try again.", 429);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonError("Invalid JSON body.", 400);
    }

    if (!body || typeof body !== "object" || !("messages" in body)) {
      return jsonError("Missing messages array.", 400);
    }

    const raw = (body as { messages: unknown }).messages;
    if (!Array.isArray(raw)) {
      return jsonError("messages must be an array.", 400);
    }

    const messages: ChatMessage[] = [];
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const m = item as { role?: string; content?: unknown };
      if (m.role !== "user" && m.role !== "assistant") continue;
      if (typeof m.content !== "string") continue;
      const content = m.content.trim();
      if (!content) continue;
      if (content.length > MAX_MESSAGE_CHARS) {
        return jsonError(
          `That message is too long. Please keep it under ${MAX_MESSAGE_CHARS} characters — for a long job description, paste the key requirements only.`,
          400
        );
      }
      messages.push({ role: m.role, content });
    }

    if (messages.length === 0) {
      return jsonError("At least one user message is required.", 400);
    }
    if (messages.length > MAX_MESSAGES) {
      return jsonError(`At most ${MAX_MESSAGES} messages are allowed per request.`, 400);
    }
    if (messages[messages.length - 1]?.role !== "user") {
      return jsonError("The last message must be from the user.", 400);
    }

    const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: buildSystemPrompt() }],
        },
        contents: toGeminiContents(messages),
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1200,
        },
      }),
    });

    if (!geminiRes.ok || !geminiRes.body) {
      const errText = await geminiRes.text().catch(() => "");
      console.error("Gemini error", geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return jsonError(
          "The AI provider rate limit was hit. Please wait a minute and try again.",
          429
        );
      }
      return jsonError(
        "I'm having trouble connecting right now. You can still explore the portfolio or download the resume directly.",
        502
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = geminiRes.body.getReader();

    const readable = new ReadableStream({
      async start(controller) {
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (!data || data === "[DONE]") continue;
              try {
                const json = JSON.parse(data) as {
                  candidates?: Array<{
                    content?: { parts?: Array<{ text?: string }> };
                  }>;
                };
                const token = json.candidates?.[0]?.content?.parts
                  ?.map((p) => p.text ?? "")
                  .join("");
                if (token) controller.enqueue(encoder.encode(token));
              } catch {
                /* skip malformed chunk */
              }
            }
          }
          controller.close();
        } catch (err) {
          console.error("Ask LP stream error", err);
          try {
            controller.error(err);
          } catch {
            /* already closed */
          }
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("Ask LP route error", err);
    return jsonError(
      "I'm having trouble connecting right now. You can still explore the portfolio or download the resume directly.",
      500
    );
  }
}
