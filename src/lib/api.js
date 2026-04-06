import { SYSTEM_PROMPT } from "../data/narration.js";

export async function callLLM(ctx, intention, onChunk) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: ctx + "\n\nINTENTION: " + intention }],
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const txt = await response.text().catch(() => "");
    if (response.status === 429 || txt.includes("rate_limit") || txt.includes("overloaded"))
      throw new Error("RATE_LIMIT");
    throw new Error("HTTP " + response.status);
  }

  const json = await response.json();

  if (json.error) {
    const t = json.error?.type || "";
    if (t === "rate_limit_error" || t === "overloaded_error") throw new Error("RATE_LIMIT");
    throw new Error(json.error?.message || "API error");
  }

  const full = (json.content || []).map(b => b.text || "").join("");

  // Extract prose
  let prose = "";
  if (full.includes("///PROSE")) {
    let after = full.split("///PROSE")[1] || "";
    if (after.startsWith("\n")) after = after.slice(1);
    const stop = after.indexOf("///");
    prose = stop >= 0 ? after.slice(0, stop).trim() : after.trim();
  }
  if (!prose) prose = full.replace(/\/\/\/PROSE/g, "").replace(/\/\/\/[\s\S]*/g, "").trim();

  onChunk(prose);

  // Extract data
  let data = { fd: {}, ld: {} };
  try {
    const dataMatch = full.match(/\/\/\/DATA\s*([\s\S]+?)\/\/\//) ||
                      full.match(/\/\/\/DATA\s*([\s\S]+?)$/);
    if (dataMatch) {
      const tick = String.fromCharCode(96);
      const raw = dataMatch[1].trim()
        .split(tick + tick + tick + "json").join("")
        .split(tick + tick + tick).join("")
        .trim();
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        data.fd = parsed.fd || {};
        data.ld = parsed.ld || {};
      }
    }
  } catch (e) {
    // Parsing failed — keep empty data, prose still displays
  }

  return { prose, data };
}
