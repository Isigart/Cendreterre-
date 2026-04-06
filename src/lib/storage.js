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

// --- API publique ---

export async function loadHero() {
  return localLoad(HERO_KEY);
}

export async function saveHero(h) {
  localSave(HERO_KEY, h);
  // Sync serveur en fond (non-bloquant)
  const world = localLoad(WORLD_KEY);
  serverSave(h, world);
}

export async function delHero() {
  localDel(HERO_KEY);
  serverSave(null, localLoad(WORLD_KEY));
}

export async function loadWorld() {
  return localLoad(WORLD_KEY);
}

export async function saveWorld(w) {
  localSave(WORLD_KEY, w);
  const hero = localLoad(HERO_KEY);
  serverSave(hero, w);
}

// Charger depuis le serveur (utilis\u00e9 quand le joueur entre son code sur un nouvel appareil)
export async function loadFromServer(code) {
  const data = await serverLoad(code);
  if (!data) return null;
  if (data.hero) localSave(HERO_KEY, data.hero);
  if (data.world) localSave(WORLD_KEY, data.world);
  return data;
}

// Forcer une synchro compl\u00e8te vers le serveur
export async function syncToServer() {
  const hero = localLoad(HERO_KEY);
  const world = localLoad(WORLD_KEY);
  await serverSave(hero, world);
}

export { HERO_KEY, WORLD_KEY, CODE_KEY };
