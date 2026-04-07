// ============================================================
// COMP\u00c9TENCES — niveaux narratifs, pas de chiffres
// ============================================================

export const NIVEAUX = ["novice", "apprenti", "comp\u00e9tent", "expert", "ma\u00eetre"];

export const COMPETENCES_METIER = {
  // Cendreux
  paysan:        { endurance: "comp\u00e9tent", survie: "apprenti" },
  ouvrier:       { endurance: "comp\u00e9tent", artisanat: "apprenti" },
  journalier:    { endurance: "apprenti" },
  mecano:        { artisanat: "comp\u00e9tent", circuits: "apprenti" },
  ingenieur:     { circuits: "comp\u00e9tent", artisanat: "apprenti" },
  marchand:      { commerce: "comp\u00e9tent", persuasion: "apprenti" },
  porteur:       { endurance: "apprenti", observation: "apprenti" },
  conseiller:    { persuasion: "comp\u00e9tent", observation: "apprenti" },
  braconnier:    { survie: "comp\u00e9tent", discretion: "apprenti" },
  soldat_demo:   { combat: "comp\u00e9tent", endurance: "apprenti" },
  contrebandier: { discretion: "comp\u00e9tent", commerce: "apprenti" },
  resistant:     { discretion: "apprenti", observation: "apprenti" },
  collaborateur: { persuasion: "apprenti", observation: "apprenti" },
  // Sonneurs
  mineur:          { endurance: "comp\u00e9tent", artisanat: "apprenti" },
  gardien_galerie: { combat: "apprenti", observation: "comp\u00e9tent" },
  eleveur_taupe:   { survie: "comp\u00e9tent", endurance: "apprenti" },
  chanteur:        { chant: "comp\u00e9tent" },
  zin_guerre:      { chant: "apprenti", combat: "comp\u00e9tent" },
  messager_sonn:   { endurance: "comp\u00e9tent", discretion: "apprenti" },
  commergant_surf: { commerce: "comp\u00e9tent", persuasion: "apprenti" },
  ancien_zin:      { chant: "expert", observation: "apprenti" },
  enfant_terre:    { chant: "comp\u00e9tent" },
  // Sylvains
  apprenti_sylv:   { chakra: "novice", survie: "apprenti" },
  praticien_sylv:  { chakra: "comp\u00e9tent", survie: "apprenti" },
  enseignant_sylv: { chakra: "expert", observation: "apprenti" },
  ancien_sylv:     { chakra: "expert", observation: "comp\u00e9tent" },
  gardien_epreuve: { chakra: "comp\u00e9tent", combat: "apprenti", endurance: "apprenti" },
  // Agritans
  enfant_agr:   {},
  guerrier_agr: { combat: "comp\u00e9tent", tatouage: "novice", endurance: "apprenti" },
  dresseur_agr: { survie: "comp\u00e9tent", endurance: "comp\u00e9tent" },
  tatoueur_agr: { tatouage: "expert", observation: "comp\u00e9tent" },
  chef_agr:     { combat: "comp\u00e9tent", tatouage: "comp\u00e9tent", persuasion: "apprenti" },
  paria_agr:    { survie: "comp\u00e9tent", endurance: "apprenti" },
  // Foulards
  coureur_route:    { endurance: "comp\u00e9tent", observation: "apprenti" },
  sedentaire:       { commerce: "apprenti" },
  runiste:          { runes: "comp\u00e9tent", artisanat: "apprenti" },
  marchand_mots:    { commerce: "comp\u00e9tent", observation: "comp\u00e9tent" },
  cartographe:      { runes: "apprenti", survie: "comp\u00e9tent" },
  marchand_croisee: { commerce: "comp\u00e9tent", persuasion: "apprenti" },
  lame_sil:         { combat: "expert", discretion: "expert" },
  gardien_alpha:    { runes: "expert", observation: "comp\u00e9tent" },
  // Ratainiens
  legionnaire:     { combat: "apprenti", endurance: "apprenti" },
  decurion:        { combat: "comp\u00e9tent", persuasion: "apprenti" },
  centurion:       { combat: "expert", observation: "apprenti" },
  legat:           { combat: "comp\u00e9tent", persuasion: "comp\u00e9tent" },
  collecteur_rat:  { commerce: "comp\u00e9tent", observation: "apprenti" },
  scribe_imp:      { observation: "comp\u00e9tent" },
  gouverneur_dist: { persuasion: "expert", observation: "comp\u00e9tent" },
  missionnaire:    { foi: "comp\u00e9tent", persuasion: "apprenti" },
  prelat:          { foi: "expert", persuasion: "comp\u00e9tent" },
  marchand_rat:    { commerce: "comp\u00e9tent", persuasion: "apprenti" },
  colon:           { survie: "apprenti", endurance: "apprenti" },
};

// Sans m\u00e9tier = rien
export const COMPETENCES_DEFAUT = {};

// Comp\u00e9tences sp\u00e9ciales bloqu\u00e9es par peuple
export const COMPETENCES_BLOQUEES = {
  chant:    ["sonneur"],      // seuls les Sonneurs
  chakra:   ["sylvain"],      // seuls les Sylvains
  runes:    ["foulard"],      // seuls les Foulards
  tatouage: ["agritan"],      // seuls les Agritans
  foi:      ["ratainien"],    // tout le monde peut croire, mais seuls les Ratainiens re\u00e7oivent des r\u00e9ponses
};

export function getCompetencesInitiales(metierId) {
  if (!metierId) return { ...COMPETENCES_DEFAUT };
  return { ...(COMPETENCES_METIER[metierId] || COMPETENCES_DEFAUT) };
}

export function canLearnCompetence(peupleId, competence) {
  const restriction = COMPETENCES_BLOQUEES[competence];
  if (!restriction) return true;
  return restriction.includes(peupleId);
}
