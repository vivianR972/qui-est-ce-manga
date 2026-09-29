QEC.portrait = function(c, w = 86, h = 96) {
  const hair = {noir:"#1a1a1a",brun:"#5a3418",blond:"#f2d05b",blanc:"#eef2f5",gris:"#9aa3ad",rouge:"#c0392b",orange:"#e67e22",rose:"#ff7ab0",bleu:"#3b82c4",vert:"#27ae60",violet:"#7d3c98",jaune:"#f4d03f",roux:"#c0392b",bordeaux:"#7b241c"}[c.cheveux] || "#222";
  const eye = {noir:"#1a1a1a",brun:"#5a3418",bleu:"#3b82c4",vert:"#1e8449",gris:"#7f8c8d",rouge:"#c0392b",jaune:"#f1c40f",violet:"#8e44ad",rose:"#ff7ab0",blanc:"#ecf0f1",ambre:"#d68910",turquoise:"#1abc9c",or:"#d4ac0d",orange:"#e67e22"}[c.yeux] || "#222";
  const skin = c.espece === "demon" || c.espece === "namek" ? "#7dcea0" : c.espece === "alien" ? "#d7bde2" : "#f3c7a3";
  const long = ["long","double","queue","tresse","afro"].includes(c.longueur);
  const spiky = c.longueur === "hérissé";
  const bald = c.longueur === "chauve" || c.cheveux === "chauve";
  const hairPath = bald ? "" : long ? `<path d="M18 38 C10 8, 76 8, 68 38 L72 92 L14 92 Z" fill="${hair}"/><ellipse cx="43" cy="26" rx="26" ry="16" fill="${hair}"/>` : spiky ? `<polygon points="18,36 22,8 30,30 38,6 46,30 54,5 62,30 70,10 68,38 18,38" fill="${hair}"/>` : `<ellipse cx="43" cy="28" rx="24" ry="16" fill="${hair}"/>`;
  const glasses = (c.lunettes || ["lunettes","lunettes-soleil"].includes(c.accessoire)) ? `<rect x="22" y="46" width="16" height="10" rx="2" fill="none" stroke="#222" stroke-width="2"/><rect x="48" y="46" width="16" height="10" rx="2" fill="none" stroke="#222" stroke-width="2"/><line x1="38" y1="51" x2="48" y2="51" stroke="#222" stroke-width="2"/>` : "";
  const mask = c.accessoire === "masque" ? `<rect x="24" y="56" width="38" height="16" rx="8" fill="#2c3e50"/>` : "";
  const hat = c.accessoire === "chapeau" ? `<ellipse cx="43" cy="16" rx="28" ry="6" fill="#8b1e1e"/><rect x="26" y="2" width="34" height="16" rx="4" fill="#c0392b"/>` : "";
  const band = c.accessoire === "bandeau" ? `<rect x="16" y="34" width="54" height="8" fill="#f4f6f7"/><rect x="36" y="34" width="14" height="8" fill="#c0392b"/>` : "";
  const scar = c.cicatrice ? `<path d="M30 44 L38 56" stroke="#b03a2e" stroke-width="2"/>` : "";
  const horns = ["cornes","corne"].includes(c.accessoire) ? `<polygon points="22,28 16,10 30,26" fill="${hair}"/><polygon points="64,28 70,10 56,26" fill="${hair}"/>` : "";
  const extra = c.mark === "whiskers" ? `<path d="M18 58 L30 56 M18 64 L30 61 M68 58 L56 56 M68 64 L56 61" stroke="#7b241c" stroke-width="1.6"/>` : "";
  return `<svg viewBox="0 0 86 96" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${hairPath}<ellipse cx="43" cy="56" rx="22" ry="24" fill="${skin}"/>${horns}${hat}${band}<circle cx="34" cy="52" r="3.2" fill="${eye}"/><circle cx="52" cy="52" r="3.2" fill="${eye}"/>${scar}${glasses}${mask}${extra}<path d="M36 66 Q43 70 50 66" fill="none" stroke="#7a4a32" stroke-width="1.6"/></svg>`;
};
