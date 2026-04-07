import { useState } from "react";
import { C } from "../styles/theme.js";

const CATEGORIES = [
  { id: "lieux",       nom: "Lieux" },
  { id: "peuples",     nom: "Peuples" },
  { id: "pnj",         nom: "Visages" },
  { id: "creatures",   nom: "Cr\u00e9atures" },
  { id: "magie",       nom: "Magie" },
  { id: "faune_flore", nom: "Faune & Flore" },
  { id: "monde",       nom: "Le Monde" },
];

export default function JournalScreen({ journal, onBack }) {
  const [activeCat, setActiveCat] = useState(null);
  const [activeEntry, setActiveEntry] = useState(null);

  const data = journal || {};

  // Vue cat\u00e9gories
  if (!activeCat) return (
    <div style={{ height: "100dvh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid " + C.dim, flexShrink: 0 }}>
        <button type="button" onClick={onBack} style={{
          background: "transparent", border: "none", color: C.muted,
          fontSize: 11, letterSpacing: 2, cursor: "pointer",
          fontFamily: "inherit", textTransform: "uppercase",
        }}>{"\u2190 retour"}</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "2rem 1.5rem", maxWidth: 500, margin: "0 auto", width: "100%" }}>
        <div style={{ fontSize: 18, color: C.accent, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", marginBottom: "2rem", textAlign: "center" }}>
          {"Journal"}
        </div>
        {CATEGORIES.map(cat => {
          const entries = data[cat.id] || {};
          const count = Object.keys(entries).length;
          return (
            <button key={cat.id} type="button"
              onClick={() => count > 0 ? setActiveCat(cat.id) : null}
              style={{
                background: "transparent",
                border: "1px solid " + (count > 0 ? C.dim : "transparent"),
                borderRadius: 3, padding: "0.8rem 1rem",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                width: "100%", marginBottom: "0.5rem",
                cursor: count > 0 ? "pointer" : "default",
                fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
                transition: "border-color .15s",
                opacity: count > 0 ? 1 : 0.3,
              }}
              onMouseEnter={e => { if (count > 0) e.currentTarget.style.borderColor = C.accent; }}
              onMouseLeave={e => { if (count > 0) e.currentTarget.style.borderColor = C.dim; }}
            >
              <span style={{ fontSize: 14, color: count > 0 ? C.text : C.dim, fontStyle: "italic" }}>{cat.nom}</span>
              <span style={{ fontSize: 11, color: C.muted }}>{count > 0 ? count : "\u2014"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const catData = data[activeCat] || {};
  const catNom = CATEGORIES.find(c => c.id === activeCat)?.nom || activeCat;

  // Vue entr\u00e9es d'une cat\u00e9gorie
  if (!activeEntry) return (
    <div style={{ height: "100dvh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid " + C.dim, flexShrink: 0 }}>
        <button type="button" onClick={() => setActiveCat(null)} style={{
          background: "transparent", border: "none", color: C.muted,
          fontSize: 11, letterSpacing: 2, cursor: "pointer",
          fontFamily: "inherit", textTransform: "uppercase",
        }}>{"\u2190 " + catNom}</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.5rem", maxWidth: 500, margin: "0 auto", width: "100%" }}>
        {Object.entries(catData).map(([id, fragments]) => (
          <button key={id} type="button"
            onClick={() => setActiveEntry(id)}
            style={{
              background: "transparent", border: "1px solid " + C.dim,
              borderRadius: 3, padding: "0.7rem 1rem",
              display: "block", width: "100%", textAlign: "left",
              marginBottom: "0.5rem", cursor: "pointer",
              fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
              transition: "border-color .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.dim}
          >
            <span style={{ fontSize: 13, color: C.accent, fontStyle: "italic" }}>
              {id.replace(/_/g, " ")}
            </span>
            <span style={{ fontSize: 10, color: C.dim, marginLeft: 8 }}>
              {Array.isArray(fragments) ? fragments.length + " fragment" + (fragments.length > 1 ? "s" : "") : "1 fragment"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  // Vue d\u00e9tail d'une entr\u00e9e
  const fragments = Array.isArray(catData[activeEntry]) ? catData[activeEntry] : [catData[activeEntry]];
  return (
    <div style={{ height: "100dvh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid " + C.dim, flexShrink: 0 }}>
        <button type="button" onClick={() => setActiveEntry(null)} style={{
          background: "transparent", border: "none", color: C.muted,
          fontSize: 11, letterSpacing: 2, cursor: "pointer",
          fontFamily: "inherit", textTransform: "uppercase",
        }}>{"\u2190 " + catNom}</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "2rem 1.5rem", maxWidth: 500, margin: "0 auto", width: "100%" }}>
        <div style={{ fontSize: 18, color: C.accent, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", marginBottom: "1.5rem" }}>
          {activeEntry.replace(/_/g, " ")}
        </div>
        {fragments.filter(Boolean).map((f, i) => (
          <p key={i} style={{
            fontSize: 13, color: C.text, lineHeight: 2,
            fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
            fontStyle: "italic", marginBottom: "1rem",
            paddingLeft: "0.8rem",
            borderLeft: "2px solid " + C.dim,
          }}>
            {f}
          </p>
        ))}
      </div>
    </div>
  );
}
