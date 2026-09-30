(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const state = {
    screen: "home", mode: "mix", name: "", room: "", isHost: false, local: false,
    peer: null, conn: null, connected: false, pool: [], secret: null, opponentName: "",
    myTurn: false, waitingAnswer: false, pendingQuestion: null, eliminated: {}, over: false,
    retries: 0
  };
  try { state.name = localStorage.getItem("qec-name") || ""; } catch (e) {}
  function show(id) {
    $$(".screen").forEach(s => s.classList.toggle("active", s.id === "screen-" + id));
  }
  function toast(t) {
    const el = $("#toast"); if (!el) return;
    el.textContent = t; el.classList.add("show");
    setTimeout(function(){ el.classList.remove("show"); }, 2800);
  }
  function log(text) {
    const box = $("#chat"); if (!box) return;
    const d = document.createElement("div");
    d.className = "msg sys"; d.textContent = text; box.appendChild(d);
    box.scrollTop = box.scrollHeight;
  }
  function code() {
    const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s = "";
    for (let i = 0; i < 5; i++) s += abc[Math.floor(Math.random() * abc.length)];
    return s;
  }
  function peerId(room) { return "qecm26" + String(room).toUpperCase(); }
  function peerOpts() {
    return {
      debug: 1,
      secure: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun.cloudflare.com:3478" }
        ]
      }
    };
  }
  function bind(id, fn) { const el = document.getElementById(id); if (el) el.onclick = fn; }
  function face(c) {
    try { if (window.QEC && QEC.face && c) return QEC.face(c); } catch (e) {}
    var name = (c && c.name) ? c.name : "?";
    var col = (c && c.color) ? c.color : "#ff4d8d";
    return '<div style="height:132px;display:grid;place-items:center;background:' + col + ';font-size:28px;font-weight:800">' + name.charAt(0) + '</div>';
  }
  function renderMangas() {
    const box = $("#manga-grid"); if (!box || !window.QEC) return;
    box.innerHTML = QEC.MANGAS.map(function(m) {
      var n = m.id === "mix" ? (QEC.MIX_IDS || []).length : QEC.pool(m.id).length;
      var sel = state.mode === m.id ? " selected" : "";
      var ic = (QEC.logo ? QEC.logo(m.id) : ('<span class="ic">' + (m.icon || "*") + '</span>'));
      return '<div class="manga-card' + sel + '" data-id="' + m.id + '">' + ic + '<b>' + m.name + '</b><small>' + n + ' persos</small></div>';
    }).join("");
    box.onclick = function(e) {
      var card = e.target.closest(".manga-card"); if (!card) return;
      state.mode = card.dataset.id; renderMangas();
    };
  }
  function startCreate() {
    state.name = ($("#name-input") && $("#name-input").value.trim()) || "Joueur 1";
    try { localStorage.setItem("qec-name", state.name); } catch (e) {}
    state.local = false; state.isHost = true; state.room = code();
    show("setup"); renderMangas();
    if ($("#setup-title")) $("#setup-title").textContent = "Creer une partie en ligne";
    if ($("#btn-launch")) $("#btn-launch").textContent = "Creer la salle";
  }
  function startJoin() {
    state.name = ($("#name-input") && $("#name-input").value.trim()) || "Joueur 2";
    try { localStorage.setItem("qec-name", state.name); } catch (e) {}
    state.local = false; state.isHost = false; show("join");
  }
  function startLocalMode() {
    state.name = ($("#name-input") && $("#name-input").value.trim()) || "Joueur 1";
    state.local = true; state.isHost = true; show("setup"); renderMangas();
    if ($("#setup-title")) $("#setup-title").textContent = "Partie sur le meme PC";
    if ($("#btn-launch")) $("#btn-launch").textContent = "Lancer la partie locale";
  }
  window.qecCreate = startCreate; window.qecJoin = startJoin; window.qecLocal = startLocalMode;
  bind("btn-create", startCreate); bind("btn-join", startJoin); bind("btn-local", startLocalMode);
  $$("[data-back]").forEach(function(b){ b.onclick = function(){ destroyNet(); show("home"); }; });
  bind("btn-launch", function() {
    if (!window.QEC || !QEC.pool) return toast("Fichiers incomplets.");
    state.pool = shuffle(QEC.pool(state.mode)).slice(0, 24);
    if (state.pool.length < 8) return toast("Pas assez de personnages.");
    if (state.local) startLocal(); else createRoom();
  });
  bind("btn-do-join", function() {
    var room = $("#join-code").value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (room.length < 4) return toast("Code trop court.");
    joinRoom(room);
  });
  function setWait(t) { if ($("#wait-status")) $("#wait-status").textContent = t; }
  function createRoom() {
    show("wait"); $("#wait-code").textContent = state.room;
    setWait("Ouverture de la salle...");
    destroyNet();
    try { state.peer = new Peer(peerId(state.room), peerOpts()); }
    catch (e) { return setWait("PeerJS indisponible. Reessaie."); }
    state.peer.on("open", function(){ setWait("Salle ouverte. Ton ami entre ce code, puis Rejoindre."); });
    state.peer.on("error", function(err){
      if (err && err.type === "unavailable-id") {
        state.room = code();
        $("#wait-code").textContent = state.room;
        setWait("Nouveau code, envoie-le a ton ami.");
        try { state.peer.destroy(); } catch (e) {}
        setTimeout(createRoom, 400);
        return;
      }
      setWait("Erreur reseau : " + (err && err.type ? err.type : err) + ". Reessaie.");
    });
    state.peer.on("connection", function(conn){
      if (state.conn && state.connected) { try { conn.close(); } catch (e) {} return; }
      state.conn = conn;
      setWait("Ami trouve, connexion...");
      wireConn();
    });
  }
  function joinRoom(room) {
    state.room = room; state.retries = 0;
    show("wait"); $("#wait-code").textContent = room; setWait("Connexion a la salle...");
    destroyNet();
    try { state.peer = new Peer(peerOpts()); }
    catch (e) { return setWait("PeerJS indisponible."); }
    state.peer.on("open", function(){ tryConnect(); });
    state.peer.on("error", function(err){
      setWait("Erreur : " + (err && err.type ? err.type : err));
      if (err && (err.type === "peer-unavailable" || err.type === "network" || err.type === "server-error")) {
        scheduleRetry();
      }
    });
  }
  function tryConnect() {
    if (!state.peer || state.connected) return;
    setWait("Tentative " + (state.retries + 1) + "/12...");
    try {
      state.conn = state.peer.connect(peerId(state.room), { reliable: true, serialization: "json" });
      wireConn();
    } catch (e) { scheduleRetry(); }
  }
  function scheduleRetry() {
    if (state.connected || state.local) return;
    state.retries += 1;
    if (state.retries > 12) {
      setWait("Toujours pas connecte. Verifie : meme code, hote deja sur ecran Salle ouverte, les deux en HTTPS.");
      return;
    }
    setTimeout(tryConnect, 1500);
  }
  function wireConn() {
    if (!state.conn) return;
    state.conn.on("open", function(){
      state.connected = true;
      setWait("Connecte ! Lancement...");
      send({
        type: "hello",
        name: state.name,
        isHost: state.isHost,
        mode: state.mode,
        pool: state.isHost ? state.pool.map(function(c){ return c.id; }) : null
      });
      if (!state.isHost) setWait("Connecte, en attente du plateau...");
    });
    state.conn.on("data", onMsg);
    state.conn.on("close", function(){ if (!state.over) toast("Deconnexion"); state.connected = false; });
    state.conn.on("error", function(){ if (!state.connected) scheduleRetry(); });
  }
  function send(obj) {
    try { if (state.conn && state.conn.open) state.conn.send(obj); } catch (e) {}
  }
  function destroyNet() {
    try { if (state.conn) state.conn.close(); } catch (e) {}
    try { if (state.peer) state.peer.destroy(); } catch (e) {}
    state.conn = null; state.peer = null; state.connected = false;
  }
  function applyPool(ids, mode) {
    if (mode) state.mode = mode;
    if (ids && ids.length) {
      state.pool = ids.map(function(id){ return (QEC.CHARS || []).filter(function(c){ return c.id === id; })[0]; }).filter(Boolean);
    }
  }
  function onMsg(msg) {
    if (!msg || !msg.type) return;
    if (msg.type === "hello") {
      state.opponentName = msg.name || "Adversaire";
      if (!state.isHost) applyPool(msg.pool, msg.mode);
      if (state.isHost) beginOnline();
    }
    if (msg.type === "start") {
      applyPool(msg.pool, msg.mode);
      state.myTurn = !msg.hostStarts;
      beginBoard(msg.secretForGuest);
    }
    if (msg.type === "question") {
      state.pendingQuestion = msg;
      $("#answer-bar").classList.add("show");
      $("#pending-q").textContent = state.opponentName + " : " + msg.label;
      log(state.opponentName + " demande : " + msg.label);
    }
    if (msg.type === "answer") { state.waitingAnswer = false; log("Reponse : " + (msg.yes ? "OUI" : "NON")); state.myTurn = false; updateTurn(); }
    if (msg.type === "guess") {
      var ok = msg.charId === state.secret.id;
      send({ type: "guessResult", ok: ok });
      if (ok) endGame(false, msg.charId); else { log("Mauvaise accusation"); state.myTurn = true; updateTurn(); }
    }
    if (msg.type === "guessResult") { if (msg.ok) endGame(true, state._lastGuess); else { log("Rate"); state.myTurn = false; updateTurn(); } }
  }
  function beginOnline() {
    var secretHost = pick(state.pool);
    var others = state.pool.filter(function(c){ return c.id !== secretHost.id; });
    var secretGuest = pick(others.length ? others : state.pool);
    state.secret = secretHost;
    var hostStarts = Math.random() < 0.5;
    state.myTurn = hostStarts;
    send({
      type: "start",
      hostStarts: hostStarts,
      secretForGuest: secretGuest.id,
      mode: state.mode,
      pool: state.pool.map(function(c){ return c.id; })
    });
    beginBoard();
  }
  function startLocal() {
    state.opponentName = "Joueur 2";
    state.secret = pick(state.pool);
    var others = state.pool.filter(function(c){ return c.id !== state.secret.id; });
    state._secret2 = pick(others.length ? others : state.pool);
    state.myTurn = true; beginBoard();
  }
  function beginBoard(secretForGuest) {
    try {
      if (secretForGuest) {
        var found = (QEC.CHARS || []).filter(function(c){ return c.id === secretForGuest; })[0];
        if (found) state.secret = found;
      }
      if (!state.secret) state.secret = pick(state.pool);
      state.eliminated = {}; state.over = false; show("game");
      if ($("#mode-label")) $("#mode-label").textContent = QEC.mangaName(state.mode);
      if ($("#room-label")) $("#room-label").textContent = state.local ? "LOCAL" : state.room;
      renderSecret(); renderBoard(); renderQuestions();
      if ($("#chat")) $("#chat").innerHTML = "";
      log("Ecris ta question dans Discussion. Les boutons a droite sont optionnels.");
      updateTurn();
    } catch (e) { toast("Erreur plateau : " + e.message); }
  }
  function renderSecret() {
    var c = state.secret || { name: "?", color: "#333" };
    var box = $("#secret"); if (!box) return;
    box.innerHTML = '<div class="mini">' + face(c) + '</div><div><div style="font-size:11px;color:#b9a8d4">Ton perso</div><b>' + c.name + '</b></div>';
  }
  function renderBoard() {
    var board = $("#board"); if (!board) return;
    board.innerHTML = (state.pool || []).map(function(c) {
      var down = state.eliminated[c.id] ? " down" : "";
      return '<article class="card' + down + '" data-id="' + c.id + '"><div class="art">' + face(c) + '</div><div class="meta"><div class="name">' + c.name + '</div><div class="serie">' + QEC.mangaName(c.manga) + '</div></div></article>';
    }).join("");
    board.onclick = function(e) {
      var card = e.target.closest(".card"); if (!card || state.over) return;
      var id = card.dataset.id;
      if (state.eliminated[id]) delete state.eliminated[id]; else state.eliminated[id] = 1;
      renderBoard();
    };
  }
  function renderQuestions() {
    var box = $("#q-list"); if (!box) return;
    var qs = (QEC.QUESTIONS || []).slice();
    box.innerHTML = '<p style="font-size:12px;color:#b9a8d4;margin-bottom:8px">Pas obligatoire. Ecris ta question dans Discussion.</p>' +
      qs.map(function(q){ return '<button type="button" data-qid="' + q.id + '">' + q.label + '</button>'; }).join("");
    box.onclick = function(e) {
      var b = e.target.closest("button"); if (!b) return;
      var q = qs.filter(function(x){ return x.id === b.dataset.qid; })[0];
      if (q) ask(q.label, q);
    };
  }
  function ask(label, q) {
    if (state.over) return;
    if (!state.local && !state.myTurn) return toast("Pas ton tour");
    log("Question : " + label);
    if (state.local) { log("L'autre repond OUI ou NON a voix haute, puis retourne les cartes."); return; }
    state.waitingAnswer = true; send({ type: "question", qid: q && q.id, label: label }); updateTurn();
  }
  function sendChat() {
    var input = $("#chat-input"); if (!input) return;
    var t = input.value.trim(); if (!t) return; input.value = ""; ask(t, null);
  }
  bind("btn-send", sendChat);
  if ($("#chat-input")) {
    $("#chat-input").placeholder = "Ta question libre (oui/non)...";
    $("#chat-input").addEventListener("keydown", function(e){ if (e.key === "Enter") sendChat(); });
  }
  bind("btn-yes", function(){ reply(true); }); bind("btn-no", function(){ reply(false); });
  function reply(yes) {
    if (!state.pendingQuestion) return;
    send({ type: "answer", yes: yes }); log("Tu reponds : " + (yes ? "OUI" : "NON"));
    state.pendingQuestion = null; $("#answer-bar").classList.remove("show"); state.myTurn = true; updateTurn();
  }
  function updateTurn() {
    var el = $("#turn"); if (!el) return;
    if (state.local) el.textContent = "Ecris une question, l'autre repond, puis clique les cartes a eliminer.";
    else if (state.waitingAnswer) el.textContent = "En attente de la reponse...";
    else if (state.myTurn) el.textContent = "A toi : pose ta question ou accuse.";
    else el.textContent = "Tour de l'autre joueur.";
  }
  bind("btn-guess", function() {
    if (state.over) return;
    var box = $("#guess-grid"); if (!box) return;
    box.innerHTML = state.pool.filter(function(c){ return !state.eliminated[c.id]; }).map(function(c){ return '<button type="button" data-id="' + c.id + '">' + c.name + '</button>'; }).join("");
    box.onclick = function(e) { var b = e.target.closest("button"); if (!b) return; doGuess(b.dataset.id); $("#modal-guess").classList.remove("show"); };
    $("#modal-guess").classList.add("show");
  });
  bind("btn-cancel-guess", function(){ $("#modal-guess").classList.remove("show"); });
  function doGuess(id) {
    state._lastGuess = id;
    if (state.local) { if (state._secret2 && id === state._secret2.id) endGame(true, id); else toast("Rate !"); return; }
    send({ type: "guess", charId: id });
  }
  function endGame(iWon, id) {
    state.over = true; $("#modal-end").classList.add("show");
    $("#end-title").textContent = iWon ? "Victoire" : "Perdu";
    var c = (QEC.CHARS || []).filter(function(x){ return x.id === id; })[0] || state.secret;
    $("#end-text").textContent = iWon ? ("C'etait " + c.name) : ("Ton perso : " + state.secret.name);
  }
  bind("btn-again", function(){ $("#modal-end").classList.remove("show"); if (state.local) startLocal(); });
  bind("btn-home", function(){ $("#modal-end").classList.remove("show"); destroyNet(); show("home"); });
  bind("btn-copy", function(){ try { navigator.clipboard.writeText(state.room); toast("Code copie"); } catch (e) { toast(state.room); } });
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  if ($("#name-input")) $("#name-input").value = state.name;
  show("home");
})();
