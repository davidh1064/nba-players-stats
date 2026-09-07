import { describe, it, expect } from "vitest";
import { teamNameToAbbreviation } from "./teamAbbreviations";
import { teams } from "@/data/teams";

describe("teamNameToAbbreviation", () => {
  it("maps a full team name to its abbreviation", () => {
    expect(teamNameToAbbreviation["Los Angeles Lakers"]).toBe("LAL");
    expect(teamNameToAbbreviation["Boston Celtics"]).toBe("BOS");
  });

  it("covers all 30 NBA teams", () => {
    // Keys can exceed 30 because some teams carry an alias (the teams page
    // builds "LA Lakers" while the canonical key is "Los Angeles Lakers"), so
    // the invariant is on distinct abbreviations rather than key count.
    expect(new Set(Object.values(teamNameToAbbreviation)).size).toBe(30);
  });

  it("uses a three-letter uppercase abbreviation for every team", () => {
    for (const [name, abbreviation] of Object.entries(teamNameToAbbreviation)) {
      expect(abbreviation, `abbreviation for ${name}`).toMatch(/^[A-Z]{3}$/);
    }
  });

  it("only ever repeats an abbreviation as a deliberate alias", () => {
    // Two *different* teams sharing an abbreviation would silently merge their
    // players in search results. Repeats are allowed only where the names are
    // aliases of one another (e.g. "LA Lakers" / "Los Angeles Lakers").
    const byAbbreviation: Record<string, string[]> = {};
    for (const [name, abbreviation] of Object.entries(teamNameToAbbreviation)) {
      byAbbreviation[abbreviation] = [
        ...(byAbbreviation[abbreviation] ?? []),
        name,
      ];
    }

    const nickname = (name: string) => name.split(" ").pop();
    for (const [abbreviation, names] of Object.entries(byAbbreviation)) {
      if (names.length === 1) continue;
      const nicknames = new Set(names.map(nickname));
      expect(
        nicknames.size,
        `${abbreviation} maps to ${names.join(", ")}`,
      ).toBe(1);
    }
  });
});

describe("teams data and the abbreviation map agree", () => {
  it("has an entry for every team rendered on the teams page", () => {
    // The teams page builds "<city> <name>" and looks it up in the map. A team
    // present in one source but not the other produces a dead tile.
    const missing = teams
      .map((team) => `${team.city} ${team.name}`)
      .filter((fullName) => !teamNameToAbbreviation[fullName]);

    expect(missing).toEqual([]);
  });

  it("lists 30 teams", () => {
    expect(teams).toHaveLength(30);
  });

  it("gives every team a unique id", () => {
    const ids = teams.map((team) => team.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points every team at an svg logo under /team-logos", () => {
    for (const team of teams) {
      expect(team.logo, `logo for ${team.name}`).toMatch(
        /^\/team-logos\/[a-z0-9-]+\.svg$/,
      );
    }
  });
});
