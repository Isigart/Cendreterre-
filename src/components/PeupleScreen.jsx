import { PEUPLES } from "../data/peuples.js";
import { getAvailablePeuples } from "../lib/unlocks.js";
import { C } from "../styles/theme.js";

export default function PeupleScreen({ onChoix, onBack, cles }) {
  const disponibles = getAvailablePeuples(cles || {});
  const peuplesDispo = PEUPLES.filter(p => disponibles.includes(p.id));

  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", padding: "2rem 1.5rem 8rem", maxWidth: 560, margin: "0 auto" }} className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <button type="button" onClick={onBack} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase" }}>{"\u2190 retour"}</button>
      </div>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: 22, color: C.accent, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>{"De quel peuple es-tu ?"}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: "0.5rem" }}>{`${peuplesDispo.length} peuple${peuplesDispo.length > 1 ? "s" : ""} d\u00e9bloqu\u00e9${peuplesDispo.length > 1 ? "s" : ""}`}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {peuplesDispo.map(p => (
          <button key={p.id} type="button" onClick={() => onChoix(p)}
            style={{ background: "transparent", border: "1px solid " + C.dim, borderRadius: 3, padding: "1rem", textAlign: "left", cursor: "pointer", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", transition: "border-color .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.dim}>
            <div style={{ fontSize: 14, color: C.accent, marginBottom: "0.4rem", fontStyle: "italic" }}>{p.nom}</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{p.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
