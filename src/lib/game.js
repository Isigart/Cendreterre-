import { LIEUX_BASE, PHYSIQUE_PEUPLES, lieuKey, getDistances } from "../data/lieux.js";
import { PROFIL_DIRECTIVE, profilNarratif } from "../data/narration.js";
import { PEUPLES, METIERS } from "../data/peuples.js";
import { randomPrenom } from "../data/prenoms.js";

export function initHero(peuple, metier, nom, genre) {
  const lieu = peuple.lieu[Math.floor(Math.random() * peuple.lieu.length)];
  return {
    nom,
    genre: genre || null,
    peuple: { id: peuple.id, nom: peuple.nom, desc: peuple.desc },
    metier: metier ? { id: metier.id, nom: metier.nom, desc: metier.desc } : null,
    magie: peuple.magie,
    lieu,
    lieuxVisites: [lieuKey(lieu)],
    traits: {
      public:  [],
      stats:   metier ? [metier.desc] : [],
      acquis:  [],
    },
    hist:         [],
    vivant:       true,
    sceneCount:   0,
    dernierChoix: null,
  };
}

export function randomHero() {
  const peuple  = PEUPLES[Math.floor(Math.random() * PEUPLES.length)];
  const metiers = METIERS[peuple.id] || [];
  const metier  = metiers[Math.floor(Math.random() * metiers.length)];
  const genre   = ["M", "F", "N"][Math.floor(Math.random() * 3)];
  const nom     = randomPrenom(genre);
  return initHero(peuple, metier, nom, genre);
}

export function buildCtx(hero, world, hist) {
  const key    = lieuKey(hero.lieu);
  const region = LIEUX_BASE[key] || null;
  const profil = profilNarratif(world);
  const parts  = [];

  parts.push("H\u00c9ROS");
  parts.push("nom=" + hero.nom);
  parts.push("peuple=" + hero.peuple.nom + (PHYSIQUE_PEUPLES[hero.peuple.id] ? " \u2014 " + PHYSIQUE_PEUPLES[hero.peuple.id] : ""));
  if (hero.metier) {
    parts.push("metier=" + hero.metier.nom + " \u2014 " + hero.metier.desc);
  } else {
    parts.push("metier=inconnu \u2014 \u00e9tranger au monde. Il a l'apparence d'un " + hero.peuple.nom + " mais ignore tout de ce monde : flore, faune, magie, institutions, factions. Il reconna\u00eet ce qu'un humain ordinaire reconna\u00eet. Rien de local. Son m\u00e9tier \u00e9mergera du jeu.");
  }
  parts.push("magie=" + hero.magie + (hero.metier ? "" : " \u2014 existe mais le h\u00e9ros ne sait pas s'en servir"));
  parts.push("lieu_actuel=" + hero.lieu + " \u2014 le h\u00e9ros y est, ne pas d\u00e9placer sans intention explicite");
  parts.push("scene=" + (hero.sceneCount || 0));
  if (hero.physique) parts.push("physique=" + hero.physique);
  if (hero.humeur)   parts.push("humeur=" + hero.humeur);
  if (hero.inventaire && hero.inventaire.length)
    parts.push("inventaire=[" + hero.inventaire.join(", ") + "]");
  if (hero.traits.acquis && hero.traits.acquis.length)
    parts.push("acquis=[" + hero.traits.acquis.join(", ") + "]");

  parts.push("");
  parts.push("MONDE");
  parts.push("profil=" + profil);
  parts.push("directive=[" + (PROFIL_DIRECTIVE[profil] || "") + "]");
  if (world.meteo) parts.push("meteo=" + world.meteo);

  const consequences = world.consequences || [];
  if (consequences.length) parts.push("memoire_monde=[" + consequences.join(" | ") + "]");

  // PNJ: prioritize those in same location, then most recent
  const pnj = world.pnj || {};
  const pnjEntries = Object.entries(pnj);
  const pnjIci = pnjEntries.filter(([, p]) => p.position && lieuKey(p.position) === key);
  const pnjAutres = pnjEntries.filter(([, p]) => !p.position || lieuKey(p.position) !== key);
  const pnjKeys = [...pnjIci.map(([n]) => n), ...pnjAutres.slice(-4).map(([n]) => n)].slice(0, 10);
  if (pnjKeys.length) {
    const pnjStr = pnjKeys.map(n => {
      const p = pnj[n];
      let s = n;
      if (p.genre)       s += " (" + p.genre + ")";
      if (p.statut)      s += " [" + p.statut + "]";
      if (p.description) s += " \u2014 " + p.description;
      if (p.position)    s += " / " + p.position;
      if (p.humeur)      s += " {" + p.humeur + "}";
      return s;
    }).join(" | ");
    parts.push("pnj_connus=[" + pnjStr + "]");
  }

  const objets = world.objets || {};
  const objetsLieu = Object.entries(objets)
    .filter(([, o]) => !o.lieu || lieuKey(o.lieu) === key)
    .slice(0, 5)
    .map(([id, o]) => {
      let s = id.replace(/_/g, " ");
      if (o.description) s += " \u2014 " + o.description;
      if (o.etat && o.etat !== "actif") s += " [" + o.etat + "]";
      return s;
    });
  if (objetsLieu.length) parts.push("objets=[" + objetsLieu.join(" | ") + "]");

  const dists = getDistances(hero.lieu);
  if (dists) parts.push("distances=[" + dists + "]");

  const fils = (world.fils || []).slice(-4);
  if (fils.length) parts.push("en_suspens=[" + fils.join(" | ") + "]");

  if (region) {
    parts.push("");
    parts.push("R\u00c9GION " + hero.lieu.toUpperCase());
    parts.push("physique=[" + region.physique + "]");
    parts.push("ambiance=[" + region.ambiance + "]");
    parts.push("danger=[" + region.danger + "]");
  }

  const lieuData = (world.lieux || {})[key];
  if (lieuData) {
    if (lieuData.persistants && lieuData.persistants.length)
      parts.push("persistants=[" + lieuData.persistants.join(" | ") + "]");
    if (lieuData.courants && lieuData.courants.length)
      parts.push("courants=[" + lieuData.courants.join(" | ") + "]");
    if (lieuData.scene_state && lieuData.scene_state.length) {
      parts.push("");
      parts.push("ESPACE \u2014 positions et orientations dans la sc\u00e8ne courante");
      lieuData.scene_state.forEach(s => parts.push(s));
    }
  }

  parts.push("");
  parts.push("HISTORIQUE");

  if (!hist.length) {
    parts.push("premi\u00e8re sc\u00e8ne");
  } else {
    hist.slice(-6).forEach((s, i, arr) => {
      const age = arr.length - 1 - i;
      if (typeof s === "string") { parts.push("\u2014 " + s); return; }
      if (age === 0) {
        const lines = ["SC\u00c8NE PR\u00c9C\u00c9DENTE"];
        if (s.intention)    lines.push("intention_joueur=" + s.intention);
        if (s.prose)        lines.push("prose=" + s.prose);
        if (s.lieu)         lines.push("lieu=" + s.lieu);
        if (s.meteo)        lines.push("meteo=" + s.meteo);
        if (s.physique)     lines.push("physique_hero=" + s.physique);
        if (s.humeur)       lines.push("humeur_hero=" + s.humeur);
        if (s.inventaire?.length) lines.push("inventaire=[" + s.inventaire.join(", ") + "]");
        if (s.pnj?.length)  lines.push("pnj_presents=[" + s.pnj.join(" | ") + "]");
        if (s.consequences?.length) lines.push("consequences=[" + s.consequences.join(" | ") + "]");
        parts.push(lines.join("\n"));
      } else if (age <= 2) {
        const lines = [];
        if (s.intention) lines.push("[" + s.intention + "]");
        if (s.prose) lines.push(s.prose);
        if (s.lieu)  lines.push("@" + s.lieu);
        if (s.consequences?.length) lines.push("=> " + s.consequences.join(" | "));
        parts.push("\u2014 " + lines.join(" \u00b7 "));
      } else {
        const lines = [];
        if (s.intention) lines.push("[" + s.intention + "]");
        lines.push(s.prose || s);
        parts.push("\u2014 " + lines.join(" \u00b7 "));
      }
    });
  }

  return parts.filter(s => s !== null && s !== undefined).join("\n");
}

export function buildHint(txt) {
  const t = txt.toLowerCase();

  if (/partir|voyage|route|rejoindre|me rendre|aller \u00e0|aller a|se diriger|traverser|marcher vers|quitter|fuir vers/.test(t))
    return "[VOYAGE] " + txt + "\n\u2192 Joue l'arc complet du voyage. Les distances sont dans le CTX (distances=[...]). Calibre la dur\u00e9e et les \u00e9v\u00e9nements en cons\u00e9quence. Les \u00e9v\u00e9nements ordinaires passent dans la prose sans s'arr\u00eater. Tu t'arr\u00eates uniquement si quelque chose de critique \u00e9merge \u2014 un choix r\u00e9el, un danger, une information qui change tout. Sinon on arrive \u00e0 destination.";

  if (/attaquer|frapper|tirer|combattre|se battre|assommer|d\u00e9gainer|charger|foncer sur|affronter/.test(t))
    return "[COMBAT] " + txt + "\n\u2192 Joue jusqu'\u00e0 r\u00e9solution claire \u2014 victoire, d\u00e9faite, fuite, impasse. Pas s'arr\u00eater \u00e0 chaque coup. S'arr\u00eater si un choix moral ou une bifurcation r\u00e9elle \u00e9merge.";

  if (/fouiller|explorer|inspecter|chercher dans|scruter|parcourir|passer au peigne/.test(t))
    return "[EXPLORATION] " + txt + "\n\u2192 Joue la d\u00e9couverte jusqu'au bout. Le joueur cherche \u2014 il doit trouver quelque chose de concret et d'utilisable, pas une description d'ambiance. Un objet, une information, une voie, une personne. S'arr\u00eater une fois la trouvaille faite ou si un danger \u00e9merge.";

  if (/surveiller|guetter|observer|\u00e9pier|suivre|filer|faire le guet|tenir \u00e0 l'oeil/.test(t))
    return "[SURVEILLANCE] " + txt + "\n\u2192 Joue ce que le h\u00e9ros observe pendant qu'il attend. S'arr\u00eater quand ce qu'il attendait se produit, ou quand quelque chose d'inattendu change la donne.";

  if (/attendre|se reposer|passer la nuit|dormir|camper|bivouaquer|faire une pause|laisser passer/.test(t))
    return "[ATTENTE] " + txt + "\n\u2192 Joue le temps qui passe avec ce qu'il apporte. Les \u00e9v\u00e9nements mineurs passent dans la prose. S'arr\u00eater si quelque chose interrompt ou si le temps demand\u00e9 est \u00e9coul\u00e9.";

  if (/parler \u00e0|dire \u00e0|demander \u00e0|s'adresser \u00e0|expliquer \u00e0|raconter \u00e0|convaincre|n\u00e9gocier|negocier|persuader|marchander|interroger|soutirer|aborder|interpeller/.test(t))
    return "[DISCOURS] " + txt + "\n\u2192 Joue la conversation jusqu'\u00e0 une r\u00e9ponse naturelle \u2014 accord, refus, fuite, r\u00e9v\u00e9lation. Pas couper au milieu d'un \u00e9change. Les gens ordinaires r\u00e9pondent de fa\u00e7on ordinaire.";

  return txt;
}

export function applyFd(hero, fd) {
  if (!fd || !Object.keys(fd).length) return hero;
  const next = { ...hero };

  if (fd.traits_add && fd.traits_add.length) {
    const acquis = [...(hero.traits.acquis || [])];
    fd.traits_add.forEach(t => { if (!acquis.includes(t)) acquis.push(t); });
    next.traits = { ...hero.traits, acquis };
  }

  if (fd.humeur)   next.humeur = fd.humeur;
  if (fd.physique)  next.physique = fd.physique;

  if (fd.inventaire_add && fd.inventaire_add.length) {
    const inv = [...(hero.inventaire || [])];
    fd.inventaire_add.forEach(o => { if (!inv.includes(o)) inv.push(o); });
    next.inventaire = inv.slice(-10);
  }
  if (fd.inventaire_del && fd.inventaire_del.length) {
    next.inventaire = (next.inventaire || hero.inventaire || [])
      .filter(o => !fd.inventaire_del.includes(o));
  }

  if (fd.lieu) {
    next.lieu = fd.lieu;
    const visited = new Set(hero.lieuxVisites || []);
    visited.add(lieuKey(fd.lieu));
    next.lieuxVisites = [...visited];
  }
  if (fd.mort) next.vivant = false;

  return next;
}

export function computeAutoCles(hero, world) {
  const cles = { ...(world.cles || {}) };
  const visited = hero.lieuxVisites || [];

  if (visited.length >= 2 && !cles.voyage_region_2) cles.voyage_region_2 = true;
  if (visited.length >= 3 && !cles.voyage_region_3) cles.voyage_region_3 = true;

  return cles;
}

export function applyLd(world, ld) {
  if (!ld || !Object.keys(ld).length) return world;
  const next = { ...world };

  if (ld.pnj && typeof ld.pnj === "object") {
    const pnj = { ...(world.pnj || {}) };
    Object.entries(ld.pnj).forEach(([nom, inc]) => {
      const ex = pnj[nom];
      if (ex) {
        pnj[nom] = { ...ex, ...inc, description: ex.description || inc.description || null, genre: ex.genre || inc.genre || null };
      } else {
        pnj[nom] = inc;
      }
    });
    next.pnj = pnj;
  }

  if (ld.objets && typeof ld.objets === "object") {
    const objets = { ...(world.objets || {}) };
    Object.entries(ld.objets).forEach(([id, inc]) => {
      const ex = objets[id];
      if (ex) {
        objets[id] = { ...ex, ...inc, description: ex.description || inc.description || null };
      } else {
        objets[id] = inc;
      }
    });
    next.objets = objets;
  }

  if (ld.lieux && typeof ld.lieux === "object") {
    const lieux = { ...(world.lieux || {}) };
    Object.entries(ld.lieux).forEach(([key, val]) => {
      const ex = lieux[key] || { persistants: [], courants: [], scene_state: [] };
      if (val.courants)    ex.courants    = val.courants.slice(0, 5);
      if (val.persistant)  ex.persistants = [...(ex.persistants || []), val.persistant].slice(-3);
      if (val.scene_state) ex.scene_state = val.scene_state.slice(0, 6);
      lieux[key] = ex;
    });
    next.lieux = lieux;
  }

  if (ld.cles && typeof ld.cles === "object") {
    const cles = { ...(world.cles || {}) };
    Object.entries(ld.cles).forEach(([k, v]) => { if (v) cles[k] = true; });
    next.cles = cles;
  }

  if (ld.en_suspens && ld.en_suspens.length)
    next.fils = [...(world.fils || []), ...ld.en_suspens].slice(-10);

  if (ld.consequences && ld.consequences.length)
    next.consequences = ld.consequences.slice(-5);

  if (ld.meteo) next.meteo = ld.meteo;

  if (ld.evt)
    next.evt = { ...(world.evt || {}), ["evt_" + Date.now()]: ld.evt };

  return next;
}

export function buildLegacy(hero) {
  return {
    nom:    hero.nom,
    peuple: hero.peuple?.nom || "?",
    metier: hero.metier?.nom || "?",
    lieu:   hero.lieu || "Cendreterre",
    scenes: hero.sceneCount || 0,
  };
}
