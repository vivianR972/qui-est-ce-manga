window.QEC = window.QEC || {};
QEC.IMAGES = QEC.IMAGES || {};
QEC.LOGOS = QEC.LOGOS || {};
QEC.photo = function(c) {
  if (!c) return "";
  if (QEC.IMAGES[c.id]) return QEC.IMAGES[c.id];
  return "";
};
QEC.face = function(c, w, h) {
  w = w || 86; h = h || 96;
  if (!c) return "";
  var src = QEC.photo(c);
  var letter = String(c.name || "?").charAt(0);
  var col = c.color || "#ff4d8d";
  var fallback = '<div class="ph" style="width:100%;height:100%;min-height:80px;display:grid;place-items:center;background:' + col + ';font-weight:800;font-size:28px">' + letter + '</div>';
  if (!src) return fallback;
  return '<img src="' + src + '" alt="' + String(c.name || "").replace(/"/g,"") + '" referrerpolicy="no-referrer" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block" onerror="this.onerror=null;this.outerHTML=this.nextSibling.outerHTML"><span style="display:none">' + fallback + '</span>';
};
QEC.logo = function(id) {
  var src = QEC.LOGOS[id];
  if (src) return '<img class="lic-logo" src="' + src + '" alt="" referrerpolicy="no-referrer" onerror="this.style.display=\'none\'">';
  return '<span class="ic">*</span>';
};
