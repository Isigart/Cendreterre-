// ============================================================
// ARCS NARRATIFS & CL\u00c9S — inject\u00e9s dans le contexte selon profil/lieu
// ============================================================

const ARCS_BASE = [
  "Famine : conditions affam\u00e9 longtemps + pas de ressource",
  "Temp\u00eate : voyage + m\u00e9t\u00e9o qui empire",
  "Blessure grave : apr\u00e8s combat \u2014 chercher soin",
  "Perdu : for\u00eat/marais/montagne sans guide",
  "Hospitalit\u00e9 : h\u00e9ros affam\u00e9/bless\u00e9 + village \u2192 quelqu'un aide",
  "Beaut\u00e9 du monde : voyage + aube/soir \u2192 contemplation",
  "Rumeur utile : auberge/march\u00e9 \u2192 info pr\u00e9cieuse",
  "Solidarit\u00e9 discr\u00e8te : territoire occup\u00e9 \u2192 un Cendreux aide",
  "Ruines/donjon : lieu isol\u00e9 + explore",
  "R\u00e9putation : h\u00e9ros connu (5+ sc\u00e8nes) \u2192 PNJ r\u00e9agissent",
  "Mentor : PNJ alli\u00e9 + h\u00e9ros apprend",
  "Rivalit\u00e9 : PNJ ennemi r\u00e9current",
  "Dilemme moral : 2 alli\u00e9s en conflit",
  "H\u00e9ritage : legacy existe + m\u00eame lieu",
];

const ARCS_VOYAGE = [
  "Embuscade : recherch\u00e9 ou transport valeur",
  "Convoi : rencontre marchands/voyageurs",
  "Caravane Foulard : croise une caravane",
  "Compagnon de route : un voyageur marche avec toi",
  "Route coup\u00e9e : troupes, inondation",
];

const ARCS_OCCUPATION = [
  "Contr\u00f4le imp\u00e9rial : Marceins/Cols sans papiers",
  "Rafle : Hautcendre + tension \u00e9lev\u00e9e",
  "Si\u00e8ge : ville + conflit accumul\u00e9",
  "Proc\u00e8s : h\u00e9ros arr\u00eat\u00e9",
  "Recrutement r\u00e9sistance : loyaut\u00e9 prouv\u00e9e \u00e0 Ramasse",
  "Mission r\u00e9sistance : recrut\u00e9 + cl\u00e9 resistance_contactee",
  "Trahison : PNJ alli\u00e9 travaille pour l'empire",
  "\u00c9vasion : h\u00e9ros prisonnier",
];

const ARCS_FACTIONS = {
  sonneur:   ["Initiation Sonneuse : Puits + confiance", "Chant des profondeurs : nuit \u2192 un chant monte"],
  sylvain:   ["\u00c9preuve Sylvaine : Val des Brumes + mission", "La for\u00eat accepte : intention paisible \u2192 montre quelque chose"],
  agritan:   ["\u00c9preuve Agritan : Hauts Plateaux + d\u00e9fi", "C\u00e9r\u00e9monie tatouage : v\u00e9cu vrai valid\u00e9", "Conflit inter-tribus : 2 tribus en d\u00e9saccord"],
  foulard:   ["Service Foulard : dette ou \u00e9change", "La tortue s'arr\u00eate : Crois\u00e9e se forme/d\u00e9monte", "Dette : service accept\u00e9 \u2192 remboursement"],
  ratainien: ["F\u00eate / march\u00e9 : lieu peupl\u00e9 + bon timing"],
};

const ARCS_CREATURES = [
  "Rencontre cr\u00e9ature : nuit + lieu isol\u00e9",
  "Le Marcheur passe : nuit + route",
  "Vouivre \u00e9veill\u00e9e : galeries Sonneuses + perturbation",
  "Traces d'Oubli\u00e9 : Val des Brumes + arbre sacr\u00e9 (confirm\u00e9+)",
  "Grand Corbeau : lieu isol\u00e9 + pas de Ratainien (confirm\u00e9+)",
  "Les Forg\u00e9s : Hauts Plateaux + nuit + Agritan corrompu",
];

const ARCS_MONDIAUX = [
  "Passage de troupes : route imp\u00e9riale + jours avanc\u00e9s",
  "F\u00eate locale : lieu peupl\u00e9 + saison",
  "Hiver : jour > 90 \u2192 froid, routes difficiles",
  "P\u00e9nurie : lieu occup\u00e9 + cons\u00e9quences accumul\u00e9es",
];

export function buildArcsCtx(profil, heroPeuple, lieuKey) {
  const arcs = [...ARCS_BASE];

  // Arcs voyage toujours disponibles
  arcs.push(...ARCS_VOYAGE);

  // Occupation d\u00e8s ancrage
  if (profil !== "debutant") {
    arcs.push(...ARCS_OCCUPATION);
    arcs.push(...ARCS_MONDIAUX);
  }

  // Factions du peuple du h\u00e9ros + peuple local
  const factionPeuples = new Set([heroPeuple]);
  const localMap = {
    hautcendre: "cendreux", pierrelong: "sonneur", le_puits: "sonneur",
    hauts_plateaux: "agritan", val_des_brumes: "sylvain", la_lisiere: "sylvain",
    la_croisee: "foulard", marceins: "ratainien", les_cols: "ratainien",
  };
  if (localMap[lieuKey]) factionPeuples.add(localMap[lieuKey]);
  factionPeuples.forEach(p => {
    if (ARCS_FACTIONS[p]) arcs.push(...ARCS_FACTIONS[p]);
  });

  // Cr\u00e9atures en \u00e9mergent+
  if (profil === "emergent" || profil === "confirme" || profil === "profond") {
    arcs.push(...ARCS_CREATURES);
  }

  return "ARCS POSSIBLES (ne pas forcer, un seul actif, \u00e9quilibrer +/-)\n" + arcs.map(a => "- " + a).join("\n");
}

// --- CL\u00c9S ---

const CLES_GENERALES = [
  "initiation_danger : surv\u00e9cu un danger r\u00e9el (tout lieu)",
  "initiation_choix : choix moral significatif (tout lieu)",
  "occupation_vecue : subi/vu l'occupation (Hautcendre, Marceins, Cols)",
  "occupation_comprise : compris le syst\u00e8me imp\u00e9rial (Marceins, Cols)",
];

const CLES_PEUPLES = {
  cendreux: [
    "resistance_contactee : contact r\u00e9sistance (Hautcendre, Ramasse)",
    "collaboration_vue : vu collaboration (Hautcendre)",
    "apprentissage_metier : atelier technique (Hautcendre)",
    "apprentissage_magie : circuits magiques (Hautcendre)",
    "faction_conseil_compris : conseil de Hautcendre",
  ],
  sonneur: [
    "faction_sonneurs_surface : rencontr\u00e9 Sonneurs (Pierrelong, Hauts Plateaux)",
    "faction_sonneurs_profondeur : descendu galeries (Pierrelong)",
  ],
  sylvain: [
    "faction_sylvains_lisiere : rencontr\u00e9 Sylvains (Lisi\u00e8re, Val des Brumes)",
    "faction_sylvains_accepte : accept\u00e9 par la for\u00eat (Val des Brumes)",
    "oublie_indirect : contact Oubli\u00e9 indirect (Val des Brumes)",
  ],
  agritan: [
    "faction_agritans_croise : rencontr\u00e9 Agritans (Hauts Plateaux, Crois\u00e9e)",
    "faction_agritans_lien : confiance tribu (Hauts Plateaux)",
  ],
  foulard: [
    "faction_foulards_service : affaire avec Foulard (Crois\u00e9e)",
    "faction_foulards_reseau : int\u00e9gr\u00e9 r\u00e9seau (Crois\u00e9e)",
    "faction_foulards_profond : loyaut\u00e9 prouv\u00e9e",
  ],
  ratainien: [
    "faction_clerge_observe : office/miracle (Marceins)",
    "faction_clerge_protege : prot\u00e9g\u00e9 par clerg\u00e9 (Marceins)",
    "faction_empire_remarque : remarqu\u00e9 par hi\u00e9rarchie (Marceins, Cols)",
  ],
};

export function buildClesCtx(heroPeuple, lieuKey, existingCles) {
  const cles = [...CLES_GENERALES];

  // Cl\u00e9s du peuple du h\u00e9ros
  if (CLES_PEUPLES[heroPeuple]) cles.push(...CLES_PEUPLES[heroPeuple]);

  // Cl\u00e9s du peuple local si diff\u00e9rent
  const localMap = {
    hautcendre: "cendreux", pierrelong: "sonneur", le_puits: "sonneur",
    hauts_plateaux: "agritan", val_des_brumes: "sylvain", la_lisiere: "sylvain",
    la_croisee: "foulard", marceins: "ratainien", les_cols: "ratainien",
  };
  const local = localMap[lieuKey];
  if (local && local !== heroPeuple && CLES_PEUPLES[local]) {
    cles.push(...CLES_PEUPLES[local]);
  }

  // Filtrer les cl\u00e9s d\u00e9j\u00e0 obtenues
  const filtered = cles.filter(c => {
    const id = c.split(" :")[0].trim();
    return !existingCles[id];
  });

  if (!filtered.length) return "";
  return "CL\u00c9S POSSIBLES (max 2/sc\u00e8ne, v\u00e9rifier lieu, m\u00e9rit\u00e9e par l'action)\n" + filtered.map(c => "- " + c).join("\n");
}
