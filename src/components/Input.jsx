import { useState } from "react";
import { C } from "../styles/theme.js";

export default function Input({ onPlay, going }) {
  const [val, setVal] = useState("");

  function submit() {
    const t = val.trim();
    if (!t || going) return;
    setVal("");
    onPlay(t);
  }

  return (
    <div style={{
      borderTop: "1px solid " + C.dim,
      padding: "1rem 0 2rem",
      marginTop: "2rem",
      display: "flex", alignItems: "flex-end", gap: "0.8rem",
    }}>
      <textarea
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
        placeholder="que fais-tu ?"
        rows={2}
        disabled={going}
        style={{
          flex: 1,
          background: "transparent", border: "none",
          borderBottom: "1px solid " + C.dim,
          color: C.text, fontSize: 15,
          fontFamily: "inherit", fontStyle: "italic",
          outline: "none", resize: "none",
          padding: "0.4rem 0", lineHeight: 1.6,
          opacity: going ? 0.4 : 1,
        }}
      />
      <button type="button" onClick={submit} disabled={!val.trim() || going}
        style={{
          flexShrink: 0,
          background: "transparent",
          border: "1px solid " + (val.trim() && !going ? C.accent : C.dim),
          borderRadius: 3, color: val.trim() && !going ? C.accent : C.dim,
          fontSize: 18, width: 40, height: 40,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .15s",
        }}>
        {"\u2713"}
      </button>
    </div>
  );
}
