// Data layer: TMDB when a key is set, otherwise sample data (same shapes either way).
const API = "https://api.themoviedb.org/3";
const usingSample = () => !CONFIG.TMDB_API_KEY;

async function fetchJSON(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (res.status === 401) throw new Error("Invalid TMDB API key. Check js/config.js.");
    if (res.status === 404) throw new Error("That movie could not be found.");
    if (res.status === 429) throw new Error("Too many requests. Wait a moment and try again.");
    if (!res.ok) throw new Error(`The movie service returned an error (${res.status}).`);
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") throw new Error("The request timed out. Check your connection and try again.");
    if (err instanceof TypeError) throw new Error("Couldn't reach the movie service. Check your internet connection.");
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
const tmdb = (path, params = {}) =>
  fetchJSON(`${API}${path}?${new URLSearchParams({ api_key: CONFIG.TMDB_API_KEY, language: "en-US", ...params })}`);

const toSummary = (m) => ({
  id: m.id, title: m.title, year: (m.release_date ?? "").slice(0, 4), rating: m.vote_average ?? 0,
  votes: m.vote_count ?? 0, poster: m.poster_path ? CONFIG.IMG + m.poster_path : null,
  genreIds: m.genre_ids ?? [], overview: m.overview ?? "",
});
const sampleSummary = ({ runtime, director, cast, ...m }) => ({ ...m, poster: null });

async function getGenres() {
  if (usingSample()) return SAMPLE_GENRES;
  return (await tmdb("/genre/movie/list")).genres;
}

async function listMovies({ query = "", genreId = null, page = 1 }) {
  if (usingSample()) {
    await new Promise((r) => setTimeout(r, 400)); // simulate network so loading UI is visible
    const q = query.toLowerCase();
    const movies = SAMPLE_MOVIES.filter((m) => (!q || m.title.toLowerCase().includes(q)) && (!genreId || m.genreIds.includes(genreId))).map(sampleSummary);
    return { movies, totalPages: 1 };
  }
  const data = query
    ? await tmdb("/search/movie", { query, page, include_adult: false })
    : genreId
      ? await tmdb("/discover/movie", { with_genres: genreId, sort_by: "popularity.desc", page })
      : await tmdb("/movie/popular", { page });
  let movies = data.results.map(toSummary);
  if (query && genreId) movies = movies.filter((m) => m.genreIds.includes(genreId)); // search can't filter by genre server-side
  return { movies, totalPages: Math.min(data.total_pages, 500) };
}

async function getMovie(id) {
  if (usingSample()) {
    await new Promise((r) => setTimeout(r, 300));
    const m = SAMPLE_MOVIES.find((x) => x.id === Number(id));
    if (!m) throw new Error("That movie could not be found.");
    return { ...sampleSummary(m), runtime: m.runtime, director: m.director, cast: m.cast,
      genres: m.genreIds.map((g) => SAMPLE_GENRES.find((s) => s.id === g)?.name).filter(Boolean) };
  }
  const m = await tmdb(`/movie/${id}`, { append_to_response: "credits" });
  return { ...toSummary(m), runtime: m.runtime, tagline: m.tagline, genres: m.genres.map((g) => g.name),
    director: m.credits?.crew.find((c) => c.job === "Director")?.name ?? "Unknown",
    cast: (m.credits?.cast ?? []).slice(0, 6).map((c) => c.name) };
}
