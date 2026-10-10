import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCountryStore } from "./useCountryStore";

const country = (overrides: Partial<Record<string, unknown>> = {}) => ({
  name: "United States",
  flag: "https://flagcdn.com/us.svg",
  playerCount: 400,
  lastUpdated: 0,
  ...overrides,
});

describe("useCountryStore", () => {
  beforeEach(() => {
    act(() => {
      useCountryStore.setState({
        countries: [],
        isLoading: false,
        error: null,
      });
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts empty and idle", () => {
    const { result } = renderHook(() => useCountryStore());

    expect(result.current.countries).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("setCountries stores the countries", () => {
    const { result } = renderHook(() => useCountryStore());

    act(() => result.current.setCountries([country(), country({ name: "Slovenia" })]));

    expect(result.current.countries).toHaveLength(2);
    expect(result.current.countries[0].name).toBe("United States");
  });

  it("setCountries stamps lastUpdated with the current time", () => {
    // lastUpdated drives the 24-hour cache window on rehydration, so a value
    // carried in from the caller would let stale entries survive indefinitely.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const { result } = renderHook(() => useCountryStore());

    act(() => result.current.setCountries([country({ lastUpdated: 0 })]));

    expect(result.current.countries[0].lastUpdated).toBe(Date.now());
    expect(result.current.countries[0].lastUpdated).not.toBe(0);
  });

  it("setCountries replaces the previous list rather than appending", () => {
    const { result } = renderHook(() => useCountryStore());

    act(() => result.current.setCountries([country()]));
    act(() => result.current.setCountries([country({ name: "Slovenia" })]));

    expect(result.current.countries).toHaveLength(1);
    expect(result.current.countries[0].name).toBe("Slovenia");
  });

  it("setLoading toggles the loading flag", () => {
    const { result } = renderHook(() => useCountryStore());

    act(() => result.current.setLoading(true));
    expect(result.current.isLoading).toBe(true);

    act(() => result.current.setLoading(false));
    expect(result.current.isLoading).toBe(false);
  });

  it("setError stores and clears an error message", () => {
    const { result } = renderHook(() => useCountryStore());

    act(() => result.current.setError("failed to load"));
    expect(result.current.error).toBe("failed to load");

    act(() => result.current.setError(null));
    expect(result.current.error).toBeNull();
  });

  it("clearStore empties the countries and the error", () => {
    const { result } = renderHook(() => useCountryStore());

    act(() => {
      result.current.setCountries([country()]);
      result.current.setError("failed");
    });

    act(() => result.current.clearStore());

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("clearStore leaves the loading flag untouched", () => {
    const { result } = renderHook(() => useCountryStore());

    act(() => result.current.setLoading(true));
    act(() => result.current.clearStore());

    expect(result.current.isLoading).toBe(true);
  });

  it("accepts a country with no known flag", () => {
    const { result } = renderHook(() => useCountryStore());

    act(() => result.current.setCountries([country({ name: "Yugoslavia", flag: null })]));

    expect(result.current.countries[0].flag).toBeNull();
  });

  it("discards data persisted by the restcountries-era store (version 0)", async () => {
    // Pre-v1 entries used restcountries spellings and a `code` field. If they
    // were rehydrated, the page would show names the backend cannot query.
    localStorage.setItem(
      "country-store",
      JSON.stringify({
        state: {
          countries: [
            {
              code: "US",
              name: "United States",
              flag: "https://flagcdn.com/us.svg",
              playerCount: 400,
              lastUpdated: Date.now(),
            },
          ],
        },
        version: 0,
      }),
    );

    await act(async () => {
      await useCountryStore.persist.rehydrate();
    });

    expect(useCountryStore.getState().countries).toEqual([]);
  });

  it("rehydrates data persisted by the current version", async () => {
    // Control for the test above: proves rehydration works at all, so the
    // empty result there is the migration discarding data, not a no-op.
    localStorage.setItem(
      "country-store",
      JSON.stringify({
        state: {
          countries: [
            { name: "USA", flag: "https://flagcdn.com/us.svg", playerCount: 3, lastUpdated: Date.now() },
          ],
        },
        version: 1,
      }),
    );

    await act(async () => {
      await useCountryStore.persist.rehydrate();
    });

    expect(useCountryStore.getState().countries.map((c) => c.name)).toEqual(["USA"]);
  });

  it("expires saved countries older than 24 hours when loading them", async () => {
    // The page skips its fetch whenever countries are present, so anything
    // reloaded here is shown as-is. Expiry must apply on load, not only on save.
    const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;
    localStorage.setItem(
      "country-store",
      JSON.stringify({
        state: {
          countries: [
            { name: "Stale", flag: null, playerCount: 1, lastUpdated: twoDaysAgo },
            { name: "Fresh", flag: null, playerCount: 1, lastUpdated: Date.now() },
          ],
        },
        version: 1,
      }),
    );

    await act(async () => {
      await useCountryStore.persist.rehydrate();
    });

    expect(useCountryStore.getState().countries.map((c) => c.name)).toEqual(["Fresh"]);
  });

  it("shares state across separate consumers of the hook", () => {
    // The store is global; the countries page and any other consumer must see
    // the same data rather than independent copies.
    const first = renderHook(() => useCountryStore());
    const second = renderHook(() => useCountryStore());

    act(() => first.result.current.setCountries([country()]));

    expect(second.result.current.countries).toHaveLength(1);
  });
});
