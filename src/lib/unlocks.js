import { PEUPLES, METIERS, DEBLOCAGES } from "../data/peuples.js";

export function getAvailablePeuples(cles) {
  const dispo = ["cendreux"];
  Object.entries(DEBLOCAGES.peuples).forEach(([id, required]) => {
    if (required.every(c => cles[c])) dispo.push(id);
  });
  return dispo;
}

export function getAvailableMetierIds(peupleId, cles) {
  const entries = DEBLOCAGES.metiers[peupleId] || [];
  const dispo = [];
  entries.forEach(({ cles: required, ids }) => {
    if (required.every(c => cles[c])) ids.forEach(id => dispo.push(id));
  });
  return dispo;
}

export function computeNewUnlocks(heroCles, worldClesAvant) {
  const merged = { ...worldClesAvant, ...heroCles };
  const avant  = getAvailablePeuples(worldClesAvant);
  const apres  = getAvailablePeuples(merged);
  const nouveauxPeuples = apres.filter(p => !avant.includes(p));

  const nouveauxMetiers = [];
  apres.forEach(pId => {
    const avantM = getAvailableMetierIds(pId, worldClesAvant);
    const apresM = getAvailableMetierIds(pId, merged);
    apresM.filter(m => !avantM.includes(m)).forEach(m => {
      const peuple = PEUPLES.find(p => p.id === pId);
      const metier = (METIERS[pId] || []).find(mt => mt.id === m);
      if (peuple && metier) nouveauxMetiers.push(peuple.nom + " \u00b7 " + metier.nom);
    });
  });

  return { peuples: nouveauxPeuples, metiers: nouveauxMetiers };
}
