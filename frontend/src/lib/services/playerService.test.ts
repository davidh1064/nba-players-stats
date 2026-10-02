import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { playerService } from "./playerService";
import api from "../api";

vi.mock("../api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// api's methods are overloaded generic signatures, so vi.mocked() cannot infer
// the mock helpers off them; cast each one to Mock directly.
const mockedApi = {
  get: api.get as unknown as Mock,
  post: api.post as unknown as Mock,
  put: api.put as unknown as Mock,
  delete: api.delete as unknown as Mock,
};

/** A player as the backend serialises it, before the service maps it. */
const apiPlayer = {
  id: 1,
  playerName: "LeBron James",
  teamAbbreviation: "LAL",
  season: "2022-23",
  country: "USA",
  college: "None",
};

describe("playerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // The service logs on the error paths; keep the test output readable.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getPlayers", () => {
    it("requests /players and returns the payload", async () => {
      mockedApi.get.mockResolvedValue({ data: [apiPlayer] });

      const players = await playerService.getPlayers();

      expect(mockedApi.get).toHaveBeenCalledWith("/players", {
        params: undefined,
      });
      expect(players).toHaveLength(1);
    });

    it("forwards search filters as query parameters", async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      await playerService.getPlayers({ playerName: "LeBron", teamName: "LAL" });

      expect(mockedApi.get).toHaveBeenCalledWith("/players", {
        params: { playerName: "LeBron", teamName: "LAL" },
      });
    });

    it("propagates a request failure to the caller", async () => {
      mockedApi.get.mockRejectedValue(new Error("network down"));

      await expect(playerService.getPlayers()).rejects.toThrow("network down");
    });
  });

  describe("getPlayerById", () => {
    it("requests the player by id", async () => {
      mockedApi.get.mockResolvedValue({ data: apiPlayer });

      await playerService.getPlayerById(7);

      expect(mockedApi.get).toHaveBeenCalledWith("/players/7");
    });
  });

  describe("field mapping", () => {
    it("maps playerName to name and teamAbbreviation to team", async () => {
      // The UI reads `name` and `team`; the API sends `playerName` and
      // `teamAbbreviation`. Losing this mapping renders blank rows.
      mockedApi.get.mockResolvedValue({ data: [apiPlayer] });

      const [player] = await playerService.getPlayersByTeam("LAL");

      expect(player.name).toBe("LeBron James");
      expect(player.team).toBe("LAL");
    });

    it("keeps the original fields alongside the mapped ones", async () => {
      mockedApi.get.mockResolvedValue({ data: [apiPlayer] });

      const [player] = await playerService.getPlayersByTeam("LAL");

      expect(player.id).toBe(1);
      expect(player.season).toBe("2022-23");
      expect(player.country).toBe("USA");
    });

    it("returns an empty array when the API returns no players", async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      expect(await playerService.getPlayersByTeam("XXX")).toEqual([]);
    });
  });

  describe("filtered lookups", () => {
    it("getPlayersByTeam sends the abbreviation as teamName", async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      await playerService.getPlayersByTeam("BOS");

      expect(mockedApi.get).toHaveBeenCalledWith("/players", {
        params: { teamName: "BOS" },
      });
    });

    it("getPlayersByCountry sends the country parameter", async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      await playerService.getPlayersByCountry("Slovenia");

      expect(mockedApi.get).toHaveBeenCalledWith("/players", {
        params: { country: "Slovenia" },
      });
    });

    it("getPlayersBySeason sends the season parameter", async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      await playerService.getPlayersBySeason("2023-24");

      expect(mockedApi.get).toHaveBeenCalledWith("/players", {
        params: { season: "2023-24" },
      });
    });

    it("rethrows so callers can surface a toast", async () => {
      mockedApi.get.mockRejectedValue(new Error("boom"));

      await expect(playerService.getPlayersByTeam("LAL")).rejects.toThrow(
        "boom",
      );
      await expect(playerService.getPlayersByCountry("USA")).rejects.toThrow(
        "boom",
      );
      await expect(playerService.getPlayersBySeason("2022-23")).rejects.toThrow(
        "boom",
      );
    });
  });

  describe("write helpers (admin-only on the server)", () => {
    it("createPlayer POSTs the player", async () => {
      mockedApi.post.mockResolvedValue({ data: apiPlayer });

      await playerService.createPlayer({ name: "X" } as never);

      expect(mockedApi.post).toHaveBeenCalledWith("/players", { name: "X" });
    });

    it("updatePlayer PUTs to the collection, not to /players/{id}", async () => {
      mockedApi.put.mockResolvedValue({ data: apiPlayer });

      await playerService.updatePlayer({ id: 1 } as never);

      expect(mockedApi.put).toHaveBeenCalledWith("/players", { id: 1 });
    });

    it("deletePlayer DELETEs by id", async () => {
      mockedApi.delete.mockResolvedValue({});

      await playerService.deletePlayer(3);

      expect(mockedApi.delete).toHaveBeenCalledWith("/players/3");
    });

    it("surfaces the 401 the API now returns without credentials", async () => {
      // These endpoints require admin auth since the write lockdown. The UI
      // does not call them, but a caller must see the rejection rather than a
      // silent no-op.
      const unauthorized = Object.assign(new Error("Request failed"), {
        response: { status: 401 },
      });
      mockedApi.delete.mockRejectedValue(unauthorized);

      await expect(playerService.deletePlayer(3)).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });
});
