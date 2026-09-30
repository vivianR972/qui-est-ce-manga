window.QEC = window.QEC || {};
QEC.WIKI = {naruto:"naruto",onepiece:"onepiece",dbz:"dragonball",demonslayer:"kimetsu-no-yaiba",jujutsu:"jujutsu-kaisen",snk:"shingeki-no-kyojin",mha:"bokunoheroacademia",deathnote:"deathnote",hxh:"hunterxhunter",bleach:"bleach",fma:"fma",opm:"onepunchman",csm:"chainsaw-man"};
QEC.photo = function(c) {
  if (!c) return "";
  if (QEC.IMAGES && QEC.IMAGES[c.id]) return QEC.IMAGES[c.id];
  var wiki = QEC.WIKI[c.manga] || c.manga;
  var file = encodeURIComponent(String(c.name || c.id).replace(/ /g, "_") + ".png");
  return "https://" + wiki + ".fandom.com/wiki/Special:FilePath/" + file;
};
QEC.face = function(c, w, h) {
  w = w || 86; h = h || 96;
  if (!c) return "";
  var src = QEC.photo(c);
  var svg = QEC.portrait(c, w, h);
  var name = String(c.name || "").replace(/</g, "");
  return '<span class="facebox" style="display:block;width:100%;height:100%;position:relative;overflow:hidden">' +
    '<img src="' + src + '" alt="' + name + '" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'grid\'">' +
    '<span style="display:none;place-items:center;width:100%;height:100%">' + svg + '</span></span>';
};
QEC.portrait = function(c, w, h) {
  w = w || 86; h = h || 96; c = c || {};
  var hairMap = {noir:"#1a1a1a",brun:"#5a3418",blond:"#f2d05b",blanc:"#eef2f5",gris:"#9aa3ad",rouge:"#c0392b",orange:"#e67e22",rose:"#ff7ab0",bleu:"#3b82c4",vert:"#27ae60",violet:"#7d3c98",jaune:"#f4d03f",roux:"#c0392b"};
  var eyeMap = {noir:"#111",brun:"#5a3418",bleu:"#3b82c4",vert:"#1e8449",gris:"#7f8c8d",rouge:"#c0392b",jaune:"#f1c40f",violet:"#8e44ad"};
  var hair = hairMap[c.cheveux] || "#222";
  var eye = eyeMap[c.yeux] || "#222";
  var skin = (c.espece === "demon" || c.espece === "namek") ? "#7dcea0" : "#f3c7a3";
  return '<svg viewBox="0 0 86 96" width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg"><ellipse cx="43" cy="28" rx="24" ry="16" fill="' + hair + '"/><ellipse cx="43" cy="56" rx="22" ry="24" fill="' + skin + '"/><circle cx="34" cy="52" r="3.2" fill="' + eye + '"/><circle cx="52" cy="52" r="3.2" fill="' + eye + '"/></svg>';
};
