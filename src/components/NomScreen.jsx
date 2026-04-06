import { useState } from "react";
import { C } from "../styles/theme.js";

export default function NomScreen({ peuple, metier, onConfirm, onBack }) {
  const [nom, setNom] = useState("");
  const [genre, setGenre] = useState(null);
  const canSubmit = nom.trim().length >= 2;

  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", padding: "3rem 2rem 10rem" }} className="fade-in">
      <div style={{ width: "100%", maxWidth: 380, margin: "0 auto" }}>
        <button type="button" onClick={onBack} style={{
          background: "transparent", border: "none",
          color: C.muted, fontSize: 11, letterSpacing: 2,
          cursor: "pointer", fontFamily: "inherit",
          textTransform: "uppercase", marginBottom: "2rem", display: "block",
        }}>{"\u2190 retour"}</button>

        <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid " + C.dim }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.3rem" }}>{peuple.nom}</div>
          {metier && (
            <>
              <div style={{ fontSize: 16, color: C.text, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>{metier.nom}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: "0.3rem", lineHeight: 1.6 }}>{metier.desc}</div>
            </>
          )}
          {!metier && (
            <div style={{ fontSize: 16, color: C.muted, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>{"Sans m\u00e9tier"}</div>
          )}
        </div>

        <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.4rem" }}>{"Nom"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "2rem" }}>
          <input
            type="text" value={nom}
            onChange={e => setNom(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && canSubmit) onConfirm(nom.trim(), genre); }}
            placeholder="un nom..." maxLength={28} autoFocus
            style={{
              flex: 1, background: "transparent", border: "none",
              borderBottom: "1px solid " + C.dim,
              padding: "0.5rem 0", color: C.accent,
              fontSize: 22, fontStyle: "italic",
              fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
              outline: "none",
            }}
          />
          <button type="button" onClick={() => { if (canSubmit) onConfirm(nom.trim(), genre); }}
            style={{
              flexShrink: 0, background: "transparent",
              border: "1px solid " + (canSubmit ? C.accent : C.dim),
              borderRadius: 3, color: canSubmit ? C.accent : C.dim,
              fontSize: 18, width: 40, height: 40,
              cursor: canSubmit ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .15s",
            }}>
            {"\u2713"}
          </button>
        </div>

        <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.5rem" }}>{"Genre (optionnel)"}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: "2.5rem" }}>
          {[["M", "il"], ["F", "elle"], ["N", "iel"]].map(([g, label]) => (
            <button key={g} type="button" onClick={() => setGenre(genre === g ? null : g)}
              style={{
                background: "transparent",
                border: "1px solid " + (genre === g ? C.accent : C.dim),
                borderRadius: 3, padding: "6px 16px",
                color: genre === g ? C.accent : C.muted,
                fontSize: 11, letterSpacing: 1,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              {label}
            </button>
          ))}
        </div>

        <button type="button"
          onClick={() => { if (canSubmit) onConfirm(nom.trim(), genre); }}
          disabled={!canSubmit}
          style={{
            background: "transparent",
            border: "1px solid " + (canSubmit ? C.accent : C.dim),
            borderRadius: 3, padding: "12px 24px",
            color: canSubmit ? C.accent : C.dim,
            fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
            cursor: canSubmit ? "pointer" : "default",
            fontFamily: "inherit", display: "block", width: "100%",
            transition: "all .15s",
          }}>
          {"Commencer"}
        </button>
      </div>
    </div>
  );
}
