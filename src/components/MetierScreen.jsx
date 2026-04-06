import { METIERS } from "../data/peuples.js";
import { getAvailableMetierIds } from "../lib/unlocks.js";
import { C } from "../styles/theme.js";

export default function MetierScreen({ peuple, onChoix, onBack, cles }) {
  const disponibles = getAvailableMetierIds(peuple.id, cles || {});
  const metiers = (METIERS[peuple.id] || []).filter(m => disponibles.includes(m.id));

  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", padding: "2rem 1.5rem 8rem", maxWidth: 560, margin: "0 auto" }} className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <button type="button" onClick={onBack} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", marginBottom: "1.5rem", display: "block" }}>{"\u2190 retour"}</button>
        <div style={{ fontSize: 10, letterSpacing: 4, color: C.muted, textTransform: "uppercase", marginBottom: "0.5rem" }}>{peuple.nom}</div>
        <div style={{ fontSize: 20, color: C.accent, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>{"Quel est ton m\u00e9tier ?"}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {metiers.map(m => (
          <button key={m.id} type="button" onClick={() => onChoix(m)}
            style={{ background: "transparent", border: "1px solid " + C.dim, borderRadius: 3, padding: "0.9rem 1rem", textAlign: "left", cursor: "pointer", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", transition: "border-color .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.dim}>
            <div style={{ fontSize: 14, color: C.text, fontStyle: "italic", marginBottom: "0.25rem" }}>{m.nom}</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{m.desc}</div>
          </button>
        ))}
        <button type="button" onClick={() => onChoix(null)}
          style={{ background: "transparent", border: "1px solid " + C.dim, borderRadius: 3, padding: "0.9rem 1rem", textAlign: "left", cursor: "pointer", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", transition: "border-color .15s", marginTop: 8 }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.muted}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.dim}>
          <div style={{ fontSize: 14, color: C.muted, fontStyle: "italic", marginBottom: "0.25rem" }}>{"Sans m\u00e9tier"}</div>
          <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.6 }}>{"Pas d\u2019\u00e9tiquette. Le m\u00e9tier \u00e9mergera du jeu."}</div>
        </button>
      </div>
    </div>
  );
}
