/**
 * Flag lookup for the Countries page.
 *
 * Why this table exists: the page used to get country names and flags from
 * restcountries.com. Its v3.1 API was retired, and the replacement requires an
 * account and an API key, which a browser-only app cannot keep secret. Country
 * names now come from our own database (GET /api/players/countries), so all
 * that is missing is a flag for each name.
 *
 * Keys are the dataset's own spellings, exactly as the backend returns them.
 * Values are flagcdn.com codes: ISO 3166-1 alpha-2 in lowercase, plus flagcdn's
 * subdivision codes for the UK's home nations (e.g. "gb-eng").
 *
 * States that no longer exist (Yugoslavia, Serbia and Montenegro, the USSR)
 * are deliberately absent: they have no current flag code. Any name missing
 * from this table renders a placeholder instead of breaking the card.
 */
export const COUNTRY_FLAG_CODES: Record<string, string> = {
  // North America & Caribbean
  USA: "us",
  "United States": "us",
  "United States of America": "us",
  Canada: "ca",
  Mexico: "mx",
  "Puerto Rico": "pr",
  "Dominican Republic": "do",
  "US Virgin Islands": "vi",
  "U.S. Virgin Islands": "vi",
  "U.S. Virgin Islands (US)": "vi",
  Bahamas: "bs",
  "The Bahamas": "bs",
  Jamaica: "jm",
  Haiti: "ht",
  Cuba: "cu",
  "Trinidad and Tobago": "tt",
  "Trinidad & Tobago": "tt",
  Barbados: "bb",
  Dominica: "dm",
  Grenada: "gd",
  "Saint Lucia": "lc",
  "St. Lucia": "lc",
  "Saint Vincent and the Grenadines": "vc",
  "St. Vincent & Grenadines": "vc",
  "St. Vincent and the Grenadines": "vc",
  "Antigua and Barbuda": "ag",
  "Saint Kitts and Nevis": "kn",
  "St. Kitts and Nevis": "kn",
  Guadeloupe: "gp",
  Martinique: "mq",
  "French Guiana": "gf",
  Bermuda: "bm",
  Belize: "bz",
  Panama: "pa",

  // South America
  Brazil: "br",
  Argentina: "ar",
  Venezuela: "ve",
  Uruguay: "uy",
  Colombia: "co",
  Chile: "cl",
  Guyana: "gy",

  // Europe
  France: "fr",
  Germany: "de",
  Spain: "es",
  Italy: "it",
  Greece: "gr",
  Turkey: "tr",
  Türkiye: "tr",
  Turkiye: "tr",
  Serbia: "rs",
  Croatia: "hr",
  Slovenia: "si",
  Montenegro: "me",
  "Bosnia and Herzegovina": "ba",
  "Bosnia & Herzegovina": "ba",
  Bosnia: "ba",
  "Bosnia-Herzegovina": "ba",
  Macedonia: "mk",
  "North Macedonia": "mk",
  "Republic of North Macedonia": "mk",
  Lithuania: "lt",
  Latvia: "lv",
  Estonia: "ee",
  Russia: "ru",
  Ukraine: "ua",
  Belarus: "by",
  Georgia: "ge",
  Poland: "pl",
  "Czech Republic": "cz",
  Czechia: "cz",
  Slovakia: "sk",
  Hungary: "hu",
  Romania: "ro",
  Bulgaria: "bg",
  Austria: "at",
  Switzerland: "ch",
  Belgium: "be",
  Netherlands: "nl",
  Holland: "nl",
  Luxembourg: "lu",
  Denmark: "dk",
  Sweden: "se",
  Norway: "no",
  Finland: "fi",
  Iceland: "is",
  Ireland: "ie",
  Portugal: "pt",
  "United Kingdom": "gb",
  UK: "gb",
  "Great Britain": "gb",
  England: "gb-eng",
  Scotland: "gb-sct",
  Wales: "gb-wls",
  "Northern Ireland": "gb-nir",
  Israel: "il",

  // Africa
  Nigeria: "ng",
  Cameroon: "cm",
  Senegal: "sn",
  "Democratic Republic of the Congo": "cd",
  "DR Congo": "cd",
  DRC: "cd",
  "Congo, Democratic Republic": "cd",
  Congo: "cg",
  "Republic of the Congo": "cg",
  Sudan: "sd",
  "South Sudan": "ss",
  Egypt: "eg",
  Mali: "ml",
  Guinea: "gn",
  Gabon: "ga",
  Tanzania: "tz",
  Angola: "ao",
  Ghana: "gh",
  "Cape Verde": "cv",
  "Cabo Verde": "cv",
  "Ivory Coast": "ci",
  "Côte d'Ivoire": "ci",
  "Cote d'Ivoire": "ci",
  "Côte d’Ivoire": "ci", // curly apostrophe variant
  Tunisia: "tn",
  Morocco: "ma",
  Algeria: "dz",
  Libya: "ly",
  Kenya: "ke",
  Liberia: "lr",
  Uganda: "ug",
  "Central African Republic": "cf",
  Chad: "td",
  "Burkina Faso": "bf",
  Mauritania: "mr",
  Somalia: "so",
  Ethiopia: "et",
  "South Africa": "za",

  // Asia & Middle East
  China: "cn",
  Japan: "jp",
  "South Korea": "kr",
  Korea: "kr",
  Taiwan: "tw",
  Philippines: "ph",
  Indonesia: "id",
  India: "in",
  Iran: "ir",
  Lebanon: "lb",
  Qatar: "qa",
  Kazakhstan: "kz",

  // Oceania
  Australia: "au",
  "New Zealand": "nz",
};

/** Case-insensitive view of the table, built once. */
const FLAG_CODES_LOWER: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRY_FLAG_CODES).map(([name, code]) => [name.toLowerCase(), code]),
);

/**
 * The flag image URL for a dataset country name, or null when the name has no
 * known flag (the caller renders a placeholder).
 */
export function getFlagUrl(country: string): string | null {
  const key = country.trim();
  const code = COUNTRY_FLAG_CODES[key] ?? FLAG_CODES_LOWER[key.toLowerCase()];
  return code ? `https://flagcdn.com/${code}.svg` : null;
}

/**
 * Keeps only rows whose country is exactly `country`.
 *
 * Why: the backend's ?country= filter matches case-insensitive SUBSTRINGS
 * (needed by the search page, where "slov" should find Slovenia). So
 * ?country=Serbia also returns "Serbia and Montenegro" players, Sudan also
 * returns South Sudan, and Dominica also returns the Dominican Republic. A
 * country card's count uses exact names, so its drill-down must too, or the
 * card and its table disagree.
 */
export function playersFromExactCountry<T extends { country?: string | null }>(
  players: T[],
  country: string,
): T[] {
  return players.filter((p) => p.country === country);
}

/** One row of GET /api/players/countries. */
export interface CountryPlayerCount {
  country: string;
  playerCount: number;
}

/** What a country card on the Countries page renders. */
export interface CountryCard {
  name: string;
  playerCount: number;
  flag: string | null;
}

/**
 * Turns the backend's per-country counts into cards. Keeps the backend's
 * ordering (most players first) and drops anything without a usable name or
 * with no players, so a malformed row can never render an empty card.
 */
export function toCountryCards(counts: CountryPlayerCount[]): CountryCard[] {
  return counts
    .filter((c) => typeof c.country === "string" && c.country.trim() !== "" && c.playerCount > 0)
    .map((c) => ({
      name: c.country,
      playerCount: c.playerCount,
      flag: getFlagUrl(c.country),
    }));
}
