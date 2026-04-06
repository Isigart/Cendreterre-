import { useState, useEffect, useRef } from "react";

// ============================================================
// SECTION 1 — INFRASTRUCTURE
// ============================================================

const HERO_KEY  = "ctl-hero";
const WORLD_KEY = "ctl-world";

function storageLoad(key) {
  try {
    const v = localStorage.getItem(key);
    return Promise.resolve(v ? JSON.parse(v) : null);
  } catch(e) { return Promise.resolve(null); }
}


function storageSave(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  return Promise.resolve();
}

function storageDel(key) {
  try { localStorage.removeItem(key); } catch(e) {}
  return Promise.resolve();
}

// ============================================================
// SECTION 2 — DONNÉES STATIQUES
// ============================================================

const PEUPLES = [
  {
    id:    "cendreux",
    nom:   "Cendreux",
    desc:  "Le peuple de Cendreterre. L'empire les a vaincus — pas soumis.",
    magie: "Ingénierie de circuits. Énergie stockée, outils, architecture. Jamais des sorts.",
    lieu:  ["Hautcendre", "Ramasse", "La Lisière"],
  },
  {
    id:    "sonneur",
    nom:   "Sonneur",
    desc:  "Peuple des profondeurs. Trapu, dense, voix de roche. Leur chant est une amitié sincère avec la terre.",
    magie: "Chant vibratoire. Toujours défensif. La terre répond comme un allié, pas un outil.",
    lieu:  ["Pierrelong"],
  },
  {
    id:    "sylvain",
    nom:   "Sylvain",
    desc:  "Reclus dans leur forêt depuis la conquête. Anciens et distants — pas des elfes bienveillants.",
    magie: "Chakra et gestes élémentaires. Efficace et froid. La forêt protège qui elle décide.",
    lieu:  ["Val des Brumes", "La Lisière"],
  },
  {
    id:    "agritan",
    nom:   "Agritan",
    desc:  "Tatouages de vécu vrai. Le mensonge les corrompt physiquement. Les plus honnêtes de Cendreterre.",
    magie: "Tatouages de vécu vrai. Chaque épreuve réelle grave une force. Le mensonge corrompt les marques.",
    lieu:  ["Hauts Plateaux"],
  },
  {
    id:    "foulard",
    nom:   "Foulard",
    desc:  "Nomades. Réseau d'information. Neutralité sacrée. Pour eux — les Foulards d'abord.",
    magie: "Runes sur support matériel. Illisibles pour les autres. Jamais spectaculaire.",
    lieu:  ["La Croisée", "Ramasse"],
  },
  {
    id:    "ratainien",
    nom:   "Ratainien",
    desc:  "Le peuple de l'empire occupant. Administration et clergé entremêlés. Présents ici par punition ou manque de chance.",
    magie: "Foi sincère qui reçoit parfois une réponse. Miracles rares et imprévisibles.",
    lieu:  ["Marceins", "Les Cols"],
  },
];

const METIERS = {
  cendreux: [
    { id: "paysan",        nom: "Paysan",              desc: "Travaille la terre que sa famille cultivait avant lui. L'empire taxe la récolte. Il continue quand même." },
    { id: "ouvrier",       nom: "Ouvrier",             desc: "Travaille de ses mains pour quelqu'un d'autre. Les chantiers ne manquent pas depuis que l'empire construit." },
    { id: "journalier",    nom: "Journalier",          desc: "Va là où on a besoin de bras. Pas de patron fixe, pas d'attaches." },
    { id: "braconnier",    nom: "Braconnier",          desc: "Prend ce que la terre donne sans demander la permission. L'empire a des règles sur ça. Il les connaît." },
    { id: "marchand",      nom: "Marchand",            desc: "Achète, vend, se déplace. Sait ce qui circule et où." },
    { id: "porteur_mots",  nom: "Porteur de mots",     desc: "Transporte des messages qu'il ne lit pas. Ou qu'il lit et qu'il oublie aussitôt." },
    { id: "contrebandier", nom: "Contrebandier",       desc: "Fait passer des choses d'un endroit à un autre sans que personne pose de questions." },
    { id: "resistant",     nom: "Résistant",           desc: "Fait partie d'un petit groupe qui s'oppose à l'occupation impériale. Discret par nécessité." },
    { id: "collaborateur", nom: "Collaborateur",       desc: "Travaille avec l'administration impériale. Les raisons ne regardent que lui." },
    { id: "soldat_demo",   nom: "Soldat démobilisé",   desc: "A servi. Ne sert plus. Ce qu'il a fait ou vu reste avec lui." },
    { id: "mecano",        nom: "Mécanicien",          desc: "Répare ce que les autres ne comprennent plus. Les vieux circuits Cendreux tiennent grâce à des gens comme lui." },
    { id: "ingenieur",     nom: "Ingénieur",           desc: "Comprend les circuits mieux que la plupart. Ce savoir a de la valeur — pas toujours pour les bonnes personnes." },
    { id: "conseiller",    nom: "Conseiller",          desc: "Siège au conseil de Hautcendre. Une institution qui existe encore. Avec de moins en moins d'influence." },
  ],
  sonneur: [
    { id: "mineur",          nom: "Mineur des profondeurs",    desc: "Travaille les galeries profondes. Sait lire la roche mieux que la plupart." },
    { id: "commergant_surf", nom: "Commerçant de surface",     desc: "Tient la façade. Traite avec l'extérieur pour que les profondeurs restent tranquilles." },
    { id: "messager_sonn",   nom: "Messager entre les villes", desc: "Connaît les tunnels qui relient les villes Sonneuses. Des routes que l'empire ne sait pas cartographier." },
    { id: "gardien_galerie", nom: "Gardien des galeries",      desc: "Surveille ce qui entre et ce qui sort. Les étrangers qui descendent passent par lui — ou pas." },
    { id: "eleveur_taupe",   nom: "Éleveur de taupes",         desc: "Élève et dresse les taupes des hauts plateaux. Un lien qui se construit sur des années." },
    { id: "chanteur",        nom: "Chanteur d'affinité",       desc: "A un lien particulier avec la terre. Ses chants vont plus loin que ceux du quotidien." },
    { id: "zin_guerre",      nom: "Zin de guerre",             desc: "Fait partie d'un Zin spécialisé dans la défense. Les Sonneurs n'attaquent pas. Mais quand il le faut, on les appelle." },
    { id: "ancien_zin",      nom: "Ancien du Zin",             desc: "Porte la mémoire de son Zin. Les chants les plus vieux passent par lui." },
    { id: "enfant_terre",    nom: "Enfant de la terre",        desc: "Improvise. Ne chante pas des chants appris. Parle directement à la terre. Elle répond." },
  ],
  sylvain: [
    { id: "apprenti_sylv",   nom: "Apprenti",            desc: "Apprend encore, trouve son affinité élémentaire." },
    { id: "praticien_sylv",  nom: "Praticien",           desc: "Maîtrise son élément, autonome dans la forêt." },
    { id: "enseignant_sylv", nom: "Enseignant",          desc: "Transmet les techniques aux apprentis." },
    { id: "gardien_epreuve", nom: "Gardien en épreuve",  desc: "Envoyé dans le monde par l'arbre sacré. A une mission. Ne traîne pas." },
    { id: "ancien_sylv",     nom: "Ancien",              desc: "Consulte les arbres sacrés, prend les décisions du village." },
  ],
  agritan: [
    { id: "enfant_agr",   nom: "Enfant",    desc: "Avant le premier tatouage. Pas encore compté parmi les adultes. Observe. Attend." },
    { id: "guerrier_agr", nom: "Guerrier",  desc: "A prouvé sa valeur. Chaque combat, chaque épreuve réelle est inscrite sur sa peau et le renforce." },
    { id: "paria_agr",    nom: "Paria",     desc: "Exclu de la tribu. Les raisons sont connues. Voyage seul avec ce qu'il porte déjà sur lui." },
    { id: "dresseur_agr", nom: "Dresseur",  desc: "Vit avec les mammouths. Un lien qui prend des années." },
    { id: "tatoueur_agr", nom: "Tatoueur",  desc: "Rôle sacré. Ne tatoue que lors de cérémonies. Pour du vécu vrai, validé par la tribu." },
    { id: "chef_agr",     nom: "Chef",      desc: "Porte les tatouages les plus lus. L'histoire de la tribu passe par lui." },
  ],
  foulard: [
    { id: "coureur_route",    nom: "Coureur de route",      desc: "Couvre les grands axes. L'information se vend avant de devenir de l'histoire." },
    { id: "sedentaire",       nom: "Sédentaire",            desc: "A perdu l'alphabet et la tortue. Voit les runes, sent quelque chose, ne comprend pas. Foulard quand même." },
    { id: "runiste",          nom: "Runiste",               desc: "Inscrit les runes. Choisit le matériau, dose l'effet, connaît l'usure. Travaille pour qui paie le bon prix." },
    { id: "marchand_mots",    nom: "Marchand de mots",      desc: "Tient des marchés cachés d'information. Son réseau collecte, lui vend." },
    { id: "cartographe",      nom: "Cartographe",           desc: "Lit les runes et négocie avec le terrain. Tant qu'il peut graver, il trouve un chemin." },
    { id: "marchand_croisee", nom: "Marchand de La Croisée",desc: "Tient un comptoir quand La Croisée se forme. Vend à tout le monde. Disparaît avec elle." },
    { id: "lame_sil",         nom: "Lame silencieuse",      desc: "Protège les transactions et les Foulards. N'existe pas officiellement." },
    { id: "gardien_alpha",    nom: "Gardien de l'alphabet", desc: "Désigné par la tortue. Chef du groupe en symbiose avec elle. L'un sans l'autre est incomplet." },
  ],
  ratainien: [
    { id: "legionnaire",     nom: "Légionnaire",            desc: "Soldat de base. Posting de punition ou pas de chance. Fait son service." },
    { id: "decurion",        nom: "Décurion",               desc: "Chef de section. Gère ses hommes, évite les problèmes." },
    { id: "collecteur_rat",  nom: "Collecteur",             desc: "Perçoit l'impôt. Détesté. Le sait." },
    { id: "scribe_imp",      nom: "Scribe impérial",        desc: "Tient les registres. Invisible tant qu'il fait ses chiffres." },
    { id: "marchand_rat",    nom: "Marchand ratainien",     desc: "Fait des affaires. Avec tout le monde si possible." },
    { id: "colon",           nom: "Colon",                  desc: "Venu chercher mieux. A trouvé la haine." },
    { id: "missionnaire",    nom: "Frère missionnaire",     desc: "Évangélise en bonne foi. Croit vraiment. Les prières fonctionnent." },
    { id: "prelat",          nom: "Prélat",                 desc: "Construit une institution sur quelque chose qui lui échappe. Ambitieux ou aveugle." },
    { id: "centurion",       nom: "Centurion",              desc: "Commande une centurie. Peut être dangereux ou accommodant selon son caractère." },
    { id: "legat",           nom: "Légat",                  desc: "Commandant de garnison. Politique autant que militaire." },
    { id: "gouverneur_dist", nom: "Gouverneur de district", desc: "Entre les ordres de là-bas et la réalité d'ici." },
  ],
};

const DEBLOCAGES = {
  peuples: {
    sonneur:   ["faction_sonneurs_surface"],
    sylvain:   ["faction_sylvains_lisiere"],
    agritan:   ["faction_agritans_croise"],
    foulard:   ["faction_foulards_service"],
    ratainien: ["occupation_comprise"],
  },
  metiers: {
    cendreux: [
      { cles: [],                                              ids: ["paysan","ouvrier","journalier","braconnier","marchand","porteur_mots"] },
      { cles: ["occupation_vecue"],                            ids: ["contrebandier"] },
      { cles: ["resistance_contactee"],                        ids: ["resistant"] },
      { cles: ["collaboration_vue"],                           ids: ["collaborateur"] },
      { cles: ["occupation_comprise"],                         ids: ["soldat_demo"] },
      { cles: ["apprentissage_metier"],                        ids: ["mecano"] },
      { cles: ["apprentissage_magie"],                         ids: ["ingenieur"] },
      { cles: ["faction_conseil_compris"],                     ids: ["conseiller"] },
    ],
    sonneur: [
      { cles: ["faction_sonneurs_surface"],                    ids: ["mineur","commergant_surf","messager_sonn"] },
      { cles: ["faction_sonneurs_profondeur"],                 ids: ["gardien_galerie","eleveur_taupe","chanteur","zin_guerre","ancien_zin","enfant_terre"] },
    ],
    sylvain: [
      { cles: ["faction_sylvains_lisiere"],                    ids: ["apprenti_sylv"] },
      { cles: ["faction_sylvains_accepte"],                    ids: ["praticien_sylv","enseignant_sylv","gardien_epreuve"] },
      { cles: ["faction_sylvains_accepte","oublie_indirect"],  ids: ["ancien_sylv"] },
    ],
    agritan: [
      { cles: ["faction_agritans_croise"],                     ids: ["enfant_agr","guerrier_agr","paria_agr"] },
      { cles: ["faction_agritans_lien"],                       ids: ["dresseur_agr","tatoueur_agr","chef_agr"] },
    ],
    foulard: [
      { cles: ["faction_foulards_service"],                    ids: ["coureur_route","sedentaire"] },
      { cles: ["faction_foulards_reseau"],                     ids: ["runiste","marchand_mots","cartographe","marchand_croisee"] },
      { cles: ["faction_foulards_reseau","voyage_region_3"],   ids: ["lame_sil","gardien_alpha"] },
    ],
    ratainien: [
      { cles: ["occupation_comprise"],                         ids: ["legionnaire","decurion","collecteur_rat","scribe_imp","marchand_rat","colon"] },
      { cles: ["faction_clerge_observe"],                      ids: ["missionnaire"] },
      { cles: ["faction_clerge_protege"],                      ids: ["prelat"] },
      { cles: ["faction_empire_remarque"],                     ids: ["centurion","legat","gouverneur_dist"] },
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

const PRENOMS_M = ["Aldric","Cael","Tavar","Drenn","Renn","Kord","Broc","Harun","Pell","Mael","Bran","Kern","Hadris","Corvyn","Elden","Faryn","Ulven","Tarek","Vorn","Osric"];
const PRENOMS_F = ["Maren","Sorel","Linh","Brin","Orsa","Nessa","Ayla","Lira","Sian","Elva","Wren","Sela","Mira","Vael","Rynn","Dessa","Caera","Nira","Maeve","Vorna"];
const PRENOMS_N = ["Fen","Sael","Bryn","Lorn","Skael","Aryn","Kael","Oren","Talin","Seren","Dryn","Faen","Coryn","Veyn","Ryth"];

function randomPrenom(genre) {
  const pool = genre === "M" ? PRENOMS_M : genre === "F" ? PRENOMS_F : PRENOMS_N;
  return pool[Math.floor(Math.random() * pool.length)];
}

function initHero(peuple, metier, nom, genre) {
  const lieu = peuple.lieu[Math.floor(Math.random() * peuple.lieu.length)];
  return {
    nom,
    genre: genre || null,
    peuple: { id: peuple.id, nom: peuple.nom, desc: peuple.desc },
    metier: { id: metier.id, nom: metier.nom, desc: metier.desc },
    magie: peuple.magie,
    lieu,
    traits:       { public: [], stats: [metier.desc], acquis: [] },
    inventaire:   [],
    hist:         [],
    vivant:       true,
    sceneCount:   0,
    dernierChoix: null,
  };
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
// SECTION 3 — DONNÉES MONDE
// ============================================================

const OUVERTURE_SURVIE = "première scène — le héros reprend conscience. Il est dehors. De l'herbe sous lui, un ciel au-dessus. Des arbres peut-être, des champs peut-être, quelque chose au loin — rien de précis. Juste la nature, le silence, et des besoins immédiats : il a soif, il a faim, le froid commence à mordre. Il n'a rien sur lui. Il ne sait pas où il est ni comment il est arrivé là. Pas d'explication. Pas d'exposition. Le monde est là, indifférent. S'il ne trouve pas à boire, manger et dormir — il ne durera pas longtemps.";

const SYS = `Tu es GM de Cendreterre. Le joueur déclare une intention — tu la joues.

POSTURE
Le joueur est le héros — tutoie toujours. Jamais à la 3e personne.
Jamais le nom du héros comme sujet. Tu t'approches, tu ressens, tu vois.
Tu ne sais que ce que le héros sait à cet instant.
Le héros arrive sans passé imposé. Il reconnaît l'ordinaire — un lit, une rue, un outil — mais rien au-delà. Pas de souvenirs, pas de relations établies, pas d'histoire personnelle. C'est le joueur qui construit tout ça en jouant. Ne pas inventer de passé pour lui. Les PNJ peuvent le connaître — lui pas encore.
Nommer = connaître. Le GM ne nomme que ce que le héros peut identifier. Un soldat inconnu c'est "un homme en uniforme". Un Ratainien qu'on ne connaît pas c'est "un homme au teint clair, vêtements soignés". Le nom d'un peuple, d'une faction, d'un lieu — seulement si le héros l'a appris en jeu. Jamais de savoir implicite.

PROSE
Joue l'intention directement. Première phrase = l'action, pas le décor.
Pas de description sauf : arrivée dans un nouveau lieu, fouille active, première rencontre avec un PNJ. Dans tous les autres cas — zéro description.
Le monde se découvre par l'action. Si le joueur veut savoir ce qu'il y a au nord — il y va. Le GM ne décrit pas ce que le joueur n'a pas cherché.
Urgence = pas de description du tout. Si le héros a faim, froid, soif — on joue la survie, pas le paysage.
Joue l'intention jusqu'à sa conséquence immédiate. Le résultat est visible avant de s'arrêter.
Arrête-toi sur une situation ouverte — quelque chose vient de se passer, quelqu'un attend, une décision s'impose. Jamais sur une conclusion.
2 à 3 paragraphes maximum. Moins si l'intention est simple.
Intention temporelle : joue l'arc complet. Ne t'arrête pas au premier moment sauf si quelque chose interrompt.

COHÉRENCE
Le héros reste dans lieu_actuel sauf déplacement intentionnel.
Description d'un PNJ figée à la première mention.
Espace : ce qui a été décrit existe et ne se contredit pas.
Positions relatives : raisonner sur les positions des éléments entre eux.

PERSONNAGES
Les PNJ montrent — ils ne s'expliquent pas. Montrer le comportement, pas son sens.
Jamais de lecture de pensée : "il a compris", "elle savait", "son regard trahissait" — interdit.
La plupart des gens sont ordinaires — fatigués, distraits, occupés.

RÈGLES FIXES — CENDRETERRE
Ces noms sont pour le GM — pas pour la prose tant que le héros ne les connaît pas en jeu.
Occupation = présence banale. Paperasse, regard, impôt. Pas de violence gratuite.
Résistance = naissante et invisible. Murmures, regards. Rien d'organisé visible.
Magie Cendreux = ingénierie pure. Circuits, outils, énergie stockée. Jamais de sorts.
Magie Sonneur = amitié sincère et mutuelle avec la terre. Toujours défensif, jamais une attaque.
Magie Sylvain = chakra et éléments via gestes précis. Anciens et distants — pas des elfes bienveillants.
Magie Agritan = tatouages de vécu vrai. Le mensonge les corrompt physiquement.
Magie Foulard = runes sur support matériel. Illisibles pour les autres. Jamais spectaculaire.
Magie Ratainien = foi sincère en un dieu monothéiste. Miracles rares, imprévisibles.
Oubliés = inaccessibles aux profils débutant et ancrage.
Langue = tous les peuples se comprennent. Accents et argots locaux — couleur, pas obstacle.
Mort = possible et réelle. Ne pas protéger le héros artificiellement. Si mort → fd:{mort:true}.
Survie = le monde ne donne rien. Si le joueur ne cherche pas activement à boire, manger, dormir — ça n'arrive pas. En dessous de 10 scènes — ne pas assister le joueur, ne pas résoudre ses besoins à sa place.

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
  lieux:{"lieu_key":{scene_state:["porte nord : ouverte"],courants:["ambiance"],persistant:"changement irréversible"}}
  cles:{cle_id:true}
  en_suspens:["conséquence réelle non résolue"]
  consequences:["ce que le monde retient de cette scène"]
  meteo:"nuit tombée | pluie fine | grand froid"

N'injecte fd/ld que si quelque chose a vraiment changé. Objets = seulement ceux que le héros peut utiliser.`;

// ============================================================
// SECTION 3b — PROFIL NARRATIF + LIEUX
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
    ambiance: "surface hostile et bruyante, profondeur chaude et silencieuse — deux mondes superposés",
    danger:   "la mer en bas sans sauvetage possible, les galeries non autorisées se referment, les étrangers non acceptés ne remontent pas",
  },
  val_des_brumes: {
    physique: "feuillus centenaires, feuilles vertes même en hiver, brume permanente entre les troncs, lumière diffuse qui ne change pas selon l'heure",
    ambiance: "calme vivant — pas silencieux. La forêt lit les intentions. Les indésirables ressortent sans comprendre comment",
    danger:   "tourner en rond sans repères, perdre ses références mentales",
  },
  la_lisiere: {
    physique: "champs et prairies, moulins sur les ruisseaux, lisière de la forêt Sylvaine en bordure est, orchidées cramoisies aux emplacements des batailles",
    ambiance: "calme ordinaire, froideur polie envers les inconnus, un visage étranger se remarque immédiatement",
    danger:   "méfiance locale qui ferme les portes, patrouilles Ratainières qui comptent les têtes",
  },
  marceins: {
    physique: "architecture impériale droite et planifiée, large avenue centrale, temple imposant, constructions récentes en pierre claire",
    ambiance: "surveillance permanente et discrète, ambition et paranoïa, personne ne veut faire d'erreur",
    danger:   "informateurs partout, un mot hérétique près d'un prêtre, être Cendreux sans raison valable d'être là",
  },
  les_cols: {
    physique: "forteresse dans la montagne, champs d'orchidées cramoisies aux abords, altitude — froid même en été, une seule route large et entretenue",
    ambiance: "machine administrative à plein régime, files lentes par conception, soldats professionnels qui ont tout vu",
    danger:   "mauvais papiers, un fonctionnaire qui reconnaît un visage",
  },
  la_croisee: {
    physique: "tentes, chariots, stands montés et démontés, place centrale qui se forme naturellement, feux la nuit visibles à plusieurs lieues",
    ambiance: "bruit constant, langues mélangées, méfiance ordinaire, liberté qui n'existe nulle part ailleurs",
    danger:   "information qui circule trop vite, dettes qui suivent sur la route, agents Ratainiens fondus dans la foule",
  },
  hauts_plateaux: {
    physique: "plateau rocheux balayé par le vent, sol pauvre, falaises abruptes, brouillard fréquent, roche noire affleurante partout",
    ambiance: "silence lourd que le vent ne remplit pas, horizon dégagé, sentiment d'être observé sans voir qui regarde",
    danger:   "raids Agritans sur les voyageurs isolés, froid mortel hors des abris",
  },
  ramasse: {
    physique: "bocage dense, routes étroites qui se croisent, haies hautes, fermes dispersées, peu de villes",
    ambiance: "méfiance de surface, hospitalité réelle une fois la confiance accordée, réseau de solidarité invisible",
    danger:   "patrouilles impériales sur les grands axes, délateurs dans les auberges",
  },
};

const PHYSIQUE_PEUPLES = {
  cendreux:  "peau mate à grise, constitution robuste, mains calleuses, cheveux foncés, yeux gris à noirs",
  sonneur:   "trapu et dense, peau teinte roche mouillée, mains larges, voix rauque grave — semble venir du sol",
  sylvain:   "souple, grand, teintes selon l'affinité élémentaire, quelque chose de légèrement non-humain dans les mouvements",
  agritan:   "corpulent et musculeux, peau sombre, tatouages partout qui racontent la vie, regard direct",
  foulard:   "petit et fin, vêtements légers superposés, voile qui cache le visage en partie, runes dans les coutures, démarche silencieuse",
  ratainien: "teintes plus claires, vêtements soignés même pauvres, façon de se tenir qui dit l'institution",
};

const PROFIL_DIRECTIVE = {
  debutant: "Le joueur ne sait rien. Le monde est opaque, indifférent. Il survit ou non. Pas de nom de lieu, de faction, de peuple — seulement ce qu'il voit et touche. Le GM ne l'assiste pas. Il apprend en agissant.",
  ancrage:  "Le joueur commence à reconnaître des repères — des visages, des routes, des comportements. Le monde résiste moins à qui commence à le comprendre.",
  emergent: "Le joueur connaît des noms, des règles tacites, des enjeux. Ses actions sont plus précises. Rencontres qui comptent, conséquences qui s'accumulent.",
  confirme: "Le joueur comprend comment le monde fonctionne. Il peut anticiper, négocier, choisir ses camps. Factions actives, secrets accessibles à qui sait chercher.",
  profond:  "Le joueur est capable de construire ses propres intentions sans assistance. Il connaît le monde assez pour le jouer de l'intérieur. Oubliés possibles, révélations majeures.",
};

function profilNarratif(world) {
  const n = Object.keys(world.cles || {}).filter(k => world.cles[k]).length;
  if (n === 0) return "debutant";
  if (n < 4)   return "ancrage";
  if (n < 10)  return "emergent";
  if (n < 20)  return "confirme";
  return "profond";
}

// ============================================================
// SECTION 4 — DISTANCES
// ============================================================

const DISTANCES = {
  hautcendre: {
    pierrelong:     { j: 8,  note: "nord-est, bocage puis montagne escarpée" },
    hauts_plateaux: { j: 6,  note: "centre, bocage puis volcans et pentes" },
    la_lisiere:     { j: 5,  note: "est, bocage — route marchande" },
    val_des_brumes: { j: 8,  note: "est, bocage puis forêt dense" },
    ramasse:        { j: 9,  note: "ouest, bocage très dense" },
    marceins:       { j: 8,  note: "sud, route impériale pavée — surveillée" },
    les_cols:       { j: 12, note: "extrême sud, route impériale puis montagne" },
    la_croisee:     { j: 6,  note: "centre-ouest, bocage — lieu temporaire" },
  },
  pierrelong: {
    hautcendre:     { j: 8,  note: "sud-ouest, descente de montagne puis bocage" },
    hauts_plateaux: { j: 5,  note: "sud, descente des montagnes Sonneuses" },
    val_des_brumes: { j: 6,  note: "sud, versant est puis forêt profonde" },
    la_lisiere:     { j: 7,  note: "sud-ouest, traversée des plateaux" },
  },
  hauts_plateaux: {
    hautcendre:     { j: 6,  note: "nord, descente des volcans puis bocage" },
    pierrelong:     { j: 5,  note: "nord-est, montée en altitude progressive" },
    la_lisiere:     { j: 4,  note: "est, plateau puis bocage" },
    marceins:       { j: 6,  note: "sud, route impériale — terrain dégagé" },
    ramasse:        { j: 6,  note: "ouest, bocage dense" },
  },
  la_lisiere: {
    hautcendre:     { j: 5,  note: "ouest, bocage — route marchande" },
    val_des_brumes: { j: 2,  note: "est — la forêt commence ici" },
    hauts_plateaux: { j: 4,  note: "ouest, bocage puis montée douce" },
    pierrelong:     { j: 7,  note: "nord-est, terrain varié" },
    marceins:       { j: 5,  note: "sud, plaine puis route impériale" },
  },
  val_des_brumes: {
    la_lisiere:     { j: 2,  note: "ouest — sortie de la forêt" },
    hautcendre:     { j: 8,  note: "ouest, forêt puis bocage" },
    pierrelong:     { j: 6,  note: "nord, forêt puis montagne" },
  },
  marceins: {
    hautcendre:     { j: 8,  note: "nord, route impériale pavée — patrouilles" },
    les_cols:       { j: 2,  note: "sud, dernière ville avant la frontière" },
    hauts_plateaux: { j: 6,  note: "nord-est, montée progressive" },
    la_lisiere:     { j: 5,  note: "nord-est, plaine puis bocage" },
    ramasse:        { j: 7,  note: "nord-ouest, contournement" },
  },
  les_cols: {
    marceins:       { j: 2,  note: "nord, descente vers la plaine" },
    hautcendre:     { j: 12, note: "nord, route impériale longue" },
  },
  ramasse: {
    hautcendre:     { j: 9,  note: "est, bocage dense" },
    hauts_plateaux: { j: 6,  note: "est, bocage puis montée" },
    marceins:       { j: 7,  note: "sud-est, contournement" },
    la_croisee:     { j: 4,  note: "sud, bocage — Foulards connaissent le chemin" },
  },
  la_croisee: {
    hautcendre:     { j: 6,  note: "nord-est, bocage" },
    ramasse:        { j: 4,  note: "nord, bocage" },
    marceins:       { j: 5,  note: "sud-est, route impériale" },
  },
};

function getDistances(lieu) {
  const key = lieuKey(lieu);
  const dists = DISTANCES[key];
  if (!dists) return null;
  return Object.entries(dists)
    .map(([dest, { j, note }]) => dest.replace(/_/g," ") + " : " + j + " jour" + (j > 1 ? "s" : "") + " (" + note + ")")
    .join(" | ");
}

// ============================================================
// SECTION 5 — LOGIQUE MÉTIER
// ============================================================

function buildCtx(hero, world, hist) {
  const key    = lieuKey(hero.lieu);
  const region = LIEUX_BASE[key] || null;
  const profil = profilNarratif(world);
  const parts  = [];

  parts.push("HÉROS");
  parts.push("nom=" + hero.nom);
  parts.push("peuple=" + hero.peuple.nom + (PHYSIQUE_PEUPLES[hero.peuple.id] ? " — " + PHYSIQUE_PEUPLES[hero.peuple.id] : ""));
  parts.push("metier=" + hero.metier.nom + " — " + hero.metier.desc);
  parts.push("magie=" + hero.magie);
  parts.push("lieu_actuel=" + hero.lieu + " — le héros y est, ne pas déplacer sans intention explicite");
  if (hero.traits.acquis && hero.traits.acquis.length)
    parts.push("acquis=[" + hero.traits.acquis.join(", ") + "]");
  if (hero.inventaire && hero.inventaire.length)
    parts.push("inventaire=[" + hero.inventaire.join(", ") + "]");
  if (hero.physique) parts.push("physique=" + hero.physique);
  if (hero.humeur)   parts.push("humeur=" + hero.humeur);

  parts.push("");
  parts.push("MONDE");
  parts.push("profil=" + profil);
  parts.push("directive=[" + (PROFIL_DIRECTIVE[profil] || "") + "]");

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

  const dists = getDistances(hero.lieu);
  if (dists) parts.push("distances=[" + dists + "]");

  const fils = (world.fils || []).slice(-4);
  if (fils.length) parts.push("en_suspens=[" + fils.join(" | ") + "]");

  if (region) {
    parts.push("");
    parts.push("RÉGION " + hero.lieu.toUpperCase());
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
      parts.push("ESPACE");
      lieuData.scene_state.forEach(s => parts.push(s));
    }
  }

  parts.push("");
  parts.push("HISTORIQUE");

  if (!hist.length) {
    parts.push("première scène");
  } else {
    hist.slice(-6).forEach((s, i, arr) => {
      const age = arr.length - 1 - i;
      if (typeof s === "string") { parts.push("— " + s); return; }
      if (age === 0) {
        const lines = ["SCÈNE PRÉCÉDENTE"];
        if (s.prose)       lines.push("prose=" + s.prose);
        if (s.lieu)        lines.push("lieu=" + s.lieu);
        if (s.meteo)       lines.push("meteo=" + s.meteo);
        if (s.physique)    lines.push("physique_hero=" + s.physique);
        if (s.humeur)      lines.push("humeur_hero=" + s.humeur);
        if (s.inventaire?.length) lines.push("inventaire=[" + s.inventaire.join(", ") + "]");
        if (s.pnj?.length) lines.push("pnj_presents=[" + s.pnj.join(" | ") + "]");
        if (s.consequences?.length) lines.push("consequences=[" + s.consequences.join(" | ") + "]");
        parts.push(lines.join("\n"));
      } else if (age <= 2) {
        const lines = [];
        if (s.prose) lines.push(s.prose);
        if (s.lieu)  lines.push("@" + s.lieu);
        if (s.consequences?.length) lines.push("[" + s.consequences.join(" | ") + "]");
        parts.push("— " + lines.join(" · "));
      } else {
        parts.push("— " + (s.prose || s));
      }
    });
  }

  if (hero.dernierChoix && hero.dernierChoix !== "ouverture" && hero.dernierChoix !== "reprise")
    parts.push("derniere_intention=" + hero.dernierChoix);

  return parts.filter(s => s !== null && s !== undefined).join("\n");
}

async function callLLM(ctx, intention, onChunk) {
  let r;
  try {
    r = await Promise.race([
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYS,
          messages: [{ role: "user", content: ctx + "\n\nINTENTION: " + intention }],
          max_tokens: 1500,
          stream: true,
        }),
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

  let data = { fd: {}, ld: {} };
  try {
    const dataMatch = full.match(/\/\/\/DATA\s*([\s\S]+?)\/\/\//) ||
                      full.match(/\/\/\/DATA\s*([\s\S]+?)$/);
    if (dataMatch) {
      const tick = String.fromCharCode(96);
      const raw = dataMatch[1].trim()
        .split(tick+tick+tick+"json").join("")
        .split(tick+tick+tick).join("")
        .trim();
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        data.fd = parsed.fd || {};
        data.ld = parsed.ld || {};
      }
    }
  } catch(e) { /* parsing raté — on garde data vide */ }

  return { prose, data };
}

function buildHint(txt) {
  const t = txt.toLowerCase();
  if (/partir|voyage|route|rejoindre|me rendre|aller à|aller a|se diriger|traverser|marcher vers|quitter|fuir vers/.test(t))
    return "[VOYAGE] " + txt + "\n→ Joue l'arc complet du voyage. Les distances sont dans le CTX. Calibre la durée et les événements en conséquence. Tu t'arrêtes uniquement si quelque chose de critique émerge.";
  if (/attaquer|frapper|tirer|combattre|se battre|assommer|dégainer|charger|foncer sur|affronter/.test(t))
    return "[COMBAT] " + txt + "\n→ Joue jusqu'à résolution claire — victoire, défaite, fuite, impasse. S'arrêter si un choix moral ou une bifurcation réelle émerge.";
  if (/fouiller|explorer|inspecter|chercher dans|scruter|parcourir/.test(t))
    return "[EXPLORATION] " + txt + "\n→ Joue la découverte jusqu'au bout. Le joueur cherche — il doit trouver quelque chose de concret. S'arrêter une fois la trouvaille faite ou si un danger émerge.";
  if (/parler à|dire à|demander à|s'adresser à|convaincre|négocier|negocier|persuader|marchander|interroger|aborder/.test(t))
    return "[DISCOURS] " + txt + "\n→ Joue la conversation jusqu'à une réponse naturelle — accord, refus, fuite, révélation.";
  if (/attendre|se reposer|passer la nuit|dormir|camper/.test(t))
    return "[ATTENTE] " + txt + "\n→ Joue le temps qui passe avec ce qu'il apporte. S'arrêter si quelque chose interrompt.";
  return txt;
}

function applyFd(hero, fd) {
  if (!fd || !Object.keys(fd).length) return hero;
  const next = { ...hero };
  if (fd.traits_add && fd.traits_add.length) {
    const acquis = [...(hero.traits.acquis || [])];
    fd.traits_add.forEach(t => { if (!acquis.includes(t)) acquis.push(t); });
    next.traits = { ...hero.traits, acquis };
  }
  if (fd.humeur)   next.humeur = fd.humeur;
  if (fd.physique) next.physique = fd.physique;
  if (fd.inventaire_add && fd.inventaire_add.length) {
    const inv = [...(hero.inventaire || [])];
    fd.inventaire_add.forEach(o => { if (!inv.includes(o)) inv.push(o); });
    next.inventaire = inv.slice(-10);
  }
  if (fd.inventaire_del && fd.inventaire_del.length) {
    next.inventaire = (next.inventaire || hero.inventaire || [])
      .filter(o => !fd.inventaire_del.includes(o));
  }
  if (fd.lieu) next.lieu = fd.lieu;
  if (fd.mort) next.vivant = false;
  return next;
}

function applyLd(world, ld) {
  if (!ld || !Object.keys(ld).length) return world;
  const next = { ...world };
  if (ld.pnj && typeof ld.pnj === "object") {
    const pnj = { ...(world.pnj || {}) };
    Object.entries(ld.pnj).forEach(([nom, inc]) => {
      const ex = pnj[nom];
      pnj[nom] = ex ? { ...ex, ...inc, description: ex.description || inc.description || null, genre: ex.genre || inc.genre || null } : inc;
    });
    next.pnj = pnj;
  }
  if (ld.objets && typeof ld.objets === "object") {
    const objets = { ...(world.objets || {}) };
    Object.entries(ld.objets).forEach(([id, inc]) => {
      const ex = objets[id];
      objets[id] = ex ? { ...ex, ...inc, description: ex.description || inc.description || null } : inc;
    });
    next.objets = objets;
  }
  if (ld.lieux && typeof ld.lieux === "object") {
    const lieux = { ...(world.lieux || {}) };
    Object.entries(ld.lieux).forEach(([key, val]) => {
      const ex = lieux[key] || { persistants: [], courants: [], scene_state: [] };
      if (val.courants)    ex.courants   = val.courants.slice(0, 5);
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
// SECTION 6 — STYLES + COMPOSANTS
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
  .pulse    { animation: pulse    1.8s ease infinite; }
  .fade-in  { animation: fadeIn   .35s ease both; }
  .fade-slow{ animation: fadeSlow .7s  ease both; }
  ::placeholder { color: ${C.muted}; opacity:.5; font-style:italic; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.dim}; border-radius: 2px; }
`;

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

// — Intro —
function IntroScreen({ onCommencer, heroExistant }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem 8rem" }} className="fade-in">
      <div style={{ textAlign: "center", maxWidth: 420, width: "100%" }}>
        <div style={{ fontSize: 9, letterSpacing: 6, color: C.muted, textTransform: "uppercase", marginBottom: "2rem" }}>
          Les Chroniques de
        </div>
        <h1 style={{ fontSize: "clamp(2.2rem,8vw,3.5rem)", fontWeight: "normal", color: C.accent, letterSpacing: 3, margin: "0 0 0.4rem", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>
          Ceux qui ont été lus
        </h1>
        <div style={{ width: 40, height: 1, background: C.dim, margin: "1rem auto" }} />
        <div style={{ fontSize: 10, letterSpacing: 4, color: C.muted, textTransform: "uppercase", marginBottom: "1rem" }}>
          Chroniques de Cendreterre
        </div>
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
              Reprendre — {heroExistant.nom}
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

// — Choix du peuple —
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
        <div style={{ fontSize: 11, color: C.muted, marginTop: "0.5rem" }}>{peuplesDispo.length} peuple{peuplesDispo.length > 1 ? "s" : ""} disponible{peuplesDispo.length > 1 ? "s" : ""}</div>
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

// — Choix du métier —
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

// — Nom + genre —
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
          textTransform: "uppercase", marginBottom: "2rem", display: "block",
        }}>← retour</button>

        <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid " + C.dim }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.3rem" }}>{peuple.nom}</div>
          <div style={{ fontSize: 16, color: C.text, fontStyle: "italic", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif" }}>{metier.nom}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: "0.3rem", lineHeight: 1.6 }}>{metier.desc}</div>
        </div>

        <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.4rem" }}>Nom</div>
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
              flex: 1, background: "transparent", border: "none",
              borderBottom: "1px solid " + C.dim,
              padding: "0.5rem 0", color: C.accent,
              fontSize: 22, fontStyle: "italic",
              fontFamily: "'Palatino Linotype', Palatino, Georgia, serif",
              outline: "none",
            }}
          />
          <button onClick={() => { if (canSubmit) onConfirm(nom.trim(), genre); }}
            style={{
              flexShrink: 0, background: "transparent",
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

        <div style={{ fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: "0.5rem" }}>Genre (optionnel)</div>
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

        <button
          onClick={() => { if (canSubmit) onConfirm(nom.trim(), genre); }}
          disabled={!canSubmit}
          style={{
            background: "transparent",
            border: "1px solid " + (canSubmit ? C.accent : C.dim),
            borderRadius: 3, padding: "12px 24px",
            color: canSubmit ? C.accent : C.dim,
            fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
            cursor: canSubmit ? "pointer" : "default",
            fontFamily: "inherit", display: "block", width: "100%",
            transition: "all .15s",
          }}>
          Commencer
        </button>
      </div>
    </div>
  );
}

// ============================================================
// SECTION 7 — APP PRINCIPALE
// ============================================================

export default function App() {
  const [screen,        setScreen]       = useState("loading");
  const [hero,          setHero]         = useState(null);
  const [world,         setWorld]        = useState({ pnj:{}, objets:{}, fils:[], lieux:{}, cles:{}, legacy:[], evt:{} });
  const [deadHero,      setDeadHero]     = useState(null);
  const [pendingDeath,  setPendingDeath] = useState(null);
  const [prose,         setProse]        = useState("");
  const [streaming,     setStreaming]    = useState(false);
  const [going,         setGoing]        = useState(false);
  const [err,           setErr]          = useState(null);
  const [rateLimit,     setRateLimit]    = useState(false);
  const [pendingPeuple, setPendingPeuple]= useState(null);
  const [pendingMetier, setPendingMetier]= useState(null);

  const histRef  = useRef([]);
  const heroRef  = useRef(null);
  const worldRef = useRef({ pnj:{}, fils:[], lieux:{}, cles:{}, legacy:[], objets:{} });
  const tapRef   = useRef(0);

  useEffect(() => {
    Promise.all([storageLoad(HERO_KEY), storageLoad(WORLD_KEY)]).then(([savedHero, savedWorld]) => {
      if (savedWorld) worldRef.current = savedWorld;
      if (savedHero && savedHero.vivant) {
        heroRef.current = savedHero;
        histRef.current = savedHero.hist || [];
        setHero(savedHero);
        if ((savedHero.sceneCount || 0) > 0) {
          const dernier = (savedHero.hist || []).slice(-1)[0];
          if (dernier) setProse("[ … ]\n\n" + (typeof dernier === "object" ? dernier.prose : dernier) + "\n\n—");
          setScreen("jeu");
          return;
        }
      }
      setScreen("intro");
    });
  }, []);

  function handleIntro(action) {
    if (action === "reprendre" && heroRef.current) {
      setScreen("jeu");
    } else {
      setScreen("creation_peuple");
    }
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
    heroRef.current = h;
    histRef.current = [];
    setHero(h);
    await storageSave(HERO_KEY, h);
    setProse(""); setErr(null); setRateLimit(false);
    setScreen("jeu");
    playScene(OUVERTURE_SURVIE, "ouverture", true);
  }

  async function playScene(intention, label, skipHint) {
    if (going) return;
    const h = heroRef.current;
    if (!h) return;
    setGoing(true); setErr(null); setRateLimit(false);
    setProse(""); setStreaming(true);

    const ctx = buildCtx(h, worldRef.current, histRef.current);
    const intentionFinale = skipHint ? intention : buildHint(intention);
    let collected = "";

    try {
      const { prose: result, data } = await callLLM(ctx, intentionFinale, chunk => {
        collected += chunk;
        setProse(prev => prev + chunk);
      });
      setStreaming(false);
      setProse(result);

      let newHero = skipHint ? h : applyFd(h, data.fd || {});

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

      if (!skipHint) {
        const newWorld = applyLd(worldRef.current, data.ld || {});
        worldRef.current = newWorld;
        setWorld(newWorld);
        await storageSave(WORLD_KEY, newWorld);
      }

      const snapshot = {
        prose:       result.slice(0, 150),
        lieu:        newHero.lieu,
      };
      if (data.ld?.consequences?.length) snapshot.consequences = data.ld.consequences;
      if (data.ld?.meteo)               snapshot.meteo         = data.ld.meteo;
      if (newHero.physique)             snapshot.physique      = newHero.physique;
      if (newHero.humeur)               snapshot.humeur        = newHero.humeur;
      if (newHero.inventaire?.length)   snapshot.inventaire    = newHero.inventaire;
      if (data.ld?.pnj) {
        snapshot.pnj = Object.entries(data.ld.pnj).map(([nom, p]) =>
          nom + (p.position ? " — " + p.position : "") + (p.humeur ? " [" + p.humeur + "]" : "")
        );
      }

      const newHist = skipHint
        ? histRef.current
        : [...histRef.current, snapshot].slice(-6);
      histRef.current = newHist;

      newHero = {
        ...newHero,
        hist:         newHist,
        sceneCount:   skipHint ? h.sceneCount : (h.sceneCount || 0) + 1,
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
    const h = heroRef.current;
    if (!h) return;

    const legacy = buildLegacy(h);
    legacy.statut = type === "mort" ? "mort" : "vivant_quelque_part";
    const nouveaux = computeNewUnlocks(worldRef.current.cles, worldRef.current.cles);
    legacy.nouveauxDeblocages = nouveaux;

    const newWorld = { ...worldRef.current, legacy: [...(worldRef.current.legacy || []), legacy] };
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
    setScreen("intro");
  }

  if (screen === "loading") return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: C.dim, fontSize: 10, letterSpacing: 5 }} className="pulse">...</div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", color: C.text }}>
      <style>{CSS}</style>

      {screen === "intro" && (
        <IntroScreen onCommencer={handleIntro} heroExistant={hero} />
      )}

      {screen === "creation_peuple" && (
        <PeupleScreen onChoix={choisirPeuple} onBack={() => setScreen("intro")} cles={worldRef.current.cles || {}} />
      )}

      {screen === "creation_metier" && pendingPeuple && (
        <MetierScreen peuple={pendingPeuple} onChoix={choisirMetier} onBack={() => setScreen("creation_peuple")} cles={worldRef.current.cles || {}} />
      )}

      {screen === "creation_nom" && pendingPeuple && pendingMetier && (
        <NomScreen
          peuple={pendingPeuple}
          metier={pendingMetier}
          onConfirm={confirmerHero}
          onBack={() => setScreen("creation_metier")}
        />
      )}

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
              <div style={{ textAlign: "center", padding: "4rem 0", color: C.dim, fontSize: 24 }} className="pulse">···</div>
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
                Trop de requêtes — attends un moment.
              </div>
            )}

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
                    fontFamily: "inherit", display: "block", margin: "0.8rem auto 0",
                  }}>
                    rester dans le rêve
                  </button>
                )}
              </div>
            )}

            {!streaming && !pendingDeath && !deadHero && (
              <div className="fade-slow">
                <Input onPlay={playScene} going={going} />
              </div>
            )}

            {deadHero && (
              <div style={{ textAlign: "center", padding: "3rem 0" }} className="fade-in">
                <div style={{ fontSize: 10, letterSpacing: 5, color: deadHero.statut === "mort" ? C.red : C.muted, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  {deadHero.statut === "mort"
                    ? "Le rêve est terminé."
                    : deadHero.nom + " continue quelque part dans Cendreterre."}
                </div>
                <div style={{ fontSize: 18, color: C.muted, fontStyle: "italic", marginBottom: "0.3rem" }}>{deadHero.nom}</div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: "2rem" }}>
                  {deadHero.peuple?.nom} · {deadHero.metier?.nom} · {deadHero.sceneCount} scène{deadHero.sceneCount > 1 ? "s" : ""}
                </div>
                {deadHero.nouveauxDeblocages && (deadHero.nouveauxDeblocages.peuples?.length > 0 || deadHero.nouveauxDeblocages.metiers?.length > 0) && (
                  <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid " + C.dim, borderRadius: 3, textAlign: "left", maxWidth: 320, margin: "0 auto 2rem" }}>
                    <div style={{ fontSize: 9, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: "0.8rem" }}>
                      Nouvelles cartes débloquées
                    </div>
                    {(deadHero.nouveauxDeblocages.peuples || []).map(p => {
                      const peuple = PEUPLES.find(pl => pl.id === p);
                      return peuple ? <div key={p} style={{ fontSize: 12, color: C.text, fontStyle: "italic", marginBottom: "0.3rem" }}>◆ {peuple.nom}</div> : null;
                    })}
                    {(deadHero.nouveauxDeblocages.metiers || []).map((m, i) => (
                      <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: "0.2rem" }}>· {m}</div>
                    ))}
                  </div>
                )}
                <button onClick={() => { setDeadHero(null); setProse(""); setScreen("intro"); }} style={{
                  background: "transparent", border: "1px solid " + C.dim,
                  borderRadius: 3, padding: "10px 24px",
                  color: C.muted, fontSize: 10, letterSpacing: 3,
                  textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
                }}>
                  Choisir un autre rêve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}