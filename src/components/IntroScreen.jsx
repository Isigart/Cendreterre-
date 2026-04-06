import { C } from "../styles/theme.js";

export default function IntroScreen({ onCommencer, heroExistant }) {
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
        {heroExistant ? (
          <div>
            <button type="button" onClick={() => onCommencer("reprendre")} style={{
              background: "transparent", border: "1px solid " + C.accent,
              borderRadius: 3, padding: "12px 24px", color: C.accent,
              fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
              display: "block", width: "100%", marginBottom: "0.8rem",
            }}>
              {`Reprendre le r\u00eave \u2014 ${heroExistant.nom}`}
            </button>
            <button type="button" onClick={() => onCommencer("nouveau")} style={{
              background: "transparent", border: "1px solid " + C.dim,
              borderRadius: 3, padding: "10px 24px", color: C.muted,
              fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
              display: "block", width: "100%",
            }}>
              {"Choisir un nouveau r\u00eave"}
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => onCommencer("nouveau")} style={{
            background: "transparent", border: "1px solid " + C.accent,
            borderRadius: 3, padding: "12px 24px", color: C.accent,
            fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
            cursor: "pointer", fontFamily: "inherit",
            display: "block", width: "100%",
          }}>
            {"Choisir un r\u00eave"}
          </button>
        )}
      </div>
    </div>
  );
}
