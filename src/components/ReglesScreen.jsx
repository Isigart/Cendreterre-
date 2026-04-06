import { C } from "../styles/theme.js";

export default function ReglesScreen({ onContinue }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem" }} className="fade-in">
      <div style={{ maxWidth: 380, width: "100%" }}>
        <div style={{ marginBottom: "3rem" }}>
          <p style={{
            fontSize: 14, color: C.text, lineHeight: 2.2,
            fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
            fontStyle: "italic", marginBottom: "1.8rem",
          }}>
            {"\u00c9cris comme tu parlerais \u2014 pas de commandes, pas de \u00ab\u202fje veux faire X\u202f\u00bb. Une intention, une action, une curiosit\u00e9. Le monde r\u00e9pond."}
          </p>
          <p style={{
            fontSize: 14, color: C.text, lineHeight: 2.2,
            fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
            fontStyle: "italic", marginBottom: "1.8rem",
          }}>
            {"Rien n\u2019est bloqu\u00e9 \u2014 tu peux ignorer quelqu\u2019un, partir sans raison, observer sans agir. C\u2019est du jeu valide."}
          </p>
          <p style={{
            fontSize: 14, color: C.text, lineHeight: 2.2,
            fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
            fontStyle: "italic",
          }}>
            {"Le monde se souvient \u2014 ce que tu fais compte. Les PNJ bougent, les lieux changent, les cons\u00e9quences arrivent plus tard."}
          </p>
        </div>
        <button type="button" onClick={onContinue} style={{
          background: "transparent", border: "1px solid " + C.accent,
          borderRadius: 3, padding: "12px 24px", color: C.accent,
          fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
          cursor: "pointer", fontFamily: "inherit",
          display: "block", width: "100%",
        }}>
          {"Entrer"}
        </button>
      </div>
    </div>
  );
}
