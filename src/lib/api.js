import { SYSTEM_PROMPT } from "../data/narration.js";

export async function callLLM(ctx, intention, onChunk, lastProse) {
  // Multi-turn : si on a la prose pr\u00e9c\u00e9dente, l'envoyer comme \u00e9change
  const messages = [];
  if (lastProse) {
    messages.push({ role: "user", content: ctx + "\n\nINTENTION: reprise" });
    messages.push({ role: "assistant", content: "///PROSE\n" + lastProse + "\n///\n///DATA\n{\"fd\":{},\"ld\":{}}\n///" });
    messages.push({ role: "user", content: "INTENTION: " + intention });
  } else {
    messages.push({ role: "user", content: ctx + "\n\nINTENTION: " + intention });
  }

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const txt = await response.text().catch(() => "");
    if (response.status === 429 || txt.includes("rate_limit") || txt.includes("overloaded"))
      throw new Error("RATE_LIMIT");
    throw new Error("HTTP " + response.status);
  }

  // Read the SSE stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      processLine(line);
    }
  }

  // Traiter le buffer restant
  if (buffer.trim()) processLine(buffer);

  function processLine(line) {
    if (!line.startsWith("data: ")) return;
    const payload = line.slice(6);
    if (payload === "[DONE]") return;

    let event;
    try { event = JSON.parse(payload); } catch { return; }

    if (event.type === "content_block_delta" && event.delta?.text) {
      full += event.delta.text;
      // Stream prose in real-time (stop before ///DATA)
      const dataStart = full.indexOf("///DATA");
      const visibleText = dataStart >= 0 ? full.slice(0, dataStart) : full;
      // Retirer le marqueur ///PROSE du d\u00e9but
      let prose = visibleText;
      const proseStart = prose.indexOf("///PROSE");
      if (proseStart >= 0) {
        prose = prose.slice(proseStart + 8);
        if (prose.startsWith("\n")) prose = prose.slice(1);
      }
      // Retirer le /// de fermeture s'il est \u00e0 la toute fin
      if (prose.endsWith("///")) prose = prose.slice(0, -3);
      else if (prose.endsWith("//")) prose = prose.slice(0, -2);
      onChunk(prose.trim());
    }

    if (event.type === "error") {
      const t = event.error?.type || "";
      if (t === "rate_limit_error" || t === "overloaded_error") throw new Error("RATE_LIMIT");
      throw new Error(event.error?.message || "Stream error");
    }
  }

  // Parse final result
  let prose = "";
  if (full.includes("///PROSE")) {
    let after = full.split("///PROSE")[1] || "";
    if (after.startsWith("\n")) after = after.slice(1);
    const stop = after.indexOf("///");
    prose = stop >= 0 ? after.slice(0, stop).trim() : after.trim();
  }
  if (!prose) prose = full.replace(/\/\/\/PROSE/g, "").replace(/\/\/\/[\s\S]*/g, "").trim();

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
    // Parsing failed — keep empty data
  }

  return { prose, data };
}
