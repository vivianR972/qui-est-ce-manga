window.QEC = window.QEC || {};
QEC.IMAGES = QEC.IMAGES || {};
QEC.LOGOS = QEC.LOGOS || {
  mix: "https://upload.wikimedia.org/wikipedia/commons/1/15/Logo_Naruto_Shipp%C5%ABden.svg",
  naruto: "https://upload.wikimedia.org/wikipedia/commons/1/15/Logo_Naruto_Shipp%C5%ABden.svg",
  onepiece: "https://upload.wikimedia.org/wikipedia/commons/3/34/One_piece_logo_1.svg",
  dbz: "https://upload.wikimedia.org/wikipedia/commons/8/86/Dragon_Ball_Logo.png",
  demonslayer: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Demon_Slayer_logo.svg",
  jujutsu: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Jujutsu_Kaisen_logo_in_Japan.png",
  snk: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Shingeki_no_Kyojin_logo.svg/320px-Shingeki_no_Kyojin_logo.svg.png",
  mha: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Boku_no_Hero_Academia_Logo.svg/320px-Boku_no_Hero_Academia_Logo.svg.png",
  deathnote: "https://static.wikia.nocookie.net/deathnote/images/0/08/Death_Note_title_white.png",
  hxh: "https://static.wikia.nocookie.net/hunterxhunter/images/9/95/Hunter_%C3%97_Hunter_2011_logo.png",
  bleach: "https://static.wikia.nocookie.net/bleach/images/7/76/Bleach-Logo1.jpg",
  fma: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Fullmetal_Alchemist_logo.svg/320px-Fullmetal_Alchemist_logo.svg.png",
  opm: "https://static.wikia.nocookie.net/onepunchman/images/d/dd/One-Punch_Man_Logo.jpg",
  csm: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Chainsaw_Man_logo.svg/320px-Chainsaw_Man_logo.svg.png"
};
QEC.photo = function(c) { return (c && QEC.IMAGES && QEC.IMAGES[c.id]) || ""; };
QEC.face = function(c) {
  if (!c) return "";
  var src = QEC.photo(c);
  var letter = String(c.name || "?").charAt(0);
  var col = c.color || "#7c3aed";
  var fb = '<div class="ph" style="width:100%;height:100%;min-height:80px;display:grid;place-items:center;background:' + col + ';font-weight:800;font-size:28px;color:#fff">' + letter + '</div>';
  if (!src) return fb;
  return '<span class="facebox" style="display:block;width:100%;height:100%;overflow:hidden">' +
    '<img src="' + src + '" alt="" referrerpolicy="no-referrer" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block" onerror="this.style.display=\'none\';var n=this.nextSibling;if(n)n.style.display=\'grid\'">' +
    '<div class="ph" style="display:none;width:100%;height:100%;min-height:80px;place-items:center;background:' + col + ';font-weight:800;font-size:28px;color:#fff">' + letter + '</div>' +
    '</span>';
};
QEC.logo = function(id) {
  var src = QEC.LOGOS && QEC.LOGOS[id];
  if (!src) return '<span class="ic">*</span>';
  return '<img class="lic-logo" src="' + src + '" alt="" referrerpolicy="no-referrer" onerror="this.style.display=\'none\'">';
};
