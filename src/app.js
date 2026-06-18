const modalities = [
  { label: "Corrida", icon: "run" },
  { label: "Musculacao", icon: "lift" },
  { label: "Bike", icon: "ride" },
  { label: "Luta", icon: "fight" },
  { label: "Funcional", icon: "move" }
];

const state = {
  activeTab: "home",
  selected: ["Corrida", "Musculacao"]
};

const screen = document.querySelector("#screen");
const tabButtons = [...document.querySelectorAll(".tab")];

function toggleModality(label) {
  if (state.selected.includes(label)) {
    state.selected = state.selected.filter((item) => item !== label);
  } else {
    state.selected = [...state.selected, label];
  }
  render();
}

function setTab(tab) {
  state.activeTab = tab;
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  render();
}

function modalityGrid() {
  return `
    <div class="modalityGrid">
      ${modalities
        .map(
          ({ label, icon }) => `
            <button class="modality ${state.selected.includes(label) ? "selected" : ""}" data-modality="${label}">
              <span class="sportIcon">${icon}</span>
              <span>${label}</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function pulseScreen() {
  return `
    <section class="heroBlock">
      <div class="heroTexture"></div>
      <span class="pulseBadge"><span>flame</span> 7 dias em movimento</span>
      <h2>Seu pulso virou comunidade.</h2>
      <p>Treine, poste, dispute e evolua em mais de uma modalidade.</p>
    </section>

    <section class="module">
      <div class="sectionHeader">
        <span>Escolha seu mix</span>
        <small>${state.selected.length} ativas</small>
      </div>
      ${modalityGrid()}
    </section>

    <section class="feed">
      ${post("Maya R.", "Corrida + forca", "8.2 km", "Fechou o treino hibrido com pace progressivo e perna no limite.")}
      ${post("Leo T.", "Bike", "42 min", "Entrou no desafio semanal e puxou o ranking do grupo.")}
    </section>
  `;
}

function trainingScreen() {
  return `
    <section class="trainingHero">
      <div class="signalIcon">pulse</div>
      <div>
        <span class="eyebrow">Registrar treino</span>
        <h2>O treino entra rapido. O progresso fica bonito.</h2>
      </div>
    </section>

    <section class="module">
      <div class="sectionHeader">
        <span>Modalidades de hoje</span>
        <small>multi</small>
      </div>
      <div class="choiceStack">
        ${state.selected
          .map(
            (item, index) => `
              <button class="trainingChoice">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${item}</strong>
                <b>&gt;</b>
              </button>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="metricBand">
      ${metric("Carga", "82%")}
      ${metric("Streak", "7")}
      ${metric("Pontos", "1.248")}
    </section>
  `;
}

function challengesScreen() {
  return `
    <section class="arena">
      <div class="signalIcon">award</div>
      <h2>Arena PULZR</h2>
      <p>Desafios especiais para quem mistura modalidades e aparece.</p>
    </section>

    <section class="challengeList">
      ${challenge("Hybrid Week", "68%", state.selected.join(" + "))}
      ${challenge("Clube 5K + Forca", "41%", "Premium")}
      ${challenge("Sprint Social", "92%", "Aberto")}
    </section>
  `;
}

function profileScreen() {
  return `
    <section class="profileHero">
      <div class="avatar">RG</div>
      <div>
        <span class="eyebrow">Perfil hibrido</span>
        <h2>Rodrigo Gumma</h2>
        <p>${state.selected.join(" / ")}</p>
      </div>
    </section>

    <section class="metricBand">
      ${metric("Treinos", "38")}
      ${metric("Posts", "14")}
      ${metric("Rank", "#12")}
    </section>

    <section class="module">
      <div class="sectionHeader">
        <span>Interesses</span>
        <small>escolha quantos quiser</small>
      </div>
      ${modalityGrid()}
    </section>
  `;
}

function post(name, kind, value, copy) {
  return `
    <article class="post">
      <div class="postHead">
        <div class="miniAvatar">${name.slice(0, 1)}</div>
        <div>
          <strong>${name}</strong>
          <span>${kind}</span>
        </div>
        <b>${value}</b>
      </div>
      <p>${copy}</p>
      <div class="postActions">
        <span>heat 28</span>
        <span>chat 6</span>
        <span>+124 PZ</span>
      </div>
    </article>
  `;
}

function metric(label, value) {
  return `
    <div class="metric">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function challenge(title, value, tag) {
  return `
    <article class="challenge">
      <div>
        <span>${tag}</span>
        <strong>${title}</strong>
      </div>
      <div class="ring" style="--progress:${value}">
        <span>medal</span>
      </div>
    </article>
  `;
}

function render() {
  const screens = {
    home: pulseScreen,
    train: trainingScreen,
    challenges: challengesScreen,
    profile: profileScreen
  };

  screen.innerHTML = screens[state.activeTab]();
  screen.querySelectorAll("[data-modality]").forEach((button) => {
    button.addEventListener("click", () => toggleModality(button.dataset.modality));
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setTab(button.dataset.tab));
});

render();
