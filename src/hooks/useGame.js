import { useState, useEffect, useRef } from "react";
import { loadHero, saveHero, delHero, loadWorld, saveWorld } from "../lib/storage.js";
import { initHero, randomHero, buildCtx, buildHint, applyFd, applyLd, buildLegacy, computeAutoCles, compressArc } from "../lib/game.js";
import { computeNewUnlocks } from "../lib/unlocks.js";
import { callLLM } from "../lib/api.js";
import { OUVERTURE_SURVIE } from "../data/narration.js";
import { PEUPLES } from "../data/peuples.js";
import { LIEUX_BASE, lieuKey } from "../data/lieux.js";

const EMPTY_WORLD = { pnj: {}, objets: {}, fils: [], lieux: {}, cles: {}, legacy: [], evt: {} };

export default function useGame() {
  const [screen, setScreen] = useState("loading");
  const [hero, setHero] = useState(null);
  const [world, setWorld] = useState(EMPTY_WORLD);
  const [deadHero, setDeadHero] = useState(null);
  const [pendingDeath, setPendingDeath] = useState(null);
  const [prose, setProse] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [going, setGoing] = useState(false);
  const [err, setErr] = useState(null);
  const [rateLimit, setRateLimit] = useState(false);
  const [pendingPeuple, setPendingPeuple] = useState(null);
  const [pendingMetier, setPendingMetier] = useState(null);

  const histRef = useRef([]);
  const heroRef = useRef(null);
  const worldRef = useRef(EMPTY_WORLD);
  const tapRef = useRef(0);

  // Initial load
  useEffect(() => {
    Promise.all([loadHero(), loadWorld()]).then(([savedHero, savedWorld]) => {
      if (savedWorld) worldRef.current = savedWorld;
      if (savedHero && savedHero.vivant) {
        heroRef.current = savedHero;
        histRef.current = savedHero.hist || [];
        setHero(savedHero);
        if ((savedHero.sceneCount || 0) > 0) {
          const dernierSnippet = (savedHero.hist || []).slice(-1)[0];
          if (dernierSnippet) {
            const txt = typeof dernierSnippet === "string" ? dernierSnippet : dernierSnippet.prose || "";
            if (txt) setProse("[ \u2026 ]\n\n" + txt + "\n\n\u2014");
          }
          setScreen("jeu");
          return;
        }
      }
      const cles = (worldRef.current.cles) || {};
      const hasCles = Object.keys(cles).some(k => cles[k]);
      const hasHero = savedHero && savedHero.vivant;
      if (!hasCles && !hasHero) {
        setScreen("premier_reve");
      } else {
        setScreen("intro");
      }
    });
  }, []);

  function handleIntro(action) {
    if (action === "reprendre" && heroRef.current) {
      setScreen("jeu");
      const snippets = histRef.current.slice(-2).map(s =>
        typeof s === "string" ? s : s.prose || ""
      ).filter(Boolean);
      if (snippets.length) {
        setProse("[ \u2026 ]\n\n" + snippets.join("\n\n[ \u2026 ]\n\n") + "\n\n\u2014");
      } else {
        setProse("Tu reprends l\u00e0 o\u00f9 tu en \u00e9tais.\n\nQu'est-ce que tu fais ?");
      }
    } else {
      setScreen("creation_peuple");
    }
  }

  function handlePremierNom(nom) {
    const peuple = PEUPLES.find(p => p.id === "cendreux");
    setPendingPeuple(peuple);
    setPendingMetier(null);
    const h = initHero(peuple, null, nom, null);
    h.clesDepart = { ...worldRef.current.cles };
    heroRef.current = h;
    histRef.current = [];
    setHero(h);
    saveHero(h);
    setErr(null); setRateLimit(false);
    setScreen("jeu");
    playScene(OUVERTURE_SURVIE, "ouverture", false);
  }

  function choisirPeuple(peuple) {
    setPendingPeuple(peuple);
    setScreen("creation_metier");
  }

  function choisirMetier(metier) {
    setPendingMetier(metier);
    setScreen("creation_nom");
  }

  async function confirmerHero(nom, genre) {
    const h = initHero(pendingPeuple, pendingMetier, nom, genre);
    h.clesDepart = { ...worldRef.current.cles };
    heroRef.current = h;
    histRef.current = [];
    setHero(h);
    await saveHero(h);
    setProse(""); setErr(null); setRateLimit(false);
    setScreen("jeu");
    playScene(OUVERTURE_SURVIE, "ouverture", false);
  }

  async function playScene(intention, label, skipHist) {
    if (going) return;
    const h = heroRef.current;
    if (!h) return;
    setGoing(true); setErr(null); setRateLimit(false);
    setProse(""); setStreaming(true);

    const intentionFinale = skipHist ? intention : buildHint(intention);
    const ctx = buildCtx(h, worldRef.current, histRef.current, intention);

    try {
      const { prose: result, data } = await callLLM(ctx, intentionFinale, chunk => {
        setProse(chunk);
      });
      setStreaming(false);
      setProse(result);

      let newHero = skipHist ? h : applyFd(h, data.fd || {});

      if (data.fd && data.fd.mort) {
        const snapshot = { prose: result.slice(0, 400), intention: intention, lieu: newHero.lieu };
        const newHist = [...histRef.current, snapshot].slice(-6);
        histRef.current = newHist;
        newHero = { ...newHero, hist: newHist, sceneCount: (h.sceneCount || 0) + 1, dernierChoix: label || intention };
        heroRef.current = newHero;
        setHero(newHero);
        await saveHero(newHero);
        setPendingDeath("mort");
        return;
      }

      if (!skipHist) {
        let newWorld = applyLd(worldRef.current, data.ld || {});
        newWorld = { ...newWorld, cles: computeAutoCles(newHero, newWorld) };
        worldRef.current = newWorld;
        setWorld(newWorld);
        await saveWorld(newWorld);
      }

      const snapshot = {
        prose: result.slice(0, 400),
        intention: skipHist ? null : intention,
        lieu: newHero.lieu,
      };
      if (data.ld?.consequences?.length) snapshot.consequences = data.ld.consequences;
      if (data.ld?.meteo) snapshot.meteo = data.ld.meteo;
      if (newHero.conditions?.length) snapshot.conditions = newHero.conditions;
      if (newHero.inventaire?.length) snapshot.inventaire = newHero.inventaire;
      if (data.ld?.pnj) {
        snapshot.pnj = Object.entries(data.ld.pnj).map(([nom, p]) =>
          nom + (p.position ? " \u2014 " + p.position : "") + (p.humeur ? " [" + p.humeur + "]" : "")
        );
      }

      let newHist = skipHist ? histRef.current : [...histRef.current, snapshot];

      // Compression d'arc : quand l'historique d\u00e9passe 8, compresser les plus anciens
      if (newHist.length > 8) {
        const toCompress = newHist.slice(0, newHist.length - 6);
        const sceneStart = Math.max(0, (newHero.sceneCount || 0) - newHist.length);
        const arc = compressArc(toCompress, sceneStart);
        if (arc) {
          newHero = { ...newHero, arcs: [...(newHero.arcs || []), arc].slice(-5) };
        }
        newHist = newHist.slice(-6);
      }

      histRef.current = newHist;

      newHero = {
        ...newHero,
        hist: newHist,
        sceneCount: skipHist ? h.sceneCount : (h.sceneCount || 0) + 1,
        dernierChoix: label || intention,
      };
      heroRef.current = newHero;
      setHero(newHero);
      await saveHero(newHero);

    } catch (e) {
      setStreaming(false);
      if (e.message === "RATE_LIMIT") setRateLimit(true);
      else setErr(e.message);
    } finally {
      setGoing(false);
    }
  }

  async function handleEndReve(type) {
    const h = heroRef.current;
    if (!h) return;

    const worldClesAvant = h.clesDepart || {};
    const nouveaux = computeNewUnlocks(worldRef.current.cles, worldClesAvant);

    const legacy = buildLegacy(h);
    legacy.statut = type === "mort" ? "mort" : "vivant_quelque_part";
    legacy.nouveauxDeblocages = nouveaux;

    const newWorld = { ...worldRef.current, legacy: [...(worldRef.current.legacy || []), legacy] };
    worldRef.current = newWorld;
    setWorld(newWorld);
    await saveWorld(newWorld);
    await delHero();
    heroRef.current = null;
    histRef.current = [];

    setHero(null);
    setPendingDeath(null);
    setDeadHero({ ...h, statut: legacy.statut, nouveauxDeblocages: nouveaux });
  }

  async function reset() {
    tapRef.current++;
    if (tapRef.current < 3) return;
    tapRef.current = 0;
    await delHero();
    heroRef.current = null;
    histRef.current = [];
    worldRef.current = { ...EMPTY_WORLD };
    setHero(null); setProse(""); setErr(null); setRateLimit(false);
    setPendingPeuple(null); setPendingMetier(null);
    setScreen("premier_reve");
  }

  return {
    // State
    screen, hero, world, deadHero, pendingDeath,
    prose, streaming, going, err, rateLimit,
    pendingPeuple, pendingMetier,
    worldRef,

    // Actions
    handleIntro,
    handlePremierNom,
    choisirPeuple,
    choisirMetier,
    confirmerHero,
    playScene,
    handleEndReve,
    reset,

    // UI actions
    setScreen,
    setPendingDeath,
    setDeadHero,
    setProse,
  };
}
