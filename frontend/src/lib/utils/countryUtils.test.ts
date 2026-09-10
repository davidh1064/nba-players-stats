import { describe, it, expect } from "vitest";
import { getApiFriendlyCountryName, COUNTRY_NAME_MAP } from "./countryUtils";

describe("getApiFriendlyCountryName", () => {
  it("maps an exact known name to its API form", () => {
    expect(getApiFriendlyCountryName("United States")).toBe("USA");
  });

  it("maps the long-form country name used by restcountries", () => {
    expect(
      getApiFriendlyCountryName(
        "United Kingdom of Great Britain and Northern Ireland",
      ),
    ).toBe("UK");
  });

  it("maps several spellings of the same country to one value", () => {
    // The countries page feeds names straight from an external API, so the
    // aliases have to converge or the player counts split across spellings.
    expect(getApiFriendlyCountryName("United States")).toBe("USA");
    expect(getApiFriendlyCountryName("United States of America")).toBe("USA");
    expect(getApiFriendlyCountryName("USA")).toBe("USA");
  });

  it("matches case-insensitively when there is no exact match", () => {
    expect(getApiFriendlyCountryName("united states")).toBe("USA");
    expect(getApiFriendlyCountryName("CZECH REPUBLIC")).toBe("Czechia");
  });

  it("returns the input unchanged when the country is unknown", () => {
    expect(getApiFriendlyCountryName("Slovenia")).toBe("Slovenia");
    expect(getApiFriendlyCountryName("Atlantis")).toBe("Atlantis");
  });

  it("preserves the original casing of an unmapped name", () => {
    expect(getApiFriendlyCountryName("sLoVeNiA")).toBe("sLoVeNiA");
  });

  it("returns an empty string unchanged", () => {
    expect(getApiFriendlyCountryName("")).toBe("");
  });

  it("prefers the exact match over a case-insensitive one", () => {
    // "USA" is a key in its own right; the exact branch must win so the
    // lookup does not depend on object key ordering.
    expect(getApiFriendlyCountryName("USA")).toBe("USA");
  });
});

describe("COUNTRY_NAME_MAP", () => {
  it("never maps a name to an empty value", () => {
    const empties = Object.entries(COUNTRY_NAME_MAP).filter(([, v]) => !v);
    expect(empties).toEqual([]);
  });

  it("is idempotent: mapping an already-mapped value leaves it alone", () => {
    // Guards against a chain like "X" -> "Y" -> "Z", where calling the helper
    // twice would produce a different answer than calling it once.
    for (const mapped of Object.values(COUNTRY_NAME_MAP)) {
      expect(getApiFriendlyCountryName(mapped)).toBe(mapped);
    }
  });
});
