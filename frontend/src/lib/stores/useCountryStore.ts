import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Country {
  /** The dataset's own spelling; also the value sent back as ?country=. */
  name: string;
  /** flagcdn.com image URL, or null when the country has no known flag. */
  flag: string | null;
  playerCount: number;
  lastUpdated: number;
}

interface CountryStore {
  countries: Country[];
  isLoading: boolean;
  error: string | null;
  /** lastUpdated is stamped by the store, so callers do not supply it. */
  setCountries: (countries: Omit<Country, "lastUpdated">[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearStore: () => void;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const isFresh = (country: Country) => Date.now() - country.lastUpdated < CACHE_DURATION;

export const useCountryStore = create<CountryStore>()(
  persist(
    (set) => ({
      countries: [],
      isLoading: false,
      error: null,
      setCountries: (countries) =>
        set((state) => ({
          ...state,
          countries: countries.map((country) => ({
            ...country,
            lastUpdated: Date.now(),
          })),
        })),
      setLoading: (loading) =>
        set((state) => ({ ...state, isLoading: loading })),
      setError: (error) => set((state) => ({ ...state, error })),
      clearStore: () =>
        set((state) => ({ ...state, countries: [], error: null })),
    }),
    {
      name: "country-store",
      // Why versioned: entries saved before version 1 came from restcountries
      // (its spellings and flag URLs, keyed by a `code` field). Rendering them
      // would show names the backend cannot query. zustand already drops data
      // whose version does not match, but it logs a console error without a
      // migrate function; this one makes the discard explicit and silent.
      version: 1,
      migrate: () => ({ countries: [] }),
      // Expiry is applied on BOTH sides. partialize only runs when saving, so
      // on its own an entry saved fresh would be reloaded forever. The page
      // skips its fetch whenever countries are present, so counts would never
      // refresh after the data is reloaded.
      partialize: (state) => ({
        countries: state.countries.filter(isFresh),
      }),
      merge: (persisted, current) => ({
        ...current,
        countries: ((persisted as Partial<CountryStore> | undefined)?.countries ?? []).filter(isFresh),
      }),
    }
  )
);
