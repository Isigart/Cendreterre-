import { useState, useEffect } from "react";
import { C } from "../styles/theme.js";
import { PROSE_REVE } from "../data/narration.js";

export default function PremierReve({ onNom }) {
  const [phase, setPhase] = useState(1);
  const [visible, setVisible] = useState(0);
  const [nom, setNom] = useState("");
  const [nomVisible, setNomVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);

  useEffect(() => {
    if (phase !== 1 || visible >= PROSE_REVE.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), visible === 0 ? 800 : 1800);
    return () => clearTimeout(t);
  }, [phase, visible]);

  useEffect(() => {
    if (phase !== 2) return;
    const t1 = setTimeout(() => setNomVisible(true), 600);
    const t2 = setTimeout(() => setInputVisible(true), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  function confirmer() {
    const n = nom.trim();
    if (n.length < 2) return;
    onNom(n);
  }

  if (phase === 1) return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "3rem 1.8rem 8rem",
      maxWidth: 520, margin: "0 auto",
    }}>
      <div style={{ position: "fixed", top: "1rem", right: "1.2rem" }}>
        <button type="button" onClick={() => setPhase(2)} style={{
          background: "transparent", border: "none",
          color: C.muted, fontSize: 9, letterSpacing: 3,
          textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
        }}>{"skip"}</button>
      </div>

      {PROSE_REVE.slice(0, visible).map((p, i) => (
        <p key={i} style={{
          fontSize: "clamp(15px,2.5vw,17px)", lineHeight: 2,
          color: i < visible - 1 ? C.muted : C.text,
          fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
          fontStyle: "italic", marginBottom: "1.6rem",
          animation: "fadeUp .8s ease both",
          transition: "color 1s ease",
        }}>
          {p}
        </p>
      ))}

      {visible >= PROSE_REVE.length && (
        <button type="button" onClick={() => setPhase(2)} style={{
          background: "transparent", border: "none",
          color: C.muted, fontSize: 10, letterSpacing: 4,
          textTransform: "uppercase", cursor: "pointer",
          fontFamily: "inherit", marginTop: "1rem",
          animation: "fadeSlow 1.2s ease both",
        }}>
          {"continuer \u2192"}
        </button>
      )}
    </div>
  );

  if (phase === 2) return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem 1.5rem 40vh", background: C.bg,
      overflow: "hidden", width: "100%", maxWidth: "100vw",
    }}>
      {nomVisible && (
        <div style={{ animation: "fadeSlow 1s ease both", textAlign: "center", maxWidth: 280, width: "100%", padding: "0 0.5rem" }}>
          <p style={{
            fontSize: 14, color: C.muted, fontStyle: "italic",
            fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
            lineHeight: 2, marginBottom: "2rem",
          }}>
            {"Tu ne vois rien \u00e0 part ce message dans ton esprit."}
          </p>
          <div style={{
            fontSize: 13, letterSpacing: 4, color: C.text,
            textTransform: "uppercase", marginBottom: "0.8rem",
          }}>
            {"Quel est ton nom ?"}
          </div>
        </div>
      )}

      {inputVisible && (
        <div style={{ width: "100%", maxWidth: 260, padding: "0 1.5rem", animation: "fadeUp .8s ease both", boxSizing: "border-box" }}>
          <input
            type="text" value={nom}
            onChange={e => setNom(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") confirmer(); }}
            autoFocus maxLength={20}
            style={{
              width: "100%", background: "transparent", border: "none",
              borderBottom: "1px solid " + (nom.trim() ? C.accent : C.dim),
              padding: "0.5rem 0", color: C.accent,
              fontSize: 20, fontStyle: "italic",
              fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
              outline: "none", textAlign: "center",
              marginBottom: "1.5rem", transition: "border-color .2s",
              boxSizing: "border-box",
            }}
          />
          <button type="button" onClick={confirmer} disabled={nom.trim().length < 2}
            style={{
              width: "100%", background: "transparent",
              border: "1px solid " + (nom.trim().length >= 2 ? C.accent : C.dim),
              borderRadius: 3, padding: "10px 0",
              color: nom.trim().length >= 2 ? C.accent : C.dim,
              fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
              cursor: nom.trim().length >= 2 ? "pointer" : "default",
              fontFamily: "inherit", transition: "all .15s",
            }}>
            {"Entrer"}
          </button>
        </div>
      )}
    </div>
  );

  return null;
}
