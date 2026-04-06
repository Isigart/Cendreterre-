import { useState } from "react";
import { C } from "../styles/theme.js";

export default function NomScreen({ peuple, metier, onConfirm, onBack }) {
  const [nom, setNom] = useState("");
  const [genre, setGenre] = useState(null);
  const canSubmit = nom.trim().length >= 2;

  function submit() {
    if (canSubmit) onConfirm(nom.trim(), genre);
  }

  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", padding: "3rem 2rem 6rem" }} className="fade-in">
      <div style={{ width: "100%", maxWidth: 380, margin: "0 auto" }}>
        <button type="button" onClick={onBack} style={{
          background: "transparent", border: "none",
          color: C.muted, fontSize: 11, letterSpacing: 2,
          cursor: "pointer", fontFamily: "inherit",
          textTransform: "uppercase", marginBottom: "2rem", display: "block",
        }}>{"\u2190 retour"}</button>

        <div style={{ marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid " + C.dim }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.3rem" }}>{peuple.nom}</div>
          {metier ? (
            <>
              <div style={{ fontSize: 18, color: C.text, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>{metier.nom}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: "0.4rem", lineHeight: 1.6 }}>{metier.desc}</div>
            </>
          ) : (
            <div style={{ fontSize: 18, color: C.muted, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>{"Sans m\u00e9tier"}</div>
          )}
        </div>

        <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.6rem" }}>{"Nom"}</div>
        <input
          type="text" value={nom}
          onChange={e => setNom(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") submit(); }}
          placeholder="un nom..." maxLength={28} autoFocus
          style={{
            width: "100%", background: "transparent", border: "none",
            borderBottom: "1px solid " + (nom.trim() ? C.accent : C.dim),
            padding: "0.6rem 0", color: C.accent,
            fontSize: 24, fontStyle: "italic",
            fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
            outline: "none", marginBottom: "2.5rem",
            transition: "border-color .2s",
          }}
        />

        <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.6rem" }}>{"Genre (optionnel)"}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: "3rem" }}>
          {[["M", "il"], ["F", "elle"], ["N", "iel"]].map(([g, label]) => (
            <button key={g} type="button" onClick={() => setGenre(genre === g ? null : g)}
              style={{
                background: "transparent",
                border: "1px solid " + (genre === g ? C.accent : C.dim),
                borderRadius: 3, padding: "8px 20px",
                color: genre === g ? C.accent : C.muted,
                fontSize: 12, letterSpacing: 1,
                cursor: "pointer", fontFamily: "inherit",
                transition: "all .15s",
              }}>
              {label}
            </button>
          ))}
        </div>

        <button type="button" onClick={submit} disabled={!canSubmit}
          style={{
            background: "transparent",
            border: "1px solid " + (canSubmit ? C.accent : C.dim),
            borderRadius: 3, padding: "14px 24px",
            color: canSubmit ? C.accent : C.dim,
            fontSize: 12, letterSpacing: 4, textTransform: "uppercase",
            cursor: canSubmit ? "pointer" : "default",
            fontFamily: "inherit", display: "block", width: "100%",
            transition: "all .2s",
          }}>
          {"Commencer"}
        </button>
      </div>
    </div>
  );
}
