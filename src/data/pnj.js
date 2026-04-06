// ============================================================
// PNJ R\u00c9CURRENTS PAR LIEU
// Inject\u00e9s dans le contexte quand le h\u00e9ros est au bon endroit.
// Claude doit utiliser ces PNJ au lieu d'en inventer.
// ============================================================

export const PNJ_LIEUX = {
  hautcendre: [
    {
      nom: "Aldric le Gris",
      role: "Chef du Conseil cendreux",
      desc: "Soixantaine, cheveux gris fer, mains tach\u00e9es d'encre. Costume sombre impeccable. Regard qui \u00e9value avant de parler.",
      faction: "conseil",
      personnalite: "Collabore avec l'empire par calcul \u2014 pas par conviction. Chaque mot est pes\u00e9. Prot\u00e8ge Hautcendre en c\u00e9dant juste assez. D\u00e9teste qu'on le prenne pour un tra\u00eetre.",
    },
    {
      nom: "Maren",
      role: "Ma\u00eetre des forges \u2014 ing\u00e9nieure circuits",
      desc: "Quarantaine, bras muscl\u00e9s, br\u00fblure ancienne sur l'avant-bras gauche. Tablier de cuir, lun\u00e8ttes sur le front. Sent le m\u00e9tal chaud.",
      faction: "cendreux",
      personnalite: "Directe, impatiente, brillante. R\u00e9pare les circuits anciens et en fabrique au noir. Ne fait pas confiance facilement. Respecte la comp\u00e9tence.",
    },
    {
      nom: "Corvyn",
      role: "Contact r\u00e9sistance \u2014 Enfants d'Isigard",
      desc: "Trentaine, discret, visage ordinaire qu'on oublie. Porte un manteau trop grand. Toujours pr\u00e8s d'une sortie.",
      faction: "resistance",
      personnalite: "Parano\u00efaque \u00e0 juste titre. Parle peu, \u00e9coute beaucoup. Teste les gens avant de leur faire confiance. Si tu le vois, c'est qu'il l'a d\u00e9cid\u00e9.",
    },
    {
      nom: "Centurion Varro",
      role: "Commandant de la garnison imp\u00e9riale",
      desc: "Cinquantaine, cicatrice au menton, armure entretenue. Posture militaire m\u00eame assis. Accent du sud prononc\u00e9.",
      faction: "empire",
      personnalite: "Professionnel. Pas cruel, pas g\u00e9n\u00e9reux. Fait son travail, compte les jours avant la retraite. Respecte ceux qui ne lui mentent pas.",
    },
  ],
  ramasse: [
    {
      nom: "Nessa la Vieille",
      role: "Cheffe des Enfants d'Isigard",
      desc: "Soixante-dix ans, petite, dos vo\u00fbt\u00e9. Mains noueuses, yeux per\u00e7ants. Assise pr\u00e8s du feu avec un ch\u00e2le.",
      faction: "resistance",
      personnalite: "M\u00e9moire de tout. Conna\u00eet chaque chemin, chaque ferme-relais. Douce en apparence, impitoyable dans ses d\u00e9cisions. Le r\u00e9seau entier la respecte.",
    },
    {
      nom: "Broc",
      role: "Contrebandier principal",
      desc: "Quarantaine, large d'\u00e9paules, barbe rousse, rire facile. Sent le foin et le cuir.",
      faction: "resistance",
      personnalite: "Jovial en surface, dangereux quand il ne rit plus. Conna\u00eet les routes que personne ne conna\u00eet. Fait passer tout et n'importe quoi \u2014 pour le bon prix.",
    },
  ],
  marceins: [
    {
      nom: "L\u00e9gat Aurelius",
      role: "Commandant de garnison \u2014 autorit\u00e9 militaire supr\u00eame",
      desc: "Cinquantaine, maigre, visage anguleux. Uniforme toujours impeccable. Bague de fonction \u00e0 la main droite.",
      faction: "empire",
      personnalite: "Froid, m\u00e9thodique. Croit sinc\u00e8rement \u00e0 l'ordre imp\u00e9rial. Traite les locaux avec une politesse distante. Dangereux parce qu'intelligent.",
    },
    {
      nom: "Fr\u00e8re Solan",
      role: "Pr\u00e9lat du temple \u2014 chef du clerg\u00e9 local",
      desc: "Quarantaine, corpulent, mains soign\u00e9es. Robe blanche simple. Sourire permanent qui n'atteint pas toujours les yeux.",
      faction: "clerge",
      personnalite: "Ambitieux mais croit vraiment. Les miracles fonctionnent quand il prie \u2014 \u00e7a le trouble autant que \u00e7a le renforce. B\u00e2tit une institution. Prot\u00e8ge ceux qui viennent au temple.",
    },
  ],
  les_cols: [
    {
      nom: "Centurion Drenn",
      role: "Chef de poste \u2014 contr\u00f4le du passage",
      desc: "Quarantaine, muscl\u00e9, regard fatigu\u00e9. Armure ray\u00e9e par l'usage. Mains ab\u00eem\u00e9es par le froid.",
      faction: "empire",
      personnalite: "Pragmatique. A tout vu passer. Les papiers sont bons ou ne le sont pas. Pas de discours. Peut fermer les yeux \u2014 mais il faut une bonne raison.",
    },
  ],
  la_croisee: [
    {
      nom: "Seren-qui-\u00e9coute",
      role: "Gardienne de l'alphabet \u2014 cheffe Foulard",
      desc: "\u00c2ge ind\u00e9fini, petite, voile brod\u00e9 de runes, yeux noirs profonds. La tortue g\u00e9ante est toujours \u00e0 proximit\u00e9.",
      faction: "foulard",
      personnalite: "Parle peu, comprend tout. D\u00e9signe par la tortue. Les d\u00e9cisions qu'elle prend ne se discutent pas. Bienveillante envers ceux qui respectent les r\u00e8gles.",
    },
    {
      nom: "Kael",
      role: "Marchand de mots \u2014 chef du r\u00e9seau d'info",
      desc: "Trentaine, fin, sourire de renard. Voile l\u00e2che, doigts tach\u00e9s d'encre. Parle vite, r\u00e9fl\u00e9chit plus vite.",
      faction: "foulard",
      personnalite: "Tout a un prix. L'information c'est son commerce. Pas d\u00e9loyal \u2014 mais la loyaut\u00e9 se paie. Sait des choses qu'il ne devrait pas savoir.",
    },
    {
      nom: "Lorn",
      role: "Lame silencieuse \u2014 contact discret",
      desc: "Trentaine, aucun trait distinctif. On ne le remarque pas dans une foule. C'est le but.",
      faction: "foulard",
      personnalite: "N'existe pas officiellement. Appara\u00eet quand les Foulards ont un probl\u00e8me. Dispara\u00eet quand c'est r\u00e9gl\u00e9. Poli. Efficace.",
    },
  ],
  le_puits: [
    {
      nom: "Ancien Hadris",
      role: "Ancien du Zin principal \u2014 m\u00e9moire des chants",
      desc: "Tr\u00e8s vieux, trapu m\u00eame pour un Sonneur. Barbe grise, voix si grave qu'on la sent dans le sol. Assis pr\u00e8s du puits.",
      faction: "sonneur",
      personnalite: "Patient. Les chants les plus anciens passent par lui. Ne se presse pour personne. Teste les \u00e9trangers par le silence avant de parler.",
    },
    {
      nom: "Orsa",
      role: "Gardienne des galeries \u2014 contr\u00f4le l'acc\u00e8s aux profondeurs",
      desc: "Quarantaine, muscl\u00e9e, peau teinte roche. Armure l\u00e9g\u00e8re, lanterne \u00e0 la ceinture. Regarde les gens droit dans les yeux.",
      faction: "sonneur",
      personnalite: "Directe. Non c'est non. Si elle laisse passer, c'est pour une raison. Ne se laisse ni acheter ni impressionner.",
    },
  ],
  pierrelong: [
    {
      nom: "Tarek",
      role: "Commer\u00e7ant de surface \u2014 interface avec l'ext\u00e9rieur",
      desc: "Quarantaine, trapu, sourire commercial. Boutique bien rang\u00e9e en fa\u00e7ade. Accent l\u00e9ger des profondeurs.",
      faction: "sonneur",
      personnalite: "Amical mais calcule tout. Ce qu'il vend en surface finance ce qui se passe en dessous. Ne r\u00e9v\u00e8le rien des galeries.",
    },
  ],
  val_des_brumes: [
    {
      nom: "Faen",
      role: "Ancien Sylvain \u2014 voix des arbres sacr\u00e9s",
      desc: "\u00c2ge impossible \u00e0 d\u00e9terminer. Grand, mince, peau \u00e0 l'\u00e9corce, yeux verts sans pupilles. Se d\u00e9place sans bruit.",
      faction: "sylvain",
      personnalite: "Parle comme les arbres \u2014 lentement, avec des silences qui disent autant que les mots. La for\u00eat r\u00e9pond quand il demande. Ne s'explique pas.",
    },
  ],
  la_lisiere: [
    {
      nom: "Wren",
      role: "Gardienne en \u00e9preuve \u2014 Sylvaine en mission hors for\u00eat",
      desc: "Jeune, souple, regard m\u00e9fiant. V\u00eatements de voyage, b\u00e2ton de marche, tresses nou\u00e9es avec des feuilles.",
      faction: "sylvain",
      personnalite: "En mission. Ne dit pas laquelle. M\u00e9fiante envers tout le monde, sp\u00e9cialement les Cendreux et leurs circuits. Comp\u00e9tente, press\u00e9e, seule.",
    },
    {
      nom: "Pell",
      role: "Aubergiste de Bosqu\u00e8re \u2014 conna\u00eet tout le monde",
      desc: "Cinquantaine, rond, tablier tach\u00e9, voix forte. Auberge \u00e0 l'entr\u00e9e de Bosqu\u00e8re.",
      faction: "neutre",
      personnalite: "Accueillant mais prudent. Conna\u00eet les rumeurs avant qu'elles circulent. Ne prend pas parti \u2014 mais sait qui le fait.",
    },
  ],
  hauts_plateaux: [
    {
      nom: "Chef Ulven",
      role: "Chef de la tribu principale \u2014 les tatouages les plus lus",
      desc: "Cinquantaine, imposant, tatouages du cou aux mains. Regard direct qui ne cille pas. Voix calme.",
      faction: "agritan",
      personnalite: "Chaque mot est vrai \u2014 par n\u00e9cessit\u00e9. Juge les gens par ce qu'ils font, pas ce qu'ils disent. Respecte le courage. M\u00e9prise le mensonge.",
    },
    {
      nom: "Dessa",
      role: "Tatoueuse sacr\u00e9e",
      desc: "Quarantaine, mains tatou\u00e9es jusqu'aux doigts, regard concentr\u00e9. Silencieuse sauf pendant les c\u00e9r\u00e9monies.",
      faction: "agritan",
      personnalite: "Voit le v\u00e9cu vrai dans les yeux des gens. Refuse de tatouer ceux qui mentent \u2014 m\u00eame \u00e0 eux-m\u00eames. Respect\u00e9e plus que le chef.",
    },
  ],
  le_perigord: [
    {
      nom: "Vorn le Br\u00fbl\u00e9",
      role: "Chef des radicaux cendreux",
      desc: "Quarantaine, cicatrices de br\u00fblures sur le c\u00f4t\u00e9 droit du visage. Un \u0153il ferm\u00e9. Fort, rapide malgr\u00e9 tout.",
      faction: "radicaux",
      personnalite: "Pas de n\u00e9gociation avec l'empire. A perdu sa famille pendant la conqu\u00eate. Se bat pour Isigard, pas pour le conseil. Dangereux, loyal envers les siens.",
    },
  ],
  terre_balayee: [
    {
      nom: "Elva",
      role: "\u00c9leveuse \u2014 figure locale",
      desc: "Cinquantaine, mains ab\u00eem\u00e9es par le travail, visage burin\u00e9 par le vent. Toujours dehors.",
      faction: "cendreux",
      personnalite: "Peu de mots, beaucoup de bon sens. H\u00e9berge les voyageurs mais pose des questions le lendemain. Conna\u00eet la plaine comme sa poche.",
    },
  ],
  les_coteaux: [
    {
      nom: "Caera",
      role: "Vigneronne \u2014 cheffe de la contrebande de vin",
      desc: "Quarantaine, bronz\u00e9e, mains violettes par le raisin. Sourire large, rire facile. Cave immense.",
      faction: "cendreux",
      personnalite: "G\u00e9n\u00e9reuse avec le vin, avare avec les secrets. La contrebande finance la r\u00e9sistance locale. Conna\u00eet chaque chemin de traverse.",
    },
  ],
  hamecon: [
    {
      nom: "Bran",
      role: "Capitaine des p\u00eacheurs \u2014 a\u00een\u00e9 du port",
      desc: "Soixantaine, muscl\u00e9 malgr\u00e9 l'\u00e2ge, peau tann\u00e9e, mains comme du cuir. Barque \u00e0 fond plat amarr\u00e9e au quai.",
      faction: "cendreux",
      personnalite: "Le fleuve prend, le fleuve donne. Parle des morts comme des vivants. Conna\u00eet les courants, les lumi\u00e8res de l'autre rive. Ne pose pas de questions \u2014 n'en r\u00e9pond pas non plus.",
    },
  ],
  marais_tortues: [
    {
      nom: "Aryn",
      role: "Guide des marais \u2014 Foulard s\u00e9dentaire",
      desc: "Trentaine, petit, pieds nus m\u00eame dans la boue. Conna\u00eet chaque \u00eelot, chaque passage.",
      faction: "foulard",
      personnalite: "A perdu l'alphabet mais pas le sens du terrain. Guide les voyageurs par le marais. Le prix : un service futur, pas de l'argent.",
    },
  ],
};

// --- FONCTION D'INJECTION ---

import { lieuKey } from "./lieux.js";

export function buildPnjCtx(heroLieu) {
  const key = lieuKey(heroLieu);
  const pnjs = PNJ_LIEUX[key];
  if (!pnjs || !pnjs.length) return "";

  const parts = ["PNJ R\u00c9CURRENTS DU LIEU \u2014 utilise ces personnages, ne pas en inventer d'autres pour ces r\u00f4les"];
  pnjs.forEach(p => {
    parts.push(`- ${p.nom} (${p.role}) : ${p.desc} / ${p.personnalite}`);
  });
  return parts.join("\n");
}
