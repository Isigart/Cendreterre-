
      { cles: ["occupation_vecue"],            ids: ["contrebandier"] },
      { cles: ["resistance_contactee"],        ids: ["resistant"] },
      { cles: ["collaboration_vue"],           ids: ["collaborateur"] },
      { cles: ["occupation_comprise"],         ids: ["soldat_demo"] },
      { cles: ["apprentissage_metier"],        ids: ["mecano"] },
      { cles: ["apprentissage_magie"],         ids: ["ingenieur"] },
      { cles: ["faction_conseil_compris"],     ids: ["conseiller"] },
    ],
    sonneur: [
      { cles: ["faction_sonneurs_surface"],     ids: ["mineur", "commergant_surf", "messager_sonn"] },
      { cles: ["faction_sonneurs_profondeur"],  ids: ["gardien_galerie", "eleveur_taupe", "chanteur", "zin_guerre", "ancien_zin", "enfant_terre"] },
    ],
    sylvain: [
      { cles: ["faction_sylvains_lisiere"],                       ids: ["apprenti_sylv"] },
      { cles: ["faction_sylvains_accepte"],                       ids: ["praticien_sylv", "enseignant_sylv", "gardien_epreuve"] },
      { cles: ["faction_sylvains_accepte", "oublie_indirect"],    ids: ["ancien_sylv"] },
    ],
    agritan: [
      { cles: ["faction_agritans_croise"],  ids: ["enfant_agr", "guerrier_agr", "paria_agr"] },
      { cles: ["faction_agritans_lien"],    ids: ["dresseur_agr", "tatoueur_agr", "chef_agr"] },
    ],
    foulard: [
      { cles: ["faction_foulards_service"],                         ids: ["coureur_route", "sedentaire"] },
      { cles: ["faction_foulards_reseau"],                          ids: ["runiste", "marchand_mots", "cartographe", "marchand_croisee"] },
      { cles: ["faction_foulards_reseau", "voyage_region_3"],       ids: ["lame_sil", "gardien_alpha"] },
    ],
    ratainien: [
      { cles: ["occupation_comprise"],      ids: ["legionnaire", "decurion", "collecteur_rat", "scribe_imp", "marchand_rat", "colon"] },
      { cles: ["faction_clerge_observe"],   ids: ["missionnaire"] },
      { cles: ["faction_clerge_protege"],   ids: ["prelat"] },
      { cles: ["faction_empire_remarque"],  ids: ["centurion", "legat", "gouverneur_dist"] },
    ],
  },
};

function getAvailablePeuples(cles) {
  const dispo = ["cendreux"];
  Object.entries(DEBLOCAGES.peuples).forEach(([id, required]) => {
    if (required.every(c => cles[c])) dispo.push(id);
  });
  return dispo;
}

function getAvailableMetierIds(peupleId, cles) {
  const entries = DEBLOCAGES.metiers[peupleId] || [];
  const dispo = [];
  entries.forEach(({ cles: required, ids }) => {
    if (required.every(c => cles[c])) ids.forEach(id => dispo.push(id));
  });
  return dispo;
}

function computeNewUnlocks(heroCles, worldClesAvant) {
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
      if (peuple && metier) nouveauxMetiers.push(peuple.nom + " · " + metier.nom);
    });
  });

  return { peuples: nouveauxPeuples, metiers: nouveauxMetiers };
}

const OUVERTURE_SURVIE = "première scène — le héros reprend conscience. Il est dehors. De l'herbe sous lui, un ciel au-dessus. Des arbres peut-être, des champs peut-être, quelque chose au loin — rien de précis. Juste la nature, le silence, et des besoins immédiats : il a soif, il a faim, le froid commence à mordre. Il n'a rien sur lui. Il ne sait pas où il est ni comment il est arrivé là. Pas d'explication. Pas d'exposition. Le monde est là, indifférent. S'il ne trouve pas à boire, manger et dormir — il ne durera pas longtemps.";

function initHero(peuple, metier, nom, genre) {
  const lieu = peuple.lieu[Math.floor(Math.random() * peuple.lieu.length)];
  return {
    nom,
    genre: genre || null,
    peuple: { id: peuple.id, nom: peuple.nom, desc: peuple.desc },
    metier: { id: metier.id, nom: metier.nom, desc: metier.desc },
    magie: peuple.magie,
    lieu,
    traits: {
      public:  [],
      stats:   [metier.desc],
      acquis:  [],
    },
    hist:       [],
    vivant:     true,
    sceneCount: 0,
    dernierChoix: null,
  };
}

const PRENOMS_M = ["Aldric","Cael","Tavar","Drenn","Renn","Kord","Broc","Harun","Pell","Mael","Bran","Kern","Hadris","Corvyn","Elden","Faryn","Ulven","Tarek","Vorn","Osric"];
const PRENOMS_F = ["Maren","Sorel","Linh","Brin","Orsa","Nessa","Ayla","Lira","Sian","Elva","Wren","Sela","Mira","Vael","Rynn","Dessa","Caera","Nira","Maeve","Vorna"];
const PRENOMS_N = ["Fen","Sael","Bryn","Lorn","Skael","Aryn","Kael","Oren","Talin","Seren","Dryn","Faen","Coryn","Veyn","Ryth"];

function randomPrenom(genre) {
  const pool = genre === "M" ? PRENOMS_M : genre === "F" ? PRENOMS_F : PRENOMS_N;
  return pool[Math.floor(Math.random() * pool.length)];
}

function randomHero() {
  const peuple  = PEUPLES[Math.floor(Math.random() * PEUPLES.length)];
  const metiers = METIERS[peuple.id] || [];
  const metier  = metiers[Math.floor(Math.random() * metiers.length)];
  const genre   = ["M","F","N"][Math.floor(Math.random() * 3)];
  const nom     = randomPrenom(genre);
  return initHero(peuple, metier, nom, genre);
}

// ============================================================
// SECTION 3 — APPEL LLM
// ============================================================

const SYS = `Tu es GM de Cendreterre. Le joueur déclare une intention — tu la joues.

POSTURE
Le joueur est le héros — tutoie toujours. Jamais à la 3e personne.
Jamais le nom du héros comme sujet. Tu t'approches, tu ressens, tu vois.
Tu ne sais que ce que le héros sait à cet instant.
Le héros arrive sans passé imposé. Il reconnaît l'ordinaire — un lit, une rue, un outil — mais rien au-delà. Pas de souvenirs, pas de relations établies, pas d'histoire personnelle. C'est le joueur qui construit tout ça en jouant. Ne pas inventer de passé pour lui. Les PNJ peuvent le connaître — lui pas encore.
Nommer = connaître. Le GM ne nomme que ce que le héros peut identifier. Un soldat inconnu c'est "un homme en uniforme". Un Ratainien qu'on ne connaît pas c'est "un homme au teint clair, vêtements soignés". Le nom d'un peuple, d'une faction, d'un lieu — seulement si le héros l'a appris en jeu. Jamais de savoir implicite.

PROSE
Joue l'intention directement. Première phrase = l'action, pas le décor.
Pas de description sauf : arrivée dans un nouveau lieu, fouille active, première rencontre avec un PNJ. Dans tous les autres cas — zéro description. Le monde existe, pas besoin de le rappeler à chaque scène.
Le monde se découvre par l'action. Si le joueur veut savoir ce qu'il y a au nord — il y va. Si il veut cartographier — c'est un choix qu'il fait. Le GM ne décrit pas ce que le joueur n'a pas cherché.
Urgence = pas de description du tout. Si le héros a faim, froid, soif — on joue la survie, pas le paysage.
Joue l'intention jusqu'à sa conséquence immédiate — pas juste l'action, mais ce qu'elle produit. Le résultat est visible avant de s'arrêter. La page suivante commence après la conséquence, pas pendant.
Arrête-toi sur une situation ouverte — quelque chose vient de se passer, quelqu'un attend, une décision s'impose. Jamais sur une conclusion. La dernière phrase doit donner envie d'agir, pas clore.
2 à 3 paragraphes maximum. Moins si l'intention est simple.
Intention temporelle : joue l'arc complet. Ne t'arrête pas au premier moment sauf si quelque chose interrompt. L'intention du joueur ne garantit pas le résultat.

COHÉRENCE
Le héros reste dans lieu_actuel sauf déplacement intentionnel.
Description d'un PNJ figée à la première mention.
Espace : ce qui a été décrit existe et ne se contredit pas. Pour les lieux inconnus — inventer librement mais tenir ce qu'on vient de poser.
Positions relatives : raisonner sur les positions des éléments entre eux. Elles définissent ce qui est accessible, risqué, possible.

PERSONNAGES
Les PNJ montrent — ils ne s'expliquent pas. Montrer le comportement, pas son sens.
Jamais de lecture de pensée : "il a compris", "elle savait", "son regard trahissait" — interdit.
La plupart des gens sont ordinaires — fatigués, distraits, occupés. Pas mystérieux par défaut.

RÈGLES FIXES — CENDRETERRE
Ces noms sont pour le GM — pas pour la prose tant que le héros ne les connaît pas en jeu.
Occupation = présence banale. Paperasse, regard, impôt. Pas de violence gratuite. La plupart espèrent rentrer.
Résistance = naissante et invisible. Murmures, regards. Rien d'organisé visible.
Magie Cendreux = ingénierie pure. Circuits, outils, énergie stockée. Jamais de sorts.
Magie Sonneur = amitié sincère et mutuelle avec la terre. Toujours défensif, jamais une attaque.
Magie Sylvain = chakra et éléments via gestes précis. Anciens et distants — pas des elfes bienveillants.
Magie Agritan = tatouages de vécu vrai. Le mensonge les corrompt physiquement.
Magie Foulard = runes sur support matériel. Illisibles pour les autres. Jamais spectaculaire.
Magie Ratainien = foi sincère en un dieu monothéiste. Miracles rares, imprévisibles. Ils ne savent pas que c'est un Oublié.
Oubliés = inaccessibles aux profils débutant et ancrage.
Langue = tous les peuples se comprennent. Accents et argots locaux — couleur, pas obstacle.
Mort = possible et réelle. Ne pas protéger le héros artificiellement. Si mort → fd:{mort:true}.
Survie = le monde ne donne rien. Si le joueur ne cherche pas activement à boire, manger, dormir — ça n'arrive pas. Pas de source d'eau providentielle, pas de PNJ qui tend de la nourriture sans raison. Le monde est indifférent. Les conséquences de l'inaction sont réelles. En dessous de 10 scènes — ne pas assister le joueur, ne pas résoudre ses besoins à sa place.

FORMAT
///PROSE
La narration.
///
///DATA
{"fd":{},"ld":{}}
///

fd : ce qui change sur le héros.
  traits_add:[...] — trait acquis par l'action
  humeur:"..." — état émotionnel courant
  physique:"..." — état physique : faim, froid, blessure, fatigue
  inventaire_add:["objet trouvé"] — objet ajouté
  inventaire_del:["objet perdu"] — objet consommé ou perdu
  lieu:"..." — nouveau lieu si déplacement réel
  mort:true — si le héros meurt

ld : ce qui change dans le monde.
  pnj:{Nom:{description:"figée première mention",genre:"M/F/N",statut:"allie/ennemi/neutre",position:"où il est",humeur:"état émotionnel courant"}}
  objets:{id:{description:"figée",etat:"actif/brisé/etc",lieu:"où"}}
  lieux:{
    "lieu_key":{
      scene_state:["porte nord : ouverte","garde : côté ouest, dos au mur","coffre : centre"],
      courants:["ambiance actuelle"],
      persistant:"changement irréversible"
    }
  }
  cles:{cle_id:true}
  en_suspens:["conséquence réelle non résolue"]
  consequences:["ce que le monde retient de cette scène — fait court, concret"]
  meteo:"nuit tombée | pluie fine | grand froid"

N'injecte fd/ld que si quelque chose a vraiment changé. Objets = seulement ceux que le héros peut utiliser.`;

// ============================================================
// SECTION 3b — LIEUX + PROFIL NARRATIF
// ============================================================

function lieuKey(lieu) {
  return (lieu || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s'\-]+/g, "_");
}

const LIEUX_BASE = {
  hautcendre: {
    physique: "pierre noire volcanique, circuits magiques dans les murs des bâtiments anciens, lampes sans flamme, routes pavées héritées de l'ancien régime",
    ambiance: "tension sourde entre mémoire Cendreux et présence impériale, collaboration visible, activité permanente sur les routes",
    danger:   "garnison qui surveille les étrangers, collaborateurs qui rapportent, quartier des forges dangereux la nuit",
  },
  pierrelong: {
    physique: "falaises vertigineuses, vent marin permanent, sol qui vibre différemment — plus profond, plus chaud, galeries éclairées par des veines de lave",
    ambiance: "surface hostile et bruyante, profondeur chaude et silencieuse — deux mondes superposés, les Sonneurs à l'aise nulle part autant qu'en bas",
    danger:   "la mer en bas sans sauvetage possible, les galeries non autorisées se referment, les étrangers non acceptés ne remontent pas",
  },
  val_des_brumes: {
    physique: "feuillus centenaires, feuilles vertes même en hiver, brume permanente entre les troncs, lumière diffuse qui ne change pas selon l'heure",
    ambiance: "calme vivant — pas silencieux. La forêt lit les intentions. Les indésirables ressortent sans comprendre comment",
    danger:   "tourner en rond sans repères, perdre ses références mentales, ce que la forêt décide de montrer aux mauvaises personnes",
  },
  la_lisiere: {
    physique: "champs et prairies, moulins sur les ruisseaux, lisière de la forêt Sylvaine en bordure est, orchidées cramoisies aux emplacements des batailles",
    ambiance: "calme ordinaire, froideur polie envers les inconnus, un visage étranger se remarque immédiatement, confiance qui se gagne lentement",
    danger:   "méfiance locale qui ferme les portes, patrouilles Ratainières qui comptent les têtes, la forêt si quelqu'un la force",
  },
  marceins: {
    physique: "architecture impériale droite et planifiée, large avenue centrale, temple imposant, constructions récentes en pierre claire, propre — trop propre",
    ambiance: "surveillance permanente et discrète, ambition et paranoïa, personne ne veut faire d'erreur, efficace et froid",
    danger:   "informateurs partout, un mot hérétique près d'un prêtre, être Cendreux sans raison valable d'être là",
  },
  les_cols: {
    physique: "forteresse dans la montagne, champs d'orchidées cramoisies aux abords, altitude — froid même en été, une seule route large et entretenue",
    ambiance: "machine administrative à plein régime, files lentes par conception, soldats professionnels qui ont tout vu",
    danger:   "mauvais papiers, un fonctionnaire qui reconnaît un visage, les passages secondaires en hiver tuent sans prévenir",
  },
  la_croisee: {
    physique: "tentes, chariots, stands montés et démontés, place centrale qui se forme naturellement, feux la nuit visibles à plusieurs lieues",
    ambiance: "bruit constant, langues mélangées, méfiance ordinaire, liberté qui n'existe nulle part ailleurs, les Foulards maintiennent un ordre tacite",
    danger:   "information qui circule trop vite, dettes qui suivent sur la route, agents Ratainiens fondus dans la foule",
  },
  hauts_plateaux: {
    physique: "plateau rocheux balayé par le vent, sol pauvre, falaises abruptes, brouillard fréquent, roche noire affleurante partout",
    ambiance: "silence lourd que le vent ne remplit pas, horizon dégagé, sentiment d'être observé sans voir qui regarde, nuits très froides",
    danger:   "raids Agritans sur les voyageurs isolés, froid mortel hors des abris, falaises sans chemin balisé",
  },
};

const PHYSIQUE_PEUPLES = {
  cendreux:  "peau mate à grise, constitution robuste, mains calleuses, cheveux foncés, yeux gris à noirs",
  sonneur:   "trapu et dense, peau teinte roche mouillée, mains larges, voix rauque grave — semble venir du sol",
  sylvain:   "souple, grand, teintes selon l'affinité élémentaire, quelque chose de légèrement non-humain dans les mouvements",
  agritan:   "corpulent et musculeux, peau sombre, tatouages partout qui racontent la vie, regard direct",
  foulard:   "petit et fin, vêtements légers superposés, voile qui cache le visage en partie, runes dans les coutures, démarche silencieuse",
  ratainien: "teintes plus claires, vêtements soignés même pauvres, façon de se tenir qui dit l'institution",
  metis:     "deux physiques qui se mêlent — l'un ou l'autre domine selon les jours et les regards",
};

const PROFIL_DIRECTIVE = {
  debutant: "Le joueur ne sait rien. Le monde est opaque, indifférent. Il survit ou non. Pas de nom de lieu, de faction, de peuple — seulement ce qu'il voit et touche. Le GM ne l'assiste pas. Il apprend en agissant.",
  ancrage:  "Le joueur commence à reconnaître des repères — des visages, des routes, des comportements. Le monde résiste moins à qui commence à le comprendre. Les tensions du quotidien émergent naturellement.",
  emergent: "Le joueur connaît des noms, des règles tacites, des enjeux. Ses actions sont plus précises. Le monde répond à quelqu'un qui commence à le lire. Rencontres qui comptent, conséquences qui s'accumulent.",
  confirme: "Le joueur comprend comment le monde fonctionne. Il peut anticiper, négocier, choisir ses camps. Le GM valide ses choix éclairés. Factions actives, secrets accessibles à qui sait chercher.",
  profond:  "Le joueur est capable de construire ses propres intentions sans assistance. Il connaît le monde assez pour le jouer de l'intérieur. Le GM n'est plus que l'arbitre de ce qu'il propose. Oubliés possibles, révélations majeures.",
};

function profilNarratif(world) {
  const n = Object.keys(world.cles || {}).filter(k => world.cles[k]).length;
  if (n === 0) return "debutant";
  if (n < 4)   return "ancrage";
  if (n < 10)  return "emergent";
  if (n < 20)  return "confirme";
  return "profond";
}

function buildCtx(hero, world, hist) {
  const key    = lieuKey(hero.lieu);
  const region = LIEUX_BASE[key] || null;
  const profil = profilNarratif(world);
  const parts  = [];

  // — HÉROS —
  parts.push("HÉROS");
  parts.push("nom=" + hero.nom);
  parts.push("peuple=" + hero.peuple.nom + (PHYSIQUE_PEUPLES[hero.peuple.id] ? " — " + PHYSIQUE_PEUPLES[hero.peuple.id] : ""));
  parts.push("metier=" + hero.metier.nom + " — " + hero.metier.desc);
  parts.push("magie=" + hero.magie);
  parts.push("lieu_actuel=" + hero.lieu + " — le héros y est, ne pas déplacer sans intention explicite");
  if (hero.traits.acquis && hero.traits.acquis.length)
    parts.push("acquis=[" + hero.traits.acquis.join(", ") + "]");

  // — MONDE —
  parts.push("");
  parts.push("MONDE");
  parts.push("profil=" + profil);
  parts.push("directive=[" + (PROFIL_DIRECTIVE[profil] || "") + "]");

  // PNJ connus
  const pnj = world.pnj || {};
  const pnjKeys = Object.keys(pnj).slice(-6);
  if (pnjKeys.length) {
    const pnjStr = pnjKeys.map(nom => {
      const p = pnj[nom];
      let s = nom;
      if (p.genre)       s += " (" + p.genre + ")";
      if (p.statut)      s += " [" + p.statut + "]";
      if (p.description) s += " — " + p.description;
      if (p.position)    s += " / " + p.position;
      return s;
    }).join(" | ");
    parts.push("pnj_connus=[" + pnjStr + "]");
  }

  // Objets dans le lieu courant
  const objets = world.objets || {};
  const objetsLieu = Object.entries(objets)
    .filter(([, o]) => !o.lieu || lieuKey(o.lieu) === key)
    .slice(0, 5)
    .map(([id, o]) => {
      let s = id.replace(/_/g, " ");
      if (o.description) s += " — " + o.description;
      if (o.etat && o.etat !== "actif") s += " [" + o.etat + "]";
      return s;
    });
  if (objetsLieu.length) parts.push("objets=[" + objetsLieu.join(" | ") + "]");

  // Distances depuis le lieu courant
  const dists = getDistances(hero.lieu);
  if (dists) parts.push("distances=[" + dists + "]");

  // Conséquences en suspens — ce que le monde tient en attente
  const fils = (world.fils || []).slice(-4);
  if (fils.length) parts.push("en_suspens=[" + fils.join(" | ") + "]");

  // — RÉGION —
  if (region) {
    parts.push("");
    parts.push("RÉGION " + hero.lieu.toUpperCase());
    parts.push("physique=[" + region.physique + "]");
    parts.push("ambiance=[" + region.ambiance + "]");
    parts.push("danger=[" + region.danger + "]");
  }

  // État du lieu (depuis world)
  const lieuData = (world.lieux || {})[key];
  if (lieuData) {
    if (lieuData.persistants && lieuData.persistants.length)
      parts.push("persistants=[" + lieuData.persistants.join(" | ") + "]");
    if (lieuData.courants && lieuData.courants.length)
      parts.push("courants=[" + lieuData.courants.join(" | ") + "]");
    if (lieuData.scene_state && lieuData.scene_state.length) {
      parts.push("");
      parts.push("ESPACE — positions et orientations dans la scène courante");
      lieuData.scene_state.forEach(s => parts.push(s));
    }
  }

  parts.push("");
  parts.push("HISTORIQUE");

  if (!hist.length) {
    parts.push("première scène");
  } else {
    // 3 snapshots complets + trim progressif
    hist.slice(-6).forEach((s, i, arr) => {
      const age = arr.length - 1 - i; // 0 = le plus récent
      if (typeof s === "string") {
        parts.push("— " + s);
        return;
      }
      if (age === 0) {
        // Snapshot complet — scène précédente immédiate
        const lines = ["SCÈNE PRÉCÉDENTE"];
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
        // Snapshot moyen — prose + lieu + conséquences
        const lines = [];
        if (s.prose) lines.push(s.prose);
        if (s.lieu)  lines.push("@" + s.lieu);
        if (s.consequences?.length) lines.push("[" + s.consequences.join(" | ") + "]");
        parts.push("— " + lines.join(" · "));
      } else {
        // Snippet — prose seulement
        parts.push("— " + (s.prose || s));
      }
    });
  }

  if (hero.dernierChoix && hero.dernierChoix !== "ouverture" && hero.dernierChoix !== "reprise")
    parts.push("derniere_intention=" + hero.dernierChoix);

  return parts.filter(s => s !== null && s !== undefined).join("\n");
}

async function callLLM(ctx, intention, onChunk) {
  const body = JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    stream: true,
    system: SYS,
    messages: [{ role: "user", content: ctx + "\n\nINTENTION: " + intention }],
  });

  let r;
  try {
    r = await Promise.race([
      fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body,
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 45000)),
    ]);
  } catch(e) { throw new Error("réseau : " + e.message); }

  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    if (r.status === 429 || txt.includes("rate_limit") || txt.includes("overloaded"))
      throw new Error("RATE_LIMIT");
    throw new Error("HTTP " + r.status);
  }

  const reader  = r.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  let proseStarted = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (raw === "[DONE]") continue;
      try {
        const evt = JSON.parse(raw);
        if (evt.type === "error") {
          const t = evt.error?.type || "";
          if (t === "rate_limit_error" || t === "overloaded_error") throw new Error("RATE_LIMIT");
          throw new Error(evt.error?.message || "stream error");
        }
        if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
          const text = evt.delta.text || "";
          full += text;
          if (!proseStarted && full.includes("///PROSE")) {
            proseStarted = true;
            let after = full.split("///PROSE")[1] || "";
            if (after.startsWith("\n")) after = after.slice(1);
            const stop = after.indexOf("///");
            const out  = stop >= 0 ? after.slice(0, stop) : after;
            if (out) onChunk(out);
          } else if (proseStarted) {
            if (full.split("///PROSE")[1]?.includes("///")) continue;
            onChunk(text);
          }
        }
      } catch(pe) {
        if (pe.message === "RATE_LIMIT") throw pe;
      }
    }
  }

  let prose = "";
  if (full.includes("///PROSE")) {
    let after = full.split("///PROSE")[1] || "";
    if (after.startsWith("\n")) after = after.slice(1);
    const stop = after.indexOf("///");
    prose = stop >= 0 ? after.slice(0, stop).trim() : after.trim();
  }
  if (!prose) prose = full.replace(/\/\/\/PROSE/g, "").replace(/\/\/\/[\s\S]*/g, "").trim();

  // Extraction DATA — défensive, jamais bloquante
  let data = { fd: {}, ld: {} };
  try {
    const dataMatch = full.match(/\/\/\/DATA\s*([\s\S]+?)\/\/\//) ||
                      full.match(/\/\/\/DATA\s*([\s\S]+?)$/);
    if (dataMatch) {
      const tick = String.fromCharCode(96);
      const raw = dataMatch[1].trim()
        .split(tick + tick + tick + "json").join("")
        .split(tick + tick + tick).join("")
        .trim();
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        data.fd = parsed.fd || {};
        data.ld = parsed.ld || {};
      }
    }
  } catch(e) {
    // Parsing raté — on garde data vide, la prose s'affiche quand même
  }

  return { prose, data };
}

// ============================================================
// SECTION 3c — DISTANCES
// ============================================================

// Jours de voyage à pied. Terrain réel appliqué :
// plaine 35km/j · bocage 28km/j · montagne 20km/j · forêt 22km/j · marais 15km/j
// Route impériale pavée : +25% vitesse. Base : France × 0.45. Hautcendre = Paris.
const DISTANCES = {
  hautcendre: {
    hamecon:         { j: 2,  note: "nord, plaine — route rapide" },
    pierrelong:      { j: 8,  note: "nord-est, bocage puis montagne escarpée" },
    hauts_plateaux:  { j: 6,  note: "centre, bocage puis volcans et pentes" },
    la_lisiere:      { j: 5,  note: "est, bocage — route marchande" },
    val_des_brumes:  { j: 8,  note: "est, bocage puis forêt dense impénétrable" },
    ramasse:         { j: 9,  note: "ouest, bocage très dense — routes difficiles" },
    marais_tortues:  { j: 9,  note: "sud-ouest, plaine puis marais" },
    marceins:        { j: 8,  note: "sud, route impériale pavée — surveillée" },
    les_cols:        { j: 12, note: "extrême sud, route impériale puis montagne" },
  },
  pierrelong: {
    hautcendre:      { j: 8,  note: "sud-ouest, descente de montagne puis bocage" },
    hauts_plateaux:  { j: 5,  note: "sud, descente des montagnes Sonneuses" },
    val_des_brumes:  { j: 6,  note: "sud, versant est puis forêt profonde" },
    la_lisiere:      { j: 7,  note: "sud-ouest, traversée des plateaux" },
    hamecon:         { j: 5,  note: "ouest, côte puis plaine" },
  },
  hauts_plateaux: {
    hautcendre:      { j: 6,  note: "nord, descente des volcans puis bocage" },
    pierrelong:      { j: 5,  note: "nord-est, montée en altitude progressive" },
    la_lisiere:      { j: 4,  note: "est, plateau puis bocage" },
    marceins:        { j: 6,  note: "sud, route impériale — terrain dégagé" },
    ramasse:         { j: 6,  note: "ouest, bocage dense" },
  },
  la_lisiere: {
    hautcendre:      { j: 5,  note: "ouest, bocage — route marchande" },
    val_des_brumes:  { j: 2,  note: "est — la forêt commence ici" },
    hauts_plateaux:  { j: 4,  note: "ouest, bocage puis montée douce" },
    pierrelong:      { j: 7,  note: "nord-est, terrain varié" },
    marceins:        { j: 5,  note: "sud, plaine puis route impériale" },
  },
  val_des_brumes: {
    la_lisiere:      { j: 2,  note: "ouest — sortie de la forêt" },
    hautcendre:      { j: 8,  note: "ouest, forêt puis bocage" },
    pierrelong:      { j: 6,  note: "nord, forêt puis montagne" },
  },
  marceins: {
    hautcendre:      { j: 8,  note: "nord, route impériale pavée — patrouilles" },
    les_cols:        { j: 2,  note: "sud, dernière ville avant la frontière" },
    hauts_plateaux:  { j: 6,  note: "nord-est, montée progressive" },
    la_lisiere:      { j: 5,  note: "nord-est, plaine puis bocage" },
    ramasse:         { j: 7,  note: "nord-ouest, contournement" },
  },
  les_cols: {
    marceins:        { j: 2,  note: "nord, descente vers la plaine" },
    hautcendre:      { j: 12, note: "nord, route impériale longue" },
  },
  marais_tortues: {
    hautcendre:      { j: 9,  note: "nord-est, sortie des marais puis plaine" },
    ramasse:         { j: 4,  note: "nord, bocage — Foulards connaissent le chemin" },
    marceins:        { j: 7,  note: "est, contournement des marais" },
  },
  ramasse: {
    hautcendre:      { j: 9,  note: "est, bocage dense — routes résistance" },
    marais_tortues:  { j: 4,  note: "sud, marais à l'horizon" },
    hauts_plateaux:  { j: 6,  note: "est, bocage puis montée" },
    marceins:        { j: 7,  note: "sud-est, contournement" },
  },
  hamecon: {
    hautcendre:      { j: 2,  note: "sud, plaine — route rapide" },
    pierrelong:      { j: 5,  note: "est, côte puis montagne" },
  },
};

function getDistances(lieu) {
  const key = lieuKey(lieu);
  const dists = DISTANCES[key];
  if (!dists) return null;
  return Object.entries(dists)
    .map(([dest, { j, note }]) => dest.replace(/_/g," ") + " : " + j + " jour" + (j>1?"s":"") + " (" + note + ")")
    .join(" | ");
}

function applyFd(hero, fd) {
  if (!fd || !Object.keys(fd).length) return hero;
  const next = { ...hero };

  // Traits acquis
  if (fd.traits_add && fd.traits_add.length) {
    const acquis = [...(hero.traits.acquis || [])];
    fd.traits_add.forEach(t => { if (!acquis.includes(t)) acquis.push(t); });
    next.traits = { ...hero.traits, acquis };
  }

  // Humeur émotionnelle
  if (fd.humeur) next.humeur = fd.humeur;

  // État physique
  if (fd.physique) next.physique = fd.physique;

  // Inventaire
  if (fd.inventaire_add && fd.inventaire_add.length) {
    const inv = [...(hero.inventaire || [])];
    fd.inventaire_add.forEach(o => { if (!inv.includes(o)) inv.push(o); });
    next.inventaire = inv.slice(-10); // max 10 objets
  }
  if (fd.inventaire_del && fd.inventaire_del.length) {
    next.inventaire = (next.inventaire || hero.inventaire || [])
      .filter(o => !fd.inventaire_del.includes(o));
  }

  // Lieu
  if (fd.lieu) next.lieu = fd.lieu;

  // Mort
  if (fd.mort) next.vivant = false;

  return next;
}

function applyLd(world, ld) {
  if (!ld || !Object.keys(ld).length) return world;
  const next = { ...world };

  // PNJ — description figée à la première mention, humeur mise à jour
  if (ld.pnj && typeof ld.pnj === "object") {
    const pnj = { ...(world.pnj || {}) };
    Object.entries(ld.pnj).forEach(([nom, inc]) => {
      const ex = pnj[nom];
      if (ex) {
        pnj[nom] = {
          ...ex, ...inc,
          description: ex.description || inc.description || null,
          genre:       ex.genre       || inc.genre       || null,
        };
      } else {
        pnj[nom] = inc;
      }
    });
    next.pnj = pnj;
  }

  // Objets — description figée à la première mention
  if (ld.objets && typeof ld.objets === "object") {
    const objets = { ...(world.objets || {}) };
    Object.entries(ld.objets).forEach(([id, inc]) => {
      const ex = objets[id];
      if (ex) {
        objets[id] = {
          ...ex, ...inc,
          description: ex.description || inc.description || null,
        };
      } else {
        objets[id] = inc;
      }
    });
    next.objets = objets;
  }

  // Lieux
  if (ld.lieux && typeof ld.lieux === "object") {
    const lieux = { ...(world.lieux || {}) };
    Object.entries(ld.lieux).forEach(([key, val]) => {
      const ex = lieux[key] || { persistants: [], courants: [], scene_state: [] };
      if (val.courants)     ex.courants    = val.courants.slice(0, 5);
      if (val.persistant)   ex.persistants = [...(ex.persistants || []), val.persistant].slice(-3);
      if (val.scene_state)  ex.scene_state = val.scene_state.slice(0, 6);
      lieux[key] = ex;
    });
    next.lieux = lieux;
  }

  // Clés narratives — s'activent, ne se désactivent jamais
  if (ld.cles && typeof ld.cles === "object") {
    const cles = { ...(world.cles || {}) };
    Object.entries(ld.cles).forEach(([k, v]) => { if (v) cles[k] = true; });
    next.cles = cles;
  }

  // Conséquences en suspens
  if (ld.en_suspens && ld.en_suspens.length) {
    next.fils = [...(world.fils || []), ...ld.en_suspens].slice(-10);
  }

  // Conséquences immédiates de cette scène
  if (ld.consequences && ld.consequences.length) {
    next.consequences = ld.consequences.slice(-5);
  }

  // Météo
  if (ld.meteo) next.meteo = ld.meteo;

  // Événements
  if (ld.evt) {
    next.evt = { ...(world.evt || {}), ["evt_" + Date.now()]: ld.evt };
  }

  return next;
}

function buildLegacy(hero) {
  return {
    nom:    hero.nom,
    peuple: hero.peuple?.nom || "?",
    metier: hero.metier?.nom || "?",
    lieu:   hero.lieu || "Cendreterre",
    scenes: hero.sceneCount || 0,
  };
}

// ============================================================
// SECTION 4 — STYLES
// ============================================================

const C = {
  bg:     "#0a0704",
  text:   "#d4b896",
  muted:  "#7a5c3a",
  dim:    "#2a1f12",
  accent: "#c8a050",
  red:    "#c0392b",
};

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes pulse    { 0%,100%{opacity:.3} 50%{opacity:1} }
  @keyframes blink    { 0%,100%{opacity:1}  50%{opacity:0} }
  @keyframes fadeIn   { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
  @keyframes fadeSlow { from{opacity:0} to{opacity:1} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes fadeNom  { 0%{opacity:0} 60%{opacity:0} 100%{opacity:1} }
  .pulse    { animation: pulse    1.8s ease infinite; }
  .fade-in  { animation: fadeIn   .35s ease both; }
  .fade-slow{ animation: fadeSlow .7s  ease both; }
  ::placeholder { color: ${C.muted}; opacity:.5; font-style:italic; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.dim}; border-radius: 2px; }
`;

// ============================================================
// SECTION 5 — COMPOSANTS
// ============================================================

// — Champ d'intention libre —

function Input({ onPlay, going }) {
  const [val, setVal] = useState("");
  const ref = useRef(null);

  function submit() {
    const t = val.trim();
    if (!t || going) return;
    setVal("");
    onPlay(t);
  }

  function handleFocus() {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }

  return (
    <div ref={ref} style={{
      borderTop: "1px solid " + C.dim,
      padding: "1rem 0 2rem",
      marginTop: "2rem",
      display: "flex", alignItems: "flex-end", gap: "0.8rem",
    }}>
      <textarea
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
        onFocus={handleFocus}
        placeholder="que fais-tu ?"
        rows={2}
        disabled={going}
        style={{
          flex: 1,
          background: "transparent", border: "none",
          borderBottom: "1px solid " + C.dim,
          color: C.text, fontSize: 15,
          fontFamily: "inherit", fontStyle: "italic",
          outline: "none", resize: "none",
          padding: "0.4rem 0", lineHeight: 1.6,
          opacity: going ? 0.4 : 1,
        }}
      />
      <button onClick={submit} disabled={!val.trim() || going}
        style={{
          flexShrink: 0,
          background: "transparent",
          border: "1px solid " + (val.trim() && !going ? C.accent : C.dim),
          borderRadius: 3, color: val.trim() && !going ? C.accent : C.dim,
          fontSize: 18, width: 40, height: 40,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .15s",
        }}>
        ✓
      </button>
    </div>
  );
}
// — Prose streamée —

function Prose({ text, streaming }) {
  const paras = text.split("\n\n").filter(p => p.trim());
  return (
    <div>
      {paras.map((p, i) => (
        <p key={i} style={{
          fontSize: "clamp(16px,2.5vw,18px)",
          lineHeight: 1.9, color: C.text,
          marginBottom: "1.4rem",
          fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
          fontStyle: "italic",
        }}>
          {p}
          {streaming && i === paras.length - 1 && (
            <span style={{
              display: "inline-block", width: 1, height: "1em",
              background: C.muted, marginLeft: 3,
              verticalAlign: "text-bottom",
              animation: "blink 1s step-end infinite",
            }} />
          )}
        </p>
      ))}
    </div>
  );
}

// — Premier rêve — séquence d'introduction —

const PROSE_REVE = [
  "Cette nuit est un peu particulière.",
  "Tu t'endors — et tout bascule.",
  "En pleine conscience tu dérives. Des rêves défilent autour de toi, des histoires qui semblent passées ou futures, tu ne sais pas trop. Tu flottes entre elles sans te poser nulle part.",
  "Alors que tu commences à te demander ce qui t'arrive, quelque chose approche dans le noir. Un livre. Il flotte jusqu'à toi, comme si l'obscurité le portait.",
  "Tu l'ouvres. Les pages sont blanches. Mais le livre est ancien — vraiment ancien. La reliure craque sous tes doigts, le papier sent la poussière et quelque chose que tu n'arrives pas à nommer.",
  "Après quelques instants à l'analyser, le livre se met à trembler.",
  "Il t'aspire.",
];

function PremierReve({ onNom }) {
  const [phase, setPhase] = useState(1);
  const [visible, setVisible] = useState(0);
  const [nom, setNom]     = useState("");
  const [nomVisible, setNomVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);

  // Phase 1 — apparition progressive des paragraphes
  useEffect(() => {
    if (phase !== 1) return;
    if (visible >= PROSE_REVE.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), visible === 0 ? 800 : 1800);
    return () => clearTimeout(t);
  }, [phase, visible]);

  // Phase 2 — "nom." puis input
  useEffect(() => {
    if (phase !== 2) return;
    const t1 = setTimeout(() => setNomVisible(true), 600);
    const t2 = setTimeout(() => setInputVisible(true), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  function confirmer() {
    const n = nom.trim();
    if (n.length < 2) return;
    onNom(n);
  }

  // Phase 1 — dérive narrative
  if (phase === 1) return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "3rem 1.8rem 8rem",
      maxWidth: 520, margin: "0 auto",
    }}>
      {/* Skip — coin haut droit */}
      <div style={{ position: "fixed", top: "1rem", right: "1.2rem" }}>
        <button onClick={() => setPhase(2)} style={{
          background: "transparent", border: "none",
          color: C.muted, fontSize: 9, letterSpacing: 3,
          textTransform: "uppercase", cursor: "pointer",
          fontFamily: "inherit",
        }}>skip</button>
      </div>

      {PROSE_REVE.slice(0, visible).map((p, i) => (
        <p key={i} style={{
          fontSize: "clamp(15px,2.5vw,17px)", lineHeight: 2,
          color: i < visible - 1 ? C.muted : C.text,
          fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
          fontStyle: "italic", marginBottom: "1.6rem",
          animation: "fadeUp .8s ease both",
          animationDelay: "0s",
          transition: "color 1s ease",
        }}>
          {p}
        </p>
      ))}

      {visible >= PROSE_REVE.length && (
        <button onClick={() => setPhase(2)} style={{
          background: "transparent", border: "none",
          color: C.muted, fontSize: 10, letterSpacing: 4,
          textTransform: "uppercase", cursor: "pointer",
          fontFamily: "inherit", marginTop: "1rem",
          animation: "fadeSlow 1.2s ease both",
        }}>
          continuer →
        </button>
      )}
    </div>
  );

  // Phase 2 — nom dans le noir
  if (phase === 2) return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem 2rem 40vh", background: C.bg,
    }}>
      {nomVisible && (
        <div style={{ animation: "fadeSlow 1s ease both", textAlign: "center", maxWidth: 320 }}>
          <p style={{
            fontSize: 14, color: C.muted, fontStyle: "italic",
            fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
            lineHeight: 2, marginBottom: "2rem",
          }}>
            Tu ne vois rien à part ce message dans ton esprit.
          </p>
          <div style={{
            fontSize: 13, letterSpacing: 4, color: C.text,
            textTransform: "uppercase", marginBottom: "0.8rem",
          }}>
            Quel est ton nom ?
          </div>
        </div>
      )}

      {inputVisible && (
        <div style={{ width: "100%", maxWidth: 300, animation: "fadeUp .8s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") confirmer(); }}
              autoFocus
              maxLength={28}
              style={{
                flex: 1,
                background: "transparent", border: "none",
                borderBottom: "1px solid " + C.dim,
                padding: "0.6rem 0", color: C.accent,
                fontSize: 24, fontStyle: "italic",
                fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
                outline: "none", textAlign: "center",
              }}
            />
            <button onClick={confirmer} disabled={nom.trim().length < 2}
              style={{
                flexShrink: 0,
                background: "transparent",
                border: "1px solid " + (nom.trim().length >= 2 ? C.accent : C.dim),
                borderRadius: 3, color: nom.trim().length >= 2 ? C.accent : C.dim,
                fontSize: 18, width: 40, height: 40,
                cursor: nom.trim().length >= 2 ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .15s",
              }}>
              ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return null;
}

// — Écran 0 : intro —

function IntroScreen({ onCommencer, heroExistant }) {
  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem 8rem" }} className="fade-in">
      <div style={{ textAlign: "center", maxWidth: 420, width: "100%" }}>
        <div style={{ fontSize: 9, letterSpacing: 6, color: C.muted, textTransform: "uppercase", marginBottom: "2rem" }}>
          Les Chroniques de
        </div>
        <h1 style={{ fontSize: "clamp(2.2rem,8vw,3.5rem)", fontWeight: "normal", color: C.accent, letterSpacing: 3, margin: "0 0 0.4rem", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>
          Ceux qui ont été lus
        </h1>
        <div style={{ width: 40, height: 1, background: C.dim, margin: "1rem auto" }} />
        <div style={{ fontSize: 10, letterSpacing: 4, color: C.muted, textTransform: "uppercase", marginBottom: "2rem" }}>
          Chroniques de Cendreterre
        </h1>
        <div style={{ width: 40, height: 1, background: C.dim, margin: "1.5rem auto" }} />
        <p style={{ fontSize: 13, color: C.muted, fontStyle: "italic", lineHeight: 2, margin: "0 0 3rem" }}>
          Le livre t'attend.<br />
          Le monde se souvient de toi.
        </p>
        {heroExistant ? (
          <div>
            <button onClick={() => onCommencer("reprendre")} style={{
              background: "transparent", border: "1px solid " + C.accent,
              borderRadius: 3, padding: "12px 24px", color: C.accent,
              fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
              display: "block", width: "100%", marginBottom: "0.8rem",
            }}>
              Reprendre le rêve — {heroExistant.nom}
            </button>
            <button onClick={() => onCommencer("nouveau")} style={{
              background: "transparent", border: "1px solid " + C.dim,
              borderRadius: 3, padding: "10px 24px", color: C.muted,
              fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
              display: "block", width: "100%",
            }}>
              Choisir un nouveau rêve
            </button>
          </div>
        ) : (
          <button onClick={() => onCommencer("nouveau")} style={{
            background: "transparent", border: "1px solid " + C.accent,
            borderRadius: 3, padding: "12px 24px", color: C.accent,
            fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
            cursor: "pointer", fontFamily: "inherit",
            display: "block", width: "100%",
          }}>
            Choisir un rêve
          </button>
        )}
      </div>
    </div>
  );
}

// — Écran 1 : choix du peuple —

function PeupleScreen({ onChoix, onBack, cles }) {
  const disponibles = getAvailablePeuples(cles || {});
  const peuplesDispo = PEUPLES.filter(p => disponibles.includes(p.id));

  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", padding: "2rem 1.5rem 8rem", maxWidth: 560, margin: "0 auto" }} className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase" }}>← retour</button>
      </div>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: 22, color: C.accent, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>De quel peuple es-tu ?</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: "0.5rem" }}>{peuplesDispo.length} peuple{peuplesDispo.length > 1 ? "s" : ""} débloqué{peuplesDispo.length > 1 ? "s" : ""}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {peuplesDispo.map(p => (
          <button key={p.id} onClick={() => onChoix(p)}
            style={{ background: "transparent", border: "1px solid " + C.dim, borderRadius: 3, padding: "1rem", textAlign: "left", cursor: "pointer", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", transition: "border-color .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.dim}>
            <div style={{ fontSize: 14, color: C.accent, marginBottom: "0.4rem", fontStyle: "italic" }}>{p.nom}</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{p.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MetierScreen({ peuple, onChoix, onBack, cles }) {
  const disponibles = getAvailableMetierIds(peuple.id, cles || {});
  const metiers = (METIERS[peuple.id] || []).filter(m => disponibles.includes(m.id));

  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", padding: "2rem 1.5rem 8rem", maxWidth: 560, margin: "0 auto" }} className="fade-in">
      <div style={{ marginBottom: "2rem" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", marginBottom: "1.5rem", display: "block" }}>← retour</button>
        <div style={{ fontSize: 10, letterSpacing: 4, color: C.muted, textTransform: "uppercase", marginBottom: "0.5rem" }}>{peuple.nom}</div>
        <div style={{ fontSize: 20, color: C.accent, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>Quel est ton métier ?</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {metiers.map(m => (
          <button key={m.id} onClick={() => onChoix(m)}
            style={{ background: "transparent", border: "1px solid " + C.dim, borderRadius: 3, padding: "0.9rem 1rem", textAlign: "left", cursor: "pointer", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", transition: "border-color .15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.dim}>
            <div style={{ fontSize: 14, color: C.text, fontStyle: "italic", marginBottom: "0.25rem" }}>{m.nom}</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// — Écran 3 : nom + genre —

function NomScreen({ peuple, metier, onConfirm, onBack }) {
  const [nom, setNom]     = useState("");
  const [genre, setGenre] = useState(null);
  const canSubmit = nom.trim().length >= 2;

  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", padding: "3rem 2rem 10rem" }} className="fade-in">
      <div style={{ width: "100%", maxWidth: 380, margin: "0 auto" }}>
        <button onClick={onBack} style={{
          background: "transparent", border: "none",
          color: C.muted, fontSize: 11, letterSpacing: 2,
          cursor: "pointer", fontFamily: "inherit",
          textTransform: "uppercase", marginBottom: "2rem",
          display: "block",
        }}>← retour</button>

        {/* Résumé */}
        <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid " + C.dim }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.3rem" }}>
            {peuple.nom}
          </div>
          <div style={{ fontSize: 16, color: C.text, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>
            {metier.nom}
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: "0.3rem", lineHeight: 1.6 }}>
            {metier.desc}
          </div>
        </div>

        {/* Nom */}
        <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.4rem" }}>
          Nom
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "2rem" }}>
          <input
            type="text"
            value={nom}
            onChange={e => setNom(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && canSubmit) onConfirm(nom.trim(), genre); }}
            placeholder="un nom..."
            maxLength={28}
            autoFocus
            style={{
              flex: 1,
              background: "transparent", border: "none",
              borderBottom: "1px solid " + C.dim,
              padding: "0.5rem 0", color: C.accent,
              fontSize: 22, fontStyle: "italic",
              fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
              outline: "none",
            }}
          />
          <button onClick={() => { if (canSubmit) onConfirm(nom.trim(), genre); }}
            style={{
              flexShrink: 0,
              background: "transparent",
              border: "1px solid " + (canSubmit ? C.accent : C.dim),
              borderRadius: 3, color: canSubmit ? C.accent : C.dim,
              fontSize: 18, width: 40, height: 40,
              cursor: canSubmit ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .15s",
            }}>
            ✓
          </button>
        </div>

        {/* Genre */}
        <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Genre (optionnel)
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: "2.5rem" }}>
          {[["M","il"],["F","elle"],["N","iel"]].map(([g, label]) => (
            <button key={g} onClick={() => setGenre(genre === g ? null : g)}
              style={{
                background: "transparent",
                border: "1px solid " + (genre === g ? C.accent : C.dim),
                borderRadius: 3, padding: "6px 16px",
                color: genre === g ? C.accent : C.muted,
                fontSize: 11, letterSpacing: 1,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Bouton commencer */}
        <button
          onClick={() => { if (canSubmit) onConfirm(nom.trim(), genre); }}
          disabled={!canSubmit}
          style={{
            background: "transparent",
            border: "1px solid " + (canSubmit ? C.accent : C.dim),
            borderRadius: 3, padding: "12px 24px",
            color: canSubmit ? C.accent : C.dim,
            fontSize: 11, letterSpacing: 4,
            textTransform: "uppercase",
            cursor: canSubmit ? "pointer" : "default",
            fontFamily: "inherit",
            display: "block", width: "100%",
            transition: "all .15s",
          }}>
          Commencer
        </button>
      </div>
    </div>
  );
}

// ============================================================
// SECTION 6 — APP
// ============================================================

export default function App() {
  const [screen,       setScreen]      = useState("loading");
  const [hero,         setHero]        = useState(null);
  const [world,        setWorld]       = useState({ pnj:{}, objets:{}, fils:[], lieux:{}, cles:{}, legacy:[], evt:{} });
  const [deadHero,     setDeadHero]    = useState(null);
  const [pendingDeath, setPendingDeath]= useState(null); // null | "mort" | "abandon"
  const [prose,        setProse]       = useState("");
  const [streaming, setStreaming] = useState(false);
  const [going,     setGoing]     = useState(false);
  const [err,       setErr]       = useState(null);
  const [rateLimit, setRateLimit] = useState(false);

  // Création en cours
  const [pendingPeuple, setPendingPeuple] = useState(null);
  const [pendingMetier, setPendingMetier] = useState(null);

  const histRef  = useRef([]);
  const heroRef  = useRef(null);
  const worldRef = useRef({ pnj:{}, fils:[], lieux:{}, cles:{}, legacy:[] });
  const tapRef   = useRef(0);

  // — Chargement initial —
  useEffect(() => {
    Promise.all([storageLoad(HERO_KEY), storageLoad(WORLD_KEY)]).then(([savedHero, savedWorld]) => {
      if (savedWorld) worldRef.current = savedWorld;
      if (savedHero && savedHero.vivant) {
        heroRef.current = savedHero;
        histRef.current = savedHero.hist || [];
        setHero(savedHero);
        if ((savedHero.sceneCount || 0) > 0) {
          const dernierSnippet = (savedHero.hist || []).slice(-1)[0];
          if (dernierSnippet) setProse("[ … ]\n\n" + dernierSnippet + "\n\n—");
          setScreen("jeu");
          return;
        }
      }
      // Premier joueur absolu → directement au rêve, sans bouton intermédiaire
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
      setProse(buildRappelLocal(histRef.current));
    } else {
      setScreen("creation_peuple");
    }
  }

  function handlePremierNom(nom) {
    const peuple = PEUPLES.find(p => p.id === "cendreux");
    const metier = METIERS.cendreux.find(m => m.id === "paysan");
    setPendingPeuple(peuple);
    setPendingMetier(metier);
    const h = initHero(peuple, metier, nom, null);
    heroRef.current = h;
    histRef.current = [];
    setHero(h);
    storageSave(HERO_KEY, h);
    setErr(null); setRateLimit(false);
    setScreen("jeu");
    // LLM — survie, carrefour, rien
    playScene(OUVERTURE_SURVIE, "ouverture", false);
  }

  async function lancerRandom() {
    const h = randomHero();
    heroRef.current = h;
    histRef.current = [];
    setHero(h);
    await storageSave(HERO_KEY, h);
    setProse(""); setErr(null); setRateLimit(false);
    setScreen("jeu");
    playScene(OUVERTURE_SURVIE, "ouverture", false);
  }

  // — Flux création —

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
    heroRef.current = h;
    histRef.current = [];
    setHero(h);
    await storageSave(HERO_KEY, h);
    setProse(""); setErr(null); setRateLimit(false);
    setScreen("jeu");
    playScene(OUVERTURE_SURVIE, "ouverture", false);
  }

  // — Jeu —

  function buildRappelLocal(hist) {
    const snippets = hist.slice(-2);
    if (!snippets.length) return "Tu reprends là où tu en étais.\n\nQu'est-ce que tu fais ?";
    return "[ … ]\n\n" + snippets.join("\n\n[ … ]\n\n") + "\n\n—";
  }

  function buildOuvertureLocale(h) {
    const region = LIEUX_BASE[lieuKey(h.lieu)];
    const physique = region ? region.physique.split(",")[0].trim() : h.lieu;
    const ambiance = region ? region.ambiance.split(".")[0].trim() : "";
    return h.lieu + (physique ? " — " + physique : "") + ".\n\n"
      + (ambiance ? ambiance + ".\n\n" : "")
      + "Tu es " + h.metier.nom.toLowerCase() + ". " + h.metier.desc
      + "\n\nQu'est-ce que tu fais ?";
  }

  function buildHint(txt) {
    const t = txt.toLowerCase();

    // VOYAGE — arc long, couvre de la distance
    if (/partir|voyage|route|rejoindre|me rendre|aller à|aller a|se diriger|traverser|marcher vers|quitter|fuir vers/.test(t))
      return "[VOYAGE] " + txt + "\n→ Joue l'arc complet du voyage. Les distances sont dans le CTX (distances=[...]). Calibre la durée et les événements en conséquence. Les événements ordinaires passent dans la prose sans s'arrêter. Tu t'arrêtes uniquement si quelque chose de critique émerge — un choix réel, un danger, une information qui change tout. Sinon on arrive à destination.";

    // COMBAT — arc moyen, résolution complète
    if (/attaquer|frapper|tirer|combattre|se battre|assommer|dégainer|charger|foncer sur|affronter/.test(t))
      return "[COMBAT] " + txt + "\n→ Joue jusqu'à résolution claire — victoire, défaite, fuite, impasse. Pas s'arrêter à chaque coup. S'arrêter si un choix moral ou une bifurcation réelle émerge.";

    // EXPLORATION — arc moyen, fouille d'un lieu ou espace
    if (/fouiller|explorer|inspecter|chercher dans|scruter|parcourir|passer au peigne/.test(t))
      return "[EXPLORATION] " + txt + "\n→ Joue la découverte jusqu'au bout. Le joueur cherche — il doit trouver quelque chose de concret et d'utilisable, pas une description d'ambiance. Un objet, une information, une voie, une personne. S'arrêter une fois la trouvaille faite ou si un danger émerge.";

    // SURVEILLANCE — arc court, observer avec un objectif précis
    if (/surveiller|guetter|observer|épier|suivre|filer|faire le guet|tenir à l'oeil/.test(t))
      return "[SURVEILLANCE] " + txt + "\n→ Joue ce que le héros observe pendant qu'il attend. S'arrêter quand ce qu'il attendait se produit, ou quand quelque chose d'inattendu change la donne.";

    // ATTENTE — arc moyen, temps qui passe
    if (/attendre|se reposer|passer la nuit|dormir|camper|bivouaquer|faire une pause|laisser passer/.test(t))
      return "[ATTENTE] " + txt + "\n→ Joue le temps qui passe avec ce qu'il apporte. Les événements mineurs passent dans la prose. S'arrêter si quelque chose interrompt ou si le temps demandé est écoulé.";

    // DISCOURS — arc court à moyen, interaction sociale jusqu'à réponse
    if (/parler à|dire à|demander à|s'adresser à|expliquer à|raconter à|convaincre|négocier|negocier|persuader|marchander|interroger|soutirer|aborder|interpeller/.test(t))
      return "[DISCOURS] " + txt + "\n→ Joue la conversation jusqu'à une réponse naturelle — accord, refus, fuite, révélation. Pas couper au milieu d'un échange. Les gens ordinaires répondent de façon ordinaire.";

    // Pas de hint — action ponctuelle, le LLM joue normalement
    return txt;
  }

  async function playScene(intention, label, skipHist) {
    if (going) return;
    const h = heroRef.current;
    if (!h) return;
    setGoing(true); setErr(null); setRateLimit(false);
    setProse(""); setStreaming(true);

    const ctx = buildCtx(h, worldRef.current, histRef.current);
    const intentionFinale = skipHist ? intention : buildHint(intention);
    let collected = "";

    try {
      const { prose: result, data } = await callLLM(ctx, intentionFinale, chunk => {
        collected += chunk;
        setProse(prev => prev + chunk);
      });
      setStreaming(false);
      setProse(result);

      // Appliquer fd — ce qui change sur le héros
      let newHero = skipHist ? h : applyFd(h, data.fd || {});

      // Mort détectée — on note et on attend la confirmation du joueur
      if (data.fd && data.fd.mort) {
        const snapshot = { prose: result.slice(0, 150), lieu: newHero.lieu };
        const newHist = [...histRef.current, snapshot].slice(-6);
        histRef.current = newHist;
        newHero = { ...newHero, hist: newHist, sceneCount: (h.sceneCount||0)+1, dernierChoix: label||intention };
        heroRef.current = newHero;
        setHero(newHero);
        await storageSave(HERO_KEY, newHero);
        setPendingDeath("mort");
        return;
      }

      // Appliquer ld — ce qui change dans le monde
      if (!skipHist) {
        const newWorld = applyLd(worldRef.current, data.ld || {});
        worldRef.current = newWorld;
        setWorld(newWorld);
        await storageSave(WORLD_KEY, newWorld);
      }

      // Construire le snapshot de cette scène
      const snapshot = {
        prose:        result.slice(0, 150),
        lieu:         newHero.lieu,
        hint:         skipHist ? null : (intentionFinale !== intention ? intentionFinale.split("]")[0].replace("[","") : null),
      };
      if (data.ld?.consequences?.length)  snapshot.consequences = data.ld.consequences;
      if (data.ld?.meteo)                 snapshot.meteo        = data.ld.meteo;
      if (newHero.physique)               snapshot.physique     = newHero.physique;
      if (newHero.humeur)                 snapshot.humeur       = newHero.humeur;
      if (newHero.inventaire?.length)     snapshot.inventaire   = newHero.inventaire;

      // PNJ présents dans cette scène
      if (data.ld?.pnj) {
        snapshot.pnj = Object.entries(data.ld.pnj).map(([nom, p]) =>
          nom + (p.position ? " — " + p.position : "") + (p.humeur ? " [" + p.humeur + "]" : "")
        );
      }

      const newHist = skipHist
        ? histRef.current
        : [...histRef.current, snapshot].slice(-6);
      histRef.current = newHist;

      newHero = {
        ...newHero,
        hist:        newHist,
        sceneCount:  skipHist ? h.sceneCount : (h.sceneCount || 0) + 1,
        dernierChoix: label || intention,
      };
      heroRef.current = newHero;
      setHero(newHero);
      await storageSave(HERO_KEY, newHero);

    } catch(e) {
      setStreaming(false);
      if (e.message === "RATE_LIMIT") setRateLimit(true);
      else setErr(e.message);
    } finally {
      setGoing(false);
    }
  }

  async function handleEndReve(type) {
    // type = "mort" | "abandon"
    const h = heroRef.current;
    if (!h) return;

    const worldClesAvant = { ...worldRef.current.cles };
    const nouveaux = computeNewUnlocks(worldRef.current.cles, worldClesAvant);

    const legacy = buildLegacy(h);
    legacy.statut = type === "mort" ? "mort" : "vivant_quelque_part";
    legacy.nouveauxDeblocages = nouveaux;

    const newWorld = {
      ...worldRef.current,
      legacy: [...(worldRef.current.legacy || []), legacy],
    };
    worldRef.current = newWorld;
    setWorld(newWorld);
    await storageSave(WORLD_KEY, newWorld);
    await storageDel(HERO_KEY);
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
    await storageDel(HERO_KEY);
    heroRef.current = null;
    histRef.current = [];
    worldRef.current = { pnj:{}, objets:{}, fils:[], lieux:{}, cles:{}, legacy:[], evt:{} };
    setHero(null); setProse(""); setErr(null); setRateLimit(false);
    setPendingPeuple(null); setPendingMetier(null);
    setScreen("premier_reve");
  }

  // — Render —

  if (screen === "loading") return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.dim, fontSize: 10, letterSpacing: 5 }} className="pulse">...</div>
    </div>
  );

  return (
    <div style={{
      background: C.bg, minHeight: "100vh",
      fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
      color: C.text,
    }}>
      <style>{CSS}</style>

      {/* PREMIER RÊVE */}
      {screen === "premier_reve" && (
        <PremierReve onNom={handlePremierNom} />
      )}

      {/* INTRO */}
      {screen === "intro" && (
        <IntroScreen onCommencer={handleIntro} heroExistant={hero} />
      )}

      {/* CRÉATION — Peuple */}
      {screen === "creation_peuple" && (
        <PeupleScreen onChoix={choisirPeuple} onBack={() => setScreen("intro")} cles={worldRef.current.cles || {}} />
      )}

      {/* CRÉATION — Métier */}
      {screen === "creation_metier" && pendingPeuple && (
        <MetierScreen peuple={pendingPeuple} onChoix={choisirMetier} onBack={() => setScreen("creation_peuple")} cles={worldRef.current.cles || {}} />
      )}

      {/* CRÉATION — Nom */}
      {screen === "creation_nom" && pendingPeuple && pendingMetier && (
        <NomScreen
          peuple={pendingPeuple}
          metier={pendingMetier}
          onConfirm={confirmerHero}
          onBack={() => {
            const cles = worldRef.current.cles || {};
            const hasCles = Object.keys(cles).some(k => cles[k]);
            setScreen(hasCles ? "creation_metier" : "intro");
          }}
        />
      )}

      {/* JEU */}
      {screen === "jeu" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

          {/* En-tête */}
          <div style={{
            borderBottom: "1px solid " + C.dim,
            padding: "0.8rem 1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexShrink: 0,
          }}>
            <div>
              <span style={{ fontSize: 13, color: C.accent, fontStyle: "italic" }}>{hero?.nom}</span>
              <span style={{ fontSize: 10, color: C.muted, marginLeft: 10, letterSpacing: 2 }}>
                {hero?.peuple?.nom} · {hero?.metier?.nom} · {hero?.lieu}
              </span>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {!pendingDeath && !going && prose && (
                <button onClick={() => setPendingDeath("abandon")} style={{
                  background: "transparent", border: "1px solid " + C.dim,
                  borderRadius: 3, padding: "4px 10px",
                  color: C.muted, fontSize: 9, letterSpacing: 2,
                  cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
                }}>quitter le rêve</button>
              )}
              <button onClick={reset} style={{
                background: "transparent", border: "none",
                color: C.dim, fontSize: 9, letterSpacing: 3,
                cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
              }}>···</button>
            </div>
          </div>

          {/* Zone prose */}
          <div style={{ flex: 1, overflowY: "auto", maxWidth: 620, width: "100%", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

            {going && !prose && (
              <div style={{ textAlign: "center", padding: "4rem 0", color: C.dim, fontSize: 24 }} className="pulse">
                ···
              </div>
            )}

            {prose && (
              <div className="fade-in">
                <Prose text={prose} streaming={streaming} />
              </div>
            )}

            {err && (
              <div style={{ color: C.red, fontSize: 12, fontStyle: "italic", marginBottom: "1rem" }}>
                {err}
              </div>
            )}
            {rateLimit && (
              <div style={{ color: C.muted, fontSize: 12, fontStyle: "italic", marginBottom: "1rem" }}>
                Trop de requêtes — attends un moment.
              </div>
            )}

            {/* Confirmation mort ou abandon */}
            {!streaming && pendingDeath && (
              <div style={{ textAlign: "center", padding: "2rem 0" }} className="fade-slow">
                <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: "1.5rem" }}>
                  {pendingDeath === "mort"
                    ? "Le rêve s'arrête ici."
                    : "Tu te retires. " + (hero?.nom) + " continue quelque part."}
                </div>
                <button onClick={() => handleEndReve(pendingDeath)} style={{
                  background: "transparent", border: "1px solid " + C.dim,
                  borderRadius: 3, padding: "10px 24px",
                  color: C.muted, fontSize: 10, letterSpacing: 3,
                  textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
                }}>
                  {pendingDeath === "mort" ? "Continuer" : "Quitter"}
                </button>
                {pendingDeath === "abandon" && (
                  <button onClick={() => setPendingDeath(null)} style={{
                    background: "transparent", border: "none",
                    color: C.muted, fontSize: 9, letterSpacing: 2,
                    textTransform: "uppercase", cursor: "pointer",
                    fontFamily: "inherit", display: "block",
                    margin: "0.8rem auto 0",
                  }}>
                    rester dans le rêve
                  </button>
                )}
              </div>
            )}

            {/* Input dans le scroll */}
            {!streaming && !pendingDeath && !deadHero && (
              <div className="fade-slow">
                <Input onPlay={playScene} going={going} />
              </div>
            )}

            {/* Écran de fin — mort ou abandon */}
            {deadHero && (
              <div style={{ textAlign: "center", padding: "3rem 0" }} className="fade-in">
                <div style={{ fontSize: 10, letterSpacing: 5, color: deadHero.statut === "mort" ? C.red : C.muted, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  {deadHero.statut === "mort"
                    ? "Le rêve est terminé."
                    : deadHero.nom + " continue quelque part dans Cendreterre."}
                </div>
                <div style={{ fontSize: 18, color: C.muted, fontStyle: "italic", marginBottom: "0.3rem" }}>
                  {deadHero.nom}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: "2rem" }}>
                  {deadHero.peuple?.nom} · {deadHero.metier?.nom} · {deadHero.sceneCount} scène{deadHero.sceneCount > 1 ? "s" : ""}
                </div>

                {deadHero.nouveauxDeblocages &&
                  (deadHero.nouveauxDeblocages.peuples?.length > 0 || deadHero.nouveauxDeblocages.metiers?.length > 0) && (
                  <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid " + C.dim, borderRadius: 3, textAlign: "left", maxWidth: 320, margin: "0 auto 2rem" }}>
                    <div style={{ fontSize: 9, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: "0.8rem" }}>
                      Nouvelles cartes débloquées
                    </div>
                    {(deadHero.nouveauxDeblocages.peuples || []).map(p => {
                      const peuple = PEUPLES.find(pl => pl.id === p);
                      return peuple ? (
                        <div key={p} style={{ fontSize: 12, color: C.text, fontStyle: "italic", marginBottom: "0.3rem" }}>◆ {peuple.nom}</div>
                      ) : null;
                    })}
                    {(deadHero.nouveauxDeblocages.metiers || []).map((m, i) => (
                      <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: "0.2rem" }}>· {m}</div>
                    ))}
                  </div>
                )}

                <button onClick={() => { setDeadHero(null); setProse(""); setScreen("intro"); }} style={{
                  background: "transparent", border: "1px solid " + C.dim,
                  borderRadius: 3, padding: "10px 24px",
                  color: C.muted
  );
    }
