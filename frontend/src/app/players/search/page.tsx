"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Trophy, GraduationCap, Globe } from "lucide-react";
import { playerService, Player } from "@/lib/services/playerService";
import { toast } from "sonner";
import PlayerStatsTable from "@/components/tables/PlayerStatsTable";
import PlayerDetailsModal from "@/components/modals/PlayerDetailsModal";
import { FloatingInputField } from "@/components/ui/FloatingInputField";

interface SearchParams {
  name?: string;
  team?: string;
  season?: string;
  college?: string;
  country?: string;
}

export default function PlayerSearchPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const params = {
        playerName: searchParams.name,
        teamName: searchParams.team,
        season: searchParams.season,
        college: searchParams.college,
        country: searchParams.country,
      };

      const data = await playerService.getPlayers(params);
      setPlayers(data);

      if (data.length === 0) {
        toast.info("No players found matching your search criteria");
      }
    } catch (error) {
      console.error("Error searching players:", error);
      toast.error("Failed to search players. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Advanced Player Search
        </h1>
        <p className="text-lg text-gray-600">
          Search for NBA players using multiple filters
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <div className="relative">
            <FloatingInputField
              label="Player Name"
              icon={<Search className="h-5 w-5" />}
              value={searchParams.name || ""}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="relative">
          <div className="relative">
            <FloatingInputField
              label="Team"
              icon={<Trophy className="h-5 w-5" />}
              value={searchParams.team || ""}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, team: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="relative">
          <div className="relative">
            <FloatingInputField
              label="Season"
              icon={<Users className="h-5 w-5" />}
              value={searchParams.season || ""}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, season: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="relative">
          <div className="relative">
            <FloatingInputField
              label="College"
              icon={<GraduationCap className="h-5 w-5" />}
              value={searchParams.college || ""}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  college: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="relative">
          <div className="relative">
            <FloatingInputField
              label="Country"
              icon={<Globe className="h-5 w-5" />}
              value={searchParams.country || ""}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        disabled={isLoading}
        className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>

      {isLoading ? (
        <div className="text-center text-gray-600">Searching players...</div>
      ) : players.length > 0 ? (
        <PlayerStatsTable
          players={players}
          title={`Search Results`}
          onPlayerClick={handlePlayerClick}
        />
      ) : null}

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
