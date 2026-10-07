// State management + routing + event handling.
const $ = (sel) => document.querySelector(sel);
const view = $("#view");

// ---------- state ----------
const state = {
  query: "", genre: null, genres: [], movies: [], page: 1, totalPages: 1,
  loading: false, loadingMore: false, error: "", loaded: false,
  detail: { id: null, movie: null, loading: false, error: "" },
  watchlist: load("watchlist", []),
};
function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function persist() { try { localStorage.setItem("watchlist", JSON.stringify(state.watchlist)); } catch { /* ignore */ } }
const isSaved = (id) => state.watchlist.some((m) => m.id === Number(id));

function toggleWatch(id) {
  const movie = state.movies.find((m) => m.id === Number(id)) ?? state.detail.movie ?? state.watchlist.find((m) => m.id === Number(id));
  if (!movie) return;
  state.watchlist = isSaved(id) ? state.watchlist.filter((m) => m.id !== Number(id))
    : [...state.watchlist, { id: movie.id, title: movie.title, year: movie.year, rating: movie.rating, poster: movie.poster, hue: movie.hue }];
  persist();
  render();
}

// ---------- data loading ----------
let requestId = 0;
async function loadMovies({ reset = true } = {}) {
  const token = ++requestId;
  state.error = "";
  if (reset) { state.page = 1; state.movies = []; state.loading = true; } else state.loadingMore = true;
  render();
  try {
    if (!state.genres.length) state.genres = await getGenres();
    const r = await listMovies({ query: state.query, genreId: state.genre, page: state.page });
    if (token !== requestId) return; // a newer request replaced this one
    state.movies = reset ? r.movies : [...state.movies, ...r.movies];
    state.totalPages = r.totalPages;
    state.loaded = true;
  } catch (err) {
    if (token !== requestId) return;
    state.error = err.message;
  } finally {
    if (token === requestId) { state.loading = false; state.loadingMore = false; render(); }
  }
}

async function loadDetail(id) {
  state.detail = { id, movie: null, loading: true, error: "" };
  render();
  try {
    const movie = await getMovie(id);
    if (state.detail.id !== id) return;
    state.detail = { id, movie, loading: false, error: "" };
    document.title = `${movie.title} | Movie Explorer`;
  } catch (err) {
    if (state.detail.id !== id) return;
    state.detail = { id, movie: null, loading: false, error: err.message };
  }
  render();
}

// ---------- views ----------
function HomeView() {
  const label = state.query ? `Results for "${esc(state.query)}"` : state.genre ? "Filtered movies" : usingSample() ? "Sample movies" : "Popular movies";
  let body;
  if (state.loading) body = Skeletons();
  else if (state.error) body = ErrorBox(state.error);
  else if (!state.movies.length) body = Empty(state.query ? `No movies found for "${state.query}". Try another title or category.` : "No movies in this category.");
  else body = `<div class="grid">${state.movies.map((m) => MovieCard(m, isSaved(m.id))).join("")}</div>` +
    (state.page < state.totalPages ? `<p class="more"><button data-action="load-more" ${state.loadingMore ? "disabled" : ""}>${state.loadingMore ? "Loading…" : "Load more"}</button></p>` : "");
  return `<h1 class="h">${label}</h1>${GenreChips(state.genres, state.genre)}${body}`;
}
function DetailView() {
  const d = state.detail;
  if (d.loading) return Spinner("Loading movie details…");
  if (d.error) return `<a class="back" href="#/">&larr; Back to browse</a>${ErrorBox(d.error)}`;
  return d.movie ? Details(d.movie, isSaved(d.movie.id)) : "";
}
function WatchlistView() {
  return `<h1 class="h">My watchlist</h1>` + (state.watchlist.length
    ? `<div class="grid">${state.watchlist.map((m) => MovieCard(m, true)).join("")}</div>`
    : Empty("Your watchlist is empty. Add movies with the + Watchlist button."));
}

// ---------- router ----------
const parseRoute = () => {
  const [, page, id] = location.hash.split("/");
  if (page === "movie" && id) return { name: "detail", id };
  if (page === "watchlist") return { name: "watchlist" };
  return { name: "home" };
};
function render() {
  const route = parseRoute();
  view.innerHTML = route.name === "detail" ? DetailView() : route.name === "watchlist" ? WatchlistView() : HomeView();
  $("#watch-count").textContent = state.watchlist.length;
  $("#nav-home").toggleAttribute("aria-current", route.name === "home");
  $("#nav-watch").toggleAttribute("aria-current", route.name === "watchlist");
}
function route() {
  const r = parseRoute();
  window.scrollTo(0, 0);
  document.title = "Movie Explorer";
  if (r.name === "detail") { if (state.detail.id !== r.id || state.detail.error) loadDetail(r.id); else render(); }
  else if (r.name === "home" && !state.loaded && !state.loading) loadMovies();
  else render();
  view.focus({ preventScroll: true });
}

// ---------- events ----------
function showMessage(text) { const m = $("#message"); m.textContent = text; m.hidden = !text; }

$("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = $("#q").value.trim();
  if (q && !/[\p{L}\p{N}]/u.test(q)) return showMessage("Enter a movie title using letters or numbers.");
  showMessage("");
  state.query = q;
  if (parseRoute().name !== "home") location.hash = "#/";
  loadMovies();
});

view.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const { action, id, genre } = el.dataset;
  if (action === "toggle-watch") toggleWatch(id);
  if (action === "genre") { state.genre = genre ? Number(genre) : null; loadMovies(); }
  if (action === "load-more") { state.page += 1; loadMovies({ reset: false }); }
  if (action === "retry") { parseRoute().name === "detail" ? loadDetail(parseRoute().id) : loadMovies(); }
});

window.addEventListener("hashchange", route);
route();
