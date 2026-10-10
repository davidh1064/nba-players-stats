import { describe, it, expect } from "vitest";
import { COUNTRY_FLAG_CODES, getFlagUrl, playersFromExactCountry, toCountryCards } from "./countryUtils";

describe("getFlagUrl", () => {
  it("builds a flagcdn SVG URL for a known dataset spelling", () => {
    expect(getFlagUrl("USA")).toBe("https://flagcdn.com/us.svg");
    expect(getFlagUrl("Slovenia")).toBe("https://flagcdn.com/si.svg");
  });

  it("uses flagcdn's subdivision codes for the UK's home nations", () => {
    expect(getFlagUrl("England")).toBe("https://flagcdn.com/gb-eng.svg");
    expect(getFlagUrl("Scotland")).toBe("https://flagcdn.com/gb-sct.svg");
  });

  it("maps alternative spellings of one country to the same flag", () => {
    const usa = getFlagUrl("USA");
    expect(getFlagUrl("United States")).toBe(usa);
    expect(getFlagUrl("United States of America")).toBe(usa);
  });

  it("matches case-insensitively and ignores surrounding whitespace", () => {
    expect(getFlagUrl("  slovenia ")).toBe("https://flagcdn.com/si.svg");
  });

  it("covers alternative spellings found in NBA data", () => {
    expect(getFlagUrl("Bosnia-Herzegovina")).toBe("https://flagcdn.com/ba.svg");
    expect(getFlagUrl("Turkiye")).toBe("https://flagcdn.com/tr.svg");
    expect(getFlagUrl("Côte d’Ivoire")).toBe("https://flagcdn.com/ci.svg");
    expect(getFlagUrl("St. Kitts and Nevis")).toBe("https://flagcdn.com/kn.svg");
  });

  it("returns null for a state with no current flag, so the card shows a placeholder", () => {
    expect(getFlagUrl("Yugoslavia")).toBeNull();
    expect(getFlagUrl("Serbia and Montenegro")).toBeNull();
  });

  it("returns null for an unknown or empty name rather than a broken URL", () => {
    expect(getFlagUrl("Atlantis")).toBeNull();
    expect(getFlagUrl("")).toBeNull();
  });
});

describe("playersFromExactCountry", () => {
  // The backend's ?country= filter matches substrings, so these are the real
  // over-matches an adversarial review found on PostgreSQL.
  const rows = [
    { name: "Nikola Jokic", country: "Serbia" },
    { name: "Peja Stojakovic", country: "Serbia and Montenegro" },
    { name: "Bol Bol", country: "Sudan" },
    { name: "Wenyen Gabriel", country: "South Sudan" },
    { name: "Al Horford", country: "Dominican Republic" },
    { name: "Someone", country: "Dominica" },
    { name: "A", country: "USA" },
    { name: "B", country: "usa" },
    { name: "C", country: "USA " },
    { name: "D", country: null },
  ];
  const names = (country: string) => playersFromExactCountry(rows, country).map((r) => r.name);

  it("does not include 'Serbia and Montenegro' players under Serbia", () => {
    expect(names("Serbia")).toEqual(["Nikola Jokic"]);
  });

  it("does not include South Sudan under Sudan", () => {
    expect(names("Sudan")).toEqual(["Bol Bol"]);
  });

  it("does not include the Dominican Republic under Dominica", () => {
    expect(names("Dominica")).toEqual(["Someone"]);
  });

  it("matches the exact string, as the card's count does (case and whitespace matter)", () => {
    expect(names("USA")).toEqual(["A"]);
  });

  it("returns nothing for a name with no exact match", () => {
    expect(names("Montenegro")).toEqual([]);
  });
});

describe("COUNTRY_FLAG_CODES", () => {
  it("only contains codes in flagcdn's format (lowercase alpha-2, or gb-xxx)", () => {
    // Every code was also checked live against flagcdn.com (all 113 served,
    // a deliberately bad code returned 404); this guards new entries' format.
    for (const [name, code] of Object.entries(COUNTRY_FLAG_CODES)) {
      expect(code, `code for ${name}`).toMatch(/^[a-z]{2}(-[a-z]{3})?$/);
    }
  });

  it("has no keys that differ only by case (the case-insensitive lookup would be ambiguous)", () => {
    const lower = Object.keys(COUNTRY_FLAG_CODES).map((k) => k.toLowerCase());
    expect(new Set(lower).size).toBe(lower.length);
  });
});

describe("toCountryCards", () => {
  it("turns backend counts into cards, keeping the backend's order", () => {
    expect(
      toCountryCards([
        { country: "USA", playerCount: 3 },
        { country: "Slovenia", playerCount: 1 },
      ]),
    ).toEqual([
      { name: "USA", playerCount: 3, flag: "https://flagcdn.com/us.svg" },
      { name: "Slovenia", playerCount: 1, flag: "https://flagcdn.com/si.svg" },
    ]);
  });

  it("keeps the dataset spelling as the name, since it is sent back as ?country=", () => {
    // The old page renamed countries (e.g. "United States" -> "USA") before
    // querying. Names must now pass through untouched.
    expect(toCountryCards([{ country: "U.S. Virgin Islands", playerCount: 2 }])[0].name).toBe(
      "U.S. Virgin Islands",
    );
  });

  it("gives a card with no known flag a null flag instead of dropping it", () => {
    expect(toCountryCards([{ country: "Yugoslavia", playerCount: 5 }])).toEqual([
      { name: "Yugoslavia", playerCount: 5, flag: null },
    ]);
  });

  it("drops malformed rows so no empty card renders", () => {
    expect(
      toCountryCards([
        { country: "", playerCount: 4 },
        { country: "   ", playerCount: 4 },
        { country: "Chad", playerCount: 0 },
        { country: null as unknown as string, playerCount: 1 },
        { country: "Chad", playerCount: 1 },
      ]),
    ).toEqual([{ name: "Chad", playerCount: 1, flag: "https://flagcdn.com/td.svg" }]);
  });

  it("returns an empty list for an empty response", () => {
    expect(toCountryCards([])).toEqual([]);
  });
});
