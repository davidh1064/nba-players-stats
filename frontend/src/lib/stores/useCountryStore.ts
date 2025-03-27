import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Country {
  code: string;
  name: string;
  flag: string;
  playerCount: number;
  lastUpdated: number;
}

interface CountryStore {
  countries: Country[];
  isLoading: boolean;
  error: string | null;
  setCountries: (countries: Country[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearStore: () => void;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
      partialize: (state) => ({
        countries: state.countries.filter(
          (country) => Date.now() - country.lastUpdated < CACHE_DURATION
        ),
      }),
    }
  )
);
