"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import Image from "next/image";
import { Search, Globe } from "lucide-react";
import { Player, playerService } from "@/lib/services/playerService";
import { toast } from "sonner";
import { useCountryStore } from "@/lib/stores/useCountryStore";
import { playersFromExactCountry, toCountryCards } from "@/lib/utils/countryUtils";
import PlayerStatsTable from "@/components/tables/PlayerStatsTable";
import PlayerDetailsModal from "@/components/modals/PlayerDetailsModal";
import { usePlayerData } from "@/hooks/usePlayerData";
import { PageHeader } from "@/components/ui/PageHeader";
import BackButton from "@/components/ui/BackButton";
import { useRouter } from "next/navigation";

interface CountryWithPlayers {
  name: string;
  flag: string | null;
  playerCount: number;
  lastUpdated: number;
  players?: Player[];
}

export default function CountriesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCountries, setVisibleCountries] = useState(12);
  // Why: before the first fetch finishes, the list is empty and isLoading is
  // still false, so the "no data loaded" hint would flash on every cold load.
  // Only show empty states once a fetch has actually completed.
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedCountry, setSelectedCountry] =
    useState<CountryWithPlayers | null>(null);
  const {
    players,
    selectedPlayer,
    isModalOpen,
    setIsLoading,
    handlePlayerClick,
    handleModalClose,
    handleSuccess,
    handleError,
  } = usePlayerData();

  const { countries, isLoading, error, setCountries, setLoading, setError } =
    useCountryStore();
  const { observerRef } = useInfiniteScroll(() =>
    setVisibleCountries((prev) => prev + 12)
  );

  useEffect(() => {
    const fetchCountries = async () => {
      if (countries.length > 0) {
        setHasFetched(true);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        // Why our own API: restcountries' v3.1 API was retired and its successor
        // needs an API key, which a browser app cannot keep secret. Our database
        // already knows every player's country, so one aggregate request
        // replaces the old fetch-every-country-then-count-each (~250 calls).
        const counts = await playerService.getCountryCounts();
        setCountries(toCountryCards(counts));
      } catch (err) {
        setError("Failed to fetch countries");
        toast.error("Failed to fetch countries. Please try again.");
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchCountries();
  }, [countries.length, setCountries, setLoading, setError]);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountryClick = async (country: CountryWithPlayers) => {
    try {
      setLoading(true);
      // The name is already the dataset's own spelling, so it can be sent back
      // unchanged; the old restcountries-to-dataset renaming is gone.
      const countryName = country.name;

      const queryParams = new URLSearchParams({ country: countryName });
      const newUrl = `/countries?${queryParams.toString()}`;
      router.push(newUrl);

      const players = playersFromExactCountry(
        await playerService.getPlayers({ country: countryName }),
        countryName
      );
      setSelectedCountry({ ...country, players });
      handleSuccess(players);
    } catch (error) {
      handleError(error, "Failed to fetch players for this country");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="NBA Players by Country"
        description="Discover NBA players from around the world"
      />
      {selectedCountry ? (
        <div className="space-y-4">
          <BackButton
            onClick={() => {
              setSelectedCountry(null);
              router.replace("/countries");
            }}
            label="Back to Countries"
          />
          {players && (
            <PlayerStatsTable
              players={players}
              title={`${selectedCountry.name} Players Stats`}
              onPlayerClick={handlePlayerClick}
            />
          )}
        </div>
      ) : (
        <>
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-lg peer relative z-20"
                placeholder=" "
              />
              <label className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 bg-white px-1 z-30 pointer-events-none">
                Search for countries...
              </label>
            </div>
          </div>

          {isLoading || !hasFetched ? (
            <div className="text-center text-gray-600">
              Loading countries...
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : filteredCountries.length === 0 ? (
            <div className="text-center text-gray-600">
              {countries.length === 0
                ? "No countries found. Is the player data loaded?"
                : "No countries match your search."}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredCountries
                .slice(0, visibleCountries)
                .map((country) => (
                  <div
                    key={country.name}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border cursor-pointer overflow-hidden"
                    onClick={() => handleCountryClick(country)}
                  >
                    <div className="relative h-48 w-full">
                      {country.flag ? (
                        // Why unoptimized: these are SVGs from flagcdn.com. Next's
                        // optimizer refuses SVG by default and would also need the
                        // host allowlisted; the browser loads them directly instead.
                        <Image
                          src={country.flag}
                          alt={`${country.name} flag`}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center bg-gray-100"
                          aria-label={`No flag available for ${country.name}`}
                        >
                          <Globe className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {country.name}
                      </h3>
                      <p className="text-gray-600">
                        {country.playerCount}{" "}
                        {country.playerCount === 1 ? "player" : "players"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      <div ref={observerRef} className="h-10" />

      <PlayerDetailsModal
        player={selectedPlayer}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
