const HERO_KEY  = "ctl-hero";
const WORLD_KEY = "ctl-world";

export async function storageLoad(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
}

export async function storageSave(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

export async function storageDel(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {}
}

export function loadHero()  { return storageLoad(HERO_KEY); }
export function saveHero(h) { return storageSave(HERO_KEY, h); }
export function delHero()   { return storageDel(HERO_KEY); }

export function loadWorld()  { return storageLoad(WORLD_KEY); }
export function saveWorld(w) { return storageSave(WORLD_KEY, w); }

export { HERO_KEY, WORLD_KEY };
