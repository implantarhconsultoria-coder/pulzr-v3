const screen = document.querySelector("#screen");
const navButtons = [...document.querySelectorAll(".nav-btn")];

const state = { current: "login" };

function setScreen(name) {
  state.current = name;
  navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.screen === name));
  render();
}

function top(title, right = "") {
  return `
    <header class="top">
      <button class="back">‹</button>
      <strong>${title}</strong>
      <span>${right}</span>
    </header>
  `;
}

function bottomHint() {
  return `<div class="home-indicator"></div>`;
}

function login() {
  return `
    <section class="login-screen">
      <div class="pulse-line"></div>
      <div class="logo-badge">⚡</div>
      <div class="wordmark"><span>PUL</span><b>ZR</b></div>
      <small>PERFORMANCE & PROGRESS</small>
      <div class="bolt">⚡</div>
      <button class="primary big" data-go="feed">CRIAR CADASTRO</button>
      <button class="ghost big" data-go="feed">ENTRAR</button>
      <p class="locked">COMUNIDADE FECHADA FITNESS</p>
      <p class="subcopy">Alta performance. Resultados reais.</p>
    </section>
  `;
}

function feedAcademia() {
  return `
    ${top("PULZR", "⌕")}
    <section class="feed-head">
      <h1>FEED DA ACADEMIA</h1>
      <div class="seg"><button class="on">SEGUINDO</button><button>DESCOBRIR</button></div>
    </section>
    <article class="social-card">
      <div class="post-author"><span class="avatar photo-a"></span><div><b>NATHALIA R.</b><small>Há 2h</small></div><i>•••</i></div>
      <p>Treino de pernas concluído com foco em força e consistência. 💪🔥</p>
      <div class="media gym"></div>
      <div class="actions"><span>♡ 128</span><span>◯ 24</span><span>▱</span></div>
      <div class="comment"><b>ALEX F.</b> Monstro! 🙏</div>
      <div class="comment"><b>RODRIGO P.</b> Vamos pra cima! 👊</div>
    </article>
  `;
}

function feedCorrida() {
  return `
    ${top("FEED SOCIAL", "⌕")}
    <div class="chips"><button class="on">TODOS</button><button>SEGUINDO</button><button>CLUBES</button></div>
    ${runPost("NATHALIA R.", "São Paulo, SP", "10.5 km", "5:30/km", "58:32", "run-a")}
    ${runPost("RODRIGO F.", "Rio de Janeiro, RJ", "21.1 km", "4:45/km", "1:40:15", "run-b")}
    ${runPost("PATRICIA M.", "Curitiba, PR", "6.2 km", "5:12/km", "32:18", "run-c")}
  `;
}

function runPost(name, city, km, pace, time, cls) {
  return `
    <article class="run-post">
      <div class="post-author"><span class="avatar ${cls}"></span><div><b>${name}</b><small>${city}</small></div><i>2h atrás</i></div>
      <div class="media ${cls}"></div>
      <div class="run-metrics"><b>♥ ${km}</b><span>${pace}</span><span>${time}</span></div>
      <div class="actions"><span>♡ 65</span><span>◯ 18</span></div>
    </article>
  `;
}

function registerRun() {
  return `
    ${top("REGISTRAR CORRIDA", "◉")}
    <section class="run-start">
      <div class="running-title">🏃 RUNNING</div>
      <div class="map-card"><h3>MAPA</h3><div class="map"><svg viewBox="0 0 260 130"><path d="M55 78 L80 42 L126 54 L160 34 L205 62 L190 96 L130 90 L98 112 Z"/><circle cx="126" cy="72" r="9"/></svg></div><p>📍 Localização<br><small>Parque Villa-Lobos<br>São Paulo, SP</small></p></div>
      <button class="primary start" data-go="liveRun">START</button>
      <div class="mode-row"><button>INDOOR</button><button>TRILHA</button><button>CALENDÁRIO</button></div>
    </section>
  `;
}

function liveRun() {
  return `
    ${top("LIVE SESSION", "GPS ▮▮▮")}
    <section class="live-run">
      <label>TEMPO:</label><strong>1:35:45</strong>
      <label>DISTÂNCIA:</label><b>21.09 <span>KM</span></b><small>Meia Maratona</small>
      <label>RITMO:</label><b>4:32<span>/KM</span></b>
      <label>FREQ. CARDÍACA:</label><div class="ecg"><i></i><em>165 <span>BPM</span></em><i></i></div>
      <button class="primary pause">PAUSAR</button>
    </section>
  `;
}

function liveGym() {
  return `
    ${top("LIVE GYM SESSION")}
    <section class="gym-live">
      <span class="live-badge">● AO VIVO</span>
      <div class="media squat"></div>
      <h2>AGACHAMENTO LIVRE</h2>
      <div class="triple"><div><small>SÉRIE</small><b>3 / 4</b></div><div><small>REPETIÇÕES</small><b>8</b></div><div><small>CARGA</small><b>120kg</b></div></div>
      <div class="rest"><small>PRÓXIMO DESCANSO</small><strong>00:45</strong></div>
      <button class="primary" data-go="gymResult">FINALIZAR SÉRIE</button>
      <button class="ghost">PAUSAR TREINO</button>
    </section>
  `;
}

function runResult() {
  return `
    ${top("RESULTADO DO TREINO", "⇧")}
    <section class="result-screen">
      <div class="media beach-run"></div>
      <div class="map result-map"><svg viewBox="0 0 260 130"><path d="M45 80 L80 50 L116 58 L148 38 L204 62 L186 101 L128 94 L92 112 Z"/></svg></div>
      <div class="stats-grid"><div><small>DISTÂNCIA</small><b>21.09 <span>KM</span></b></div><div><small>TEMPO</small><b>1:35:45</b></div><div><small>RITMO MÉD.</small><b>4:32 <span>/KM</span></b></div><div><small>CALORIAS</small><b>1100 <span>KCAL</span></b></div></div>
      <div class="badges"><b>BADGES</b><span>⬢</span><span>⬡</span><i>›</i></div>
      <button class="primary">COMPARTILHAR</button>
    </section>
  `;
}

function gymResult() {
  return `
    ${top("RESULTADO DO TREINO", "⇧")}
    <section class="gym-result">
      <div class="media hard-gym"></div>
      <div class="split-stats"><div><small>VOLUME TOTAL</small><b>22.480 <span>kg</span></b></div><div><small>CALORIAS</small><b>850 <span>kcal</span></b></div></div>
      <div class="chart-card"><h3>VOLUME POR GRUPO MUSCULAR</h3><div class="bars"><i style="height:55%"></i><i style="height:45%"></i><i style="height:70%"></i><i style="height:38%"></i><i style="height:25%"></i><i style="height:43%"></i></div><div class="bar-labels"><span>Peito</span><span>Costas</span><span>Pernas</span><span>Ombros</span><span>Bíceps</span><span>Tríceps</span></div></div>
      <div class="performance"><div><small>FORÇA</small><b>+12%</b><span>vs último treino</span></div><div><small>VOLUME</small><b>+18%</b><span>vs último treino</span></div><div><small>RESISTÊNCIA</small><b>+9%</b><span>vs último treino</span></div></div>
      <button class="primary">COMPARTILHAR RESULTADO</button>
    </section>
  `;
}

function profile() {
  return `
    ${top("PERFIL", "⚙")}
    <section class="profile-screen">
      <div class="avatar big photo-a"></div>
      <h1>NATHALIA R.</h1><p>Nível 8 · Maratonista 🛡</p>
      <div class="stats-grid three"><div><small>PARABÉNS</small><b>TOP 2%</b><span>DIAS ATIVOS</span></div><div><small>TREINOS</small><b>185</b></div><div><small>KM TOTAIS</small><b>2.450</b><span>22</span></div></div>
      <div class="medal-card"><h3>MEDALHAS.</h3><div class="medals"><span>⬢</span><span>⬡</span><span>⬢</span><span>⬡</span><span>⬢</span></div><small>VER TODAS</small></div>
      <div class="history"><h3>HISTÓRICO RECENTE</h3>${historyItem("Corrida SP - 10km", "Hoje · 10.5 km · 5:30/km")}${historyItem("Treino Intervalado", "Ontem · 8.2 km · 4:45/km")}${historyItem("Longão Domingo", "2 dias atrás · 21.1 km · 5:10/km")}</div>
    </section>
  `;
}

function gymProfile() {
  return `
    ${top("PERFIL DA ACADEMIA")}
    <section class="profile-screen gym-profile">
      <div class="profile-row"><div class="avatar big photo-a"></div><div><h1>NATHALIA R.</h1><p>NÍVEL 8 - ATLETA PULZR 🛡</p></div></div>
      <h3 class="section-title">RECORDES PESSOAIS <span>VER TODOS</span></h3>
      <div class="stats-grid three"><div><small>AGACHAMENTO</small><b>140kg</b><span>1RM</span></div><div><small>LEVANTAMENTO TERRA</small><b>180kg</b><span>1RM</span></div><div><small>SUPINO RETO</small><b>95kg</b><span>1RM</span></div></div>
      <div class="history"><h3>HISTÓRICO DE TREINOS <span>ÚLTIMOS 10 TREINOS</span></h3>${historyItem("Treino de Pernas", "22.480 kg")}${historyItem("Costas e Bíceps", "18.600 kg")}${historyItem("Peito e Tríceps", "19.300 kg")}${historyItem("Ombros e Trapézio", "15.800 kg")}</div>
      <button class="primary">VER EVOLUÇÃO COMPLETA</button>
    </section>
  `;
}

function program() {
  return `
    ${top("NOVO TREINO / PROGRAMA")}
    <section class="program-screen">
      <h3>MEUS PROGRAMAS</h3>
      <div class="program-card"><b>HIPERTROFIA FOCADA</b><small>5x por semana</small><div class="progress"><i style="width:62%"></i></div></div>
      <h3>GRUPOS MUSCULARES</h3>
      ${muscle("Peito", "4 exercícios")}${muscle("Costas", "4 exercícios")}${muscle("Pernas", "5 exercícios")}${muscle("Ombros", "3 exercícios")}${muscle("Braços", "4 exercícios")}
      <div class="add">ADICIONAR EXERCÍCIOS ›</div>
      <button class="primary" data-go="liveGym">INICIAR PROGRAMA</button>
      <button class="ghost">CRIAR NOVO PROGRAMA</button>
    </section>
  `;
}

function challenges() {
  return `
    ${top("DESAFIOS")}
    <section class="challenges-screen">
      <div class="seg"><button class="on">ATIVOS</button><button>CONCLUÍDOS</button></div>
      ${challenge("DESAFIO 21 DIAS", "Consistência é o que te transforma.", "14 / 21 DIAS", 68, "challenge-a")}
      ${challenge("DESAFIO 100KM", "Supere seus limites.", "68 / 100 KM", 68, "challenge-b")}
      ${challenge("DESAFIO FORÇA", "Mais forte a cada treino.", "7 / 10 TREINOS", 70, "challenge-c")}
    </section>
  `;
}

function challenge(title, text, progress, value, photo) {
  return `<article class="challenge-card"><div class="thumb ${photo}"></div><div><h2>${title}</h2><p>${text}</p><small>PROGRESSO</small><b>${progress}</b><div class="progress"><i style="width:${value}%"></i></div></div></article>`;
}
function historyItem(a,b){return `<div class="history-item"><span>⚡</span><div><b>${a}</b><small>${b}</small></div></div>`}
function muscle(a,b){return `<div class="muscle"><span>⬢</span><b>${a}</b><small>${b}</small></div>`}

const screens = { login, feed: feedAcademia, runfeed: feedCorrida, run: registerRun, liveRun, liveGym, runResult, gymResult, profile, gymProfile, program, challenges };

function render() {
  screen.innerHTML = screens[state.current]();
  screen.querySelectorAll("[data-go]").forEach((el) => el.addEventListener("click", () => setScreen(el.dataset.go)));
}

navButtons.forEach((btn) => btn.addEventListener("click", () => setScreen(btn.dataset.screen)));
render();
