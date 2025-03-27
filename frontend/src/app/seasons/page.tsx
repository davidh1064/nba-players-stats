"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { playerService } from "@/lib/services/playerService";
import { toast } from "sonner";
import PlayerStatsTable from "@/components/tables/PlayerStatsTable";
import PlayerDetailsModal from "@/components/modals/PlayerDetailsModal";
import { Player } from "@/lib/services/playerService";
import { cn } from "@/lib/utils";
import { FloatingInputField } from "@/components/ui/FloatingInputField";

export default function SeasonsPage() {
  const [season, setSeason] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!season) {
      toast.error("Please enter a season");
      return;
    }

    try {
      setIsLoading(true);
      const results = await playerService.getPlayers({ season });
      setPlayers(results);
      if (results.length === 0) {
        toast.info("No players found for this season");
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      toast.error("Failed to fetch players");
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
        <h1 className="text-4xl font-bold text-gray-800">Search by Season</h1>
        <p className="text-lg text-gray-600">
          Find all NBA players from a specific season
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative">
          <FloatingInputField
            label="Season (e.g., 2022-23)"
            type="text"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? "Searching..." : "Search Season"}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-600">Searching players...</div>
      ) : players.length > 0 ? (
        <PlayerStatsTable
          players={players}
          title={`Players from ${season}`}
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
