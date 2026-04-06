export const PRENOMS_M = ["Aldric","Cael","Tavar","Drenn","Renn","Kord","Broc","Harun","Pell","Mael","Bran","Kern","Hadris","Corvyn","Elden","Faryn","Ulven","Tarek","Vorn","Osric"];
export const PRENOMS_F = ["Maren","Sorel","Linh","Brin","Orsa","Nessa","Ayla","Lira","Sian","Elva","Wren","Sela","Mira","Vael","Rynn","Dessa","Caera","Nira","Maeve","Vorna"];
export const PRENOMS_N = ["Fen","Sael","Bryn","Lorn","Skael","Aryn","Kael","Oren","Talin","Seren","Dryn","Faen","Coryn","Veyn","Ryth"];

export function randomPrenom(genre) {
  const pool = genre === "M" ? PRENOMS_M : genre === "F" ? PRENOMS_F : PRENOMS_N;
  return pool[Math.floor(Math.random() * pool.length)];
}
