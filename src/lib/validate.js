import { LIEUX_BASE, lieuKey } from "../data/lieux.js";

const MOMENTS_VALIDES = ["aube", "matin", "midi", "apres-midi", "soir", "nuit"];

export function validateFd(fd) {
  if (!fd || typeof fd !== "object") return {};
  const clean = {};

  // moment
  if (fd.moment && typeof fd.moment === "string") {
    const m = fd.moment.toLowerCase().trim().replace(/\u00e8/g, "e").replace(/[-\s]+/g, "-");
    if (MOMENTS_VALIDES.includes(m)) clean.moment = fd.moment;
  }

  // jours_ecoules
  if (fd.jours_ecoules && typeof fd.jours_ecoules === "number" && fd.jours_ecoules > 0 && fd.jours_ecoules <= 30) {
    clean.jours_ecoules = Math.floor(fd.jours_ecoules);
  }

  // lieu — doit exister dans LIEUX_BASE
  if (fd.lieu && typeof fd.lieu === "string") {
    const key = lieuKey(fd.lieu);
    if (LIEUX_BASE[key]) {
      clean.lieu = fd.lieu;
    }
  }

  // conditions
  if (fd.conditions_add && Array.isArray(fd.conditions_add)) {
    clean.conditions_add = fd.conditions_add.filter(c => typeof c === "string" && c.length < 100);
  }
  if (fd.conditions_del && Array.isArray(fd.conditions_del)) {
    clean.conditions_del = fd.conditions_del.filter(c => typeof c === "string");
  }
  if (fd.conditions_replace && typeof fd.conditions_replace === "object" && !Array.isArray(fd.conditions_replace)) {
    const cr = {};
    Object.entries(fd.conditions_replace).forEach(([k, v]) => {
      if (typeof k === "string" && typeof v === "string" && v.length < 100) cr[k] = v;
    });
    if (Object.keys(cr).length) clean.conditions_replace = cr;
  }

  // traits
  if (fd.traits_add && Array.isArray(fd.traits_add)) {
    clean.traits_add = fd.traits_add.filter(t => typeof t === "string" && t.length < 100).slice(0, 3);
  }

  // inventaire
  if (fd.inventaire_add && Array.isArray(fd.inventaire_add)) {
    clean.inventaire_add = fd.inventaire_add.filter(o => typeof o === "string" && o.length < 80).slice(0, 5);
  }
  if (fd.inventaire_del && Array.isArray(fd.inventaire_del)) {
    clean.inventaire_del = fd.inventaire_del.filter(o => typeof o === "string");
  }

  // mort
  if (fd.mort === true) clean.mort = true;

  return clean;
}

export function validateLd(ld) {
  if (!ld || typeof ld !== "object") return {};
  const clean = {};

  // pnj
  if (ld.pnj && typeof ld.pnj === "object" && !Array.isArray(ld.pnj)) {
    const pnj = {};
    Object.entries(ld.pnj).forEach(([nom, data]) => {
      if (typeof nom !== "string" || typeof data !== "object" || Array.isArray(data)) return;
      const p = {};
      if (data.description && typeof data.description === "string") p.description = data.description.slice(0, 200);
      if (data.genre && typeof data.genre === "string") p.genre = data.genre;
      if (data.statut && typeof data.statut === "string") p.statut = data.statut;
      if (data.position && typeof data.position === "string") p.position = data.position;
      if (data.humeur && typeof data.humeur === "string") p.humeur = data.humeur;
      pnj[nom.slice(0, 50)] = p;
    });
    if (Object.keys(pnj).length) clean.pnj = pnj;
  }

  // objets
  if (ld.objets && typeof ld.objets === "object" && !Array.isArray(ld.objets)) {
    const objets = {};
    Object.entries(ld.objets).forEach(([id, data]) => {
      if (typeof id !== "string" || typeof data !== "object") return;
      const o = {};
      if (data.description && typeof data.description === "string") o.description = data.description.slice(0, 200);
      if (data.etat && typeof data.etat === "string") o.etat = data.etat;
      if (data.lieu && typeof data.lieu === "string") o.lieu = data.lieu;
      objets[id.slice(0, 50)] = o;
    });
    if (Object.keys(objets).length) clean.objets = objets;
  }

  // lieux
  if (ld.lieux && typeof ld.lieux === "object" && !Array.isArray(ld.lieux)) {
    const lieux = {};
    Object.entries(ld.lieux).forEach(([key, val]) => {
      if (typeof key !== "string" || typeof val !== "object") return;
      const l = {};
      if (val.scene_state && Array.isArray(val.scene_state)) l.scene_state = val.scene_state.filter(s => typeof s === "string").slice(0, 8);
      if (val.courants && Array.isArray(val.courants)) l.courants = val.courants.filter(s => typeof s === "string").slice(0, 5);
      if (val.persistant && typeof val.persistant === "string") l.persistant = val.persistant;
      lieux[key] = l;
    });
    if (Object.keys(lieux).length) clean.lieux = lieux;
  }

  // cles
  if (ld.cles && typeof ld.cles === "object" && !Array.isArray(ld.cles)) {
    const cles = {};
    Object.entries(ld.cles).forEach(([k, v]) => {
      if (typeof k === "string" && v === true) cles[k] = true;
    });
    if (Object.keys(cles).length) clean.cles = cles;
  }

  // consequences
  if (ld.consequences && Array.isArray(ld.consequences)) {
    clean.consequences = ld.consequences.filter(s => typeof s === "string").slice(0, 8);
  }

  // meteo
  if (ld.meteo && typeof ld.meteo === "string") {
    clean.meteo = ld.meteo.slice(0, 100);
  }

  // journal
  const JOURNAL_CATEGORIES = ["lieux", "peuples", "pnj", "creatures", "magie", "faune_flore", "monde"];
  if (ld.journal && typeof ld.journal === "object" && !Array.isArray(ld.journal)) {
    const journal = {};
    Object.entries(ld.journal).forEach(([cat, entries]) => {
      if (!JOURNAL_CATEGORIES.includes(cat)) return;
      if (typeof entries !== "object" || Array.isArray(entries)) return;
      const cleanEntries = {};
      Object.entries(entries).forEach(([id, fragment]) => {
        if (typeof id === "string" && typeof fragment === "string" && fragment.length < 200) {
          cleanEntries[id.slice(0, 50)] = fragment;
        }
      });
      if (Object.keys(cleanEntries).length) journal[cat] = cleanEntries;
    });
    if (Object.keys(journal).length) clean.journal = journal;
  }

  return clean;
}
