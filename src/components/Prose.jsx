import { C } from "../styles/theme.js";

export default function Prose({ text, streaming }) {
  const paras = text.split("\n\n").filter(p => p.trim());
  return (
    <div style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
      {paras.map((p, i) => (
        <p key={i} style={{
          fontSize: "clamp(16px,2.5vw,18px)",
          lineHeight: 1.9, color: C.text,
          marginBottom: "1.4rem",
          fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
          fontStyle: "italic",
        }}>
          {p}
          {streaming && i === paras.length - 1 && (
            <span style={{
              display: "inline-block", width: 1, height: "1em",
              background: C.muted, marginLeft: 3,
              verticalAlign: "text-bottom",
              animation: "blink 1s step-end infinite",
            }} />
          )}
        </p>
      ))}
    </div>
  );
}
