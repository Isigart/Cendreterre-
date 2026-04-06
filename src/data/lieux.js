export const LIEUX_BASE = {
  hautcendre: {
    physique: "pierre noire volcanique, circuits magiques dans les murs des b\u00e2timents anciens, lampes sans flamme, routes pav\u00e9es h\u00e9rit\u00e9es de l'ancien r\u00e9gime",
    ambiance: "tension sourde entre m\u00e9moire Cendreux et pr\u00e9sence imp\u00e9riale, collaboration visible, activit\u00e9 permanente sur les routes",
    danger:   "garnison qui surveille les \u00e9trangers, collaborateurs qui rapportent, quartier des forges dangereux la nuit",
  },
  pierrelong: {
    physique: "falaises vertigineuses, vent marin permanent, sol qui vibre diff\u00e9remment \u2014 plus profond, plus chaud, galeries \u00e9clair\u00e9es par des veines de lave",
    ambiance: "surface hostile et bruyante, profondeur chaude et silencieuse \u2014 deux mondes superpos\u00e9s, les Sonneurs \u00e0 l'aise nulle part autant qu'en bas",
    danger:   "la mer en bas sans sauvetage possible, les galeries non autoris\u00e9es se referment, les \u00e9trangers non accept\u00e9s ne remontent pas",
  },
  val_des_brumes: {
    physique: "feuillus centenaires, feuilles vertes m\u00eame en hiver, brume permanente entre les troncs, lumi\u00e8re diffuse qui ne change pas selon l'heure",
    ambiance: "calme vivant \u2014 pas silencieux. La for\u00eat lit les intentions. Les ind\u00e9sirables ressortent sans comprendre comment",
    danger:   "tourner en rond sans rep\u00e8res, perdre ses r\u00e9f\u00e9rences mentales, ce que la for\u00eat d\u00e9cide de montrer aux mauvaises personnes",
  },
  la_lisiere: {
    physique: "champs et prairies, moulins sur les ruisseaux, lisi\u00e8re de la for\u00eat Sylvaine en bordure est, orchid\u00e9es cramoisies aux emplacements des batailles",
    ambiance: "calme ordinaire, froideur polie envers les inconnus, un visage \u00e9tranger se remarque imm\u00e9diatement, confiance qui se gagne lentement",
    danger:   "m\u00e9fiance locale qui ferme les portes, patrouilles Rataini\u00e8res qui comptent les t\u00eates, la for\u00eat si quelqu'un la force",
  },
  marceins: {
    physique: "architecture imp\u00e9riale droite et planifi\u00e9e, large avenue centrale, temple imposant, constructions r\u00e9centes en pierre claire, propre \u2014 trop propre",
    ambiance: "surveillance permanente et discr\u00e8te, ambition et parano\u00efa, personne ne veut faire d'erreur, efficace et froid",
    danger:   "informateurs partout, un mot h\u00e9r\u00e9tique pr\u00e8s d'un pr\u00eatre, \u00eatre Cendreux sans raison valable d'\u00eatre l\u00e0",
  },
  les_cols: {
    physique: "forteresse dans la montagne, champs d'orchid\u00e9es cramoisies aux abords, altitude \u2014 froid m\u00eame en \u00e9t\u00e9, une seule route large et entretenue",
    ambiance: "machine administrative \u00e0 plein r\u00e9gime, files lentes par conception, soldats professionnels qui ont tout vu",
    danger:   "mauvais papiers, un fonctionnaire qui reconna\u00eet un visage, les passages secondaires en hiver tuent sans pr\u00e9venir",
  },
  la_croisee: {
    physique: "tentes, chariots, stands mont\u00e9s et d\u00e9mont\u00e9s, place centrale qui se forme naturellement, feux la nuit visibles \u00e0 plusieurs lieues",
    ambiance: "bruit constant, langues m\u00e9lang\u00e9es, m\u00e9fiance ordinaire, libert\u00e9 qui n'existe nulle part ailleurs, les Foulards maintiennent un ordre tacite",
    danger:   "information qui circule trop vite, dettes qui suivent sur la route, agents Ratainiens fondus dans la foule",
  },
  hauts_plateaux: {
    physique: "plateau rocheux balay\u00e9 par le vent, sol pauvre, falaises abruptes, brouillard fr\u00e9quent, roche noire affleurante partout",
    ambiance: "silence lourd que le vent ne remplit pas, horizon d\u00e9gag\u00e9, sentiment d'\u00eatre observ\u00e9 sans voir qui regarde, nuits tr\u00e8s froides",
    danger:   "raids Agritans sur les voyageurs isol\u00e9s, froid mortel hors des abris, falaises sans chemin balis\u00e9",
  },
};

export const PHYSIQUE_PEUPLES = {
  cendreux:  "peau mate \u00e0 grise, constitution robuste, mains calleuses, cheveux fonc\u00e9s, yeux gris \u00e0 noirs",
  sonneur:   "trapu et dense, peau teinte roche mouill\u00e9e, mains larges, voix rauque grave \u2014 semble venir du sol",
  sylvain:   "souple, grand, teintes selon l'affinit\u00e9 \u00e9l\u00e9mentaire, quelque chose de l\u00e9g\u00e8rement non-humain dans les mouvements",
  agritan:   "corpulent et musculeux, peau sombre, tatouages partout qui racontent la vie, regard direct",
  foulard:   "petit et fin, v\u00eatements l\u00e9gers superpos\u00e9s, voile qui cache le visage en partie, runes dans les coutures, d\u00e9marche silencieuse",
  ratainien: "teintes plus claires, v\u00eatements soign\u00e9s m\u00eame pauvres, fa\u00e7on de se tenir qui dit l'institution",
  metis:     "deux physiques qui se m\u00ealent \u2014 l'un ou l'autre domine selon les jours et les regards",
};

export const DISTANCES = {
  hautcendre: {
    hamecon:         { j: 2,  note: "nord, plaine \u2014 route rapide" },
    pierrelong:      { j: 8,  note: "nord-est, bocage puis montagne escarp\u00e9e" },
    hauts_plateaux:  { j: 6,  note: "centre, bocage puis volcans et pentes" },
    la_lisiere:      { j: 5,  note: "est, bocage \u2014 route marchande" },
    val_des_brumes:  { j: 8,  note: "est, bocage puis for\u00eat dense imp\u00e9n\u00e9trable" },
    ramasse:         { j: 9,  note: "ouest, bocage tr\u00e8s dense \u2014 routes difficiles" },
    marais_tortues:  { j: 9,  note: "sud-ouest, plaine puis marais" },
    marceins:        { j: 8,  note: "sud, route imp\u00e9riale pav\u00e9e \u2014 surveill\u00e9e" },
    les_cols:        { j: 12, note: "extr\u00eame sud, route imp\u00e9riale puis montagne" },
  },
  pierrelong: {
    hautcendre:      { j: 8,  note: "sud-ouest, descente de montagne puis bocage" },
    hauts_plateaux:  { j: 5,  note: "sud, descente des montagnes Sonneuses" },
    val_des_brumes:  { j: 6,  note: "sud, versant est puis for\u00eat profonde" },
    la_lisiere:      { j: 7,  note: "sud-ouest, travers\u00e9e des plateaux" },
    hamecon:         { j: 5,  note: "ouest, c\u00f4te puis plaine" },
  },
  hauts_plateaux: {
    hautcendre:      { j: 6,  note: "nord, descente des volcans puis bocage" },
    pierrelong:      { j: 5,  note: "nord-est, mont\u00e9e en altitude progressive" },
    la_lisiere:      { j: 4,  note: "est, plateau puis bocage" },
    marceins:        { j: 6,  note: "sud, route imp\u00e9riale \u2014 terrain d\u00e9gag\u00e9" },
    ramasse:         { j: 6,  note: "ouest, bocage dense" },
  },
  la_lisiere: {
    hautcendre:      { j: 5,  note: "ouest, bocage \u2014 route marchande" },
    val_des_brumes:  { j: 2,  note: "est \u2014 la for\u00eat commence ici" },
    hauts_plateaux:  { j: 4,  note: "ouest, bocage puis mont\u00e9e douce" },
    pierrelong:      { j: 7,  note: "nord-est, terrain vari\u00e9" },
    marceins:        { j: 5,  note: "sud, plaine puis route imp\u00e9riale" },
  },
  val_des_brumes: {
    la_lisiere:      { j: 2,  note: "ouest \u2014 sortie de la for\u00eat" },
    hautcendre:      { j: 8,  note: "ouest, for\u00eat puis bocage" },
    pierrelong:      { j: 6,  note: "nord, for\u00eat puis montagne" },
  },
  marceins: {
    hautcendre:      { j: 8,  note: "nord, route imp\u00e9riale pav\u00e9e \u2014 patrouilles" },
    les_cols:        { j: 2,  note: "sud, derni\u00e8re ville avant la fronti\u00e8re" },
    hauts_plateaux:  { j: 6,  note: "nord-est, mont\u00e9e progressive" },
    la_lisiere:      { j: 5,  note: "nord-est, plaine puis bocage" },
    ramasse:         { j: 7,  note: "nord-ouest, contournement" },
  },
  les_cols: {
    marceins:        { j: 2,  note: "nord, descente vers la plaine" },
    hautcendre:      { j: 12, note: "nord, route imp\u00e9riale longue" },
  },
  marais_tortues: {
    hautcendre:      { j: 9,  note: "nord-est, sortie des marais puis plaine" },
    ramasse:         { j: 4,  note: "nord, bocage \u2014 Foulards connaissent le chemin" },
    marceins:        { j: 7,  note: "est, contournement des marais" },
  },
  ramasse: {
    hautcendre:      { j: 9,  note: "est, bocage dense \u2014 routes r\u00e9sistance" },
    marais_tortues:  { j: 4,  note: "sud, marais \u00e0 l'horizon" },
    hauts_plateaux:  { j: 6,  note: "est, bocage puis mont\u00e9e" },
    marceins:        { j: 7,  note: "sud-est, contournement" },
  },
  hamecon: {
    hautcendre:      { j: 2,  note: "sud, plaine \u2014 route rapide" },
    pierrelong:      { j: 5,  note: "est, c\u00f4te puis montagne" },
  },
};

export function lieuKey(lieu) {
  return (lieu || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s'\-]+/g, "_");
}

export function getDistances(lieu) {
  const key = lieuKey(lieu);
  const dists = DISTANCES[key];
  if (!dists) return null;
  return Object.entries(dists)
    .map(([dest, { j, note }]) => dest.replace(/_/g, " ") + " : " + j + " jour" + (j > 1 ? "s" : "") + " (" + note + ")")
    .join(" | ");
}
