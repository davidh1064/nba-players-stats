"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import Image from "next/image";
import { Search, ArrowLeft } from "lucide-react";
import { Player, playerService } from "@/lib/services/playerService";
import { toast } from "sonner";
import { useCountryStore } from "@/lib/stores/useCountryStore";
import { getApiFriendlyCountryName } from "@/lib/utils/countryUtils";
import PlayerStatsTable from "@/components/tables/PlayerStatsTable";
import PlayerDetailsModal from "@/components/modals/PlayerDetailsModal";
import { Button } from "@/components/ui/Button";
import { usePlayerData } from "@/hooks/usePlayerData";
import { PageHeader } from "@/components/ui/PageHeader";

interface RestCountry {
  name: {
    common: string;
  };
  cca2: string;
  flags: {
    svg: string;
  };
}

interface CountryWithPlayers {
  code: string;
  name: string;
  flag: string;
  playerCount: number;
  lastUpdated: number;
  players?: Player[];
}

export default function CountriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCountries, setVisibleCountries] = useState(12);
  const [selectedCountry, setSelectedCountry] = useState<CountryWithPlayers | null>(null);
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

  const { countries, isLoading, error, setCountries, setLoading, setError } = useCountryStore();
  const { observerRef } = useInfiniteScroll(() => setVisibleCountries((prev) => prev + 12));

  useEffect(() => {
    const fetchCountries = async () => {
      if (countries.length > 0) return;
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("https://restcountries.com/v3.1/all");
        const countryData: RestCountry[] = await res.json();

        const countriesWithPlayerCounts = await Promise.all(
          countryData.map(async (country) => {
            try {
              const name = country.name.common;
              const apiName = getApiFriendlyCountryName(name);
              const players = await playerService.getPlayers({ country: apiName });
              return {
                code: country.cca2,
                name,
                flag: country.flags.svg,
                playerCount: players.length,
                lastUpdated: Date.now(),
              };
            } catch (err) {
              console.error(`Error fetching players for ${country.name.common}:`, err);
              return {
                code: country.cca2,
                name: country.name.common,
                flag: country.flags.svg,
                playerCount: 0,
                lastUpdated: Date.now(),
              };
            }
          })
        );

        const countriesWithPlayers = countriesWithPlayerCounts
          .filter((c) => c.playerCount > 0)
          .sort((a, b) => b.playerCount - a.playerCount);

        setCountries(countriesWithPlayers);
      } catch (err) {
        setError("Failed to fetch countries");
        toast.error("Failed to fetch countries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [countries.length, setCountries, setLoading, setError]);

  const handleCountryClick = async (country: CountryWithPlayers) => {
    try {
      setLoading(true);
      const name = getApiFriendlyCountryName(country.name);
      const players = await playerService.getPlayers({ country: name });
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedCountry(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold">Players from {selectedCountry.name}</h2>
          </div>
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

          {isLoading ? (
            <div className="text-center text-gray-600">Loading countries...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {countries
                .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, visibleCountries)
                .map((country) => (
                  <div
                    key={country.code}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border cursor-pointer overflow-hidden"
                    onClick={() => handleCountryClick(country)}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={country.flag}
                        alt={`${country.name} flag`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-800">{country.name}</h3>
                      <p className="text-gray-600">{country.playerCount} players</p>
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
