# Movie Explorer

Search and browse movies, filter by category, see ratings and details, and keep a watchlist. Built with HTML, CSS and vanilla JavaScript (ES6+), structured like a React app: components, state, hooks-style data loading and routing.

## Run
1. Open `index.html` (or `python -m http.server 8000` and visit `http://localhost:8000`).
2. It runs on built-in **sample data** by default.
3. For real movies: get a free key at themoviedb.org (Settings > API) and paste it into `js/config.js`.

## Requirements checklist
| Requirement | Where |
|---|---|
| Search movies | header form, `listMovies()` in `js/api.js` |
| View details | `#/movie/:id` route, `Details()` component |
| Ratings | `Rating()` component (star bar + score) |
| Category filters | `GenreChips()`, TMDB genres / discover |
| Responsive design | CSS grid + breakpoints in `css/style.css` |
| Error handling | invalid input, network, timeout, 401/404/429, no results, retry button |
| Loading indicators | skeleton cards, spinner, "Loading..." on Load more |

## React concept mapping (for your report)
| React skill | In this project |
|---|---|
| Components | functions in `js/components.js` return HTML from data (props) |
| State management | single `state` object in `js/app.js`, `render()` after each change |
| Hooks (`useEffect`) | `route()` triggers `loadMovies()` / `loadDetail()` when the view changes |
| Routing | hash routes `#/`, `#/movie/:id`, `#/watchlist` |
| API integration | `js/api.js` with async/await, timeout, error mapping |
| Reusability | `MovieCard` used on Browse and Watchlist; `Rating`, `Poster` shared |

## Files
```
index.html
css/style.css
js/config.js        API key
js/sample-data.js   fictional demo movies
js/api.js           TMDB + sample data layer
js/components.js    UI components
js/app.js           state, router, events
```

## Deploy (GitHub Pages)
Push to GitHub, then Settings > Pages > Deploy from branch > `main` / root. Your link: `https://<username>.github.io/<repo>/`.
Note: a TMDB key in front-end code is visible to visitors. TMDB v3 keys are free and low-risk, but never put paid or secret keys here.

## AI-assisted activity (document in your report)
- **Generate components:** prompt AI for a `MovieCard`, `Rating` and `Details` component; keep the prompts and outputs.
- **Refactor for reuse:** merge duplicated card markup into one `MovieCard`; extract `Poster` and `Rating`.
- **State troubleshooting:** the `requestId` token fixes a race where an older search overwrote newer results; paste the symptom and `loadMovies()` into AI to reproduce the analysis.

## Suggested commits
1. `chore: set up project structure and base styles`
2. `feat: add TMDB data layer with sample-data fallback`
3. `feat: add movie grid, cards and rating component`
4. `feat: add search with input validation`
5. `feat: add genre category filters`
6. `feat: add movie details route`
7. `feat: add loading skeletons, spinner and error states`
8. `feat: add watchlist saved in localStorage`
9. `style: responsive layout for mobile`
10. `docs: add README with setup, deployment and AI-activity notes`
