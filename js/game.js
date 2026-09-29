(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const state = {
    screen: "home", mode: "mix",
    name: (function(){ try { return localStorage.getItem("qec-name") || ""; } catch(e) { return ""; } })(),
    room: "", isHost: false, local: false, peer: null, conn: null, connected: false,
    pool: [], secret: null, opponentName: "", myTurn: false, waitingAnswer: false,
    pendingQuestion: null, eliminated: new Set(), chat: [], over: false
  };
  function show(id) {
    state.screen = id;
    $$(".screen").forEach(s => s.classList.toggle("active", s.id === "screen-" + id));
  }
  function toast(t) {
    const el = $("#toast"); if (!el) return;
    el.textContent = t; el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2400);
  }
  function log(text, cls) {
    cls = cls || "sys";
    const box = $("#chat"); if (!box) return;
    const d = document.createElement("div");
    d.className = "msg " + cls; d.textContent = text; box.appendChild(d);
    box.scrollTop = box.scrollHeight;
  }
  function code() {
    const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s = "";
    for (let i = 0; i < 5; i++) s += abc[Math.floor(Math.random() * abc.length)];
    return s;
  }
  function peerId(room) { return "qecmanga-" + room.toUpperCase(); }
  function bind(id, fn) { const el = document.getElementById(id); if (el) el.onclick = fn; }
  function renderMangas() {
    const box = $("#manga-grid"); if (!box || !window.QEC) return;
    box.innerHTML = QEC.MANGAS.map(m => {
      const n = m.id === "mix" ? QEC.MIX_IDS.length : QEC.pool(m.id).length;
      return '<div class="manga-card ' + (state.mode === m.id ? "selected" : "") + '" data-id="' + m.id + '"><span class="ic">' + m.icon + '</span><b>' + m.name + '</b><small>' + n + ' persos</small></div>';
    }).join("");
    box.onclick = e => {
      const card = e.target.closest(".manga-card"); if (!card) return;
      state.mode = card.dataset.id; renderMangas();
    };
  }
  function startCreate() {
    state.name = ($("#name-input") && $("#name-input").value.trim()) || "Joueur 1";
    try { localStorage.setItem("qec-name", state.name); } catch (e) {}
    state.local = false; state.isHost = true; state.room = code();
    show("setup"); renderMangas();
    if ($("#setup-title")) $("#setup-title").textContent = "Creer une partie en ligne";
    if ($("#setup-hint")) $("#setup-hint").textContent = "Choisis le mode, puis lance la salle.";
    if ($("#btn-launch")) $("#btn-launch").textContent = "Creer la salle";
  }
  function startJoin() {
    state.name = ($("#name-input") && $("#name-input").value.trim()) || "Joueur 2";
    try { localStorage.setItem("qec-name", state.name); } catch (e) {}
    state.local = false; state.isHost = false; show("join");
  }
  function startLocalMode() {
    state.name = ($("#name-input") && $("#name-input").value.trim()) || "Joueur 1";
    try { localStorage.setItem("qec-name", state.name); } catch (e) {}
    state.local = true; state.isHost = true;
    show("setup"); renderMangas();
    if ($("#setup-title")) $("#setup-title").textContent = "Partie sur le meme PC";
    if ($("#btn-launch")) $("#btn-launch").textContent = "Lancer la partie locale";
  }
  window.qecCreate = startCreate; window.qecJoin = startJoin; window.qecLocal = startLocalMode;
  bind("btn-create", startCreate); bind("btn-join", startJoin); bind("btn-local", startLocalMode);
  $$("[data-back]").forEach(b => b.onclick = () => { destroyNet(); show("home"); });
  bind("btn-launch", () => {
    if (!window.QEC) return toast("Fichiers du jeu incomplets.");
    state.pool = shuffle(QEC.pool(state.mode)).slice(0, 24);
    if (state.pool.length < 8) return toast("Pas assez de personnages.");
    if (state.local) startLocal(); else createRoom();
  });
  bind("btn-do-join", () => {
    const room = $("#join-code").value.trim().toUpperCase();
    if (room.length < 4) return toast("Code trop court.");
    joinRoom(room);
  });
  function createRoom() {
    show("wait");
    $("#wait-code").textContent = state.room;
    $("#wait-status").textContent = "Connexion au relais...";
    try { state.peer = new Peer(peerId(state.room), { debug: 0 }); }
    catch (e) { return toast("Impossible de creer la salle."); }
    state.peer.on("open", () => { $("#wait-status").textContent = "En attente de ton ami..."; });
    state.peer.on("error", err => {
      $("#wait-status").textContent = "Erreur reseau : " + err.type;
      if (err.type === "unavailable-id") { state.room = code(); $("#wait-code").textContent = state.room; destroyNet(); createRoom(); }
    });
    state.peer.on("connection", conn => { if (state.conn) { conn.close(); return; } state.conn = conn; wireConn(); });
  }
  function joinRoom(room) {
    state.room = room; show("wait");
    $("#wait-code").textContent = room;
    $("#wait-status").textContent = "Connexion a la salle...";
    state.peer = new Peer({ debug: 0 });
    state.peer.on("open", () => { state.conn = state.peer.connect(peerId(room), { reliable: true }); wireConn(); });
    state.peer.on("error", err => { $("#wait-status").textContent = "Salle introuvable (" + err.type + ")."; });
  }
  function wireConn() {
    const conn = state.conn;
    conn.on("open", () => {
      state.connected = true;
      send({ type: "hello", name: state.name, isHost: state.isHost, mode: state.mode, pool: state.isHost ? state.pool.map(c => c.id) : null });
      $("#wait-status").textContent = "Connecte !";
    });
    conn.on("data", onMsg);
    conn.on("close", () => { state.connected = false; log("Deconnexion"); toast("Deconnexion"); });
  }
  function send(obj) { if (state.conn && state.conn.open) state.conn.send(obj); }
  function destroyNet() {
    try { state.conn && state.conn.close(); } catch (e) {}
    try { state.peer && state.peer.destroy(); } catch (e) {}
    state.conn = null; state.peer = null; state.connected = false;
  }
  function onMsg(msg) {
    if (!msg || !msg.type) return;
    if (msg.type === "hello") {
      state.opponentName = msg.name || "Adversaire";
      if (!state.isHost && msg.pool) {
        state.mode = msg.mode;
        state.pool = msg.pool.map(id => QEC.CHARS.find(c => c.id === id)).filter(Boolean);
      }
      if (state.isHost) beginOnline();
    }
    if (msg.type === "start") { state.myTurn = !msg.hostStarts; beginBoard(msg.secretForGuest); }
    if (msg.type === "question") {
      state.pendingQuestion = msg;
      $("#answer-bar").classList.add("show");
      $("#pending-q").textContent = state.opponentName + " demande : " + msg.label;
      log(state.opponentName + " : " + msg.label, "them");
    }
    if (msg.type === "answer") { state.waitingAnswer = false; log("Reponse : " + (msg.yes ? "OUI" : "NON")); state.myTurn = false; updateTurn(); }
    if (msg.type === "chat") log(state.opponentName + " : " + msg.text, "them");
    if (msg.type === "guess") {
      const ok = msg.charId === state.secret.id;
      send({ type: "guessResult", ok });
      if (ok) endGame(false, msg.charId);
      else { log(state.opponentName + " s'est trompe."); state.myTurn = true; updateTurn(); }
    }
    if (msg.type === "guessResult") {
      if (msg.ok) endGame(true, state._lastGuess);
      else { log("Mauvaise accusation."); state.myTurn = false; updateTurn(); }
    }
    if (msg.type === "again" && state.isHost) beginOnline();
  }
  function beginOnline() {
    const secretHost = pick(state.pool);
    const secretGuest = pick(state.pool.filter(c => c.id !== secretHost.id)) || pick(state.pool);
    state.secret = secretHost;
    const hostStarts = Math.random() < 0.5;
    state.myTurn = hostStarts;
    send({ type: "start", hostStarts, secretForGuest: secretGuest.id });
    beginBoard();
  }
  function startLocal() {
    state.opponentName = "Joueur 2";
    state.secret = pick(state.pool);
    state._secret2 = pick(state.pool.filter(c => c.id !== state.secret.id)) || pick(state.pool);
    state.myTurn = true; beginBoard();
  }
  function beginBoard(secretForGuest) {
    if (secretForGuest) state.secret = QEC.CHARS.find(c => c.id === secretForGuest);
    state.eliminated = new Set(); state.over = false; show("game");
    $("#mode-label").textContent = QEC.mangaName(state.mode);
    $("#room-label").textContent = state.local ? "LOCAL" : state.room;
    renderSecret(); renderBoard(); renderQuestions();
    $("#chat").innerHTML = ""; log("La partie commence."); updateTurn();
  }
  function renderSecret() {
    const c = state.secret;
    $("#secret").innerHTML = '<div class="mini">' + QEC.face(c, 44, 52) + '</div><div><b>' + c.name + '</b></div>';
  }
  function renderBoard() {
    $("#board").innerHTML = state.pool.map(c => '<article class="card ' + (state.eliminated.has(c.id) ? "down" : "") + '" data-id="' + c.id + '" style="--c:' + c.color + '"><div class="art">' + QEC.face(c, 120, 140) + '</div><div class="meta"><div class="name">' + c.name + '</div><div class="serie">' + QEC.mangaName(c.manga) + '</div></div></article>').join("");
    $("#board").onclick = e => {
      const card = e.target.closest(".card"); if (!card || state.over) return;
      const id = card.dataset.id;
      if (state.eliminated.has(id)) state.eliminated.delete(id); else state.eliminated.add(id);
      renderBoard();
    };
  }
  function renderQuestions() {
    const extra = [];
    if (state.mode === "mix") {
      QEC.MANGAS.filter(m => m.id !== "mix").forEach(m => {
        extra.push({ id: "manga-" + m.id, label: "Vient-il/elle de " + m.name + " ?", test: c => c.manga === m.id });
      });
    }
    const qs = QEC.QUESTIONS.concat(extra);
    $("#q-list").innerHTML = qs.map(q => '<button data-qid="' + q.id + '">' + q.label + '</button>').join("");
    $("#q-list").onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      askQuestion(qs.find(q => q.id === b.dataset.qid));
    };
  }
  function askQuestion(q) {
    if (!q || state.over) return;
    if (!state.local && !state.myTurn) return toast("Pas ton tour.");
    if (state.local) {
      log("J1 : " + q.label, "me");
      log("J2 : " + (q.test(state._secret2) ? "OUI" : "NON"));
      return;
    }
    state.waitingAnswer = true; log("Toi : " + q.label, "me");
    send({ type: "question", qid: q.id, label: q.label }); updateTurn();
  }
  bind("btn-yes", () => answer(true)); bind("btn-no", () => answer(false));
  function answer(yes) {
    const q = state.pendingQuestion; if (!q) return;
    const real = QEC.QUESTIONS.find(x => x.id === q.qid);
    const truth = real && real.test ? !!real.test(state.secret) : yes;
    send({ type: "answer", yes: truth });
    log("Tu reponds : " + (truth ? "OUI" : "NON"));
    state.pendingQuestion = null; $("#answer-bar").classList.remove("show");
    state.myTurn = true; updateTurn();
  }
  function updateTurn() {
    const el = $("#turn"); if (!el) return;
    if (state.over) { el.textContent = "Termine"; return; }
    if (state.local) { el.textContent = "Pose une question puis accuse."; el.className = "turn-banner mine"; return; }
    if (state.waitingAnswer) { el.textContent = "En attente de reponse..."; el.className = "turn-banner wait"; }
    else if (state.myTurn) { el.textContent = "C'est a toi."; el.className = "turn-banner mine"; }
    else { el.textContent = "Tour de l'adversaire."; el.className = "turn-banner"; }
  }
  bind("btn-guess", () => {
    if (state.over) return;
    if (!state.local && !state.myTurn) return toast("Attends ton tour.");
    const box = $("#guess-grid");
    box.innerHTML = state.pool.filter(c => !state.eliminated.has(c.id)).map(c => '<button data-id="' + c.id + '">' + c.name + '</button>').join("");
    box.onclick = e => { const b = e.target.closest("button"); if (!b) return; doGuess(b.dataset.id); $("#modal-guess").classList.remove("show"); };
    $("#modal-guess").classList.add("show");
  });
  bind("btn-cancel-guess", () => $("#modal-guess").classList.remove("show"));
  function doGuess(id) {
    state._lastGuess = id;
    if (state.local) {
      if (id === state._secret2.id) endGame(true, id); else toast("Rate !");
      return;
    }
    send({ type: "guess", charId: id });
  }
  function endGame(iWon, id) {
    state.over = true; updateTurn();
    $("#modal-end").classList.add("show");
    $("#end-title").textContent = iWon ? "Victoire !" : "Perdu...";
    const c = QEC.CHARS.find(x => x.id === id) || state.secret;
    $("#end-text").textContent = iWon ? ("Tu as trouve " + c.name) : ("Ton perso etait " + state.secret.name);
  }
  bind("btn-again", () => { $("#modal-end").classList.remove("show"); if (state.local) startLocal(); else { send({ type: "again" }); if (state.isHost) beginOnline(); } });
  bind("btn-home", () => { $("#modal-end").classList.remove("show"); destroyNet(); show("home"); });
  function sendChat() {
    const t = $("#chat-input").value.trim(); if (!t) return;
    $("#chat-input").value = ""; log("Toi : " + t, "me");
    if (!state.local) send({ type: "chat", text: t });
  }
  bind("btn-send", sendChat);
  if ($("#chat-input")) $("#chat-input").addEventListener("keydown", e => { if (e.key === "Enter") sendChat(); });
  bind("btn-copy", async () => { try { await navigator.clipboard.writeText(state.room); toast("Code copie"); } catch (e) { toast(state.room); } });
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  if ($("#name-input")) $("#name-input").value = state.name;
  show("home");
})();
