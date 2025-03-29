"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Search, Users, Trophy, GraduationCap, Globe } from "lucide-react";
import { playerService } from "@/lib/services/playerService";
import { toast } from "sonner";
import PlayerStatsTable from "@/components/tables/PlayerStatsTable";
import PlayerDetailsModal from "@/components/modals/PlayerDetailsModal";
import { FloatingInputField } from "@/components/ui/FloatingInputField";
import { PageHeader } from "@/components/ui/PageHeader";
import { usePlayerData } from "@/hooks/usePlayerData";
import { teamNameToAbbreviation } from "@/lib/constants/teamAbbreviations";
import { TeamCombobox } from "@/components/ui/TeamCombobox";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchParams {
  name?: string;
  team?: string;
  season?: string;
  college?: string;
  country?: string;
}

export default function PlayerSearchPage() {
  const router = useRouter();
  const urlParams = useSearchParams();
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [hasSearched, setHasSearched] = useState(false);
  const {
    players,
    isLoading,
    selectedPlayer,
    isModalOpen,
    setIsLoading,
    handlePlayerClick,
    handleModalClose,
    handleError,
    handleSuccess,
  } = usePlayerData();

  const buildQueryString = (params: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });
    return query.toString();
  };

  const handleSearch = async () => {
    const queryParams = {
      playerName: searchParams.name,
      teamName: searchParams.team,
      season: searchParams.season,
      college: searchParams.college,
      country: searchParams.country,
    };

    const queryString = buildQueryString(queryParams);
    const newUrl = `/players/search?${queryString}`;
    router.push(newUrl);

    try {
      setIsLoading(true);
      setHasSearched(true);

      const data = await playerService.getPlayers(queryParams);

      if (data.length === 0) {
        toast.info("No players found matching your search criteria");
      }
      handleSuccess(data);
    } catch (error) {
      handleError(error, "Failed to search players. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof SearchParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParams((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleClearAll = () => {
    setSearchParams({});
    setHasSearched(false);
    handleSuccess([]);
    toast.success("Search filters cleared");
    router.replace("/players/search");
  };

  useEffect(() => {
    const playerName = urlParams.get("playerName") || "";
    const teamName = urlParams.get("teamName") || "";
    const season = urlParams.get("season") || "";
    const college = urlParams.get("college") || "";
    const country = urlParams.get("country") || "";

    if (playerName || teamName || season || college || country) {
      setSearchParams({
        name: playerName,
        team: teamName,
        season,
        college,
        country,
      });

      handleSuccess([]);
      setTimeout(() => handleSearch(), 0);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="Advanced Player Search"
        description="Search for NBA players using multiple filters"
      />

      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <FloatingInputField
          label="Player Name"
          icon={<Search className="h-5 w-5" />}
          value={searchParams.name || ""}
          onChange={handleInputChange("name")}
        />

        <TeamCombobox
          value={searchParams.team || ""}
          onChange={(teamName) =>
            setSearchParams((prev) => ({
              ...prev,
              team: teamNameToAbbreviation[teamName],
            }))
          }
        />

        <FloatingInputField
          label="Season"
          icon={<Users className="h-5 w-5" />}
          value={searchParams.season || ""}
          onChange={handleInputChange("season")}
        />

        <FloatingInputField
          label="College"
          icon={<GraduationCap className="h-5 w-5" />}
          value={searchParams.college || ""}
          onChange={handleInputChange("college")}
        />

        <FloatingInputField
          label="Country"
          icon={<Globe className="h-5 w-5" />}
          value={searchParams.country || ""}
          onChange={handleInputChange("country")}
        />

        <p className="text-sm text-gray-500 text-center">
          All fields are optional. Fill in as many or as few as you like.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-600">Searching players...</div>
      ) : hasSearched && players.length > 0 ? (
        <div className="w-full">
          <PlayerStatsTable
            players={players}
            title="Search Results"
            onPlayerClick={handlePlayerClick}
          />
        </div>
      ) : null}

      <PlayerDetailsModal
        player={selectedPlayer}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
