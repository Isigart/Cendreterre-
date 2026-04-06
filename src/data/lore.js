// ============================================================
// LORE DE CENDRETERRE — inject\u00e9 dans le contexte selon le lieu
// ============================================================

// --- MONDE G\u00c9N\u00c9RAL (toujours inject\u00e9 en profil \u00e9mergent+) ---

export const MONDE = {
  nom_secret: "Le vrai nom du royaume : Isigard. On ne le dit pas \u00e0 voix haute sous l'occupation.",
  resistance: "La r\u00e9sistance se nomme 'Enfants d'Isigard' \u2014 acte de m\u00e9moire autant que politique. Organis\u00e9e dans les Terres de Ramasse, pr\u00e9sente en cellules discr\u00e8tes \u00e0 Hautcendre.",
  occupation: "Occupation depuis 20 ans. La capitale imp\u00e9riale est loin au sud, derri\u00e8re des milliers de km. Les ordres mettent du temps. Les renforts aussi. L'empire gagne par patience et organisation, pas par force.",
  passage: "Un seul passage l\u00e9gal vers l'empire : les Cols du Sud. Des passages clandestins existent \u2014 les Foulards les connaissent.",
  fleuve: "Le Fleuve Furieux borde le nord et l'ouest. Difficile \u00e0 naviguer. Par beau temps on voit l'autre rive \u2014 des formes, du relief, parfois des lumi\u00e8res la nuit. Ce qu'il y a de l'autre c\u00f4t\u00e9 : inconnu.",
  goulin: "Le Goulin descend des Montagnes Sonneuses, traverse Hautcendre comme la Seine traverse Paris, file nord-ouest rejoindre le Furieux. Zone industrielle cendreux sur ses rives.",
};

// --- LORE PAR PEUPLE (inject\u00e9 quand pertinent) ---

export const LORE_PEUPLES = {
  cendreux: {
    culture: "Avant la conqu\u00eate : royaume d'Isigard, technocratie. Majorit\u00e9 de la population de Cendreterre. Le conseil de Hautcendre existe encore \u2014 collaborateurs par calcul, pas par conviction.",
    magie_detail: "Circuits magiques = ing\u00e9nierie pure. Mat\u00e9riaux conducteurs, batteries, moteurs, capteurs d'\u00e9nergie (vent, feu, eau). Mat\u00e9riaux conducteurs rares : mines Sonneuses + lianes Sylvaines. Les circuits d'avant la conqu\u00eate tiennent encore mais les premi\u00e8res failles apparaissent. H\u00e9r\u00e9tiques aux yeux de l'empire.",
    combat: "Lame augment\u00e9e, pistolet \u00e0 cartouche magique. Contrainte = charge restante. \u00c9lite : armure m\u00e9canis\u00e9e compl\u00e8te \u2014 lourde, rare, co\u00fbteuse.",
  },
  sonneur: {
    culture: "Surface = fa\u00e7ade pour l'empire. Profondeurs = vraie vie. Le Puits = ville visible. En dessous, la ville r\u00e9elle. Organisation par Zins (clans de chant). Les chants les plus anciens passent d'une g\u00e9n\u00e9ration \u00e0 l'autre.",
    magie_detail: "Chant qui r\u00e9sonne dans la roche et la terre. Pas d'effets visuels \u2014 vibration, r\u00e9sonance. Certains chants ouvrent les galeries, d'autres les ferment. Les Enfants de la terre improvisent \u2014 parlent directement \u00e0 la terre.",
    vouivre: "La Vouivre garde les veines de la terre. Respect\u00e9e par les Sonneurs. Un \u00e9tranger non accept\u00e9 dans les galeries ne repart pas.",
  },
  sylvain: {
    culture: "Villages dans la for\u00eat profonde. Les arbres sacr\u00e9s incarnent parfois des Oubli\u00e9s. Un Sylvain hors de la for\u00eat a une mission \u2014 ne tra\u00eene pas. Les Sylvains arrachent les circuits Cendreux qu'ils trouvent.",
    magie_detail: "Chakra et \u00e9l\u00e9ments via gestes pr\u00e9cis. Efficace et froid. La for\u00eat est attentive \u2014 pas accueillante. Les ind\u00e9sirables ressortent sans comprendre comment.",
  },
  agritan: {
    culture: "Tribus ind\u00e9pendantes. Pas de hi\u00e9rarchie inter-tribus. Un Agritan tr\u00e8s tatou\u00e9 a vraiment v\u00e9cu. C'est quelqu'un de dangereux. Le peuple le plus honn\u00eate de Cendreterre \u2014 par n\u00e9cessit\u00e9 absolue.",
    magie_detail: "Chaque tatouage augmente une qualit\u00e9 : force, endurance, perception, combat. Tatoueurs ne tatouent que lors de c\u00e9r\u00e9monies, pour du v\u00e9cu valid\u00e9 par la tribu.",
    forges: "Les Forg\u00e9s : d\u00e9rive par tatouages solitaires \u2014 ni morts ni vivants. Tatouages faits hors c\u00e9r\u00e9monie, sans validation. Puissants mais corrompus.",
    monture: "Mammouth laineux \u2014 uniquement les dresseurs. Un lien qui prend des ann\u00e9es.",
  },
  foulard: {
    culture: "Nomades. Neutralit\u00e9 commerciale \u2014 vendent \u00e0 tout le monde. Soci\u00e9t\u00e9 matrilin\u00e9aire. La tortue g\u00e9ante : m\u00e9moire vivante du groupe sur des g\u00e9n\u00e9rations. Agir contre un Foulard : \u00e7a se sait. Ressemble \u00e0 un accident.",
    magie_detail: "Alphabet runique h\u00e9rit\u00e9 d'un Oubli\u00e9. Illisible pour les non-Foulards \u2014 les yeux glissent dessus. Les runes augmentent le support o\u00f9 elles sont inscrites mais acc\u00e9l\u00e8rent son usure. Plus l'effet est puissant, plus \u00e7a consomme. Le mat\u00e9riau compte : tissu = limit\u00e9, cuir = durable, mat\u00e9riau rare = grandes possibilit\u00e9s.",
    lame: "Branche arm\u00e9e silencieuse : Lame silencieuse. N'existe pas officiellement. Tr\u00e8s r\u00e9elle sur le terrain.",
    tabous: "Tabous Foulards : nuire \u00e0 un Foulard, prendre parti dans les conflits des autres peuples.",
  },
  ratainien: {
    culture: "Deux piliers : administration et clerg\u00e9 \u2014 entrem\u00eal\u00e9s. Ce sont des fonctionnaires dans un pays qu'ils ne comprennent pas. Affaiblis \u00e0 Cendreterre : absence de renforts. La machine tourne \u00e0 effectifs r\u00e9duits.",
    magie_detail: "Un Oubli\u00e9 veille sur tous les \u00eatres vivants \u2014 les Ratainiens les seuls \u00e0 l'avoir remarqu\u00e9 (via un enfant vertueux). L'Oubli\u00e9 ne se r\u00e9v\u00e8le jamais. Les pr\u00eatres b\u00e9nissent et soignent. Pas des combattants. Pas du charlatanisme \u2014 \u00e7a fonctionne vraiment. \u00c9vang\u00e9lisation active.",
  },
};

// --- LES OUBLI\u00c9S (inject\u00e9 en profil \u00e9mergent+) ---

export const OUBLIES = "Immuables \u2014 c'est le monde qui les a oubli\u00e9s, pas l'inverse. Cr\u00e9ateurs de tous les peuples. Chaque peuple a un tuteur Oubli\u00e9 sauf les Cendreux (voulus libres et sans guide \u2014 d\u00e9lib\u00e9r\u00e9). Rencontrer un Oubli\u00e9 est exceptionnel. Ils savent tout, ne mentent pas, sentent le mensonge. Certains sont incarn\u00e9s dans les arbres sacr\u00e9s Sylvains.";

// --- LES PLUMES DE NUIT (inject\u00e9 en profil confirm\u00e9+) ---

export const PLUMES_DE_NUIT = "Soci\u00e9t\u00e9 des Grands Corbeaux. Intelligents, libres, organis\u00e9s. Ni domestiqu\u00e9s ni domesticables. M\u00e9moire qui d\u00e9passe celle des humains. \u00c9gaux des Oubli\u00e9s \u2014 pas serviteurs. Ha\u00efssent les Ratainiens : capture d'oisillons pour les briser en montures de prestige. N'oublieront jamais. Tendresse prudente envers les Sylvains. Rencontrer un Grand Corbeau : rare. Qu'il s'ouvre \u00e0 toi : un miracle qui ne se force pas.";

// --- CR\u00c9ATURES DES OUBLI\u00c9S (inject\u00e9 quand pertinent au lieu) ---

export const CREATURES = {
  varek: {
    desc: "Nettoie la mort non r\u00e9clam\u00e9e. Depuis la conqu\u00eate, il y en a plus qu'avant.",
    survie: "Ne pas s'arr\u00eater.",
    lieux: ["hauts_plateaux", "ramasse", "la_lisiere"],
  },
  creux: {
    desc: "Pr\u00e9serve ce qui a de la valeur. Collecte les objets charg\u00e9s d'histoire. Fait des \u00e9changes \u2014 ne parle pas.",
    survie: "L'\u00e9change fonctionne.",
    lieux: ["hautcendre", "pierrelong", "val_des_brumes"],
  },
  restant: {
    desc: "Pr\u00e9serve le moment. Rejoue en boucle. Regarder trop longtemps entra\u00eene dedans.",
    survie: "Ne pas regarder.",
    lieux: ["val_des_brumes", "la_lisiere"],
  },
  brumeux: {
    desc: "Dissout les attachements trop lourds. Ce qu'il prend ne revient pas. Il choisit \u2014 pas le h\u00e9ros.",
    survie: "\u00c9viter la brume si on porte quelque chose.",
    lieux: ["val_des_brumes"],
  },
  pleureuse: {
    desc: "Accompagne les mourants. Suivre sa voix dans la nuit m\u00e8ne l\u00e0 o\u00f9 elle est.",
    survie: "Entendre sans suivre.",
    lieux: ["hauts_plateaux", "pierrelong", "ramasse"],
  },
  vide_yeux: {
    desc: "R\u00e9v\u00e8le ce qu'on refuse de voir. Se glisse dans les reflets. Ceux qui regardent jusqu'au bout changent \u2014 irr\u00e9versiblement.",
    survie: "Casser le reflet.",
    lieux: ["hautcendre", "marceins"],
  },
  assoiffe: {
    desc: "Absorbe les exc\u00e8s de magie instable. S'accumule pr\u00e8s des circuits Cendreux bris\u00e9s.",
    survie: "R\u00e9parer les circuits.",
    lieux: ["hautcendre", "la_lisiere"],
  },
  vouivre: {
    desc: "Garde les veines de la terre. Respect\u00e9e par les Sonneurs. Un \u00e9tranger non accept\u00e9 dans les galeries ne repart pas.",
    survie: "\u00catre accept\u00e9 par les Sonneurs.",
    lieux: ["pierrelong", "hauts_plateaux"],
  },
  marcheur: {
    desc: "Compte le monde vivant. Marche sur les routes la nuit. Ceux qui ont suivi savent des choses qu'ils n'auraient pas d\u00fb savoir.",
    survie: "Le laisser passer.",
    lieux: ["ramasse", "la_lisiere", "hauts_plateaux", "marceins"],
  },
};

// --- LA CROIS\u00c9E (inject\u00e9 quand le h\u00e9ros est \u00e0 La Crois\u00e9e) ---

export const LA_CROISEE_LORE = "Pas une ville fixe \u2014 un ph\u00e9nom\u00e8ne de route. Se forme quand suffisamment de monde s'arr\u00eate. Dispara\u00eet quand les convois repartent. Signal : une tortue Foularde s'arr\u00eate et ne repart pas. Les tortues servent de comptoirs improvis\u00e9s. Zone grise \u2014 l'empire ne contr\u00f4le pas quelque chose qui bouge. Les Foulards maintiennent un ordre tacite. Tout s'\u00e9change : marchandises, animaux, informations, services, dettes. Pas de violence ouverte.";

// --- LORE PAR R\u00c9GION (inject\u00e9 selon lieu_actuel) ---

export const LORE_REGIONS = {
  hautcendre: {
    region: "C\u0153ur-Cendre",
    lore: "Capitale d'Isigard. Bocage urbanis\u00e9. L'empire contr\u00f4le la ville, pas la p\u00e9riph\u00e9rie camp\u00e9e tout autour. Le Goulin traverse la ville \u2014 zone industrielle cendreux sur ses rives. Le conseil si\u00e8ge encore. Les circuits anciens tiennent mais les premi\u00e8res failles apparaissent.",
  },
  pierrelong: {
    region: "Montagnes Sonneuses",
    lore: "Surface = fa\u00e7ade pour l'empire. Profondeurs = vraie ville Sonneuse. Le Puits est la ville visible \u2014 en dessous, le r\u00e9seau de galeries s'\u00e9tend sur des kilom\u00e8tres. Le Goulin prend sa source ici.",
  },
  hauts_plateaux: {
    region: "Les Hauts Plateaux",
    lore: "Volcans dormants, sols noirs. Grottes et tunnels naturels prolong\u00e9s par les Sonneurs. Territoire partag\u00e9 : Sonneurs dans les galeries, Agritans \u00e0 la surface. Les deux peuples se respectent \u2014 fronti\u00e8re tacite.",
  },
  la_lisiere: {
    region: "La Lisi\u00e8re",
    lore: "Bande de ~50 km le long de la for\u00eat Sylvaine. Bocage et for\u00eat m\u00eal\u00e9s. Fronti\u00e8re douce entre le monde des hommes et celui des Sylvains. Les orchid\u00e9es cramoisies poussent aux emplacements des batailles de la conqu\u00eate. Ville principale : Bosqu\u00e8re.",
  },
  val_des_brumes: {
    region: "Val des Brumes",
    lore: "For\u00eats profondes. Territoire Sylvain exclusif. La for\u00eat d\u00e9cide qui entre et qui sort. Les arbres sacr\u00e9s incarnent parfois des Oubli\u00e9s. Un non-Sylvain ici est soit invit\u00e9, soit perdu.",
  },
  marceins: {
    region: "La Grande Plaine",
    lore: "Plaine ouverte, facile \u00e0 surveiller. Garnison imp\u00e9riale principale. Le temple est le b\u00e2timent le plus imposant. Les Ratainiens y sont chez eux \u2014 le seul endroit de Cendreterre o\u00f9 c'est vrai.",
  },
  les_cols: {
    region: "Les Cols",
    lore: "Forteresse dans la montagne. Seul passage l\u00e9gal vers l'Empire Ratainien. Machine administrative \u00e0 plein r\u00e9gime. Les passages secondaires en hiver tuent sans pr\u00e9venir.",
  },
  la_croisee: {
    region: "Zone nomade",
    lore: LA_CROISEE_LORE,
  },
  ramasse: {
    region: "Terres de Ramasse",
    lore: "Bocage ouest. La r\u00e9sistance organis\u00e9e \u2014 les Enfants d'Isigard \u2014 y prend racine. R\u00e9seau de solidarit\u00e9 invisible. Chaque ferme est un relais potentiel.",
  },
  hamecon: {
    region: "Les Hauts-P\u00eacheurs",
    lore: "Villages le long du Fleuve Furieux. P\u00eacheurs qui coexistent avec le fleuve. Le deuil est normal ici \u2014 le fleuve prend r\u00e9guli\u00e8rement. Par beau temps on voit l'autre rive. Des lumi\u00e8res la nuit. Personne n'y va.",
  },
  marais_tortues: {
    region: "Le Marais des Tortues",
    lore: "Delta du Fleuve Furieux. Mar\u00e9cages imp\u00e9n\u00e9trables. Territoire Foulard d'origine. Les tortues g\u00e9antes y vivent \u2014 m\u00e9moire vivante sur des g\u00e9n\u00e9rations. L'empire ne cartographie pas ce qu'il ne peut pas contr\u00f4ler.",
  },
};

// --- FONCTION D'INJECTION ---

import { lieuKey } from "./lieux.js";

export function buildLoreCtx(heroLieu, heroPeuple, profil) {
  const key = lieuKey(heroLieu);
  const parts = [];

  // Lore de la r\u00e9gion actuelle
  const regionLore = LORE_REGIONS[key];
  if (regionLore) {
    parts.push("R\u00c9GION " + (regionLore.region || heroLieu));
    parts.push(regionLore.lore);
  }

  // Lore du peuple du h\u00e9ros
  const peupleLore = LORE_PEUPLES[heroPeuple];
  if (peupleLore) {
    parts.push("");
    parts.push("PEUPLE \u2014 " + heroPeuple.toUpperCase());
    parts.push(peupleLore.culture);
    parts.push("magie_d\u00e9tail=" + peupleLore.magie_detail);
    if (peupleLore.combat) parts.push("combat=" + peupleLore.combat);
    if (peupleLore.forges && (profil === "emergent" || profil === "confirme" || profil === "profond"))
      parts.push("forg\u00e9s=" + peupleLore.forges);
    if (peupleLore.monture) parts.push("monture=" + peupleLore.monture);
    if (peupleLore.vouivre) parts.push("vouivre=" + peupleLore.vouivre);
    if (peupleLore.lame) parts.push("lame=" + peupleLore.lame);
    if (peupleLore.tabous) parts.push("tabous=" + peupleLore.tabous);
  }

  // Peuple local (si diff\u00e9rent du h\u00e9ros)
  const localPeuples = {
    hautcendre: "cendreux", pierrelong: "sonneur", hauts_plateaux: "agritan",
    val_des_brumes: "sylvain", la_lisiere: "sylvain", la_croisee: "foulard",
    marceins: "ratainien", les_cols: "ratainien", marais_tortues: "foulard",
    ramasse: "cendreux", hamecon: "cendreux",
  };
  const localPeuple = localPeuples[key];
  if (localPeuple && localPeuple !== heroPeuple) {
    const local = LORE_PEUPLES[localPeuple];
    if (local) {
      parts.push("");
      parts.push("PEUPLE LOCAL \u2014 " + localPeuple.toUpperCase());
      parts.push(local.culture);
    }
  }

  // Monde g\u00e9n\u00e9ral (profil \u00e9mergent+)
  if (profil === "emergent" || profil === "confirme" || profil === "profond") {
    parts.push("");
    parts.push("MONDE");
    parts.push(MONDE.nom_secret);
    parts.push(MONDE.resistance);
    parts.push(MONDE.occupation);
    if (key === "hamecon" || key === "hautcendre") parts.push(MONDE.fleuve);
    if (key === "hautcendre") parts.push(MONDE.goulin);
    if (key === "les_cols") parts.push(MONDE.passage);
  }

  // Oubli\u00e9s (\u00e9mergent+)
  if (profil === "emergent" || profil === "confirme" || profil === "profond") {
    parts.push("");
    parts.push("OUBLI\u00c9S");
    parts.push(OUBLIES);
  }

  // Plumes de Nuit (confirm\u00e9+)
  if (profil === "confirme" || profil === "profond") {
    parts.push("");
    parts.push("PLUMES DE NUIT");
    parts.push(PLUMES_DE_NUIT);
  }

  // Cr\u00e9atures possibles dans ce lieu (\u00e9mergent+)
  if (profil === "emergent" || profil === "confirme" || profil === "profond") {
    const creaturesIci = Object.entries(CREATURES)
      .filter(([, c]) => c.lieux.includes(key))
      .map(([nom, c]) => nom + " \u2014 " + c.desc + " Survie : " + c.survie);
    if (creaturesIci.length) {
      parts.push("");
      parts.push("CR\u00c9ATURES POSSIBLES (ne pas forcer \u2014 seulement si la sc\u00e8ne s'y pr\u00eate)");
      creaturesIci.forEach(c => parts.push("- " + c));
    }
  }

  return parts.join("\n");
}
