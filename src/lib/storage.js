const HERO_KEY  = "ctl-hero";
const WORLD_KEY = "ctl-world";
const CODE_KEY  = "ctl-code";

// --- localStorage (instant, local) ---

function localLoad(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
}

function localSave(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

function localDel(key) {
  try { localStorage.removeItem(key); } catch (e) {}
}

// --- Code joueur ---

export function getPlayerCode() {
  try { return localStorage.getItem(CODE_KEY) || null; } catch (e) { return null; }
}

export function setPlayerCode(code) {
  try { localStorage.setItem(CODE_KEY, code.toLowerCase().trim()); } catch (e) {}
}

// --- Sync serveur (async, non-bloquant) ---

async function serverSave(hero, world) {
  const code = getPlayerCode();
  if (!code) return;
  try {
    await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, hero, world }),
    });
  } catch (e) {
    // Silently fail — localStorage is the primary store
  }
}

async function serverLoad(code) {
  try {
    const res = await fetch("/api/load", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.ok) return { hero: data.hero, world: data.world };
    return null;
  } catch (e) {
    return null;
  }
}

const HEROES_KEY = "ctl-heroes";
const ACTIVE_KEY = "ctl-active";

// --- API publique ---

// Multi-h\u00e9ros : charge tous les h\u00e9ros
export async function loadHeroes() {
  return localLoad(HEROES_KEY) || [];
}

export async function saveHeroes(heroes) {
  localSave(HEROES_KEY, heroes);
  const world = localLoad(WORLD_KEY);
  serverSave(heroes, world);
}

// H\u00e9ros actif
export function getActiveHeroId() {
  try { return localStorage.getItem(ACTIVE_KEY) || null; } catch (e) { return null; }
}

export function setActiveHeroId(id) {
  try { localStorage.setItem(ACTIVE_KEY, id); } catch (e) {}
}

// Compat : charge le h\u00e9ros actif
export async function loadHero() {
  const heroes = await loadHeroes();
  const activeId = getActiveHeroId();
  if (activeId) {
    const found = heroes.find(h => h.id === activeId);
    if (found) return found;
  }
  // Fallback : ancien format mono-h\u00e9ros
  const old = localLoad(HERO_KEY);
  if (old) {
    if (!old.id) old.id = "hero_" + Date.now();
    return old;
  }
  return heroes[0] || null;
}

export async function saveHero(h) {
  if (!h.id) h.id = "hero_" + Date.now();
  const heroes = await loadHeroes();
  const idx = heroes.findIndex(x => x.id === h.id);
  if (idx >= 0) heroes[idx] = h;
  else heroes.push(h);
  await saveHeroes(heroes);
  setActiveHeroId(h.id);
}

export async function delHero(heroOrId) {
  const id = typeof heroOrId === "string" ? heroOrId : heroOrId?.id;
  let heroes = await loadHeroes();
  if (id) heroes = heroes.filter(h => h.id !== id);
  await saveHeroes(heroes);
  localDel(HERO_KEY); // clean ancien format
}

export async function loadWorld() {
  return localLoad(WORLD_KEY);
}

export async function saveWorld(w) {
  localSave(WORLD_KEY, w);
  const heroes = localLoad(HEROES_KEY);
  serverSave(heroes, w);
}

export async function loadFromServer(code) {
  const data = await serverLoad(code);
  if (!data) return null;
  // Support ancien format (hero) et nouveau (heroes)
  if (data.hero && !Array.isArray(data.hero)) {
    if (!data.hero.id) data.hero.id = "hero_" + Date.now();
    localSave(HEROES_KEY, [data.hero]);
  } else if (Array.isArray(data.hero)) {
    localSave(HEROES_KEY, data.hero);
  }
  if (data.world) localSave(WORLD_KEY, data.world);
  return data;
}

export async function syncToServer() {
  const heroes = localLoad(HEROES_KEY);
  const world = localLoad(WORLD_KEY);
  await serverSave(heroes, world);
}

export { HERO_KEY, WORLD_KEY, CODE_KEY };
