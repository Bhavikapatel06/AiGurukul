/**
 * utils/anthropic.js — EDITED
 * Path: backend/utils/anthropic.js
 *
 * Uses OpenRouter API instead of direct Anthropic SDK
 * OpenRouter key starts with sk-or-v1-...
 * Docs: openrouter.ai/docs
 */

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'anthropic/claude-opus-4';  // Claude via OpenRouter

async function callOpenRouter(systemPrompt, messages, maxTokens = 1200) {
  const res = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3001',
      'X-Title': 'AI Gurukul',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `OpenRouter error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

/* ── callClaude — same interface as before ── */
async function callClaude(systemPrompt, userMessage, maxTokens = 1200) {
  return callOpenRouter(
    systemPrompt,
    [{ role: 'user', content: userMessage }],
    maxTokens
  );
}

/* ── callClaudeJSON — parses response as JSON ── */
async function callClaudeJSON(systemPrompt, userMessage, maxTokens = 1200) {
  const raw = await callClaude(systemPrompt, userMessage, maxTokens);
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[OpenRouter JSON parse error]', cleaned.slice(0, 200));
    throw new Error('Claude returned invalid JSON. Please retry.');
  }
}

/* ── callClaudeChat — multi-turn conversation ── */
async function callClaudeChat(systemPrompt, messages, maxTokens = 400) {
  return callOpenRouter(systemPrompt, messages, maxTokens);
}

module.exports = { callClaude, callClaudeJSON, callClaudeChat };