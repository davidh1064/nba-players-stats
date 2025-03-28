"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FloatingInputField } from "@/components/ui/FloatingInputField";
import PlayerStatsTable from "@/components/tables/PlayerStatsTable";
import PlayerDetailsModal from "@/components/modals/PlayerDetailsModal";
import { playerService } from "@/lib/services/playerService";
import { usePlayerData } from "@/hooks/usePlayerData";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";

export default function SeasonsPage() {
  const [season, setSeason] = useState("");
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

  const handleSearch = async () => {
    if (!season) {
      toast.error("Please enter a season");
      return;
    }
    try {
      setIsLoading(true);
      const data = await playerService.getPlayersBySeason(season);
      handleSuccess(data);
      if (data.length === 0) {
        toast.info("No players found for this season");
      }
    } catch (error) {
      handleError(error, "Failed to fetch players");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="Search by Season"
        description="Find all NBA players from a specific season"
      />

      <div className="max-w-md mx-auto">
        <FloatingInputField
          label="Season (e.g., 2022-23)"
          type="text"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        />

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
        onClose={handleModalClose}
      />
    </div>
  );
}
