// "Components": pure functions that take data and return HTML strings.
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const hueOf = (id) => (Number(id) * 47) % 360;

const Rating = (rating, votes) => {
  const r = Number(rating) || 0;
  return `<span class="rating" title="${r.toFixed(1)} out of 10"><span class="stars" style="--p:${r * 10}%" aria-hidden="true">★★★★★</span>
    <b>${r ? r.toFixed(1) : "N/A"}</b>${votes ? `<small>(${Number(votes).toLocaleString()})</small>` : ""}</span>`;
};

const Poster = (m) => m.poster
  ? `<img src="${esc(m.poster)}" alt="Poster of ${esc(m.title)}" loading="lazy">`
  : `<div class="poster-fallback" style="--h:${m.hue ?? hueOf(m.id)}" role="img" aria-label="Poster placeholder for ${esc(m.title)}"><span>${esc(m.title)}</span></div>`;

const MovieCard = (m, saved) => `
  <article class="movie">
    <a class="poster" href="#/movie/${m.id}">${Poster(m)}</a>
    <div class="info">
      <h3><a href="#/movie/${m.id}">${esc(m.title)}</a></h3>
      <p class="sub">${esc(m.year) || "Unknown year"}</p>
      ${Rating(m.rating, 0)}
      <button class="save ${saved ? "on" : ""}" data-action="toggle-watch" data-id="${m.id}" aria-pressed="${saved}">${saved ? "In watchlist" : "+ Watchlist"}</button>
    </div>
  </article>`;

const Skeletons = (n = 10) => `<div class="grid" aria-hidden="true">${Array.from({ length: n }, () => `<div class="movie skeleton"><div class="poster"></div><div class="info"><i></i><i></i></div></div>`).join("")}</div>`;
const Spinner = (text = "Loading…") => `<div class="spinner-wrap" role="status"><div class="spinner"></div><p>${esc(text)}</p></div>`;
const ErrorBox = (msg) => `<div class="state error"><p>${esc(msg)}</p><button data-action="retry">Try again</button></div>`;
const Empty = (msg) => `<div class="state"><p>${esc(msg)}</p></div>`;

const GenreChips = (genres, active) => `<div class="chips" role="group" aria-label="Filter by category">
  <button class="chip ${active === null ? "active" : ""}" data-action="genre" data-genre="">All</button>
  ${genres.map((g) => `<button class="chip ${active === g.id ? "active" : ""}" data-action="genre" data-genre="${g.id}">${esc(g.name)}</button>`).join("")}</div>`;

const Details = (m, saved) => `
  <a class="back" href="#/">&larr; Back to browse</a>
  <article class="details">
    <div class="poster big">${Poster(m)}</div>
    <div>
      <h1>${esc(m.title)} <small>${esc(m.year)}</small></h1>
      ${m.tagline ? `<p class="tagline">${esc(m.tagline)}</p>` : ""}
      ${Rating(m.rating, m.votes)}
      <p class="sub">${m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : "Runtime unknown"}</p>
      <p>${m.genres.map((g) => `<span class="tag">${esc(g)}</span>`).join(" ")}</p>
      <h2>Overview</h2><p>${esc(m.overview) || "No overview available."}</p>
      <p><strong>Director:</strong> ${esc(m.director)}</p>
      <p><strong>Cast:</strong> ${m.cast.length ? m.cast.map(esc).join(", ") : "Not listed"}</p>
      <button class="save big-btn ${saved ? "on" : ""}" data-action="toggle-watch" data-id="${m.id}" aria-pressed="${saved}">${saved ? "In watchlist" : "+ Add to watchlist"}</button>
    </div>
  </article>`;
