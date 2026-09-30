window.QEC = window.QEC || {};
QEC.WIKI = {
  naruto: "naruto",
  onepiece: "onepiece",
  dbz: "dragonball",
  demonslayer: "kimetsu-no-yaiba",
  jujutsu: "jujutsu-kaisen",
  snk: "shingeki-no-kyojin",
  mha: "bokunoheroacademia",
  deathnote: "deathnote",
  hxh: "hunterxhunter",
  bleach: "bleach",
  fma: "fma",
  opm: "onepunchman",
  csm: "chainsaw-man"
};
QEC.photo = function(c) {
  if (!c) return null;
  if (QEC.IMAGES && QEC.IMAGES[c.id]) return QEC.IMAGES[c.id];
  var wiki = QEC.WIKI[c.manga] || c.manga;
  var file = encodeURIComponent((c.name || c.id).replace(/ /g, "_") + ".png");
  return "https://" + wiki + ".fandom.com/wiki/Special:FilePath/" + file;
};
QEC.face = function(c, w, h) {
  w = w || 86; h = h || 96;
  if (!c) return "";
  var src = QEC.photo(c);
  var svg = QEC.portrait(c, w, h).replace(/`/g, "");
  var safe = (c.name || "").replace(/"/g, "");
  return '<img src="' + src + '" alt="' + safe + '" width="' + w + '" height="' + h + '" loading="lazy" referrerpolicy="no-referrer" style="object-fit:cover;object-position:center top;width:100%;height:100%;display:block" onerror="this.onerror=null;this.outerHTML=`' + svg.replace(/`/g, "'") + '`">';
};
QEC.portrait = function(c, w, h) {
  w = w || 86; h = h || 96;
  c = c || {};
  var hairMap = {noir:"#1a1a1a",brun:"#5a3418",blond:"#f2d05b",blanc:"#eef2f5",gris:"#9aa3ad",rouge:"#c0392b",orange:"#e67e22",rose:"#ff7ab0",bleu:"#3b82c4",vert:"#27ae60",violet:"#7d3c98",jaune:"#f4d03f",roux:"#c0392b"};
  var eyeMap = {noir:"#1a1a1a",brun:"#5a3418",bleu:"#3b82c4",vert:"#1e8449",gris:"#7f8c8d",rouge:"#c0392b",jaune:"#f1c40f",violet:"#8e44ad",rose:"#ff7ab0",blanc:"#ecf0f1"};
  var hair = hairMap[c.cheveux] || "#222";
  var eye = eyeMap[c.yeux] || "#222";
  var skin = (c.espece === "demon" || c.espece === "namek") ? "#7dcea0" : "#f3c7a3";
  var longHair = ["long","double","queue","tresse","afro"].indexOf(c.longueur) >= 0;
  var spiky = c.longueur === "herisse" || c.longueur === "herisse" || c.longueur === "herisse";
  var bald = c.longueur === "chauve" || c.cheveux === "chauve";
  var hairPath = bald ? "" : longHair ? '<ellipse cx="43" cy="26" rx="26" ry="16" fill="' + hair + '"/>' : spiky ? '<polygon points="18,36 22,8 30,30 38,6 46,30 54,5 62,30 70,10 68,38 18,38" fill="' + hair + '"/>' : '<ellipse cx="43" cy="28" rx="24" ry="16" fill="' + hair + '"/>';
  return '<svg viewBox="0 0 86 96" width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg">' + hairPath + '<ellipse cx="43" cy="56" rx="22" ry="24" fill="' + skin + '"/><circle cx="34" cy="52" r="3.2" fill="' + eye + '"/><circle cx="52" cy="52" r="3.2" fill="' + eye + '"/><path d="M36 66 Q43 70 50 66" fill="none" stroke="#7a4a32" stroke-width="1.6"/></svg>';
};
