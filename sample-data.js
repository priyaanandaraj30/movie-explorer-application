// Fictional sample movies so the app works without an API key.
const SAMPLE_GENRES = [
  { id: 1, name: "Action" }, { id: 2, name: "Comedy" }, { id: 3, name: "Drama" },
  { id: 4, name: "Sci-Fi" }, { id: 5, name: "Animation" }, { id: 6, name: "Thriller" }, { id: 7, name: "Romance" },
];
const SAMPLE_MOVIES = [
  { id: 101, title: "Midnight Orbit", year: "2024", rating: 8.2, votes: 5120, hue: 230, genreIds: [4, 6], runtime: 128, director: "Asha Verma", cast: ["R. Menon", "L. Park", "T. Okafor"], overview: "A salvage crew drifting near a dead station discovers its AI is still counting down to something." },
  { id: 102, title: "Monsoon Letters", year: "2023", rating: 7.6, votes: 2310, hue: 195, genreIds: [3, 7], runtime: 112, director: "Kavya Iyer", cast: ["S. Nair", "D. Rao"], overview: "Two strangers in Chennai swap handwritten letters through one rainy season, and slowly find each other." },
  { id: 103, title: "Turbo Tortoise", year: "2022", rating: 7.1, votes: 8890, hue: 140, genreIds: [5, 2], runtime: 96, director: "Mia Chen", cast: ["Voice: J. Ortiz", "Voice: B. Singh"], overview: "The slowest runner in the forest enters the biggest race of the year with a tiny rocket and a huge heart." },
  { id: 104, title: "Last Train to Kovai", year: "2024", rating: 6.9, votes: 1740, hue: 15, genreIds: [6, 1], runtime: 119, director: "Ravi Shankar", cast: ["M. Das", "P. Joseph"], overview: "A night express, a missing briefcase and one hour to find out who on board is lying." },
  { id: 105, title: "The Laugh Factory Heist", year: "2021", rating: 6.4, votes: 3300, hue: 45, genreIds: [2, 1], runtime: 104, director: "Dan Whitfield", cast: ["K. Brooks", "A. Lee", "N. Bose"], overview: "Three failed comedians plan to rob the club that fired them, and keep forgetting the plan." },
  { id: 106, title: "Paper Lanterns", year: "2020", rating: 8.0, votes: 4010, hue: 340, genreIds: [3], runtime: 133, director: "Hana Mori", cast: ["Y. Sato", "E. Tan"], overview: "A family festival becomes a reckoning when three generations gather under one roof for the first time in a decade." },
  { id: 107, title: "Quantum Cafe", year: "2025", rating: 7.4, votes: 980, hue: 275, genreIds: [4, 2, 7], runtime: 101, director: "Leo Alvarez", cast: ["C. Dube", "F. Hart"], overview: "Every coffee at a tiny cafe sends the drinker to a different timeline. Only the barista remembers them all." },
  { id: 108, title: "Iron Monsoon", year: "2023", rating: 5.8, votes: 2650, hue: 0, genreIds: [1], runtime: 122, director: "T. Karthik", cast: ["V. Anand", "G. Shah"], overview: "When the dam breaks, a retired rescue diver must cross a flooded city to reach the people he failed once before." },
  { id: 109, title: "Starlight Sisters", year: "2022", rating: 7.9, votes: 6120, hue: 300, genreIds: [5, 3], runtime: 99, director: "Priya Menon", cast: ["Voice: A. Kaur", "Voice: S. Wu"], overview: "Two sisters keep a lighthouse that guides lost constellations back to the sky." },
  { id: 110, title: "Cold Signal", year: "2024", rating: 6.6, votes: 1450, hue: 205, genreIds: [6, 4], runtime: 115, director: "Ingrid Holm", cast: ["O. Berg", "Z. Rahman"], overview: "A polar researcher intercepts a radio message that is dated three days in the future." },
];
