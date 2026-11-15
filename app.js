(() => {
  "use strict";
  const data = window.LOREHUB_DATA;
  if (!data || !Array.isArray(data.articles)) throw new Error("LoreHub data could not be loaded.");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const state = { filter: "all", query: "", sort: "featured", view: "home", saved: loadSaved() };
  const universeById = Object.fromEntries(data.universes.map(u => [u.id, u]));
  const articleById = Object.fromEntries(data.articles.map(a => [a.id, a]));

  function loadSaved() {
    try { const value = JSON.parse(localStorage.getItem("lorehub-saved") || "[]"); return Array.isArray(value) ? value : []; }
    catch { return []; }
  }
  function saveSaved() { localStorage.setItem("lorehub-saved", JSON.stringify(state.saved)); }
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function theme(universeId) {
    const u = universeById[universeId] || data.universes[0];
    return `--card-accent:${u.accent};--card-glow:${u.glow};--tag-color:${u.accent};--detail-accent:${u.accent};--detail-glow:${u.glow}`;
  }
  function toast(message) {
    const node = $("#toast"); node.textContent = message; node.classList.add("show");
    clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove("show"), 2300);
  }
  function updateSavedCount() {
    $("#savedCount").textContent = state.saved.length;
    $("#savedTabCount").textContent = state.saved.length;
  }
  function renderUniverses() {
    $("#universeGrid").innerHTML = data.universes.map((u, index) => `
      <button class="universe-card" type="button" style="--card-accent:${u.accent};--card-glow:${u.glow}" data-universe="${u.id}" data-mark="${esc(u.mark)}" aria-label="Explore ${esc(u.name)}">
        <div class="universe-art franchise-art">
          <img class="franchise-backdrop" src="${esc(u.art || "assets/arcade-hero.svg")}" alt="" loading="lazy">
          ${u.portrait ? `<img class="franchise-portrait" src="${esc(u.portrait)}" alt="" loading="lazy">` : ""}
          ${u.logo ? `<img class="franchise-logo" src="${esc(u.logo)}" alt="${esc(u.name)} logo" loading="lazy">` : ""}
          <span class="universe-number">WORLD 0${index + 1}</span><span class="universe-icon">${esc(u.icon)}</span>
        </div>
        <div class="universe-card-body"><h3 class="universe-name">${esc(u.name)}</h3><p class="universe-desc">${esc(u.descriptor)}</p>
        <div class="universe-foot"><span>${esc(u.countLabel)}</span><b>▶</b></div></div>
      </button>`).join("");
    $$("[data-universe]").forEach(button => button.addEventListener("click", () => setFilter(button.dataset.universe)));
  }
  function renderGames() {
    const shelf = $("#gameShelf");
    if (!shelf || !Array.isArray(data.games)) return;
    shelf.innerHTML = data.games.map((game, index) => `
      <article class="game-card" style="--game-accent:${game.accent}">
        <div class="game-art">
          <img src="${esc(game.art)}" alt="${esc(game.title)} artwork" loading="lazy">
          <span class="game-year">${esc(game.year)}</span>
          <span class="game-index">PICK 0${index + 1}</span>
        </div>
        <div class="game-card-copy">
          <div class="game-meta"><span>${esc(game.genre)}</span><span>${esc(game.platform)}</span></div>
          <h3>${esc(game.title)}</h3>
          <p class="game-subtitle">${esc(game.subtitle)}</p>
          <p class="game-description">${esc(game.description)}</p>
        </div>
      </article>`).join("");
  }

  function getVisibleArticles() {
    let list = [...data.articles];
    if (state.filter === "saved") list = list.filter(article => state.saved.includes(article.id));
    else if (state.filter !== "all") list = list.filter(article => article.universe === state.filter);
    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter(a => [a.title,a.summary,a.category,a.universe,...(a.sections || []).map(s => s.body)].join(" ").toLowerCase().includes(q));
    }
    if (state.sort === "title") list.sort((a,b) => a.title.localeCompare(b.title));
    else if (state.sort === "universe") list.sort((a,b) => a.universe.localeCompare(b.universe) || a.title.localeCompare(b.title));
    else list.sort((a,b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title));
    return list;
  }
  function renderArticles() {
    const list = getVisibleArticles();
    $("#articleGrid").innerHTML = list.map((article,index) => {
      const u = universeById[article.universe];
      return `<article class="article-card" tabindex="0" role="button" data-article="${article.id}" aria-label="Open ${esc(article.title)}">
        <div class="article-card-top"><span class="tag" style="--tag-color:${u.accent}">${esc(u.name)} / ${esc(article.category)}</span><span class="article-id">LH-${String(index + 1).padStart(3,"0")}</span></div>
        <h3>${esc(article.title)}</h3><p>${esc(article.summary)}</p>
        <div class="article-card-foot"><span class="read-label">${esc(article.reading)} READ · EXPLORE ↗</span><button class="save-card ${state.saved.includes(article.id) ? "saved" : ""}" type="button" data-save="${article.id}" aria-label="${state.saved.includes(article.id) ? "Remove saved" : "Save"} ${esc(article.title)}" title="Save article">${state.saved.includes(article.id) ? "♥" : "♡"}</button></div>
      </article>`;
    }).join("");
    $("#emptyState").hidden = list.length !== 0;
    $("#articleGrid").hidden = list.length === 0;
    $("#visibleCount").textContent = `${list.length} ${list.length === 1 ? "ARTICLE" : "ARTICLES"}`;
    $("#activeSearch").hidden = !state.query;
    $("#searchSummary").textContent = state.query ? `Search results for “${state.query}”` : "";
    $$("[data-article]").forEach(card => {
      card.addEventListener("click", event => { if (event.target.closest("[data-save]")) return; openArticle(card.dataset.article); });
      card.addEventListener("keydown", event => { if ((event.key === "Enter" || event.key === " ") && !event.target.closest("button")) { event.preventDefault(); openArticle(card.dataset.article); } });
    });
    $$("[data-save]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); toggleSaved(button.dataset.save); }));
  }
  function setFilter(filter) {
    state.filter = filter; state.query = ""; $("#heroSearchInput").value = "";
    $$(".filter-tab").forEach(button => button.classList.toggle("active", button.dataset.filter === filter));
    renderArticles(); location.hash = "articles";
  }
  function toggleSaved(id) {
    state.saved = state.saved.includes(id) ? state.saved.filter(item => item !== id) : [...state.saved,id];
    saveSaved(); updateSavedCount(); renderArticles();
    toast(state.saved.includes(id) ? "Added to your saved archive" : "Removed from saved archive");
  }
  function openArticle(id) {
    const article = articleById[id] || getSubmittedArticles().find(a => a.id === id);
    if (!article) return;
    const u = universeById[article.universe];
    const related = (article.related || []).map(key => articleById[key]).filter(Boolean);
    $("#articleDetail").innerHTML = `
      <div class="detail-hero" style="--detail-accent:${u.accent};--detail-glow:${u.glow}">
        <div class="detail-kicker">${esc(u.name)} / ${esc(article.category)} / ARCHIVE ENTRY</div>
        <h1 class="detail-title">${esc(article.title)}</h1><p class="detail-summary">${esc(article.summary)}</p>
        <div class="detail-meta"><span>${esc(article.category.toUpperCase())}</span><span>${esc(article.reading || "3 min").toUpperCase()} READ</span><span>LOREHUB ENTRY</span></div>
      </div>
      <div class="detail-layout"><div class="detail-content">
        ${(article.sections || [{heading:"Overview",body:article.summary}]).map(section => `<h2>${esc(section.heading)}</h2><p>${esc(section.body)}</p>`).join("")}
        ${related.length ? `<h2>Related entries</h2><ul>${related.map(item => `<li><a href="#article/${item.id}" data-related="${item.id}">${esc(item.title)}</a> · ${esc(item.category)}</li>`).join("")}</ul>` : ""}
        <div class="detail-actions"><button class="button button-primary" type="button" id="detailSave">${state.saved.includes(id) ? "♥ Saved" : "♡ Save article"}</button><button class="button button-quiet" type="button" id="copyArticle">Copy entry link</button></div>
      </div><aside class="detail-sidebar"><h3>ENTRY INFORMATION</h3><dl>${Object.entries(article.facts || {}).map(([key,value]) => `<dt>${esc(key.toUpperCase())}</dt><dd>${esc(value)}</dd>`).join("")}<dt>UNIVERSE</dt><dd>${esc(u.name)}</dd></dl></aside></div>`;
    $("#app").hidden = true; $("#articleView").hidden = false; state.view = "article"; window.scrollTo({top:0,behavior:"smooth"});
    $("#backToArticles").onclick = closeArticle;
    $("#detailSave").onclick = () => { toggleSaved(id); $("#detailSave").textContent = state.saved.includes(id) ? "♥ Saved" : "♡ Save article"; };
    $("#copyArticle").onclick = async () => { const link = `${location.origin}${location.pathname}#article/${id}`; try { await navigator.clipboard.writeText(link); toast("Entry link copied"); } catch { toast("Copy isn't available in this browser"); } };
    $$('[data-related]').forEach(link => link.addEventListener("click", event => { event.preventDefault(); openArticle(link.dataset.related); }));
    history.replaceState(null,"",`#article/${id}`);
  }
  function closeArticle() {
    $("#articleView").hidden = true; $("#app").hidden = false; state.view = "home"; history.replaceState(null,"","#articles"); window.scrollTo({top:$("#articles").offsetTop - 75,behavior:"smooth"});
  }
  function getSubmittedArticles() {
    try { const value = JSON.parse(localStorage.getItem("lorehub-submissions") || "[]"); return Array.isArray(value) ? value : []; } catch { return []; }
  }
  function handleContribution(event) {
    event.preventDefault();
    const form = event.currentTarget; const fields = new FormData(form);
    const title = String(fields.get("title") || "").trim(); const universe = String(fields.get("universe") || ""); const category = String(fields.get("category") || ""); const summary = String(fields.get("summary") || "").trim();
    if (!title || !universe || !category || summary.length < 15) { $("#formFeedback").textContent = "Please complete all fields. The summary needs at least 15 characters."; return; }
    const submissions = getSubmittedArticles();
    submissions.unshift({id:`submission-${Date.now()}`,title,universe,category,summary,submittedAt:new Date().toISOString()});
    localStorage.setItem("lorehub-submissions", JSON.stringify(submissions));
    form.reset(); $("#formFeedback").textContent = "Entry saved locally. Thanks for contributing!"; toast("Contribution saved in this browser");
  }
  function setActiveNav(sectionId) {
    $$(".nav-link").forEach(link => {
      const active = link.dataset.nav === sectionId;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function closeMobileNav() {
    $(".main-nav").classList.remove("open");
    $("#mobileMenuButton").setAttribute("aria-expanded", "false");
    $("#mobileMenuButton").textContent = "☰";
  }

  function showMainView() {
    if (state.view === "article") {
      $("#articleView").hidden = true;
      $("#app").hidden = false;
      state.view = "home";
    }
  }

  function navigateToSection(sectionId, updateHash = true) {
    const target = document.getElementById(sectionId);
    if (!target) return;
    showMainView();
    closeMobileNav();
    if (updateHash) history.replaceState(null, "", `#${sectionId}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNav(sectionId);
  }

  function updateActiveNav() {
    if (state.view === "article") {
      setActiveNav("articles");
      return;
    }
    const headerHeight = $(".site-header").getBoundingClientRect().height;
    const activationLine = window.scrollY + headerHeight + 32;
    let activeSection = "home";
    ["home", "universes", "articles", "contribute"].forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section && section.getBoundingClientRect().top + window.scrollY <= activationLine) {
        activeSection = sectionId;
      }
    });
    setActiveNav(activeSection);
  }

  let scrollSpyPending = false;
  function requestScrollSpyUpdate() {
    if (scrollSpyPending) return;
    scrollSpyPending = true;
    window.requestAnimationFrame(() => {
      updateActiveNav();
      scrollSpyPending = false;
    });
  }

  function handleSearch(term) {
    state.query = term.trim(); state.filter = "all";
    $$(".filter-tab").forEach(button => button.classList.toggle("active", button.dataset.filter === "all"));
    renderArticles(); navigateToSection("articles");
  }

  $(".brand").addEventListener("click", event => {
    event.preventDefault();
    navigateToSection("home");
  });

  $$(".nav-link").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    navigateToSection(link.dataset.nav === "home" ? "home" : link.dataset.nav);
  }));

  window.addEventListener("scroll", requestScrollSpyUpdate, { passive: true });
  window.addEventListener("resize", requestScrollSpyUpdate);

  $("#heroSearchForm").addEventListener("submit", event => { event.preventDefault(); handleSearch($("#heroSearchInput").value); });
  $("#heroSearchInput").addEventListener("input", event => { if (!event.target.value.trim()) { state.query = ""; renderArticles(); } });
  $("#filterTabs").addEventListener("click", event => { const button = event.target.closest("[data-filter]"); if (button) setFilter(button.dataset.filter); });
  $("#sortSelect").addEventListener("change", event => { state.sort = event.target.value; renderArticles(); });
  $("#clearSearch").addEventListener("click", () => { state.query=""; $("#heroSearchInput").value=""; renderArticles(); });
  $("#resetFilters").addEventListener("click", () => setFilter("all"));
  $("#savedButton").addEventListener("click", () => setFilter("saved"));
  $("#contributeForm").addEventListener("submit", handleContribution);
  $("#mobileMenuButton").addEventListener("click", () => {
    const expanded = $("#mobileMenuButton").getAttribute("aria-expanded") === "true";
    $("#mobileMenuButton").setAttribute("aria-expanded", String(!expanded));
    $("#mobileMenuButton").textContent = expanded ? "☰" : "×";
    $(".main-nav").classList.toggle("open", !expanded);
  });

  renderUniverses(); renderGames(); renderArticles(); updateSavedCount();
  $("#articleTotal").textContent = `${data.articles.length} ARTICLES`;
  if (location.hash.startsWith("#article/")) openArticle(location.hash.slice(9));
  else if (["#home", "#universes", "#articles", "#contribute"].includes(location.hash)) {
    const sectionId = location.hash.slice(1);
    requestAnimationFrame(() => navigateToSection(sectionId, false));
  } else {
    requestScrollSpyUpdate();
  }
})();
