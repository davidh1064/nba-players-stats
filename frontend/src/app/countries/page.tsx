"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import Image from "next/image";
import { Search, ArrowLeft } from "lucide-react";
import { playerService } from "@/lib/services/playerService";
import { toast } from "sonner";
import { useCountryStore } from "@/lib/stores/useCountryStore";
import { getApiFriendlyCountryName } from "@/lib/utils/countryUtils";
import PlayerStatsTable from "@/components/tables/PlayerStatsTable";
import PlayerDetailsModal from "@/components/modals/PlayerDetailsModal";
import { Player } from "@/lib/services/playerService";
import { Button } from "@/components/ui/button";

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
  players?: {
    id: number;
    name: string;
    team: string;
    season: string;
    college?: string;
    country: string;
    age?: number;
    playerHeight?: number;
    playerWeight?: number;
    draftYear?: string;
    draftRound?: string;
    draftNumber?: string;
    gp?: number;
    pts?: number;
    reb?: number;
    ast?: number;
    netRating?: number;
    orebPct?: number;
    drebPct?: number;
    usgPct?: number;
    tsPct?: number;
    astPct?: number;
  }[];
}

export default function CountriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCountries, setVisibleCountries] = useState(12);
  const [selectedCountry, setSelectedCountry] =
    useState<CountryWithPlayers | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { countries, isLoading, error, setCountries, setLoading, setError } =
    useCountryStore();

  useEffect(() => {
    const fetchCountries = async () => {
      // If we have cached data and it's not expired, don't fetch again
      if (countries.length > 0) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all countries from REST Countries API
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countryData: RestCountry[] = await response.json();

        // Fetch player counts for each country in parallel
        const countriesWithPlayerCounts = await Promise.all(
          countryData.map(async (country: RestCountry) => {
            try {
              const apiFriendlyName = getApiFriendlyCountryName(
                country.name.common
              );
              const players = await playerService.getPlayers({
                country: apiFriendlyName,
              });
              return {
                code: country.cca2,
                name: country.name.common,
                flag: country.flags.svg,
                playerCount: players.length,
                lastUpdated: Date.now(),
              };
            } catch (error) {
              console.error(
                `Error fetching players for ${country.name.common}:`,
                error
              );
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

        // Filter out countries with no players and sort by player count
        const countriesWithPlayers = countriesWithPlayerCounts
          .filter((country: CountryWithPlayers) => country.playerCount > 0)
          .sort(
            (a: CountryWithPlayers, b: CountryWithPlayers) =>
              b.playerCount - a.playerCount
          );

        setCountries(countriesWithPlayers);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to fetch countries. Please try again.");
        toast.error("Failed to fetch countries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [countries.length, setCountries, setLoading, setError]);

  const loadMore = () => {
    setVisibleCountries((prev) => prev + 12);
  };

  const { observerRef } = useInfiniteScroll(loadMore);

  const filteredCountries = countries.filter((country: CountryWithPlayers) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountryClick = async (country: CountryWithPlayers) => {
    try {
      setLoading(true);
      const apiFriendlyName = getApiFriendlyCountryName(country.name);
      const players = await playerService.getPlayers({
        country: apiFriendlyName,
      });
      console.log("Fetched players:", players);
      setSelectedCountry({
        ...country,
        players,
      });
    } catch (error) {
      console.error("Error fetching players for country:", error);
      toast.error("Failed to fetch players for this country");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setSelectedCountry(null);
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          NBA Players by Country
        </h1>
        <p className="text-lg text-gray-600">
          Discover NBA players from around the world
        </p>
      </div>

      {selectedCountry ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold">
              Players from {selectedCountry.name}
            </h2>
          </div>
          {selectedCountry.players && (
            <PlayerStatsTable
              players={selectedCountry.players}
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
            <div className="text-center text-gray-600">
              Loading countries...
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredCountries.map((country: CountryWithPlayers) => (
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
                    <h3 className="text-lg font-semibold text-gray-800">
                      {country.name}
                    </h3>
                    <p className="text-gray-600">
                      {country.playerCount} players
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
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlayer(null);
        }}
      />
    </div>
  );
}
