import { useState } from "react";
import { C } from "../styles/theme.js";

export default function CodeScreen({ onCode }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);
  const canSubmit = code.trim().length >= 3;

  async function submit() {
    if (!canSubmit || loading) return;
    setLoading(true);
    setErreur(null);
    onCode(code.trim().toLowerCase());
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem 50vh" }} className="fade-in">
      <div style={{ textAlign: "center", maxWidth: 340, width: "100%" }}>
        <div style={{ fontSize: 9, letterSpacing: 6, color: C.muted, textTransform: "uppercase", marginBottom: "2rem" }}>
          {"Cendreterre"}
        </div>
        <div style={{ fontSize: 18, color: C.accent, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", marginBottom: "0.8rem" }}>
          {"Ton code de r\u00eaveur"}
        </div>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.8, marginBottom: "2rem" }}>
          {"Choisis un code pour sauvegarder ton r\u00eave. Tu pourras le reprendre de n'importe o\u00f9 avec ce code."}
        </p>
        <input
          type="text" value={code}
          onChange={e => setCode(e.target.value.replace(/[^a-zA-Z0-9\-_]/g, ""))}
          onKeyDown={e => { if (e.key === "Enter") submit(); }}
          placeholder={"un mot, un pseudo..."}
          maxLength={20} autoFocus
          style={{
            width: "100%", background: "transparent", border: "none",
            borderBottom: "1px solid " + (code.trim() ? C.accent : C.dim),
            padding: "0.6rem 0", color: C.accent,
            fontSize: 22, fontStyle: "italic", textAlign: "center",
            fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
            outline: "none", marginBottom: "0.5rem",
            transition: "border-color .2s",
          }}
        />
        <div style={{ fontSize: 10, color: C.dim, marginBottom: "2rem" }}>
          {"3-20 caract\u00e8res, lettres et chiffres"}
        </div>
        {erreur && (
          <div style={{ fontSize: 11, color: C.red, marginBottom: "1rem" }}>{erreur}</div>
        )}
        <button type="button" onClick={submit} disabled={!canSubmit || loading}
          style={{
            background: "transparent",
            border: "1px solid " + (canSubmit ? C.accent : C.dim),
            borderRadius: 3, padding: "12px 24px",
            color: canSubmit ? C.accent : C.dim,
            fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
            cursor: canSubmit ? "pointer" : "default",
            fontFamily: "inherit", display: "block", width: "100%",
            transition: "all .2s",
          }}>
          {loading ? "..." : "Entrer"}
        </button>
      </div>
    </div>
  );
}
