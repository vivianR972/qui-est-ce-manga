(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const state = {
    screen: "home", mode: "mix", name: "", room: "", isHost: false, local: false,
    mqtt: null, myId: Math.random().toString(36).slice(2, 10), connected: false,
    pool: [], secret: null, opponentName: "", myTurn: false, waitingAnswer: false,
    pendingQuestion: null, eliminated: {}, over: false, started: false, canAccuse: false
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
  function bind(id, fn) { const el = document.getElementById(id); if (el) el.onclick = fn; }
  function code() {
    const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s = "";
    for (let i = 0; i < 5; i++) s += abc[Math.floor(Math.random() * abc.length)];
    return s;
  }
  function topic() { return "qecmanga/v1/" + String(state.room).toUpperCase(); }
  function setWait(t) { if ($("#wait-status")) $("#wait-status").textContent = t; }
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
    if (state.local) startLocal(); else openNet();
  });
  bind("btn-do-join", function() {
    var room = $("#join-code").value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (room.length < 4) return toast("Code trop court.");
    state.room = room; openNet();
  });
  function openNet() {
    if (!window.mqtt) return setWait("Bibliotheque reseau absente. Ctrl+F5.") || toast("Recharge la page (Ctrl+F5).");
    show("wait");
    $("#wait-code").textContent = state.room;
    $("#wait-code").style.fontSize = "34px";
    $("#wait-code").style.letterSpacing = "0.28em";
    setWait("Connexion au relais...");
    destroyNet();
    var urls = ["wss://broker.emqx.io:8084/mqtt", "wss://broker.hivemq.com:8884/mqtt"];
    var i = 0;
    function tryBroker() {
      if (i >= urls.length) { setWait("Relais injoignable. Reessaie dans 10 secondes."); return; }
      var url = urls[i++];
      try {
        state.mqtt = mqtt.connect(url, { clientId: "qec-" + state.myId + "-" + Math.random().toString(16).slice(2, 6), clean: true, connectTimeout: 8000, reconnectPeriod: 2000 });
      } catch (e) { return tryBroker(); }
      state.mqtt.on("connect", function() {
        state.mqtt.subscribe(topic(), function(err) {
          if (err) { setWait("Impossible de rejoindre la salle."); return; }
          state.connected = true;
          if (state.isHost) setWait("Salle ouverte. Ton ami entre ce code.");
          else { setWait("Salle rejointe, on attend l'hote..."); send({ type: "hello", name: state.name, isHost: false }); }
        });
      });
      state.mqtt.on("message", function(_t, payload) { try { onMsg(JSON.parse(payload.toString())); } catch (e) {} });
      state.mqtt.on("error", function() {});
      state.mqtt.on("close", function() { if (!state.over && !state.local && state.connected && !state.started) setWait("Relais coupe, reconnexion..."); });
      setTimeout(function() {
        if (!state.connected && state.mqtt) { try { state.mqtt.end(true); } catch (e) {} state.mqtt = null; tryBroker(); }
      }, 9000);
    }
    tryBroker();
  }
  function send(obj) {
    if (!state.mqtt || !state.connected) return;
    obj.from = state.myId;
    try { state.mqtt.publish(topic(), JSON.stringify(obj)); } catch (e) {}
  }
  function destroyNet() {
    try { if (state.mqtt) state.mqtt.end(true); } catch (e) {}
    state.mqtt = null; state.connected = false; state.started = false;
  }
  function applyPool(ids, mode) {
    if (mode) state.mode = mode;
    if (ids && ids.length) state.pool = ids.map(function(id){ return (QEC.CHARS || []).filter(function(c){ return c.id === id; })[0]; }).filter(Boolean);
  }
  function onMsg(msg) {
    if (!msg || !msg.type || msg.from === state.myId) return;
    if (msg.type === "hello") {
      state.opponentName = msg.name || "Adversaire";
      if (state.isHost && !state.started) { setWait("Ami trouve, lancement..."); beginOnline(); }
    }
    if (msg.type === "start") { applyPool(msg.pool, msg.mode); state.myTurn = !msg.hostStarts; state.started = true; beginBoard(msg.secretForGuest); }
    if (msg.type === "question") {
      state.pendingQuestion = msg;
      $("#answer-bar").classList.add("show");
      $("#pending-q").textContent = state.opponentName + " : " + msg.label;
      log(state.opponentName + " demande : " + msg.label);
    }
    if (msg.type === "answer") {
      state.waitingAnswer = false; state.canAccuse = true; state.myTurn = true;
      log("Reponse : " + (msg.yes ? "OUI" : "NON")); updateTurn();
    }
    if (msg.type === "pass") { state.myTurn = true; state.canAccuse = false; state.waitingAnswer = false; log("A toi de jouer."); updateTurn(); }
    if (msg.type === "guess") {
      var ok = msg.charId === state.secret.id;
      send({ type: "guessResult", ok: ok });
      if (ok) endGame(false, msg.charId); else { log("Mauvaise accusation"); state.canAccuse = false; state.myTurn = true; updateTurn(); }
    }
    if (msg.type === "guessResult") { if (msg.ok) endGame(true, state._lastGuess); else { log("Rate"); state.canAccuse = false; state.myTurn = false; updateTurn(); } }
    if (msg.type === "rematch" && state.isHost) { $("#modal-end").classList.remove("show"); freshPool(); state.started = false; beginOnline(); }
  }
  function beginOnline() {
    if (state.started) return;
    state.started = true;
    var secretHost = pick(state.pool);
    var others = state.pool.filter(function(c){ return c.id !== secretHost.id; });
    var secretGuest = pick(others.length ? others : state.pool);
    state.secret = secretHost;
    var hostStarts = Math.random() < 0.5;
    state.myTurn = hostStarts;
    send({ type: "start", hostStarts: hostStarts, secretForGuest: secretGuest.id, mode: state.mode, pool: state.pool.map(function(c){ return c.id; }) });
    beginBoard();
  }
  function startLocal() {
    state.opponentName = "Joueur 2";
    state.secret = pick(state.pool);
    var others = state.pool.filter(function(c){ return c.id !== state.secret.id; });
    state._secret2 = pick(others.length ? others : state.pool);
    state.myTurn = true; beginBoard();
  }
  function freshPool() {
    if (!window.QEC || !QEC.pool) return;
    var next = shuffle(QEC.pool(state.mode)).slice(0, 24);
    if (next.length >= 8) state.pool = next;
  }
  function beginBoard(secretForGuest) {
    try {
      var end = $("#modal-end"); if (end) end.classList.remove("show");
      var bar = $("#answer-bar"); if (bar) bar.classList.remove("show");
      state.pendingQuestion = null; state.waitingAnswer = false;
      if (secretForGuest) {
        var found = (QEC.CHARS || []).filter(function(c){ return c.id === secretForGuest; })[0];
        if (found) state.secret = found;
      }
      if (!state.secret) state.secret = pick(state.pool);
      state.eliminated = {}; state.over = false; state.canAccuse = false; show("game");
      if ($("#mode-label")) $("#mode-label").textContent = QEC.mangaName(state.mode);
      if ($("#room-label")) $("#room-label").textContent = state.local ? "LOCAL" : state.room;
      renderSecret(); renderBoard(); renderQuestions();
      if ($("#chat")) $("#chat").innerHTML = "";
      log("Ecris ta question dans Discussion.");
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
    if (!state.local && state.canAccuse) return toast("Accuse ou passe avant une nouvelle question.");
    log("Question : " + label);
    if (state.local) { log("L'autre repond OUI ou NON a voix haute, puis retourne les cartes."); return; }
    state.canAccuse = false;
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
    state.pendingQuestion = null; $("#answer-bar").classList.remove("show"); state.myTurn = false; updateTurn();
  }
  function ensurePass() {
    if (document.getElementById("btn-pass")) return;
    var row = document.querySelector("#screen-game .game-top .row:last-child");
    if (!row) return;
    var b = document.createElement("button");
    b.id = "btn-pass"; b.type = "button"; b.className = "ghost"; b.textContent = "Passer";
    b.onclick = function() {
      if (state.over || state.local || !state.canAccuse) return;
      state.canAccuse = false; state.myTurn = false;
      send({ type: "pass" });
      updateTurn();
    };
    var guess = document.getElementById("btn-guess");
    if (guess) row.insertBefore(b, guess); else row.appendChild(b);
  }
  function updateTurn() {
    var el = $("#turn"); if (!el) return;
    ensurePass();
    var pass = document.getElementById("btn-pass");
    var guess = document.getElementById("btn-guess");
    if (state.local) el.textContent = "Ecris une question, l'autre repond, puis clique les cartes a eliminer.";
    else if (state.waitingAnswer) el.textContent = "En attente de la reponse...";
    else if (state.canAccuse) el.textContent = "Reponse recue. Tu peux accuser, ou passer le tour.";
    else if (state.myTurn) el.textContent = "A toi : pose ta question.";
    else el.textContent = "Tour de l'autre joueur.";
    if (pass) pass.style.display = (!state.local && state.canAccuse && !state.over) ? "" : "none";
    if (guess) guess.disabled = !state.local && !state.canAccuse;
  }
  bind("btn-guess", function() {
    if (state.over) return;
    if (!state.local && !state.canAccuse) return toast("Tu peux accuser seulement apres une reponse.");
    var box = $("#guess-grid"); if (!box) return;
    box.innerHTML = state.pool.filter(function(c){ return !state.eliminated[c.id]; }).map(function(c){ return '<button type="button" data-id="' + c.id + '">' + c.name + '</button>'; }).join("");
    box.onclick = function(e) { var b = e.target.closest("button"); if (!b) return; doGuess(b.dataset.id); $("#modal-guess").classList.remove("show"); };
    $("#modal-guess").classList.add("show");
  });
  bind("btn-cancel-guess", function(){ $("#modal-guess").classList.remove("show"); });
  function doGuess(id) {
    state._lastGuess = id;
    if (state.local) { if (state._secret2 && id === state._secret2.id) endGame(true, id); else toast("Rate !"); return; }
    state.canAccuse = false;
    send({ type: "guess", charId: id });
  }
  function endGame(iWon, id) {
    state.over = true; $("#modal-end").classList.add("show");
    $("#end-title").textContent = iWon ? "Victoire" : "Perdu";
    var c = (QEC.CHARS || []).filter(function(x){ return x.id === id; })[0] || state.secret;
    $("#end-text").textContent = iWon ? ("C'etait " + c.name) : ("Ton perso : " + state.secret.name);
  }
  function replay() {
    var end = $("#modal-end"); if (end) end.classList.remove("show");
    state.over = false; state.eliminated = {};
    if (state.local) { freshPool(); startLocal(); return; }
    if (!state.connected) return toast("Plus connecte. Recree une salle.");
    if (state.isHost) { freshPool(); state.started = false; beginOnline(); }
    else { toast("Relance envoyee"); send({ type: "rematch" }); }
  }
  bind("btn-again", replay);
  bind("btn-home", function(){ $("#modal-end").classList.remove("show"); destroyNet(); show("home"); });
  bind("btn-copy", function(){ try { navigator.clipboard.writeText(state.room); toast("Code copie"); } catch (e) { toast(state.room); } });
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  if ($("#name-input")) $("#name-input").value = state.name;
  show("home");
})();
