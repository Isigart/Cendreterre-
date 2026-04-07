import { useRef, useEffect } from "react";
import { C } from "../styles/theme.js";
import { PEUPLES } from "../data/peuples.js";
import Prose from "./Prose.jsx";
import Input from "./Input.jsx";

export default function GameScreen({
  hero, prose, streaming, going, err, rateLimit,
  pendingDeath, deadHero,
  onPlay, onPause, onAbandon, onCancelQuit, onEndReve, onNewDream, onReset, onJournal,
}) {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll quand le contenu change
  useEffect(() => {
    if (prose && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [prose, streaming]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", width: "100%", maxWidth: "100vw", boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid " + C.dim,
        padding: "0.8rem 1rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexShrink: 0, boxSizing: "border-box", width: "100%",
      }}>
        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, color: C.accent, fontStyle: "italic" }}>{hero?.nom}</span>
          <span style={{ fontSize: 10, color: C.muted, marginLeft: 10, letterSpacing: 2 }}>
            {hero?.peuple?.nom}{hero?.metier?.nom ? ` · ${hero.metier.nom}` : ""}{` · ${hero?.lieu || ""}`}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexShrink: 0 }}>
          <button type="button" onClick={onJournal} style={{
            background: "transparent", border: "1px solid " + C.dim,
            borderRadius: 3, padding: "4px 10px",
            color: C.muted, fontSize: 9, letterSpacing: 2,
            cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
          }}>{"journal"}</button>
          {!pendingDeath && !going && prose && (
            <button type="button" onClick={onPause} style={{
              background: "transparent", border: "1px solid " + C.dim,
              borderRadius: 3, padding: "4px 10px",
              color: C.muted, fontSize: 9, letterSpacing: 2,
              cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
            }}>{"\u2190"}</button>
          )}
          {!pendingDeath && !going && prose && (
            <button type="button" onClick={onAbandon} style={{
              background: "transparent", border: "none",
              color: C.dim, fontSize: 9, letterSpacing: 3,
              cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
            }}>{"···"}</button>
          )}
        </div>
      </div>

      {/* Prose area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", maxWidth: 620, width: "100%", margin: "0 auto", padding: "2rem 1rem 4rem", boxSizing: "border-box" }}>

        {going && !prose && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: C.dim, fontSize: 24 }} className="pulse">{"···"}</div>
        )}

        {prose && (
          <div className="fade-in">
            <Prose text={prose} streaming={streaming} />
          </div>
        )}

        {err && (
          <div style={{ color: C.red, fontSize: 12, fontStyle: "italic", marginBottom: "1rem" }}>{err}</div>
        )}
        {rateLimit && (
          <div style={{ color: C.muted, fontSize: 12, fontStyle: "italic", marginBottom: "1rem" }}>
            {"Trop de requ\u00eates \u2014 attends un moment."}
          </div>
        )}

        {/* Death / abandon confirmation */}
        {!streaming && pendingDeath && (
          <div style={{ textAlign: "center", padding: "2rem 0" }} className="fade-slow">
            <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: "1.5rem" }}>
              {pendingDeath === "mort"
                ? "Le r\u00eave s'arr\u00eate ici."
                : `Tu te retires. ${hero?.nom} continue quelque part.`}
            </div>
            <button type="button" onClick={() => onEndReve(pendingDeath)} style={{
              background: "transparent", border: "1px solid " + C.dim,
              borderRadius: 3, padding: "10px 24px",
              color: C.muted, fontSize: 10, letterSpacing: 3,
              textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
            }}>
              {pendingDeath === "mort" ? "Continuer" : "Quitter"}
            </button>
            {pendingDeath === "abandon" && (
              <div>
                <button type="button" onClick={onCancelQuit} style={{
                  background: "transparent", border: "none",
                  color: C.muted, fontSize: 9, letterSpacing: 2,
                  textTransform: "uppercase", cursor: "pointer",
                  fontFamily: "inherit", display: "block", margin: "0.8rem auto 0",
                }}>
                  {"rester dans le r\u00eave"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Input */}
        {!streaming && !pendingDeath && !deadHero && (
          <div className="fade-slow">
            <Input onPlay={onPlay} going={going} />
          </div>
        )}

        {/* End screen */}
        {deadHero && (
          <div style={{ textAlign: "center", padding: "3rem 0" }} className="fade-in">
            <div style={{ fontSize: 10, letterSpacing: 5, color: deadHero.statut === "mort" ? C.red : C.muted, textTransform: "uppercase", marginBottom: "1.5rem" }}>
              {deadHero.statut === "mort"
                ? "Le r\u00eave est termin\u00e9."
                : `${deadHero.nom} continue quelque part dans Cendreterre.`}
            </div>
            <div style={{ fontSize: 18, color: C.muted, fontStyle: "italic", marginBottom: "0.3rem" }}>{deadHero.nom}</div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: "2rem" }}>
              {deadHero.peuple?.nom}{deadHero.metier?.nom ? ` · ${deadHero.metier.nom}` : ""}{` · ${deadHero.sceneCount} sc\u00e8ne${deadHero.sceneCount > 1 ? "s" : ""}`}
            </div>

            {deadHero.nouveauxDeblocages &&
              (deadHero.nouveauxDeblocages.peuples?.length > 0 || deadHero.nouveauxDeblocages.metiers?.length > 0) && (
              <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid " + C.dim, borderRadius: 3, textAlign: "left", maxWidth: 320, margin: "0 auto 2rem" }}>
                <div style={{ fontSize: 9, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: "0.8rem" }}>
                  {"Nouvelles cartes d\u00e9bloqu\u00e9es"}
                </div>
                {(deadHero.nouveauxDeblocages.peuples || []).map(p => {
                  const peuple = PEUPLES.find(pl => pl.id === p);
                  return peuple ? (
                    <div key={p} style={{ fontSize: 12, color: C.text, fontStyle: "italic", marginBottom: "0.3rem" }}>{"\u25c6 "}{peuple.nom}</div>
                  ) : null;
                })}
                {(deadHero.nouveauxDeblocages.metiers || []).map((m, i) => (
                  <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: "0.2rem" }}>{"\u00b7 "}{m}</div>
                ))}
              </div>
            )}

            <button type="button" onClick={onNewDream} style={{
              background: "transparent", border: "1px solid " + C.dim,
              borderRadius: 3, padding: "10px 24px",
              color: C.muted, fontSize: 10, letterSpacing: 3,
              textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
            }}>
              {"Choisir un nouveau r\u00eave"}
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
