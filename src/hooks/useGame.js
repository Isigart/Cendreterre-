import { useState, useEffect, useRef } from "react";
import { loadHero, loadHeroes, saveHero, saveHeroes, delHero, loadWorld, saveWorld, getPlayerCode, setPlayerCode, loadFromServer, getActiveHeroId, setActiveHeroId } from "../lib/storage.js";
import { initHero, randomHero, buildCtx, buildHint, applyFd, applyLd, applyTime, applyInactiveTime, buildLegacy, computeAutoCles, compressArc } from "../lib/game.js";
import { computeNewUnlocks } from "../lib/unlocks.js";
import { callLLM } from "../lib/api.js";
import { validateFd, validateLd } from "../lib/validate.js";
import { OUVERTURE_SURVIE } from "../data/narration.js";
import { PEUPLES } from "../data/peuples.js";
import { LIEUX_BASE, lieuKey } from "../data/lieux.js";

const EMPTY_WORLD = { pnj: {}, objets: {}, fils: [], lieux: {}, cles: {}, legacy: [], evt: {} };

function buildResumeProse(hero) {
  const parts = [];
  parts.push("Le r\u00eave reprend.\n");

  // O\u00f9 et quand
  parts.push("Tu es \u00e0 " + (hero.lieu || "quelque part") + ". Jour " + (hero.jour || 1) + ", " + (hero.moment || "matin") + ".");

  // Conditions actives
  const conds = hero.conditions || [];
  if (conds.length) {
    parts.push("Tu ressens : " + conds.join(", ") + ".");
  }

  // Inventaire
  const inv = hero.inventaire || [];
  if (inv.length) {
    parts.push("Sur toi : " + inv.join(", ") + ".");
  }

  // Dernier souvenir
  const hist = hero.hist || [];
  const dernier = hist.slice(-1)[0];
  if (dernier) {
    let txt = "";
    if (typeof dernier === "string") {
      txt = dernier;
    } else if (dernier && typeof dernier === "object") {
      txt = dernier.prose || dernier.intention || "";
    }
    if (txt && typeof txt === "string" && txt.length > 0) {
      parts.push("\nDernier souvenir \u2014 " + txt);
    }
  }

  parts.push("\n\u2014");
  return parts.join("\n");
}

export default function useGame() {
  const [screen, setScreen] = useState("loading");
  const [hero, setHero] = useState(null);
  const [heroes, setHeroes] = useState([]);
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
  const lastProseRef = useRef(null);
  const tapRef = useRef(0);

  // Initial load
  useEffect(() => {
    const code = getPlayerCode();
    if (!code) {
      setScreen("code");
      return;
    }
    initFromStorage();
  }, []);

  async function initFromStorage() {
    let [savedHeroes, savedWorld] = await Promise.all([loadHeroes(), loadWorld()]);

    // Compat ancien format mono-h\u00e9ros
    if ((!savedHeroes || !savedHeroes.length)) {
      const oldHero = await loadHero();
      if (oldHero) {
        if (!oldHero.id) oldHero.id = "hero_" + Date.now();
        savedHeroes = [oldHero];
      }
    }

    // Si localStorage vide mais code pr\u00e9sent, essayer le serveur
    if ((!savedHeroes || !savedHeroes.length) && !savedWorld) {
      const code = getPlayerCode();
      if (code) {
        const serverData = await loadFromServer(code);
        if (serverData) {
          if (Array.isArray(serverData.hero)) savedHeroes = serverData.hero;
          else if (serverData.hero) savedHeroes = [serverData.hero];
          savedWorld = serverData.world;
        }
      }
    }

    if (savedWorld) {
      // Init temps sur le world si absent
      if (!savedWorld.jour) savedWorld.jour = 1;
      if (!savedWorld.moment) savedWorld.moment = "matin";
      worldRef.current = savedWorld;
    }

    const livingHeroes = (savedHeroes || []).filter(h => h.vivant);
    setHeroes(livingHeroes);

    // Reprendre le h\u00e9ros actif
    const activeId = getActiveHeroId();
    const activeHero = livingHeroes.find(h => h.id === activeId) || livingHeroes[0];

    if (activeHero) {
      heroRef.current = activeHero;
      histRef.current = activeHero.hist || [];
      setHero(activeHero);
      if ((activeHero.sceneCount || 0) > 0) {
        setProse(buildResumeProse(activeHero));
        setScreen("jeu");
        return;
      }
    }
    const cles = (worldRef.current.cles) || {};
    const hasCles = Object.keys(cles).some(k => cles[k]);
    const hasHeroes = livingHeroes.length > 0;
    if (!hasCles && !hasHeroes) {
      setScreen("premier_reve");
    } else {
      setScreen("intro");
    }
  }

  function handleCode(code) {
    setPlayerCode(code);
    initFromStorage();
  }

  function handleIntro(action) {
    if (action === "reprendre" && heroRef.current) {
      setScreen("jeu");
      setProse(buildResumeProse(heroRef.current));
    } else {
      setScreen("creation_peuple");
    }
  }

  function handlePremierNom(nom) {
    const peuple = PEUPLES.find(p => p.id === "cendreux");
    setPendingPeuple(peuple);
    setPendingMetier(null);
    const h = initHero(peuple, null, nom, null);
    h.id = "hero_" + Date.now();
    h.clesDepart = { ...worldRef.current.cles };
    h.lastActiveJour = worldRef.current.jour || 1;
    // Init world time si premier h\u00e9ros
    if (!worldRef.current.jour) {
      worldRef.current = { ...worldRef.current, jour: 1, moment: "matin" };
    }
    heroRef.current = h;
    histRef.current = [];
    setHero(h);
    setHeroes(prev => [...prev, h]);
    saveHero(h);
    saveWorld(worldRef.current);
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
    const allHeroes = await loadHeroes();
    if (allHeroes.filter(h => h.vivant).length >= 3) {
      setErr("Maximum 3 r\u00eaveurs en parall\u00e8le.");
      return;
    }
    const h = initHero(pendingPeuple, pendingMetier, nom, genre);
    h.id = "hero_" + Date.now();
    h.clesDepart = { ...worldRef.current.cles };
    h.lastActiveJour = worldRef.current.jour || 1;
    heroRef.current = h;
    histRef.current = [];
    setHero(h);
    setHeroes(prev => [...prev, h]);
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
      }, lastProseRef.current);
      setStreaming(false);
      setProse(result);
      lastProseRef.current = result;

      // Valider les donn\u00e9es avant de les appliquer
      const fd = validateFd(data.fd || {});
      const ld = validateLd(data.ld || {});

      let newHero = skipHist ? h : applyFd(h, fd);

      if (fd.mort) {
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
        let newWorld = applyLd(worldRef.current, ld);
        newWorld = applyTime(newWorld, fd);
        newWorld = { ...newWorld, cles: computeAutoCles(newHero, newWorld) };
        newHero.lastActiveJour = newWorld.jour;
        worldRef.current = newWorld;
        setWorld(newWorld);
        await saveWorld(newWorld);
      }

      const snapshot = {
        prose: result.slice(0, 400),
        intention: skipHist ? null : intention,
        lieu: newHero.lieu,
      };
      if (ld.consequences?.length) snapshot.consequences = ld.consequences;
      if (ld.meteo) snapshot.meteo = ld.meteo;
      if (newHero.conditions?.length) snapshot.conditions = newHero.conditions;
      if (newHero.inventaire?.length) snapshot.inventaire = newHero.inventaire;
      if (ld.pnj) {
        snapshot.pnj = Object.entries(ld.pnj).map(([nom, p]) =>
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

  async function switchHero(heroId) {
    // Sauvegarder le h\u00e9ros actuel
    if (heroRef.current) {
      heroRef.current.lastActiveJour = worldRef.current.jour || 1;
      await saveHero(heroRef.current);
    }

    // Charger le h\u00e9ros cible
    const allHeroes = await loadHeroes();
    const target = allHeroes.find(h => h.id === heroId);
    if (!target || !target.vivant) return;

    // Appliquer le temps \u00e9coul\u00e9 pendant l'inactivit\u00e9
    const joursEcoules = (worldRef.current.jour || 1) - (target.lastActiveJour || 1);
    const updated = applyInactiveTime(target, joursEcoules);
    updated.lastActiveJour = worldRef.current.jour || 1;

    heroRef.current = updated;
    histRef.current = updated.hist || [];
    lastProseRef.current = null;
    setHero(updated);
    setActiveHeroId(heroId);
    await saveHero(updated);

    setProse(buildResumeProse(updated));
    setPendingDeath(null);
    setDeadHero(null);
    setErr(null);
    setRateLimit(false);
    setScreen("jeu");
  }

  async function handleEndReve(type) {
    const h = heroRef.current;
    if (!h) return;

    const worldClesAvant = h.clesDepart || {};
    const nouveaux = computeNewUnlocks(worldRef.current.cles, worldClesAvant);

    const legacy = buildLegacy(h, worldRef.current);
    legacy.statut = type === "mort" ? "mort" : "vivant_quelque_part";
    legacy.nouveauxDeblocages = nouveaux;

    const newWorld = { ...worldRef.current, legacy: [...(worldRef.current.legacy || []), legacy] };
    worldRef.current = newWorld;
    setWorld(newWorld);
    await saveWorld(newWorld);
    await delHero(h.id);
    heroRef.current = null;
    histRef.current = [];
    lastProseRef.current = null;

    // Mettre \u00e0 jour la liste des h\u00e9ros vivants
    const remaining = heroes.filter(x => x.id !== h.id);
    setHeroes(remaining);

    setHero(null);
    setPendingDeath(null);
    setDeadHero({ ...h, statut: legacy.statut, nouveauxDeblocages: nouveaux, remainingHeroes: remaining });
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
    screen, hero, heroes, world, deadHero, pendingDeath,
    prose, streaming, going, err, rateLimit,
    pendingPeuple, pendingMetier,
    worldRef,

    // Actions
    handleCode,
    handleIntro,
    switchHero,
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
