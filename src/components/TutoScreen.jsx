import { useState, useRef, useEffect } from "react";
import { C } from "../styles/theme.js";
import Prose from "./Prose.jsx";

// --- Classification ---

function classifyScene2(txt) {
  const t = txt.toLowerCase();
  if (/attend|silence|rien|bouge pas|reste|immobile|ne dit|ne r\u00e9pond/.test(t)) return "silence";
  if (/l\u00e8ve|debout|recule|avance|colle|place|d\u00e9place|position/.test(t)) return "physique";
  return "dialogue";
}

function classifyScene3(txt) {
  const t = txt.toLowerCase();
  if (/frappe|attaque|coup|pousse|cogne|barre|assomm|tape|violence/.test(t)) return "combat";
  if (/fui[ste]?|cours|passe|sprint|esquive|escalier|dehors|sortir|d\u00e9camp/.test(t)) return "fuite";
  if (/cache|ombre|discr[e\u00e8]t|silenc|recule|caisse|planque|glisse/.test(t)) return "discretion";
  if (/parle|dis|explique|r[e\u00e9]pond|raconte|nom|raison|excuse|travail|bureau|calme/.test(t)) return "dialogue";
  return "autre";
}

// --- Prose ---

const S1_PROSE = "Le sol est froid. Pierre noire, humide. Une lampe \u00e0 circuit gr\u00e9sille sur le mur en face \u2014 elle tient \u00e0 peine. Caisses empil\u00e9es, outils accroch\u00e9s au fer, une porte \u00e0 gauche verrouill\u00e9e de l'ext\u00e9rieur.\n\nTu ne sais pas combien de temps tu as dormi l\u00e0.";

const S1_FOUILLE = "Les caisses du fond sont poussi\u00e9reuses. Toile de jute, boulons, chiffons huileux. Dans la derni\u00e8re, tout au fond, une barre de fer courte \u2014 pas une arme, mais quelque chose \u00e0 serrer dans la main.\n\nL'escalier craque. Quelqu'un descend.";
const S1_NOFOUILLE = "L'escalier craque. Quelqu'un descend.";

const S2_PROSE = "Un homme appara\u00eet en bas des marches. V\u00eatements imp\u00e9riaux simples \u2014 propres, repass\u00e9s. Une liste dans une main, une lampe dans l'autre. Il cherche quelque chose.\n\nIl te voit. S'arr\u00eate.\n\n\u00ab\u202fQu'est-ce que tu fais l\u00e0\u202f?\u202f\u00bb";

const S2_RESULTS = {
  dialogue: "Il \u00e9coute. Son expression ne change pas beaucoup \u2014 des yeux habitu\u00e9s \u00e0 recevoir des explications. Il note quelque chose sur sa liste.\n\n\u00ab\u202fTu n'es pas cens\u00e9 \u00eatre ici. Mais si tu as du travail en haut, je ne suis pas l\u00e0 pour t'en emp\u00eacher.\u202f\u00bb\n\nIl tourne les \u00e9paules vers les \u00e9tag\u00e8res. Sa main reste pr\u00e8s de sa liste.",
  silence: "Tu ne r\u00e9ponds pas. Son regard reste sur toi une seconde de trop. Il pose sa liste.\n\n\u00ab\u202fJe vais avoir besoin que tu t'expliques\u202f\u00bb, dit-il. Calme. Habitu\u00e9 \u00e0 \u00e7a.",
  physique: "Il note ton mouvement. Fait un pas de c\u00f4t\u00e9 \u2014 instinctif, pas agressif.\n\n\u00ab\u202fDoucement\u202f\u00bb, dit-il. Pas une menace. Un r\u00e9flexe.",
};

const S3_PROSE = "Sa main n'est plus sur sa liste. Elle est pr\u00e8s du sifflet \u00e0 sa ceinture.\n\nLa porte de l'escalier est ouverte derri\u00e8re lui. Trois marches et tu es dehors. Mais il est entre toi et cet escalier.\n\nIl attend.";

const S3_RESULTS = {
  combat: "Tu frappes vite. Il recule, heurte une caisse, tombe \u00e0 genoux. Sa lampe bascule et s'\u00e9teint. L'escalier est devant toi.\n\nIl n'a pas cri\u00e9. Mais quelqu'un au-dessus a entendu le bruit.",
  fuite: "Tu passes \u00e0 c\u00f4t\u00e9 de lui avant qu'il r\u00e9agisse \u2014 une \u00e9paule, une pouss\u00e9e, les marches sous tes pieds. Tu es dehors en quelques secondes.\n\nDerri\u00e8re toi, un coup de sifflet. Bref, m\u00e9thodique.",
  discretion: "Tu recules lentement dans l'ombre derri\u00e8re les caisses pendant qu'il cherche quelque chose sur l'\u00e9tag\u00e8re. Le temps qu'il se retourne, tu es d\u00e9j\u00e0 dans l'escalier.\n\nIl ne t'a pas vu partir.",
  dialogue: "Tu lui donnes quelque chose \u2014 une raison, un nom, une explication. Il r\u00e9fl\u00e9chit. Puis\u202f:\n\n\u00ab\u202fLa prochaine fois tu passes par le bureau.\u202f\u00bb Il te fait signe vers l'escalier. C'est tout.",
  autre: "Vous restez l\u00e0 tous les deux. Apr\u00e8s un silence trop long, il sort son sifflet et siffle deux fois.\n\nDes pas au-dessus. Tu as quelques secondes.",
};

const S4_RESULTS = {
  combat: "L'homme est \u00e0 terre dans la cave. La garnison va s'en apercevoir. Tu as de l'avance \u2014 pas ind\u00e9finiment.",
  fuite: "Le sifflet a \u00e9t\u00e9 entendu. Peut-\u00eatre rien. Peut-\u00eatre pas.",
  discretion: "Personne ne sait que tu \u00e9tais l\u00e0. Tu as le temps.",
  dialogue: "L'homme t'a laiss\u00e9 passer. C'est comme \u00e7a que \u00e7a marche parfois \u2014 les bonnes paroles.",
  autre: "Sorti de justesse. \u00c7a s'est senti.",
};

// --- Input ---

function TutoInput({ onSubmit }) {
  const [val, setVal] = useState("");
  const ref = useRef(null);

  function submit() {
    const t = val.trim();
    if (!t) return;
    setVal("");
    onSubmit(t);
  }

  function handleFocus() {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 350);
  }

  return (
    <div ref={ref} style={{ borderTop: "1px solid " + C.dim, padding: "1rem 0 2rem", marginTop: "2rem", display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
      <textarea
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
        onFocus={handleFocus}
        placeholder="que fais-tu ?"
        rows={2}
        style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", borderBottom: "1px solid " + C.dim, color: C.text, fontSize: 15, fontFamily: "inherit", fontStyle: "italic", outline: "none", resize: "none", padding: "0.4rem 0", lineHeight: 1.6 }}
      />
      <button type="button" onClick={submit} disabled={!val.trim()}
        style={{ flexShrink: 0, background: "transparent", border: "1px solid " + (val.trim() ? C.accent : C.dim), borderRadius: 3, color: val.trim() ? C.accent : C.dim, fontSize: 16, width: 36, height: 36, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {"\u2713"}
      </button>
    </div>
  );
}

// --- Main ---

export default function TutoScreen({ onComplete }) {
  const [scene, setScene] = useState(1);
  const [phase, setPhase] = useState("input"); // "input" | "response" | "done"
  const [prose, setProse] = useState(S1_PROSE);
  const [hasBarre, setHasBarre] = useState(false);
  const [scene2Type, setScene2Type] = useState(null);
  const [scene3Type, setScene3Type] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [prose, phase]);

  function goNext() {
    if (scene === 1) {
      setScene(2); setProse(S2_PROSE); setPhase("input");
    } else if (scene === 2) {
      setScene(3); setProse(S3_PROSE); setPhase("input");
    } else if (scene === 3) {
      setScene(4);
      setProse(S4_RESULTS[scene3Type] + "\n\nCendreterre t'attend.");
      setPhase("done");
    }
  }

  function handleScene1(txt) {
    const t = txt.toLowerCase();
    const isFouille = /fouill|cherch|regard|explor|inspect|caisse|outil|objet|barre|autour|examine/.test(t);
    if (isFouille) {
      setHasBarre(true);
      setProse(S1_PROSE + "\n\n" + S1_FOUILLE);
    } else {
      setProse(S1_PROSE + "\n\n" + S1_NOFOUILLE);
    }
    setPhase("response");
  }

  function handleScene2(txt) {
    const type = classifyScene2(txt);
    setScene2Type(type);
    setProse(S2_PROSE + "\n\n" + S2_RESULTS[type]);
    setPhase("response");
  }

  function handleScene3(txt) {
    const type = classifyScene3(txt);
    setScene3Type(type);
    setProse(S3_PROSE + "\n\n" + S3_RESULTS[type]);
    setPhase("response");
  }

  const handlers = { 1: handleScene1, 2: handleScene2, 3: handleScene3 };

  return (
    <div style={{ height: "100dvh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", overflow: "hidden", width: "100%", boxSizing: "border-box" }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", maxWidth: 620, width: "100%", margin: "0 auto", padding: "2rem 1rem 4rem", boxSizing: "border-box" }}>

        <div className="fade-in">
          <Prose text={prose} streaming={false} />
        </div>

        {phase === "input" && (
          <div className="fade-slow">
            <TutoInput onSubmit={handlers[scene]} />
          </div>
        )}

        {phase === "response" && (
          <div style={{ textAlign: "center", marginTop: "2rem" }} className="fade-slow">
            <button type="button" onClick={goNext} style={{
              background: "transparent", border: "none",
              color: C.muted, fontSize: 10, letterSpacing: 4,
              textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
            }}>
              {"continuer \u2192"}
            </button>
          </div>
        )}

        {phase === "done" && (
          <div style={{ textAlign: "center", marginTop: "3rem" }} className="fade-slow">
            <button type="button" onClick={() => onComplete({ hasBarre, scene2Type, scene3Type })} style={{
              background: "transparent", border: "1px solid " + C.accent,
              borderRadius: 3, padding: "12px 24px", color: C.accent,
              fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
            }}>
              {"Entrer dans le monde"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
