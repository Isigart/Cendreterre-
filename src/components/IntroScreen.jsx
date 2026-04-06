import { C } from "../styles/theme.js";

export default function IntroScreen({ onCommencer, heroes, onSwitch }) {
  const livingHeroes = (heroes || []).filter(h => h.vivant);
  const canCreateNew = livingHeroes.length < 3;

  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem 8rem" }} className="fade-in">
      <div style={{ textAlign: "center", maxWidth: 420, width: "100%" }}>
        <div style={{ fontSize: 9, letterSpacing: 6, color: C.muted, textTransform: "uppercase", marginBottom: "2rem" }}>
          {"Les Chroniques de"}
        </div>
        <h1 style={{ fontSize: "clamp(2.2rem,8vw,3.5rem)", fontWeight: "normal", color: C.accent, letterSpacing: 3, margin: "0 0 0.4rem", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>
          {"Ceux qui ont \u00e9t\u00e9 lus"}
        </h1>
        <div style={{ width: 40, height: 1, background: C.dim, margin: "1rem auto" }} />
        <div style={{ fontSize: 10, letterSpacing: 4, color: C.muted, textTransform: "uppercase", marginBottom: "2rem" }}>
          {"Chroniques de Cendreterre"}
        </div>
        <div style={{ width: 40, height: 1, background: C.dim, margin: "1.5rem auto" }} />
        <p style={{ fontSize: 13, color: C.muted, fontStyle: "italic", lineHeight: 2, margin: "0 0 3rem" }}>
          {"Le livre t\u2019attend."}<br />
          {"Le monde se souvient de toi."}
        </p>

        {/* H\u00e9ros vivants */}
        {livingHeroes.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            {livingHeroes.map(h => (
              <button key={h.id} type="button" onClick={() => onSwitch(h.id)} style={{
                background: "transparent", border: "1px solid " + C.accent,
                borderRadius: 3, padding: "12px 20px", color: C.accent,
                fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
                cursor: "pointer", fontFamily: "inherit",
                display: "block", width: "100%", marginBottom: "0.6rem",
                textAlign: "left",
              }}>
                <span style={{ fontStyle: "italic", fontSize: 13, letterSpacing: 1, textTransform: "none" }}>{h.nom}</span>
                <span style={{ color: C.muted, marginLeft: 10, fontSize: 10 }}>
                  {h.peuple?.nom}{h.metier ? " \u00b7 " + h.metier.nom : ""}{" \u00b7 "}{h.lieu}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Nouveau r\u00eave */}
        {canCreateNew && (
          <button type="button" onClick={() => onCommencer("nouveau")} style={{
            background: "transparent",
            border: "1px solid " + (livingHeroes.length > 0 ? C.dim : C.accent),
            borderRadius: 3, padding: livingHeroes.length > 0 ? "10px 24px" : "12px 24px",
            color: livingHeroes.length > 0 ? C.muted : C.accent,
            fontSize: livingHeroes.length > 0 ? 10 : 11,
            letterSpacing: livingHeroes.length > 0 ? 3 : 4,
            textTransform: "uppercase",
            cursor: "pointer", fontFamily: "inherit",
            display: "block", width: "100%",
          }}>
            {livingHeroes.length > 0 ? "Nouveau r\u00eave" : "Choisir un r\u00eave"}
          </button>
        )}

        {!canCreateNew && (
          <div style={{ fontSize: 10, color: C.dim, marginTop: "0.5rem" }}>
            {"3 r\u00eaves en cours \u2014 termine ou quitte un r\u00eave pour en commencer un nouveau"}
          </div>
        )}
      </div>
    </div>
  );
}
