import { useState, useRef, useEffect } from "react";
import { C } from "../styles/theme.js";
import Prose from "./Prose.jsx";

// --- Classification des intentions ---

function classifyAction(txt) {
  const t = txt.toLowerCase();
  if (/frappe|attaque|coup|pousse|cogne|barre|assomm/.test(t)) return "combat";
  if (/fui|cours|passe|sprint|esquive|escalier|dehors|sortir/.test(t)) return "fuite";
  if (/cache|ombre|discret|silenc|recule|caisse|planque/.test(t)) return "discretion";
  if (/parle|dis|explique|repond|raconte|nom|raison|excuse|travail|bureau/.test(t)) return "dialogue";
  return "autre";
}

// --- Donn\u00e9es des sc\u00e8nes ---

const SCENE_1_PROSE = "Le sol est froid. Pierre noire, humide. Une lampe \u00e0 circuit gr\u00e9sille sur le mur en face \u2014 elle tient \u00e0 peine. Caisses empil\u00e9es, outils accroch\u00e9s au fer, une porte \u00e0 gauche verrouill\u00e9e de l'ext\u00e9rieur.\n\nTu ne sais pas combien de temps tu as dormi l\u00e0.";

const SCENE_1_FOUILLE = "Les caisses du fond sont poussi\u00e9reuses. Toile de jute, boulons, chiffons huileux. Dans la derni\u00e8re, tout au fond, une barre de fer courte \u2014 pas une arme, mais quelque chose \u00e0 serrer dans la main.\n\nL'escalier craque. Quelqu'un descend.";

const SCENE_1_NOFOUILLE = "L'escalier craque. Quelqu'un descend.";

const SCENE_2_PROSE = "Un homme appara\u00eet en bas des marches. V\u00eatements imp\u00e9riaux simples \u2014 propres, repass\u00e9s. Une liste dans une main, une lampe dans l'autre. Il cherche quelque chose.\n\nIl te voit. S'arr\u00eate.\n\nQu'est-ce que tu fais l\u00e0 ?";

const SCENE_2_DIALOGUE = "Il \u00e9coute. Son expression ne change pas beaucoup \u2014 des yeux habitu\u00e9s \u00e0 recevoir des explications. Il note quelque chose sur sa liste.\n\nTu n'es pas cens\u00e9 \u00eatre ici. Mais si tu as du travail en haut, je ne suis pas l\u00e0 pour t'en emp\u00eacher.\n\nIl tourne les \u00e9paules vers les \u00e9tag\u00e8res. Sa main reste pr\u00e8s de sa liste.";

const SCENE_2_SILENCE = "Tu ne r\u00e9ponds pas. Son regard reste sur toi une seconde de trop. Il pose sa liste.\n\nJe vais avoir besoin que tu t'expliques, dit-il. Calme. Habitu\u00e9 \u00e0 \u00e7a.";

const SCENE_2_PHYSIQUE = "Il note ton mouvement. Fait un pas de c\u00f4t\u00e9 \u2014 instinctif, pas agressif.\n\nDoucement, dit-il. Pas une menace. Un r\u00e9flexe.";

const SCENE_3_PROSE = "Sa main n'est plus sur sa liste. Elle est pr\u00e8s du sifflet \u00e0 sa ceinture.\n\nLa porte de l'escalier est ouverte derri\u00e8re lui. Trois marches et tu es dehors. Mais il est entre toi et cet escalier.\n\nIl attend.";

const SCENE_3_RESULTS = {
  combat: "Tu frappes vite. Il recule, heurte une caisse, tombe \u00e0 genoux. Sa lampe bascule et s'\u00e9teint. L'escalier est devant toi.\n\nIl n'a pas cri\u00e9. Mais quelqu'un au-dessus a entendu le bruit.",
  fuite: "Tu passes \u00e0 c\u00f4t\u00e9 de lui avant qu'il r\u00e9agisse \u2014 une \u00e9paule, une pouss\u00e9e, les marches sous tes pieds. Tu es dehors en quelques secondes.\n\nDerri\u00e8re toi, un coup de sifflet. Bref, m\u00e9thodique.",
  discretion: "Tu recules lentement dans l'ombre derri\u00e8re les caisses pendant qu'il cherche quelque chose sur l'\u00e9tag\u00e8re. Le temps qu'il se retourne, tu es d\u00e9j\u00e0 dans l'escalier.\n\nIl ne t'a pas vu partir.",
  dialogue: "Tu lui donnes quelque chose \u2014 une raison, un nom, une explication. Il r\u00e9fl\u00e9chit. Puis :\n\nLa prochaine fois tu passes par le bureau. Il te fait signe vers l'escalier. C'est tout.",
  autre: "Vous restez l\u00e0 tous les deux. Apr\u00e8s un silence trop long, il sort son sifflet et siffle deux fois.\n\nDes pas au-dessus. Tu as quelques secondes.",
};

const SCENE_4_RESULTS = {
  combat: "L'homme est \u00e0 terre dans la cave. La garnison va s'en apercevoir. Tu as de l'avance \u2014 pas ind\u00e9finiment.",
  fuite: "Le sifflet a \u00e9t\u00e9 entendu. Peut-\u00eatre rien. Peut-\u00eatre pas.",
  discretion: "Personne ne sait que tu \u00e9tais l\u00e0. Tu as le temps.",
  dialogue: "L'homme t'a laiss\u00e9 passer. C'est comme \u00e7a que \u00e7a marche parfois \u2014 les bonnes paroles.",
  autre: "Sorti de justesse. \u00c7a s'est senti.",
};

// --- Composant Input simple ---

function TutoInput({ onSubmit, placeholder }) {
  const [val, setVal] = useState("");
  const ref = useRef(null);

  function submit() {
    const t = val.trim();
    if (!t) return;
    setVal("");
    onSubmit(t);
  }

  function handleFocus() {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  }

  return (
    <div ref={ref} style={{
      borderTop: "1px solid " + C.dim,
      padding: "1rem 0 2rem", marginTop: "2rem",
      display: "flex", alignItems: "flex-end", gap: "0.5rem",
    }}>
      <textarea
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
        onFocus={handleFocus}
        placeholder={placeholder || "que fais-tu ?"}
        rows={2}
        style={{
          flex: 1, minWidth: 0,
          background: "transparent", border: "none",
          borderBottom: "1px solid " + C.dim,
          color: C.text, fontSize: 15,
          fontFamily: "inherit", fontStyle: "italic",
          outline: "none", resize: "none",
          padding: "0.4rem 0", lineHeight: 1.6,
        }}
      />
      <button type="button" onClick={submit} disabled={!val.trim()}
        style={{
          flexShrink: 0, background: "transparent",
          border: "1px solid " + (val.trim() ? C.accent : C.dim),
          borderRadius: 3, color: val.trim() ? C.accent : C.dim,
          fontSize: 16, width: 36, height: 36,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
        {"\u2713"}
      </button>
    </div>
  );
}

// --- Composant principal ---

export default function TutoScreen({ onComplete }) {
  const [scene, setScene] = useState(1);
  const [prose, setProse] = useState(SCENE_1_PROSE);
  const [hasBarre, setHasBarre] = useState(false);
  const [scene3Type, setScene3Type] = useState(null);
  const [showInput, setShowInput] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [prose]);

  function handleScene1(txt) {
    const t = txt.toLowerCase();
    const isFouille = /fouill|cherch|regard|explor|inspect|caisse|outil|objet|barre|autour/.test(t);
    if (isFouille) {
      setHasBarre(true);
      setProse(SCENE_1_PROSE + "\n\n" + SCENE_1_FOUILLE);
    } else {
      setProse(SCENE_1_PROSE + "\n\n" + SCENE_1_NOFOUILLE);
    }
    setShowInput(false);
    setTimeout(() => { setScene(2); setProse(SCENE_2_PROSE); setShowInput(true); }, 2500);
  }

  function handleScene2(txt) {
    const t = txt.toLowerCase();
    const isDialogue = /parle|dis|explique|repond|raconte|oui|non|travail|r\u00e9pond|bonjour|rien/.test(t);
    const isSilence = /rien|attend|silence|regarde|observe|bouge pas|reste/.test(t);
    const isPhysique = /l\u00e8ve|debout|recule|avance|colle|place|bouge/.test(t);

    let response;
    if (isDialogue && !isSilence) response = SCENE_2_DIALOGUE;
    else if (isSilence && !isDialogue) response = SCENE_2_SILENCE;
    else if (isPhysique) response = SCENE_2_PHYSIQUE;
    else response = SCENE_2_DIALOGUE;

    setProse(SCENE_2_PROSE + "\n\n" + response);
    setShowInput(false);
    setTimeout(() => { setScene(3); setProse(SCENE_3_PROSE); setShowInput(true); }, 3000);
  }

  function handleScene3(txt) {
    const type = classifyAction(txt);
    setScene3Type(type);
    setProse(SCENE_3_PROSE + "\n\n" + SCENE_3_RESULTS[type]);
    setShowInput(false);
    setTimeout(() => {
      setScene(4);
      setProse(SCENE_4_RESULTS[type] + "\n\nCendreterre t'attend.");
    }, 3000);
  }

  function handleFinish() {
    onComplete({
      hasBarre,
      scene3Type,
    });
  }

  return (
    <div style={{ height: "100dvh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", overflow: "hidden", width: "100%", boxSizing: "border-box" }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", maxWidth: 620, width: "100%", margin: "0 auto", padding: "2rem 1rem 4rem", boxSizing: "border-box" }}>

        <div className="fade-in">
          <Prose text={prose} streaming={false} />
        </div>

        {showInput && scene >= 1 && scene <= 3 && (
          <div className="fade-slow">
            <TutoInput
              onSubmit={scene === 1 ? handleScene1 : scene === 2 ? handleScene2 : handleScene3}
            />
          </div>
        )}

        {scene === 4 && (
          <div style={{ textAlign: "center", marginTop: "3rem" }} className="fade-slow">
            <button type="button" onClick={handleFinish} style={{
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
